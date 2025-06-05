import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { WorkflowStatus, ProductCategory, StoreType, PriorityLevel } from '../types/productTypes';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'yyyy-MM-dd');
};

export const formatDateTime = (dateString: string): string => {
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
};

export const formatRelativeTime = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: zhCN,
  });
};

export const getStatusText = (status: WorkflowStatus): string => {
  switch (status) {
    case 'pending_review':
      return '待评审';
    case 'sample_approved':
      return '已确认拿样';
    case 'sample_rejected':
      return '不予采纳';
    case 'sample_received':
      return '已签收样品';
    case 'order_approved':
      return '已确认订货';
    case 'order_rejected':
      return '不予采纳';
    case 'contract_uploaded':
      return '已上传合同';
    case 'order_placed':
      return '已发起订货';
    case 'stock_received':
      return '已入仓';
    case 'launched':
      return '已上架';
    case 'restock_needed':
      return '需补货';
    default:
      return '未知状态';
  }
};

export const getCategoryText = (category: ProductCategory): string => {
  switch (category) {
    case 'fishing_rod':
      return '鱼竿';
    case 'fishing_reel':
      return '渔轮';
    case 'fishing_line':
      return '渔线';
    case 'fishing_hook':
      return '鱼钩';
    case 'fishing_lure':
      return '路亚';
    case 'fishing_accessory':
      return '渔具配件';
    case 'fishing_apparel':
      return '钓鱼服饰';
    default:
      return '其他';
  }
};

export const getStoreTypeText = (storeType: StoreType): string => {
  switch (storeType) {
    case 'pop':
      return 'POP店铺';
    case 'self_operated':
      return '自营店铺';
    default:
      return '未知';
  }
};

export const getPriorityText = (priority: PriorityLevel): string => {
  switch (priority) {
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
    default:
      return '未知';
  }
};

export const getPriorityClass = (priority: PriorityLevel): string => {
  switch (priority) {
    case 'high':
      return 'badge-error';
    case 'medium':
      return 'badge-warning';
    case 'low':
      return 'badge-secondary';
    default:
      return 'badge-secondary';
  }
};

export const getStatusClass = (status: WorkflowStatus): string => {
  switch (status) {
    case 'pending_review':
      return 'badge-warning';
    case 'sample_approved':
    case 'sample_received':
    case 'order_approved':
    case 'contract_uploaded':
    case 'order_placed':
    case 'stock_received':
      return 'badge-primary';
    case 'launched':
      return 'badge-success';
    case 'sample_rejected':
    case 'order_rejected':
      return 'badge-error';
    case 'restock_needed':
      return 'badge-warning';
    default:
      return 'badge-secondary';
  }
};