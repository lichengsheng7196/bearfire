import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Store, Tag, AlertTriangle } from 'lucide-react';
import { useRequirementStore } from '../stores/requirementStore';
import { formatDateTime, getCategoryText, getStoreTypeText, getPriorityClass } from '../utils/formatters';
import toast from 'react-hot-toast';

const ProductRequirementDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequirementById, fetchRequirements } = useRequirementStore();
  const [requirement, setRequirement] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      await fetchRequirements();
      const req = getRequirementById(id);
      
      if (req) {
        setRequirement(req);
      } else {
        toast.error('未找到需求信息');
        navigate('/requirements');
      }
    };
    
    loadData();
  }, [id, getRequirementById, fetchRequirements, navigate]);

  if (!requirement) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-neutral-600">正在加载需求信息...</p>
        </div>
      </div>
    );
  }

  const isOverdue = new Date(requirement.plannedLaunchDate) < new Date();

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="rounded-2xl bg-white/80 shadow-2xl backdrop-blur-md p-8 animate-fade-in">
        <button
          onClick={() => navigate('/requirements')}
          className="mb-6 flex items-center gap-2 text-base text-neutral-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          <span>返回需求列表</span>
        </button>
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-green-600 drop-shadow-md">{requirement.title}</h1>
        <p className="mb-8 text-sm text-neutral-600">创建于 {formatDateTime(requirement.createdAt)} | 创建人: {requirement.createdBy.name}</p>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl border border-neutral-200 bg-white/90 shadow-xl">
              <div className="border-b border-neutral-200 bg-neutral-50/80 px-6 py-4 rounded-t-2xl">
                <h2 className="font-semibold text-lg text-neutral-800">需求详情</h2>
              </div>
              <div className="p-6 space-y-8">
                <div>
                  <h3 className="mb-4 text-lg font-bold text-blue-700">基本信息</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/80 p-4 shadow-sm">
                      <Store className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium text-neutral-700">店铺类型</div>
                        <div className="text-neutral-600">{getStoreTypeText(requirement.storeType)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/80 p-4 shadow-sm">
                      <Tag className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="text-sm font-medium text-neutral-700">产品分类</div>
                        <div className="text-neutral-600">{getCategoryText(requirement.category)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/80 p-4 shadow-sm">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="text-sm font-medium text-neutral-700">优先级</div>
                        <span className={`badge ${getPriorityClass(requirement.priority)}`}>{requirement.priority === 'high' ? '高' : requirement.priority === 'medium' ? '中' : '低'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/80 p-4 shadow-sm">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="text-sm font-medium text-neutral-700">计划上架时间</div>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-600">{formatDateTime(requirement.plannedLaunchDate)}</span>
                          {isOverdue && (
                            <span className="badge badge-error text-xs">已逾期</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {requirement.initialImages && requirement.initialImages.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-blue-700">产品图片</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {requirement.initialImages.map((image: string, index: number) => (
                        <div key={index} className="relative h-40 overflow-hidden rounded-xl bg-neutral-100 shadow">
                          <img src={image} alt={`产品图片 ${index + 1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {requirement.marketPositioning && (
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-blue-700">市场定位</h3>
                    <p className="whitespace-pre-wrap rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 text-neutral-600 shadow-sm">{requirement.marketPositioning}</p>
                  </div>
                )}
                {requirement.marketingStrategy && (
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-blue-700">营销策略</h3>
                    <p className="whitespace-pre-wrap rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 text-neutral-600 shadow-sm">{requirement.marketingStrategy}</p>
                  </div>
                )}
                {requirement.competitorAnalysis && (
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-blue-700">竞品分析</h3>
                    <p className="whitespace-pre-wrap rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 text-neutral-600 shadow-sm">{requirement.competitorAnalysis}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div>
            <div className="rounded-2xl border border-neutral-200 bg-white/90 shadow-xl">
              <div className="border-b border-neutral-200 bg-neutral-50/80 px-6 py-4 rounded-t-2xl">
                <h2 className="font-semibold text-lg text-neutral-800">状态</h2>
              </div>
              <div className="p-6">
                <div className="mb-6 flex items-center">
                  <div className={`h-3 w-3 rounded-full ${
                    requirement.status === 'completed'
                      ? 'bg-success-500'
                      : requirement.status === 'cancelled'
                        ? 'bg-error-500'
                        : requirement.status === 'in_progress'
                          ? 'bg-primary-500'
                          : 'bg-neutral-500'
                  }`}></div>
                  <div className="ml-3">
                    <span className="font-medium text-neutral-800">
                      {requirement.status === 'completed' && '已完成'}
                      {requirement.status === 'cancelled' && '已取消'}
                      {requirement.status === 'in_progress' && '进行中'}
                      {requirement.status === 'draft' && '草稿'}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/product-pool?requirement=${requirement.id}`}
                  className="btn-outline w-full justify-center"
                >
                  查看关联选品
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRequirementDetailPage;