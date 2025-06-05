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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [previewImg, setPreviewImg] = useState<string|null>(null);
  const [fadeImg, setFadeImg] = useState(false);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  // Filter requirements based on search query and filters
  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStoreType = selectedStoreType === 'all' || req.storeType === selectedStoreType;
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || req.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || req.status === selectedStatus;
    return matchesSearch && matchesStoreType && matchesCategory && matchesPriority && matchesStatus;
  });

  const paginatedRequirements = filteredRequirements.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredRequirements.length / pageSize);

  const handleExportToExcel = () => {
    setIsExporting(true);
    try {
      // Transform data for export
      const exportData = filteredRequirements.map(req => ({
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
    <div className="mx-auto max-w-7xl p-2">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
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
        <div className="flex gap-2">
          <select
            value={selectedStoreType}
            onChange={(e) => setSelectedStoreType(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          >
            <option value="all">所有店铺类型</option>
            <option value="self">自营店铺</option>
            <option value="pop">POP店铺</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
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
        <div className="flex gap-2 ml-auto">
          {(user?.role === 'admin' || user?.role === 'operations_manager') && (
            <button
              className="rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 px-4 py-2 text-white font-bold shadow hover:scale-105 hover:shadow-lg transition"
              onClick={() => {/* 跳转到创建产品页面，或弹窗 */}}
            >
              创建产品
            </button>
          )}
          <button
            onClick={handleExportToExcel}
            disabled={isExporting || filteredRequirements.length === 0}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 px-4 py-2 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition disabled:opacity-60"
          >
            {isExporting ? '导出中...' : '导出'}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto w-full rounded-xl bg-white/90 shadow p-2">
        <table className="table w-full divide-y divide-neutral-200 text-sm">
          <thead>
            <tr className="bg-blue-100 divide-x divide-neutral-300 rounded-t-xl text-center">
              <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">序号</th>
              <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">创建时间</th>
              <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center w-12">图片</th>
              <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center max-w-xs">产品名称</th>
              <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center max-w-xs">SEO Keyword</th>
              <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">店铺类型</th>
              <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">类目</th>
              <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">优先级</th>
              <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">计划上架时间</th>
              <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">创建人</th>
              <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white/80 text-center">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedRequirements.length > 0 ? (
              paginatedRequirements.map((requirement, idx) => (
                <tr key={requirement.id} className="transition-colors hover:bg-blue-50/40 divide-x divide-neutral-200 text-center">
                  <td className="px-2 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-neutral-500">{formatDateTime(requirement.createdAt)}</td>
                  <td className="px-2 py-2 w-12">
                    <img
                      src={requirement.image || 'https://via.placeholder.com/48x48?text=+'}
                      alt={requirement.title}
                      className="h-8 w-8 object-cover rounded cursor-pointer border border-neutral-200 mx-auto"
                      onClick={() => { setPreviewImg(requirement.image || 'https://via.placeholder.com/400x400?text=产品图片'); setTimeout(() => setFadeImg(true), 10); }}
                    />
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 font-medium text-blue-700 hover:underline truncate max-w-xs" title={requirement.title}>{requirement.title}</td>
                  <td className="px-2 py-2 truncate max-w-xs relative group cursor-pointer">
                    <span title={requirement.seoKeyword || '带秤多功能路亚钳铝合金控大物失手绳防丢取钩摘钩'}>{requirement.seoKeyword || '带秤多功能路亚钳铝合金控大物失手绳防丢取钩摘钩'}</span>
                    <div className="absolute left-1/2 z-50 hidden group-hover:block -translate-x-1/2 top-full mt-1 w-max max-w-xs bg-white border border-neutral-300 rounded shadow-lg px-3 py-2 text-sm text-neutral-800 whitespace-pre-line">
                      {requirement.seoKeyword || '带秤多功能路亚钳铝合金控大物失手绳防丢取钩摘钩'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-neutral-600">{getStoreTypeText(requirement.storeType)}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-neutral-600">{getCategoryText(requirement.category as any)}</td>
                  <td className="whitespace-nowrap px-2 py-2"><span className={`badge ${getPriorityClass(requirement.priority)}`}>{getPriorityText(requirement.priority)}</span></td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-neutral-600">{formatDateTime(requirement.plannedLaunchDate)}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-neutral-600">{requirement.createdBy.name}</td>
                  <td className="whitespace-nowrap px-2 py-2">
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
        <div className="flex justify-end items-center gap-2 mt-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 rounded bg-neutral-100 hover:bg-blue-100 text-neutral-700 disabled:opacity-50">上一页</button>
          <span className="text-xs">第 {currentPage} / {totalPages} 页</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 rounded bg-neutral-100 hover:bg-blue-100 text-neutral-700 disabled:opacity-50">下一页</button>
        </div>
      </div>
      {previewImg && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${fadeImg ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => { setFadeImg(false); setTimeout(() => setPreviewImg(null), 300); }}
          onTransitionEnd={e => { if (!fadeImg && previewImg) setPreviewImg(null); }}
        >
          <img src={previewImg} alt="预览" className="max-w-[60vw] max-h-[60vh] object-contain rounded shadow-2xl border-4 border-white" />
        </div>
      )}
    </div>
  );
};

export default ProductRequirementPage;