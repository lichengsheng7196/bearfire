import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, ArrowUpDown } from 'lucide-react';
import { ProductPool, ProductCategory } from '../types/productTypes';
import { 
  getStatusText, 
  getStatusClass, 
  getCategoryText,
  formatCurrency,
  formatRelativeTime
} from '../utils/formatters';

interface ProductPoolTableProps {
  productPools: ProductPool[];
  isLoading?: boolean;
  showDeleteButton?: boolean;
}

const ProductPoolTable = ({ 
  productPools, 
  isLoading = false,
  showDeleteButton = false 
}: ProductPoolTableProps) => {
  const [filteredPools, setFilteredPools] = useState<ProductPool[]>(productPools);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProductPool | null;
    direction: 'ascending' | 'descending';
  }>({ key: 'createdAt', direction: 'descending' });
  const [previewImg, setPreviewImg] = useState<string|null>(null);
  const [fadeImg, setFadeImg] = useState(false);

  // Update filtered pools when props change or filters change
  useEffect(() => {
    let result = [...productPools];
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.productName.toLowerCase().includes(lowercasedFilter) ||
        item.supplier.name.toLowerCase().includes(lowercasedFilter) ||
        item.createdBy.name.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.workflowStatus === statusFilter);
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof ProductPool];
        const bValue = b[sortConfig.key as keyof ProductPool];
        
        if (aValue === undefined || bValue === undefined) {
          return 0;
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredPools(result);
  }, [productPools, searchTerm, categoryFilter, statusFilter, sortConfig]);

  const requestSort = (key: keyof ProductPool) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof ProductPool) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={16} className="ml-1 text-neutral-400" />;
    }
    return sortConfig.direction === 'ascending' ? (
      <ChevronDown size={16} className="ml-1 text-primary-500" />
    ) : (
      <ChevronDown size={16} className="ml-1 rotate-180 text-primary-500" />
    );
  };

  return (
    <div className="card">
      <div className="p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-neutral-800">选品管理</h2>
          
          {/* Search and filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="搜索产品名称、供应商、创建人"
                className="input w-full pl-10 sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <select
                className="select w-full appearance-none pl-10 pr-8 sm:w-40"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | 'all')}
              >
                <option value="all">所有分类</option>
                <option value="fishing_rod">鱼竿</option>
                <option value="fishing_reel">渔轮</option>
                <option value="fishing_line">渔线</option>
                <option value="fishing_hook">鱼钩</option>
                <option value="fishing_lure">路亚</option>
                <option value="fishing_accessory">渔具配件</option>
                <option value="fishing_apparel">钓鱼服饰</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-neutral-400" />
            </div>
            
            {/* Status filter */}
            <div className="relative">
              <select
                className="select w-full appearance-none pr-8 sm:w-40"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">所有状态</option>
                <option value="pending_review">待评审</option>
                <option value="sample_approved">已确认拿样</option>
                <option value="sample_received">已签收样品</option>
                <option value="order_approved">已确认订货</option>
                <option value="contract_uploaded">已上传合同</option>
                <option value="order_placed">已发起订货</option>
                <option value="stock_received">已入仓</option>
                <option value="launched">已上架</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-neutral-400" />
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto w-full rounded-xl bg-white/90 shadow p-2">
            <table className="table w-full divide-y divide-neutral-200 text-sm">
              <thead>
                <tr className="bg-blue-100 divide-x divide-neutral-300 rounded-t-xl text-center">
                  <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">序号</th>
                  <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center w-12">图片</th>
                  <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center max-w-xs">产品名称</th>
                  <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center max-w-xs">供应商</th>
                  <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">分类</th>
                  <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">出厂价</th>
                  <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">创建时间</th>
                  <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">创建人</th>
                  <th className="px-2 py-2 text-base font-bold uppercase tracking-wider text-neutral-700 text-center">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white/80 text-center">
                {filteredPools.length > 0 ? (
                  filteredPools.map((pool, idx) => (
                    <tr key={pool.id} className="transition-colors hover:bg-blue-50/40 divide-x divide-neutral-200 text-center">
                      <td className="px-2 py-2">{idx + 1}</td>
                      <td className="px-2 py-2 w-12">
                        <img
                          src={pool.productImages?.[0] || 'https://via.placeholder.com/48x48?text=+'}
                          alt={pool.productName}
                          className="h-8 w-8 object-cover rounded cursor-pointer border border-neutral-200 mx-auto"
                          onClick={() => { setPreviewImg(pool.productImages?.[0] || 'https://via.placeholder.com/400x400?text=产品图片'); setTimeout(() => setFadeImg(true), 10); }}
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 font-medium text-blue-700 hover:underline truncate max-w-xs" title={pool.productName}>{pool.productName}</td>
                      <td className="px-2 py-2 truncate max-w-xs relative group cursor-pointer">
                        <span title={pool.supplier.name}>{pool.supplier.name}</span>
                        <div className="absolute left-1/2 z-50 hidden group-hover:block -translate-x-1/2 top-full mt-1 w-max max-w-xs bg-white border border-neutral-300 rounded shadow-lg px-3 py-2 text-sm text-neutral-800 whitespace-pre-line">
                          {pool.supplier.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-neutral-600">{getCategoryText(pool.category)}</td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-neutral-600">{formatCurrency(pool.factoryPrice)}</td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-neutral-500">{formatRelativeTime(pool.createdAt)}</td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-neutral-600">{pool.createdBy.name}</td>
                      <td className="whitespace-nowrap px-2 py-2">
                        <span className={`badge ${getStatusClass(pool.workflowStatus)}`}>{getStatusText(pool.workflowStatus)}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-neutral-500">未找到匹配的产品</td>
                  </tr>
                )}
              </tbody>
            </table>
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
        )}
      </div>
    </div>
  );
};

export default ProductPoolTable;