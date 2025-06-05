import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Download, Filter, Search } from 'lucide-react';
import ProductPoolTable from '../components/ProductPoolTable';
import { useProductPoolStore } from '../stores/productPoolStore';
import { useAuthStore } from '../stores/authStore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { 
  formatCurrency, 
  formatDateTime, 
  getStatusText,
  getCategoryText 
} from '../utils/formatters';
import { ProductPool } from '../types/productTypes';
import toast from 'react-hot-toast';

const ProductPoolPage = () => {
  const { productPools, fetchProductPools, loading } = useProductPoolStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProductPools();
  }, [fetchProductPools, user, navigate]);

  const handleCreateProduct = () => {
    if (!user) {
      toast.error('请先登录');
      navigate('/login');
      return;
    }
    navigate('/product-pool/create');
  };

  const handleExport = async () => {
    if (!productPools.length) {
      toast.error('没有可导出的数据');
      return;
    }

    setIsExporting(true);
    try {
      const data = productPools.map(pool => ({
        '产品名称': pool.productName,
        '类别': getCategoryText(pool.category),
        '工厂价格': formatCurrency(pool.factoryPrice),
        '供应商': pool.supplier.name,
        '创建时间': formatDateTime(pool.createdAt),
        '创建人': pool.createdBy.name,
        '状态': getStatusText(pool.workflowStatus)
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '选品池列表');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(dataBlob, `选品池列表_${formatDateTime(new Date().toISOString())}.xlsx`);
      toast.success('导出成功');
    } catch (error) {
      toast.error('导出失败');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredProductPools = productPools.filter(pool => {
    const matchesSearch = searchQuery === '' || 
      pool.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || pool.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || pool.workflowStatus === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">选品池</h1>
        <div className="flex gap-4">
          <button
            onClick={handleExport}
            disabled={isExporting || !productPools.length}
            className="btn-secondary flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600"></div>
                导出中...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                导出
              </>
            )}
          </button>
          {(user?.role === 'product_manager' || user?.role === 'admin') && (
            <button onClick={handleCreateProduct} className="btn-primary flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              创建选品
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索产品名称或供应商..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-neutral-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
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
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">所有状态</option>
            <option value="pending_review">待评审</option>
            <option value="sample_approved">已确认拿样</option>
            <option value="sample_rejected">不予采纳</option>
            <option value="sample_ordered">已下单拿样</option>
            <option value="sample_received">已收到样品</option>
            <option value="evaluation_pending">待评估</option>
            <option value="evaluation_approved">评估通过</option>
            <option value="evaluation_rejected">评估不通过</option>
            <option value="order_confirmed">已确认订单</option>
            <option value="contract_created">已创建合同</option>
            <option value="production_started">已开始生产</option>
            <option value="production_completed">生产完成</option>
            <option value="shipped">已发货</option>
            <option value="received">已收货</option>
            <option value="completed">已完成</option>
          </select>
        </div>
      </div>

      <ProductPoolTable 
        productPools={filteredProductPools} 
        isLoading={loading}
        showDeleteButton={user?.role === 'product_manager' || user?.role === 'admin'}
      />
    </div>
  );
};

export default ProductPoolPage;