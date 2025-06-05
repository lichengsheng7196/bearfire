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
  getPriorityClass,
  getStatusClass,
  getStatusText
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
        '分类': getCategoryText(req.category as any),
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
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-green-600 drop-shadow-md animate-fade-in">需求管理</h1>
      <div className="card rounded-2xl bg-white/80 shadow-xl backdrop-blur-md p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="搜索需求标题、店铺类型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full rounded-lg border border-neutral-300 pl-10 pr-4 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            >
              <option value="all">所有类别</option>
              <option value="electronics">电子产品</option>
              <option value="clothing">服装</option>
              <option value="home">家居用品</option>
              <option value="beauty">美妆个护</option>
              <option value="sports">运动户外</option>
              <option value="toys">玩具</option>
              <option value="food">食品</option>
              <option value="other">其他</option>
            </select>
          </div>
        </div>
        <div className="table-container rounded-2xl bg-white/80 shadow-xl backdrop-blur-md">
          <table className="table min-w-full divide-y divide-neutral-200">
            <thead>
              <tr className="bg-neutral-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">需求标题</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">店铺类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">优先级</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">计划上架时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">创建人</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white/80">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredRequirements.length > 0 ? (
                filteredRequirements.map((requirement) => (
                  <tr key={requirement.id} className="transition-colors hover:bg-blue-50/40">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-blue-700 hover:underline">
                      <Link to={`/requirements/${requirement.id}`}>{requirement.title}</Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">{getStoreTypeText(requirement.storeType)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">{getCategoryText(requirement.category as any)}</td>
                    <td className="whitespace-nowrap px-6 py-4"><span className={`badge ${getPriorityClass(requirement.priority)}`}>{getPriorityText(requirement.priority)}</span></td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">{formatDateTime(requirement.plannedLaunchDate)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{formatDateTime(requirement.createdAt)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">{requirement.createdBy.name}</td>
                    <td className="whitespace-nowrap px-6 py-4">
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
                  <td colSpan={8} className="py-8 text-center text-neutral-500">未找到匹配的需求</td>
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