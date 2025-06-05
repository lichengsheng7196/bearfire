import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  FileText, 
  Boxes, 
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useProductPoolStore } from '../stores/productPoolStore';
import { useRequirementStore } from '../stores/requirementStore';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ProductPool, WorkflowStatus } from '../types/productTypes';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { productPools, fetchProductPools } = useProductPoolStore();
  const { requirements, fetchRequirements } = useRequirementStore();
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProductPools(), fetchRequirements()]);
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchProductPools, fetchRequirements]);

  // Calculate statistics
  const totalProducts = productPools.length;
  const completedProducts = productPools.filter(p => p.workflowStatus === 'launched').length;
  const pendingReview = productPools.filter(p => p.workflowStatus === 'pending_review').length;
  const inProgress = totalProducts - completedProducts - pendingReview;

  // Determine pending tasks based on user role
  useEffect(() => {
    if (!user || isLoading) return;
    
    const tasks: any[] = [];
    
    // Operations manager tasks
    if (user.role === 'operations_manager' || user.role === 'admin') {
      // Products waiting for review
      const reviewTasks = productPools
        .filter(p => p.workflowStatus === 'pending_review')
        .map(p => ({
          id: p.id,
          title: `评审产品: ${p.productName}`,
          link: `/product-pool/${p.id}`,
          priority: 'high',
          type: 'review',
          date: new Date(p.createdAt)
        }));
      
      // Sample products waiting for approval
      const sampleTasks = productPools
        .filter(p => p.workflowStatus === 'sample_received')
        .map(p => ({
          id: p.id,
          title: `确认样品: ${p.productName}`,
          link: `/product-pool/${p.id}`,
          priority: 'medium',
          type: 'sample',
          date: p.timeline.find(t => t.status === 'sample_received')?.date 
            ? new Date(p.timeline.find(t => t.status === 'sample_received')!.date)
            : new Date(p.createdAt)
        }));
      
      // Products waiting to be launched
      const launchTasks = productPools
        .filter(p => p.workflowStatus === 'stock_received')
        .map(p => ({
          id: p.id,
          title: `上架产品: ${p.productName}`,
          link: `/product-pool/${p.id}`,
          priority: 'medium',
          type: 'launch',
          date: p.timeline.find(t => t.status === 'stock_received')?.date 
            ? new Date(p.timeline.find(t => t.status === 'stock_received')!.date)
            : new Date(p.createdAt)
        }));
      
      tasks.push(...reviewTasks, ...sampleTasks, ...launchTasks);
    }
    
    // Product manager tasks
    if (user.role === 'product_manager' || user.role === 'admin') {
      // Sample approved, waiting for procurement
      const sampleTasks = productPools
        .filter(p => p.workflowStatus === 'sample_approved')
        .map(p => ({
          id: p.id,
          title: `样品签收: ${p.productName}`,
          link: `/product-pool/${p.id}`,
          priority: 'high',
          type: 'sample_procurement',
          date: p.timeline.find(t => t.status === 'sample_approved')?.date 
            ? new Date(p.timeline.find(t => t.status === 'sample_approved')!.date)
            : new Date(p.createdAt)
        }));
      
      // Order approved, waiting for contract
      const contractTasks = productPools
        .filter(p => p.workflowStatus === 'order_approved')
        .map(p => ({
          id: p.id,
          title: `上传合同: ${p.productName}`,
          link: `/product-pool/${p.id}`,
          priority: 'medium',
          type: 'contract',
          date: p.timeline.find(t => t.status === 'order_approved')?.date 
            ? new Date(p.timeline.find(t => t.status === 'order_approved')!.date)
            : new Date(p.createdAt)
        }));
      
      tasks.push(...sampleTasks, ...contractTasks);
    }
    
    // Purchasing specialist tasks
    if (user.role === 'purchasing_specialist' || user.role === 'admin') {
      // Contract uploaded, waiting for order
      const orderTasks = productPools
        .filter(p => p.workflowStatus === 'contract_uploaded')
        .map(p => ({
          id: p.id,
          title: `发起订货: ${p.productName}`,
          link: `/product-pool/${p.id}`,
          priority: 'high',
          type: 'order',
          date: p.timeline.find(t => t.status === 'contract_uploaded')?.date 
            ? new Date(p.timeline.find(t => t.status === 'contract_uploaded')!.date)
            : new Date(p.createdAt)
        }));
      
      // Restock needed
      const restockTasks = productPools
        .filter(p => p.workflowStatus === 'restock_needed')
        .map(p => ({
          id: p.id,
          title: `补货: ${p.productName}`,
          link: `/product-pool/${p.id}`,
          priority: 'high',
          type: 'restock',
          date: p.timeline.find(t => t.status === 'restock_needed')?.date 
            ? new Date(p.timeline.find(t => t.status === 'restock_needed')!.date)
            : new Date(p.createdAt)
        }));
      
      tasks.push(...orderTasks, ...restockTasks);
    }
    
    // ERP specialist tasks
    if (user.role === 'erp_specialist' || user.role === 'admin') {
      // Order placed, waiting for stock receipt
      const stockTasks = productPools
        .filter(p => p.workflowStatus === 'order_placed')
        .map(p => ({
          id: p.id,
          title: `确认入仓: ${p.productName}`,
          link: `/product-pool/${p.id}`,
          priority: 'medium',
          type: 'stock',
          date: p.timeline.find(t => t.status === 'order_placed')?.date 
            ? new Date(p.timeline.find(t => t.status === 'order_placed')!.date)
            : new Date(p.createdAt)
        }));
      
      // Check low inventory
      const inventoryTasks = productPools
        .filter(p => 
          p.workflowStatus === 'launched' && 
          p.inventory && 
          p.inventory.available <= p.inventory.threshold
        )
        .map(p => ({
          id: p.id,
          title: `库存不足: ${p.productName}`,
          link: `/product-pool/${p.id}`,
          priority: 'high',
          type: 'inventory',
          date: p.inventory?.lastUpdated 
            ? new Date(p.inventory.lastUpdated)
            : new Date()
        }));
      
      tasks.push(...stockTasks, ...inventoryTasks);
    }
    
    // Sort tasks by date, newest first
    const sortedTasks = tasks.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    setPendingTasks(sortedTasks);
  }, [user, productPools, isLoading]);

  // Get recent activity from timeline events
  const getRecentActivity = () => {
    const allEvents = productPools.flatMap(p => 
      p.timeline.map(event => ({
        ...event,
        productId: p.id,
        productName: p.productName
      }))
    );
    
    // Sort by date, newest first
    return allEvents
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };
  
  // Get recently added products
  const getRecentProducts = () => {
    return [...productPools]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: WorkflowStatus }) => {
    switch (status) {
      case 'pending_review':
        return <span className="badge-warning">待评审</span>;
      case 'sample_approved':
        return <span className="badge-primary">已确认拿样</span>;
      case 'sample_rejected':
        return <span className="badge-error">不予采纳</span>;
      case 'sample_received':
        return <span className="badge-primary">已签收样品</span>;
      case 'order_approved':
        return <span className="badge-primary">已确认订货</span>;
      case 'order_rejected':
        return <span className="badge-error">不予采纳</span>;
      case 'contract_uploaded':
        return <span className="badge-primary">已上传合同</span>;
      case 'order_placed':
        return <span className="badge-primary">已发起订货</span>;
      case 'stock_received':
        return <span className="badge-primary">已入仓</span>;
      case 'launched':
        return <span className="badge-success">已上架</span>;
      case 'restock_needed':
        return <span className="badge-warning">需补货</span>;
      default:
        return <span className="badge-secondary">未知状态</span>;
    }
  };
  
  // Format date to relative time (e.g., "3 days ago")
  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: zhCN
    });
  };

  // Operations manager specific quick actions
  const renderOperationsManagerActions = () => {
    if (user?.role !== 'operations_manager' && user?.role !== 'admin') return null;
    
    return (
      <Link to="/requirements/create" className="flex items-center gap-2 rounded-md border border-primary-300 bg-primary-50 p-4 shadow-sm transition-all hover:bg-primary-100">
        <PlusCircle className="h-6 w-6 text-primary-600" />
        <span className="text-sm font-medium text-primary-700">创建新需求</span>
      </Link>
    );
  };
  
  // Product manager specific quick actions
  const renderProductManagerActions = () => {
    if (user?.role !== 'product_manager' && user?.role !== 'admin') return null;
    
    return (
      <Link to="/product-pool/create" className="flex items-center gap-2 rounded-md border border-secondary-300 bg-secondary-50 p-4 shadow-sm transition-all hover:bg-secondary-100">
        <PlusCircle className="h-6 w-6 text-secondary-600" />
        <span className="text-sm font-medium text-secondary-700">创建新选品</span>
      </Link>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-neutral-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-800">欢迎，{user?.name}</h1>
      
      {/* Quick actions */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {renderOperationsManagerActions()}
        {renderProductManagerActions()}
        <Link to="/product-pool" className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white p-4 shadow-sm transition-all hover:bg-neutral-50">
          <Boxes className="h-6 w-6 text-neutral-600" />
          <span className="text-sm font-medium text-neutral-700">查看选品池</span>
        </Link>
        <Link to="/requirements" className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white p-4 shadow-sm transition-all hover:bg-neutral-50">
          <FileText className="h-6 w-6 text-neutral-600" />
          <span className="text-sm font-medium text-neutral-700">查看需求列表</span>
        </Link>
      </div>
      
      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-primary-600" />
            <h3 className="text-sm font-medium text-neutral-700">总产品数量</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-neutral-900">{totalProducts}</p>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success-600" />
            <h3 className="text-sm font-medium text-neutral-700">已上架产品</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-neutral-900">{completedProducts}</p>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary-600" />
            <h3 className="text-sm font-medium text-neutral-700">进行中产品</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-neutral-900">{inProgress}</p>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning-600" />
            <h3 className="text-sm font-medium text-neutral-700">待评审产品</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-neutral-900">{pendingReview}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Pending tasks */}
        <div className="card overflow-hidden">
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
            <h2 className="font-semibold text-neutral-800">待办事项</h2>
          </div>
          <div className="max-h-96 overflow-y-auto p-6">
            {pendingTasks.length > 0 ? (
              <ul className="space-y-3">
                {pendingTasks.map(task => (
                  <li key={`${task.type}-${task.id}`}>
                    <Link 
                      to={task.link} 
                      className="flex items-start justify-between gap-4 rounded-md border border-neutral-200 p-3 transition-colors hover:bg-neutral-50"
                    >
                      <div>
                        <div className="font-medium text-neutral-800">{task.title}</div>
                        <div className="mt-1 text-xs text-neutral-500">
                          {formatRelativeTime(task.date.toISOString())}
                        </div>
                      </div>
                      <span className={`badge ${
                        task.priority === 'high' 
                          ? 'badge-error' 
                          : task.priority === 'medium' 
                            ? 'badge-warning' 
                            : 'badge-secondary'
                      }`}>
                        {task.priority === 'high' ? '紧急' : task.priority === 'medium' ? '中等' : '普通'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <CheckCircle2 className="h-12 w-12 text-success-500" />
                <p className="mt-2 text-center text-neutral-600">
                  没有待办事项
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent activity */}
        <div className="card overflow-hidden">
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
            <h2 className="font-semibold text-neutral-800">最近活动</h2>
          </div>
          <div className="max-h-96 overflow-y-auto p-6">
            <ul className="space-y-6">
              {getRecentActivity().map(event => (
                <li key={event.id} className="relative">
                  <div className="timeline-container">
                    <div className={`timeline-dot ${
                      event.status === 'launched' || event.status === 'stock_received' 
                        ? 'timeline-dot-success' 
                        : event.status === 'sample_rejected' || event.status === 'order_rejected' 
                          ? 'timeline-dot-error' 
                          : ''
                    }`}></div>
                    <div className="timeline-content">
                      <Link 
                        to={`/product-pool/${event.productId}`}
                        className="font-medium text-neutral-800 hover:text-primary-600"
                      >
                        {event.title}
                      </Link>
                      <p className="mt-1 text-sm text-neutral-600">{event.description}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {formatRelativeTime(event.date)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Recent products */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-800">最近添加的产品</h2>
          <Link to="/product-pool" className="text-sm text-primary-600 hover:text-primary-700">
            查看全部
          </Link>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr className="bg-neutral-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">
                  产品名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">
                  分类
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">
                  创建人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">
                  状态
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {getRecentProducts().map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-neutral-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link to={`/product-pool/${product.id}`} className="font-medium text-primary-600 hover:text-primary-700">
                      {product.productName}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                    {product.category === 'fishing_rod' && '鱼竿'}
                    {product.category === 'fishing_reel' && '渔轮'}
                    {product.category === 'fishing_line' && '渔线'}
                    {product.category === 'fishing_hook' && '鱼钩'}
                    {product.category === 'fishing_lure' && '路亚'}
                    {product.category === 'fishing_accessory' && '渔具配件'}
                    {product.category === 'fishing_apparel' && '钓鱼服饰'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                    {product.createdBy.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                    {formatRelativeTime(product.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={product.workflowStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;