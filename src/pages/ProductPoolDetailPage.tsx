import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Eye, 
  Edit, 
  FileText, 
  PlusCircle,
  Download,
  Loader2,
  CheckCircle2,
  X,
  Upload,
  ShoppingBag,
  Package,
  ExternalLink,
  StoreIcon
} from 'lucide-react';
import { useProductPoolStore } from '../stores/productPoolStore';
import { useAuthStore } from '../stores/authStore';
import { useRequirementStore } from '../stores/requirementStore';
import toast from 'react-hot-toast';
import { 
  formatCurrency, 
  formatDateTime, 
  formatRelativeTime,
  getStatusText,
  getStatusClass,
  getCategoryText
} from '../utils/formatters';
import { ProductPool, WorkflowStatus } from '../types/productTypes';

const ProductPoolDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getProductPoolById, 
    updateWorkflowStatus, 
    addReview, 
    uploadSampleImages,
    confirmOrderAndCreateContract,
    loading 
  } = useProductPoolStore();
  const { user } = useAuthStore();
  const { getRequirementById, fetchRequirements } = useRequirementStore();
  
  const [productPool, setProductPool] = useState<ProductPool | null>(null);
  const [requirement, setRequirement] = useState<any>(null);
  const [reviewContent, setReviewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [sampleImages, setSampleImages] = useState<string[]>([]);
  const [sampleFeedback, setSampleFeedback] = useState('');
  const [productLink, setProductLink] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    type: string;
    title: string;
    confirmText: string;
    cancelText: string;
    status?: WorkflowStatus;
  } | null>(null);

  // Add new state for AI analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketAnalysis, setMarketAnalysis] = useState('');
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      if (!id) return;
      
      await fetchRequirements();
      const pool = getProductPoolById(id);
      
      if (pool) {
        setProductPool(pool);
        const req = getRequirementById(pool.requirementId);
        setRequirement(req);
      } else {
        toast.error('未找到产品信息');
        navigate('/product-pool');
      }
    };
    
    loadData();
  }, [id, getProductPoolById, fetchRequirements, navigate, user]);
  
  // This effect ensures the productPool state is updated when the store changes
  useEffect(() => {
    if (id) {
      const pool = getProductPoolById(id);
      if (pool) {
        setProductPool(pool);
      }
    }
  }, [id, getProductPoolById]);

  if (!productPool) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-neutral-600">正在加载产品信息...</p>
        </div>
      </div>
    );
  }

  const handleAddReview = async () => {
    if (!reviewContent.trim()) {
      toast.error('请输入评审意见');
      return;
    }
    
    setSubmitting(true);
    
    try {
      await addReview(productPool.id, {
        reviewer: user!,
        content: reviewContent.trim()
      });
      
      setReviewContent('');
      setIsAddingReview(false);
      toast.success('评审意见已添加');
    } catch (error) {
      toast.error('添加评审意见失败');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleSampleUpload = async () => {
    if (sampleImages.length === 0) {
      toast.error('请至少上传一张样品图片');
      return;
    }
    
    if (!sampleFeedback.trim()) {
      toast.error('请填写样品体验分析意见');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // First upload sample images
      await uploadSampleImages(productPool.id, sampleImages);
      
      // Then update workflow status with sample feedback
      await updateWorkflowStatus(productPool.id, 'sample_received', {
        sampleFeedback: sampleFeedback.trim()
      });
      
      setSampleImages([]);
      setSampleFeedback('');
      toast.success('样品信息已更新');
      setShowActionModal(false);
    } catch (error) {
      toast.error('更新样品信息失败');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleProductLaunch = async () => {
    if (!productLink.trim()) {
      toast.error('请填写产品链接');
      return;
    }
    
    setSubmitting(true);
    
    try {
      await updateWorkflowStatus(productPool.id, 'launched', {
        productLink: productLink.trim()
      });
      
      setProductLink('');
      toast.success('产品已上架');
      setShowActionModal(false);
    } catch (error) {
      toast.error('更新产品状态失败');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleUpdateStatus = async (status: WorkflowStatus, data?: any) => {
    setSubmitting(true);
    
    try {
      await updateWorkflowStatus(productPool.id, status, data);
      toast.success('状态已更新');
      setShowActionModal(false);
    } catch (error) {
      toast.error('更新状态失败');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleContractUpload = async () => {
    // In a real app, we'd handle file upload here
    setSubmitting(true);
    
    try {
      await updateWorkflowStatus(productPool.id, 'contract_uploaded', {
        contractInfo: {
          title: '供货合同',
          supplierName: productPool.supplier.name,
          signDate: new Date().toISOString(),
        }
      });
      
      toast.success('合同已上传');
      setShowActionModal(false);
    } catch (error) {
      toast.error('上传合同失败');
    } finally {
      setSubmitting(false);
    }
  };
  
  const openActionModal = (action: {
    type: string;
    title: string;
    confirmText: string;
    cancelText: string;
    status?: WorkflowStatus;
  }) => {
    setCurrentAction(action);
    setShowActionModal(true);
  };
  
  // Add image to sample images (mock for demo)
  const handleAddSampleImage = () => {
    // In a real app, this would be a file upload
    // For demo, we'll use placeholder images
    const placeholders = [
      'https://images.pexels.com/photos/1619084/pexels-photo-1619084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3306181/pexels-photo-3306181.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5708077/pexels-photo-5708077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ];
    const randomImage = placeholders[Math.floor(Math.random() * placeholders.length)];
    setSampleImages([...sampleImages, randomImage]);
  };
  
  // Determine available actions based on workflow status and user role
  const getAvailableActions = () => {
    if (!user) return [];
    
    const actions = [];
    const { workflowStatus } = productPool;
    const isAdmin = user.role === 'admin';
    const isOperationsManager = user.role === 'operations_manager' || isAdmin;
    const isProductManager = user.role === 'product_manager' || isAdmin;
    const isPurchasingSpecialist = user.role === 'purchasing_specialist' || isAdmin;
    const isErpSpecialist = user.role === 'erp_specialist' || isAdmin;
    
    // Operations Manager actions
    if (isOperationsManager) {
      if (workflowStatus === 'pending_review') {
        actions.push({
          label: '确认拿样',
          icon: <CheckCircle2 size={16} />,
          onClick: () => openActionModal({
            type: 'approve',
            title: '确认拿样',
            confirmText: '确认',
            cancelText: '取消',
            status: 'sample_approved'
          }),
          color: 'btn-primary'
        });
        
        actions.push({
          label: '不予采纳',
          icon: <X size={16} />,
          onClick: () => openActionModal({
            type: 'reject',
            title: '不予采纳',
            confirmText: '确认',
            cancelText: '取消',
            status: 'sample_rejected'
          }),
          color: 'btn-danger'
        });
      }
      
      if (workflowStatus === 'sample_received') {
        actions.push({
          label: '确认订货',
          icon: <CheckCircle2 size={16} />,
          onClick: () => openActionModal({
            type: 'order',
            title: '确认订货',
            confirmText: '确认',
            cancelText: '取消',
            status: 'order_approved'
          }),
          color: 'btn-primary'
        });
        
        actions.push({
          label: '不予采纳',
          icon: <X size={16} />,
          onClick: () => openActionModal({
            type: 'reject',
            title: '不予采纳',
            confirmText: '确认',
            cancelText: '取消',
            status: 'order_rejected'
          }),
          color: 'btn-danger'
        });
      }
      
      if (workflowStatus === 'stock_received') {
        actions.push({
          label: '产品上架',
          icon: <StoreIcon size={16} />,
          onClick: () => openActionModal({
            type: 'launch',
            title: '产品上架',
            confirmText: '上架',
            cancelText: '取消'
          }),
          color: 'btn-success'
        });
      }
    }
    
    // Product Manager actions
    if (isProductManager) {
      if (workflowStatus === 'sample_approved') {
        actions.push({
          label: '签收样品',
          icon: <CheckCircle2 size={16} />,
          onClick: () => openActionModal({
            type: 'sample',
            title: '签收样品',
            confirmText: '提交',
            cancelText: '取消'
          }),
          color: 'btn-primary'
        });
      }
      
      if (workflowStatus === 'order_approved') {
        actions.push({
          label: '上传合同',
          icon: <Upload size={16} />,
          onClick: () => openActionModal({
            type: 'contract',
            title: '上传合同',
            confirmText: '上传',
            cancelText: '取消'
          }),
          color: 'btn-primary'
        });
      }
    }
    
    // Purchasing Specialist actions
    if (isPurchasingSpecialist) {
      if (workflowStatus === 'contract_uploaded') {
        actions.push({
          label: '发起订货',
          icon: <ShoppingBag size={16} />,
          onClick: () => openActionModal({
            type: 'place_order',
            title: '发起订货',
            confirmText: '确认',
            cancelText: '取消',
            status: 'order_placed'
          }),
          color: 'btn-primary'
        });
      }
      
      if (workflowStatus === 'restock_needed') {
        actions.push({
          label: '补货',
          icon: <ShoppingBag size={16} />,
          onClick: () => openActionModal({
            type: 'restock',
            title: '补货',
            confirmText: '确认',
            cancelText: '取消',
            status: 'order_placed'
          }),
          color: 'btn-warning'
        });
      }
    }
    
    // ERP Specialist actions
    if (isErpSpecialist) {
      if (workflowStatus === 'order_placed') {
        actions.push({
          label: '确认入仓',
          icon: <Package size={16} />,
          onClick: () => openActionModal({
            type: 'stock',
            title: '确认入仓',
            confirmText: '确认',
            cancelText: '取消',
            status: 'stock_received'
          }),
          color: 'btn-primary'
        });
      }
      
      if (workflowStatus === 'launched' && productPool.inventory && productPool.inventory.available <= productPool.inventory.threshold) {
        actions.push({
          label: '发起补货',
          icon: <AlertTriangle size={16} />,
          onClick: () => openActionModal({
            type: 'restock_needed',
            title: '发起补货',
            confirmText: '确认',
            cancelText: '取消',
            status: 'restock_needed'
          }),
          color: 'btn-warning'
        });
      }
    }
    
    // All users can add review if not rejected or completed
    if (
      workflowStatus !== 'sample_rejected' && 
      workflowStatus !== 'order_rejected' &&
      workflowStatus !== 'launched'
    ) {
      actions.push({
        label: '添加评审意见',
        icon: <PlusCircle size={16} />,
        onClick: () => setIsAddingReview(true),
        color: 'btn-outline'
      });
    }
    
    return actions;
  };

  const renderActionModal = () => {
    if (!currentAction) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h3 className="mb-4 text-lg font-semibold text-neutral-800">{currentAction.title}</h3>
          
          {currentAction.type === 'sample' && (
            <div className="space-y-4">
              <div>
                <label className="label">样品实拍图</label>
                <div className="mb-2 grid grid-cols-3 gap-2">
                  {sampleImages.map((img, index) => (
                    <div key={index} className="relative h-24 overflow-hidden rounded-md">
                      <img 
                        src={img} 
                        alt={`样品图 ${index + 1}`} 
                        className="h-full w-full object-cover"
                      />
                      <button
                        className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
                        onClick={() => setSampleImages(sampleImages.filter((_, i) => i !== index))}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="flex h-24 flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-500 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-500"
                    onClick={handleAddSampleImage}
                  >
                    <PlusCircle size={24} />
                    <span className="mt-1 text-xs">添加图片</span>
                  </button>
                </div>
                <p className="text-xs text-neutral-500">可添加多张样品实拍图</p>
              </div>
              
              <div>
                <label htmlFor="sampleFeedback" className="label">样品体验分析意见</label>
                <textarea
                  id="sampleFeedback"
                  className="input h-32 w-full resize-none"
                  placeholder="请填写样品体验分析意见，包括质量、外观、使用体验等"
                  value={sampleFeedback}
                  onChange={(e) => setSampleFeedback(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="btn-outline flex-1"
                  disabled={submitting}
                >
                  {currentAction.cancelText}
                </button>
                <button
                  onClick={handleSampleUpload}
                  className="btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    currentAction.confirmText
                  )}
                </button>
              </div>
            </div>
          )}
          
          {currentAction.type === 'launch' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="productLink" className="label">产品链接</label>
                <input
                  id="productLink"
                  type="text"
                  className="input w-full"
                  placeholder="请填写产品链接"
                  value={productLink}
                  onChange={(e) => setProductLink(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="btn-outline flex-1"
                  disabled={submitting}
                >
                  {currentAction.cancelText}
                </button>
                <button
                  onClick={handleProductLaunch}
                  className="btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    currentAction.confirmText
                  )}
                </button>
              </div>
            </div>
          )}
          
          {currentAction.type === 'contract' && (
            <div className="space-y-4">
              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">上传合同文件</span>
                  <span className="text-xs text-neutral-500">仅支持 PDF 格式</span>
                </div>
                <div className="flex h-16 items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-white">
                  <button className="flex items-center gap-1 text-sm text-primary-600">
                    <Upload size={16} />
                    <span>点击上传</span>
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="btn-outline flex-1"
                  disabled={submitting}
                >
                  {currentAction.cancelText}
                </button>
                <button
                  onClick={handleContractUpload}
                  className="btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      上传中...
                    </>
                  ) : (
                    currentAction.confirmText
                  )}
                </button>
              </div>
            </div>
          )}
          
          {['approve', 'reject', 'order', 'place_order', 'stock', 'restock_needed', 'restock'].includes(currentAction.type) && (
            <div className="space-y-4">
              <p className="text-neutral-600">
                {currentAction.type === 'approve' && '确认拿样后，将通知产品经理进行样品签收。'}
                {currentAction.type === 'reject' && '不予采纳后，此产品将被标记为已拒绝。'}
                {currentAction.type === 'order' && '确认订货后，将通知产品经理上传合同。'}
                {currentAction.type === 'place_order' && '发起订货后，将通知ERP专员确认入仓。'}
                {currentAction.type === 'stock' && '确认入仓后，将通知运营经理产品上架。'}
                {currentAction.type === 'restock_needed' && '发起补货后，将通知采购专员进行补货。'}
                {currentAction.type === 'restock' && '确认补货后，将重新发起订货流程。'}
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="btn-outline flex-1"
                  disabled={submitting}
                >
                  {currentAction.cancelText}
                </button>
                <button
                  onClick={() => handleUpdateStatus(currentAction.status!)}
                  className={`${
                    currentAction.type === 'reject' ? 'btn-danger' : 'btn-primary'
                  } flex-1`}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    currentAction.confirmText
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Add AI analysis function
  const handleAIAnalysis = async () => {
    if (!productPool) return;
    
    setIsAnalyzing(true);
    try {
      // In a real app, this would call an AI service
      // For demo, we'll simulate an AI response
      const analysis = {
        marketAnalysis: `基于市场调研，该产品在${productPool.category}类目中具有以下特点：
1. 目标用户群体：25-45岁的中高端钓鱼爱好者
2. 价格定位：${formatCurrency(productPool.factoryPrice)}的出厂价具有较强竞争力
3. 市场趋势：该类目产品年增长率约15%，需求稳定
4. 销售渠道：建议在自营店和POP店同时布局，重点投放抖音和快手平台`,
        competitorAnalysis: `竞品分析：
1. 主要竞品：${productPool.competitorLinks?.join(', ')}
2. 差异化优势：${productPool.description}
3. 价格优势：较竞品低10-15%
4. 质量保证：供应商${productPool.supplier.name}具有5年以上的生产经验`
      };
      
      setMarketAnalysis(analysis.marketAnalysis);
      setCompetitorAnalysis(analysis.competitorAnalysis);
      
      // Update the product pool with AI analysis
      await updateWorkflowStatus(productPool.id, productPool.workflowStatus, {
        marketAnalysis: analysis.marketAnalysis,
        competitorAnalysis: analysis.competitorAnalysis
      });
      
      toast.success('AI分析完成');
    } catch (error) {
      toast.error('AI分析失败');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add function to handle image annotation
  const handleImageAnnotation = (imageUrl: string, annotation: string) => {
    // In a real app, this would save the annotation to the backend
    toast.success('图片标注已保存');
  };

  // Update the render function to include new features
  const renderProductDetails = () => {
    if (!productPool) return null;

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-neutral-800">基本信息</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-neutral-500">产品名称</p>
                <p className="font-medium">{productPool.productName}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">分类</p>
                <p className="font-medium">{getCategoryText(productPool.category)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">出厂价</p>
                <p className="font-medium">{formatCurrency(productPool.factoryPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">税费</p>
                <p className="font-medium">{formatCurrency(productPool.tax)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">供应商</p>
                <p className="font-medium">{productPool.supplier.name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">风险等级</p>
                <p className="font-medium">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    productPool.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    productPool.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {productPool.riskLevel === 'high' ? '高风险' :
                     productPool.riskLevel === 'medium' ? '中风险' : '低风险'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="card">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-neutral-800">产品图片</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {productPool.productImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`产品图片 ${index + 1}`}
                    className="h-48 w-full rounded-lg object-cover"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all group-hover:bg-opacity-50 group-hover:opacity-100">
                    <button
                      onClick={() => handleImageAnnotation(image, '')}
                      className="rounded-full bg-white p-2 text-neutral-800 hover:bg-neutral-100"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Analysis */}
        <div className="card">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-800">市场分析</h2>
              <button
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
                className="btn-primary flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>分析中...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={16} />
                    <span>AI分析</span>
                  </>
                )}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium text-neutral-700">市场分析</h3>
                <p className="whitespace-pre-wrap text-neutral-600">
                  {productPool.marketAnalysis || '暂无市场分析'}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-neutral-700">竞品分析</h3>
                <p className="whitespace-pre-wrap text-neutral-600">
                  {productPool.competitorAnalysis || '暂无竞品分析'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="card">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-neutral-800">工作流时间轴</h2>
            <div className="space-y-4">
              {productPool.timeline.map((event, index) => (
                <div key={event.id} className="relative pl-8">
                  {index < productPool.timeline.length - 1 && (
                    <div className="absolute left-3 top-8 h-full w-0.5 bg-neutral-200" />
                  )}
                  <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="mb-1 text-sm font-medium text-neutral-800">
                    {formatDateTime(event.date)} {event.actor?.name}
                  </div>
                  <div className="text-sm text-neutral-600">{event.description}</div>
                  {event.data && (
                    <div className="mt-2 text-sm text-neutral-500">
                      {Object.entries(event.data).map(([key, value]) => (
                        <div key={key}>
                          {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="card">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-800">评审意见</h2>
              <button
                onClick={() => setIsAddingReview(true)}
                className="btn-primary flex items-center gap-2"
              >
                <PlusCircle size={16} />
                <span>添加评审意见</span>
              </button>
            </div>
            <div className="space-y-4">
              {productPool.reviews.map((review) => (
                <div key={review.id} className="rounded-lg border border-neutral-200 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium text-neutral-800">{review.reviewer.name}</div>
                    <div className="text-sm text-neutral-500">
                      {formatDateTime(review.createdAt)}
                    </div>
                  </div>
                  <p className="text-neutral-600">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="rounded-2xl bg-white/80 shadow-2xl backdrop-blur-md p-8 animate-fade-in">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-green-600 drop-shadow-md">产品详情</h1>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => navigate('/product-pool')}
              className="btn-outline flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span>返回</span>
            </button>
          </div>

          {renderProductDetails()}

          {/* Action Modal */}
          {showActionModal && currentAction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md rounded-lg bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-neutral-800">
                  {currentAction.title}
                </h3>
                {/* Modal content based on action type */}
                {currentAction.type === 'review' && (
                  <div className="space-y-4">
                    <textarea
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="请输入评审意见..."
                      className="w-full rounded-lg border border-neutral-200 p-3 focus:border-primary-500 focus:outline-none"
                      rows={4}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowActionModal(false)}
                        className="btn-outline"
                        disabled={submitting}
                      >
                        取消
                      </button>
                      <button
                        onClick={handleAddReview}
                        className="btn-primary"
                        disabled={submitting}
                      >
                        {submitting ? '提交中...' : '提交'}
                      </button>
                    </div>
                  </div>
                )}
                {/* Add other modal types as needed */}
              </div>
            </div>
          )}

          {/* Image Preview Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
              onClick={() => setSelectedImage(null)}
            >
              <img
                src={selectedImage}
                alt="产品图片预览"
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPoolDetailPage;