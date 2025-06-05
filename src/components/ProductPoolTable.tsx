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
          <h2 className="text-xl font-semibold text-neutral-800">选品池</h2>
          
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-full table-auto">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  <th className="px-6 py-3">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('productName')}
                    >
                      产品名称
                      {getSortIcon('productName')}
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('category')}
                    >
                      分类
                      {getSortIcon('category')}
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('factoryPrice')}
                    >
                      出厂价
                      {getSortIcon('factoryPrice')}
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('supplier')}
                    >
                      供应商
                      {getSortIcon('supplier')}
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('createdAt')}
                    >
                      创建时间
                      {getSortIcon('createdAt')}
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('createdBy')}
                    >
                      创建人
                      {getSortIcon('createdBy')}
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('workflowStatus')}
                    >
                      状态
                      {getSortIcon('workflowStatus')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {filteredPools.length > 0 ? (
                  filteredPools.map((pool) => (
                    <tr key={pool.id} className="hover:bg-neutral-50">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-primary-700">
                        <Link to={`/product-pool/${pool.id}`} className="hover:underline">
                          {pool.productName}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                        {getCategoryText(pool.category)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                        {formatCurrency(pool.factoryPrice)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                        {pool.supplier.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                        {formatRelativeTime(pool.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                        {pool.createdBy.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`badge ${getStatusClass(pool.workflowStatus)}`}>
                          {getStatusText(pool.workflowStatus)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500">
                      未找到匹配的产品
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPoolTable;