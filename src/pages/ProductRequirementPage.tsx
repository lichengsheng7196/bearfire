import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter, Download } from 'lucide-react';
import { useRequirementStore } from '../stores/requirementStore';
import { useAuthStore } from '../stores/authStore';
import { 
  formatDateTime, 
  getCategoryText, 
  getStoreTypeText, 
  getPriorityText, 
  getPriorityClass 
} from '../utils/formatters';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ProductRequirementPage = () => {
  const { requirements, fetchRequirements, loading } = useRequirementStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStoreType, setSelectedStoreType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  // Filter requirements based on search query and filters
  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStoreType = selectedStoreType === 'all' || req.storeType === selectedStoreType;
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || req.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || req.status === selectedStatus;
    return matchesSearch && matchesStoreType && matchesCategory && matchesPriority && matchesStatus;
  });

  const handleExportToExcel = () => {
    setIsExporting(true);
    
    try {
      // Transform data for export
      const exportData = requirements.map(req => ({
        '需求标题': req.title,
        '店铺类型': getStoreTypeText(req.storeType),
        '分类': getCategoryText(req.category),
        '优先级': getPriorityText(req.priority),
        '市场定位': req.marketPositioning || '',
        '运营策略': req.marketingStrategy || '',
        '竞品分析': req.competitorAnalysis || '',
        '计划上架时间': formatDateTime(req.plannedLaunchDate),
        '创建时间': formatDateTime(req.createdAt),
        '创建人': req.createdBy.name,
        '状态': req.status === 'completed' ? '已完成' :
                req.status === 'cancelled' ? '已取消' :
                req.status === 'in_progress' ? '进行中' : '草稿'
      }));
      
      // Create workbook
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '需求数据');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      
      // Save file
      saveAs(blob, `需求数据_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Check if user can create requirements (only operations managers and admins)
  const canCreateRequirement = user?.role === 'operations_manager' || user?.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-neutral-800">需求管理</h1>
        
        <div className="flex gap-2">
          <button
            onClick={handleExportToExcel}
            disabled={isExporting || loading || requirements.length === 0}
            className="btn-outline flex items-center gap-2"
          >
            <Download size={16} />
            <span>{isExporting ? '导出中...' : '导出为Excel'}</span>
          </button>
          
          {canCreateRequirement && (
            <Link
              to="/requirements/create"
              className="btn-primary flex items-center gap-2"
            >
              <PlusCircle size={16} />
              <span>创建需求</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 grid gap-4 sm:grid-cols-5">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索需求标题或创建人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedStoreType}
          onChange={(e) => setSelectedStoreType(e.target.value)}
          className="rounded-lg border border-neutral-200 py-2 px-4 focus:border-primary-500 focus:outline-none"
        >
          <option value="all">所有店铺类型</option>
          <option value="pop">POP店铺</option>
          <option value="self_operated">自营店铺</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-neutral-200 py-2 px-4 focus:border-primary-500 focus:outline-none"
        >
          <option value="all">所有分类</option>
          <option value="fishing_rod">台钓装备</option>
          <option value="fishing_reel">路亚装备</option>
          <option value="fishing_accessory">渔具配件</option>
          <option value="fishing_clothing">渔具周边</option>
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="rounded-lg border border-neutral-200 py-2 px-4 focus:border-primary-500 focus:outline-none"
        >
          <option value="all">所有优先级</option>
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-lg border border-neutral-200 py-2 px-4 focus:border-primary-500 focus:outline-none"
        >
          <option value="all">所有状态</option>
          <option value="draft">草稿</option>
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full table-auto">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                <th className="px-6 py-3">需求标题</th>
                <th className="px-6 py-3">店铺类型</th>
                <th className="px-6 py-3">分类</th>
                <th className="px-6 py-3">优先级</th>
                <th className="px-6 py-3">计划上架时间</th>
                <th className="px-6 py-3">创建时间</th>
                <th className="px-6 py-3">创建人</th>
                <th className="px-6 py-3">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredRequirements.length > 0 ? (
                filteredRequirements.map((requirement) => (
                  <tr key={requirement.id} className="hover:bg-neutral-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-primary-700">
                      <Link to={`/requirements/${requirement.id}`} className="hover:underline">
                        {requirement.title}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                      {getStoreTypeText(requirement.storeType)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                      {getCategoryText(requirement.category)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`badge ${getPriorityClass(requirement.priority)}`}>
                        {getPriorityText(requirement.priority)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                      {formatDateTime(requirement.plannedLaunchDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                      {formatDateTime(requirement.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                      {requirement.createdBy.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`badge ${
                        requirement.status === 'completed' 
                          ? 'badge-success' 
                          : requirement.status === 'cancelled'
                            ? 'badge-error'
                            : requirement.status === 'in_progress'
                              ? 'badge-primary'
                              : 'badge-secondary'
                      }`}>
                        {requirement.status === 'completed' && '已完成'}
                        {requirement.status === 'cancelled' && '已取消'}
                        {requirement.status === 'in_progress' && '进行中'}
                        {requirement.status === 'draft' && '草稿'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-neutral-500">
                    暂无需求数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductRequirementPage;