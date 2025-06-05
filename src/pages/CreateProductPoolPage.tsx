import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Loader2, Upload, Trash2, Edit, Sparkles, ArrowLeft, AlertTriangle, CheckCircle2, X, Package, ShoppingBag, FileText, BarChart2, TrendingUp, DollarSign, Clock, Users, Shield, Target, Zap, Truck, Factory, Warehouse, Store, Calendar, GitBranch, GitCommit, GitPullRequest, History, Building2, Star, Award, ClipboardCheck, Phone, Mail } from 'lucide-react';
import { useProductPoolStore } from '../stores/productPoolStore';
import { useRequirementStore } from '../stores/requirementStore';
import { useAuthStore } from '../stores/authStore';
import { useSupplyChainStore } from '../stores/supplyChainStore';
import toast from 'react-hot-toast';
import { mockSuppliers } from '../data/mockData';
import { ProductCategory } from '../types/productTypes';
import { Supplier } from '../types/supplyChainTypes';

interface FormData {
  productName: string;
  category: ProductCategory;
  requirementId: string;
  supplierId: string;
  factoryPrice: string;
  tax: string;
  specifications: {
    dimensions: string;
    weight: string;
    materials: string[];
    colors: string[];
  };
  accessories: string;
  packaging: string;
  sampleTimeframe: string;
  productionTimeframe: string;
  minimumOrderQuantity: string;
  riskLevel: 'high' | 'medium' | 'low';
  competitorLinks: string;
  description: string;
  customizationRequirements: string;
  evaluationMetrics: EvaluationMetrics;
  riskAnalysis: RiskAnalysis;
  supplyChain: {
    stages: SupplyChainStage[];
  };
  lifecycle: ProductLifecycle;
  supplier: Supplier | null;
  productImages: string[];
  sampleImages: string[];
  marketAnalysis: string;
  competitorAnalysis: string;
}

interface EvaluationMetrics {
  marketPotential: number;
  profitMargin: number;
  competitionLevel: number;
  supplyChainRisk: number;
  technicalFeasibility: number;
}

interface RiskAnalysis {
  marketRisk: string;
  supplyChainRisk: string;
  technicalRisk: string;
  financialRisk: string;
  mitigationStrategies: string[];
}

interface SupplyChainStage {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  startDate?: string;
  endDate?: string;
  notes?: string;
  attachments?: string[];
}

interface ProductLifecycle {
  stage: 'development' | 'testing' | 'production' | 'launch' | 'maintenance';
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  startDate?: string;
  endDate?: string;
  milestones: {
    id: string;
    name: string;
    status: 'pending' | 'completed';
    dueDate?: string;
  }[];
}

const initialForm: FormData = {
  productName: '',
  category: 'fishing_rod',
  requirementId: '',
  supplierId: '',
  factoryPrice: '',
  tax: '',
  specifications: {
    dimensions: '',
    weight: '',
    materials: [''],
    colors: ['']
  },
  accessories: '',
  packaging: '',
  sampleTimeframe: '',
  productionTimeframe: '',
  minimumOrderQuantity: '',
  riskLevel: 'medium',
  competitorLinks: '',
  description: '',
  customizationRequirements: '',
  evaluationMetrics: {
    marketPotential: 0,
    profitMargin: 0,
    competitionLevel: 0,
    supplyChainRisk: 0,
    technicalFeasibility: 0
  },
  riskAnalysis: {
    marketRisk: '',
    supplyChainRisk: '',
    technicalRisk: '',
    financialRisk: '',
    mitigationStrategies: []
  },
  supplyChain: {
    stages: [
      {
        id: '1',
        name: '原材料采购',
        status: 'pending',
        notes: '等待供应商确认'
      },
      {
        id: '2',
        name: '生产制造',
        status: 'pending',
        notes: '等待原材料到位'
      },
      {
        id: '3',
        name: '质量检验',
        status: 'pending',
        notes: '等待生产完成'
      },
      {
        id: '4',
        name: '仓储物流',
        status: 'pending',
        notes: '等待质检完成'
      }
    ]
  },
  lifecycle: {
    stage: 'development',
    status: 'planned',
    milestones: [
      {
        id: '1',
        name: '产品设计完成',
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: '样品制作',
        status: 'pending',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: '市场测试',
        status: 'pending',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  supplier: null,
  productImages: [],
  sampleImages: [],
  marketAnalysis: '',
  competitorAnalysis: ''
};

const CreateProductPoolPage = () => {
  const navigate = useNavigate();
  const { addProductPool } = useProductPoolStore();
  const { requirements, fetchRequirements } = useRequirementStore();
  const { user } = useAuthStore();
  const { suppliers, fetchSuppliers } = useSupplyChainStore();
  
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    marketAnalysis: string;
    competitorAnalysis: string;
  } | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [imageAnnotations, setImageAnnotations] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplierSearchQuery, setSupplierSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRequirements();
    fetchSuppliers();
  }, [fetchRequirements, user, navigate, fetchSuppliers]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!form.productName.trim()) {
      newErrors.productName = '请输入产品名称';
    }
    if (!form.category) {
      newErrors.category = '请选择产品类别';
    }
    if (!form.requirementId) {
      newErrors.requirementId = '请选择关联需求';
    }
    if (!form.supplierId) {
      newErrors.supplierId = '请选择供应商';
    }
    if (!form.factoryPrice) {
      newErrors.factoryPrice = '请输入工厂价格';
    } else if (isNaN(Number(form.factoryPrice)) || Number(form.factoryPrice) <= 0) {
      newErrors.factoryPrice = '请输入有效的工厂价格';
    }
    if (!form.sampleTimeframe) {
      newErrors.sampleTimeframe = '请输入打样时间';
    }
    if (!form.productionTimeframe) {
      newErrors.productionTimeframe = '请输入生产周期';
    }
    if (!form.minimumOrderQuantity) {
      newErrors.minimumOrderQuantity = '请输入最小起订量';
    } else if (isNaN(Number(form.minimumOrderQuantity)) || Number(form.minimumOrderQuantity) <= 0) {
      newErrors.minimumOrderQuantity = '请输入有效的最小起订量';
    }
    if (!form.description.trim()) {
      newErrors.description = '请输入产品描述';
    }
    if (form.productImages.length === 0) {
      toast.error('请上传至少一张产品图片');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      toast.error('未登录或会话已过期，请重新登录');
      navigate('/login');
      return;
    }

    const supplier = suppliers.find(s => s.id === form.supplierId);
    if (!supplier) {
      toast.error('未找到供应商信息');
      return;
    }

    setIsSubmitting(true);
    try {
      const { supplierId, accessories, competitorLinks, factoryPrice, tax, minimumOrderQuantity, ...restForm } = form;
      await addProductPool({
        ...restForm,
        supplier,
        productImages: form.productImages,
        accessories: accessories ? accessories.split(',').map(s => s.trim()).filter(Boolean) : [],
        competitorLinks: competitorLinks ? competitorLinks.split(',').map(s => s.trim()).filter(Boolean) : [],
        factoryPrice: Number(factoryPrice),
        tax: Number(tax),
        minimumOrderQuantity: Number(minimumOrderQuantity),
        createdBy: user,
        createdAt: new Date().toISOString(),
        marketAnalysis: analysisResult?.marketAnalysis,
        competitorAnalysis: analysisResult?.competitorAnalysis,
        workflowStatus: 'pending_review',
        timeline: [{
          type: 'created',
          content: '创建选品',
          createdAt: new Date().toISOString(),
          user: user
        }]
      } as any);
      
      toast.success('创建成功');
      navigate('/product-pool');
    } catch (error) {
      toast.error('创建失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + form.productImages.length > 10) {
      toast.error('最多上传10张图片');
      return;
    }
    
    const newImages = files.map(file => URL.createObjectURL(file));
    setForm(prev => ({
      ...prev,
      productImages: [...prev.productImages, ...newImages]
    }));
    setImageAnnotations(prev => [...prev, ...Array(files.length).fill('')]);
  };

  const handleRemoveImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index)
    }));
    setImageAnnotations(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageDragStart = (index: number) => {
    setDragIndex(index);
    setIsDragging(true);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newImages = [...form.productImages];
    const newAnnotations = [...imageAnnotations];
    const [draggedImage] = newImages.splice(dragIndex, 1);
    const [draggedAnnotation] = newAnnotations.splice(dragIndex, 1);
    
    newImages.splice(index, 0, draggedImage);
    newAnnotations.splice(index, 0, draggedAnnotation);
    
    setForm(prev => ({
      ...prev,
      productImages: newImages
    }));
    setImageAnnotations(newAnnotations);
    setDragIndex(index);
  };

  const handleImageDragEnd = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  const handleAnnotationChange = (index: number, value: string) => {
    setImageAnnotations(prev => prev.map((ann, i) => i === index ? value : ann));
  };

  const handleAnalyze = async () => {
    if (!form.productName || !form.description) {
      toast.error('请先填写产品名称和描述');
      return;
    }

    if (!form.category) {
      toast.error('请先选择产品类别');
      return;
    }

    setIsAnalyzing(true);
    try {
      // 模拟AI分析
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 根据产品类别生成不同的分析结果
      const categoryAnalysis = {
        fishing_rod: {
          marketAnalysis: '台钓市场持续增长，高端碳素竿需求旺盛。建议突出轻量化、手感舒适等特点。',
          competitorAnalysis: '主要竞争对手包括A、B、C等品牌，我们的产品在价格和功能上具有竞争优势。'
        },
        fishing_reel: {
          marketAnalysis: '渔轮市场趋于稳定，消费者更注重耐用性和顺滑度。建议强调轴承质量和防腐蚀性能。',
          competitorAnalysis: '竞品主要集中在300-500元价位，我们的产品在性价比方面具有优势。'
        },
        fishing_line: {
          marketAnalysis: '渔线市场增长迅速，消费者对线径和拉力值要求提高。建议突出产品耐用性和抗打结性能。',
          competitorAnalysis: '市场上同类产品较多，建议通过独特工艺和材料提升竞争力。'
        },
        fishing_hook: {
          marketAnalysis: '鱼钩市场稳定，消费者更关注锋利度和防锈性能。建议强调热处理工艺和防锈涂层。',
          competitorAnalysis: '竞品价格区间在20-50元，建议通过品质提升来获取更高溢价。'
        },
        fishing_lure: {
          marketAnalysis: '路亚市场快速增长，消费者更注重仿真度和泳姿。建议突出产品设计和材料选择。',
          competitorAnalysis: '主要竞争对手来自日本和欧美品牌，建议通过本土化设计提升竞争力。'
        },
        fishing_accessory: {
          marketAnalysis: '渔具配件市场稳定，消费者更注重实用性和耐用性。建议强调产品细节和材质选择。',
          competitorAnalysis: '竞品主要集中在低端市场，建议通过品质提升来获取更高市场份额。'
        },
        fishing_apparel: {
          marketAnalysis: '钓鱼服饰市场增长迅速，消费者更注重功能性和舒适度。建议突出防晒、速干等特点。',
          competitorAnalysis: '竞品主要集中在运动品牌，建议通过专业性和功能性来提升竞争力。'
        }
      };

      const analysis = categoryAnalysis[form.category as keyof typeof categoryAnalysis];
      setAnalysisResult(analysis);
      
      // 自动填充一些建议的竞品链接
      if (!form.competitorLinks) {
        const competitorLinks = {
          fishing_rod: 'https://item.taobao.com/item.htm?id=123456,https://jd.com/item/654321',
          fishing_reel: 'https://item.taobao.com/item.htm?id=234567,https://jd.com/item/765432',
          fishing_line: 'https://item.taobao.com/item.htm?id=345678,https://jd.com/item/876543',
          fishing_hook: 'https://item.taobao.com/item.htm?id=456789,https://jd.com/item/987654',
          fishing_lure: 'https://item.taobao.com/item.htm?id=567890,https://jd.com/item/098765',
          fishing_accessory: 'https://item.taobao.com/item.htm?id=678901,https://jd.com/item/109876',
          fishing_apparel: 'https://item.taobao.com/item.htm?id=789012,https://jd.com/item/210987'
        };
        setForm(prev => ({
          ...prev,
          competitorLinks: competitorLinks[form.category as keyof typeof competitorLinks]
        }));
      }

      toast.success('分析完成');
    } catch (error) {
      toast.error('分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEvaluate = async () => {
    if (!form.productName || !form.description || !form.category) {
      toast.error('请先填写产品基本信息');
      return;
    }

    setIsAnalyzing(true);
    try {
      // 模拟AI评估
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 根据产品类别生成评估指标
      const categoryMetrics = {
        fishing_rod: {
          marketPotential: 85,
          profitMargin: 75,
          competitionLevel: 65,
          supplyChainRisk: 30,
          technicalFeasibility: 90
        },
        fishing_reel: {
          marketPotential: 80,
          profitMargin: 70,
          competitionLevel: 70,
          supplyChainRisk: 40,
          technicalFeasibility: 85
        },
        // ... 其他类别的评估指标
      };

      const metrics = categoryMetrics[form.category as keyof typeof categoryMetrics];
      setForm(prev => ({
        ...prev,
        evaluationMetrics: metrics
      }));

      // 生成风险分析
      const analysis = {
        marketRisk: '市场竞争激烈，需要突出产品差异化优势',
        supplyChainRisk: '供应链稳定，但需要关注原材料价格波动',
        technicalRisk: '技术成熟，生产工艺稳定',
        financialRisk: '初期投入较大，但预期回报可观',
        mitigationStrategies: [
          '加强产品差异化定位',
          '建立稳定的供应商关系',
          '优化生产工艺降低成本',
          '制定合理的定价策略'
        ]
      };

      setForm(prev => ({
        ...prev,
        riskAnalysis: analysis
      }));
      setShowEvaluationModal(true);
      toast.success('评估完成');
    } catch (error) {
      toast.error('评估失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateSupplyChainStage = (stageId: string, updates: Partial<SupplyChainStage>) => {
    setForm(prev => ({
      ...prev,
      supplyChain: {
        ...prev.supplyChain,
        stages: prev.supplyChain.stages.map(stage =>
          stage.id === stageId ? { ...stage, ...updates } : stage
        )
      }
    }));
  };

  const handleUpdateMilestone = (milestoneId: string, updates: Partial<ProductLifecycle['milestones'][0]>) => {
    setForm(prev => ({
      ...prev,
      lifecycle: {
        ...prev.lifecycle,
        milestones: prev.lifecycle.milestones.map(milestone =>
          milestone.id === milestoneId ? { ...milestone, ...updates } : milestone
        )
      }
    }));
  };

  const handleSelectSupplier = (supplier: Supplier) => {
    setForm(prev => ({
      ...prev,
      supplier
    }));
    setShowSupplierModal(false);
    toast.success('已选择供应商');
  };

  const renderEvaluationModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-800">产品评估结果</h3>
          <button
            onClick={() => setShowEvaluationModal(false)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 评估指标 */}
          <div>
            <h4 className="mb-3 font-medium text-neutral-700">评估指标</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-neutral-600">市场潜力</span>
                  <span className="text-sm font-medium text-neutral-800">{form.evaluationMetrics.marketPotential}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${form.evaluationMetrics.marketPotential}%` }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-neutral-600">利润率</span>
                  <span className="text-sm font-medium text-neutral-800">{form.evaluationMetrics.profitMargin}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${form.evaluationMetrics.profitMargin}%` }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-neutral-600">竞争程度</span>
                  <span className="text-sm font-medium text-neutral-800">{form.evaluationMetrics.competitionLevel}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${form.evaluationMetrics.competitionLevel}%` }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-neutral-600">供应链风险</span>
                  <span className="text-sm font-medium text-neutral-800">{form.evaluationMetrics.supplyChainRisk}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${form.evaluationMetrics.supplyChainRisk}%` }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-neutral-600">技术可行性</span>
                  <span className="text-sm font-medium text-neutral-800">{form.evaluationMetrics.technicalFeasibility}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${form.evaluationMetrics.technicalFeasibility}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 风险分析 */}
          <div>
            <h4 className="mb-3 font-medium text-neutral-700">风险分析</h4>
            <div className="space-y-4">
              <div className="rounded-lg border border-neutral-200 p-4">
                <h5 className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-800">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  市场风险
                </h5>
                <p className="text-sm text-neutral-600">{form.riskAnalysis.marketRisk}</p>
              </div>

              <div className="rounded-lg border border-neutral-200 p-4">
                <h5 className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-800">
                  <Package className="h-4 w-4 text-blue-500" />
                  供应链风险
                </h5>
                <p className="text-sm text-neutral-600">{form.riskAnalysis.supplyChainRisk}</p>
              </div>

              <div className="rounded-lg border border-neutral-200 p-4">
                <h5 className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-800">
                  <Zap className="h-4 w-4 text-purple-500" />
                  技术风险
                </h5>
                <p className="text-sm text-neutral-600">{form.riskAnalysis.technicalRisk}</p>
              </div>

              <div className="rounded-lg border border-neutral-200 p-4">
                <h5 className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-800">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  财务风险
                </h5>
                <p className="text-sm text-neutral-600">{form.riskAnalysis.financialRisk}</p>
              </div>

              <div className="rounded-lg border border-neutral-200 p-4">
                <h5 className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-800">
                  <Shield className="h-4 w-4 text-red-500" />
                  风险应对策略
                </h5>
                <ul className="list-inside list-disc space-y-1 text-sm text-neutral-600">
                  {form.riskAnalysis.mitigationStrategies.map((strategy, index) => (
                    <li key={index}>{strategy}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowEvaluationModal(false)}
            className="btn-primary"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );

  const renderSupplierModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">选择供应商</h2>
            <button
              onClick={() => setShowSupplierModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜索供应商..."
              value={supplierSearchQuery}
              onChange={(e) => setSupplierSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-4">
            {suppliers
              .filter(supplier => 
                supplier.name.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
                supplier.contactPerson.toLowerCase().includes(supplierSearchQuery.toLowerCase())
              )
              .map(supplier => (
                <div
                  key={supplier.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer"
                  onClick={() => {
                    setForm(prev => ({ ...prev, supplierId: supplier.id }));
                    setShowSupplierModal(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{supplier.name}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          联系人: {supplier.contactPerson}
                        </p>
                        <p className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          电话: {supplier.phoneNumber}
                        </p>
                        {supplier.email && (
                          <p className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            邮箱: {supplier.email}
                          </p>
                        )}
                        <p className="flex items-center">
                          <Building2 className="w-4 h-4 mr-2" />
                          地址: {supplier.address.province} {supplier.address.city} {supplier.address.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < supplier.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {supplier.performanceMetrics && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">准时交付率</p>
                        <p className="text-lg font-semibold">
                          {supplier.performanceMetrics.onTimeDeliveryRate ?? 'N/A'}%
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">质量合格率</p>
                        <p className="text-lg font-semibold">
                          {supplier.performanceMetrics.qualityPassRate ?? 'N/A'}%
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">响应时间</p>
                        <p className="text-lg font-semibold">
                          {supplier.performanceMetrics.responseTime ?? 'N/A'}小时
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">合作年限</p>
                        <p className="text-lg font-semibold">
                          {supplier.performanceMetrics.cooperationYears ?? 'N/A'}年
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="rounded-2xl bg-white/80 shadow-2xl backdrop-blur-md p-8 animate-fade-in">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-green-600 drop-shadow-md">创建新选品</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-800">基本信息</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  产品名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => setForm(prev => ({ ...prev, productName: e.target.value }))}
                  className={`w-full rounded-md border ${errors.productName ? 'border-red-500' : 'border-neutral-300'} px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                  placeholder="请输入产品名称"
                />
                {errors.productName && (
                  <p className="mt-1 text-sm text-red-500">{errors.productName}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  产品类别 <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                  className={`w-full rounded-md border ${errors.category ? 'border-red-500' : 'border-neutral-300'} px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                >
                  <option value="fishing_rod">鱼竿</option>
                  <option value="fishing_reel">渔轮</option>
                  <option value="fishing_line">渔线</option>
                  <option value="fishing_hook">鱼钩</option>
                  <option value="fishing_lure">路亚</option>
                  <option value="fishing_accessory">渔具配件</option>
                  <option value="fishing_apparel">钓鱼服饰</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  关联需求 <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.requirementId}
                  onChange={(e) => setForm(prev => ({ ...prev, requirementId: e.target.value }))}
                  className={`w-full rounded-md border ${errors.requirementId ? 'border-red-500' : 'border-neutral-300'} px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                >
                  <option value="">请选择需求</option>
                  {requirements.map(req => (
                    <option key={req.id} value={req.id}>
                      {req.title}
                    </option>
                  ))}
                </select>
                {errors.requirementId && (
                  <p className="mt-1 text-sm text-red-500">{errors.requirementId}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  供应商 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">供应商信息</h3>
                    <button
                      type="button"
                      onClick={() => setShowSupplierModal(true)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      <PlusCircle className="w-4 h-4 mr-1" />
                      选择供应商
                    </button>
                  </div>
                  
                  {form.supplierId && selectedSupplier && (
                    <div className="p-4 bg-white rounded-lg shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-medium">{selectedSupplier.name}</h4>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              联系人: {selectedSupplier.contactPerson}
                            </p>
                            <p className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              电话: {selectedSupplier.phoneNumber}
                            </p>
                            {selectedSupplier.email && (
                              <p className="flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                邮箱: {selectedSupplier.email}
                              </p>
                            )}
                            <p className="flex items-center">
                              <Building2 className="w-4 h-4 mr-2" />
                              地址: {selectedSupplier.address.province} {selectedSupplier.address.city} {selectedSupplier.address.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < selectedSupplier.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {selectedSupplier.performanceMetrics && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">准时交付率</p>
                            <p className="text-lg font-semibold">
                              {selectedSupplier.performanceMetrics.onTimeDeliveryRate ?? 'N/A'}%
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">质量合格率</p>
                            <p className="text-lg font-semibold">
                              {selectedSupplier.performanceMetrics.qualityPassRate ?? 'N/A'}%
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">响应时间</p>
                            <p className="text-lg font-semibold">
                              {selectedSupplier.performanceMetrics.responseTime ?? 'N/A'}小时
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">合作年限</p>
                            <p className="text-lg font-semibold">
                              {selectedSupplier.performanceMetrics.cooperationYears ?? 'N/A'}年
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedSupplier.contracts && selectedSupplier.contracts.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-600">合同信息</h5>
                          <div className="mt-2 space-y-2">
                            {selectedSupplier.contracts.map(contract => (
                              <div key={contract.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <p className="font-medium">{contract.title}</p>
                                  <p className="text-sm text-gray-500">
                                    签署日期: {new Date(contract.signDate).toLocaleDateString()}
                                  </p>
                                </div>
                                {contract.fileUrl && (
                                  <a
                                    href={contract.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <FileText className="w-5 h-5" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  工厂价格 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.factoryPrice}
                  onChange={(e) => setForm(prev => ({ ...prev, factoryPrice: e.target.value }))}
                  className={`w-full rounded-md border ${errors.factoryPrice ? 'border-red-500' : 'border-neutral-300'} px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                  placeholder="请输入工厂价格"
                  min="0"
                  step="0.01"
                />
                {errors.factoryPrice && (
                  <p className="mt-1 text-sm text-red-500">{errors.factoryPrice}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  税费
                </label>
                <input
                  type="number"
                  value={form.tax}
                  onChange={(e) => setForm(prev => ({ ...prev, tax: e.target.value }))}
                  className="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入税费"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-800">规格信息</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  尺寸规格
                </label>
                <input
                  type="text"
                  value={form.specifications.dimensions}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    specifications: { ...prev.specifications, dimensions: e.target.value }
                  }))}
                  className="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入尺寸规格，如：长度4.5米，收缩后110厘米"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  重量
                </label>
                <input
                  type="text"
                  value={form.specifications.weight}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    specifications: { ...prev.specifications, weight: e.target.value }
                  }))}
                  className="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入重量，如：207克"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  材质
                </label>
                <div className="space-y-2">
                  {form.specifications.materials.map((material, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => {
                          const newMaterials = [...form.specifications.materials];
                          newMaterials[index] = e.target.value;
                          setForm(prev => ({
                            ...prev,
                            specifications: { ...prev.specifications, materials: newMaterials }
                          }));
                        }}
                        className="flex-1 rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        placeholder="请输入材质"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newMaterials = form.specifications.materials.filter((_, i) => i !== index);
                          setForm(prev => ({
                            ...prev,
                            specifications: { ...prev.specifications, materials: newMaterials }
                          }));
                        }}
                        className="btn-outline px-2 py-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          materials: [...prev.specifications.materials, '']
                        }
                      }));
                    }}
                    className="btn-outline flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    添加材质
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  颜色
                </label>
                <div className="space-y-2">
                  {form.specifications.colors.map((color, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...form.specifications.colors];
                          newColors[index] = e.target.value;
                          setForm(prev => ({
                            ...prev,
                            specifications: { ...prev.specifications, colors: newColors }
                          }));
                        }}
                        className="flex-1 rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        placeholder="请输入颜色"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newColors = form.specifications.colors.filter((_, i) => i !== index);
                          setForm(prev => ({
                            ...prev,
                            specifications: { ...prev.specifications, colors: newColors }
                          }));
                        }}
                        className="btn-outline px-2 py-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          colors: [...prev.specifications.colors, '']
                        }
                      }));
                    }}
                    className="btn-outline flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    添加颜色
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Production Information */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-800">生产信息</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  打样时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.sampleTimeframe}
                  onChange={(e) => setForm(prev => ({ ...prev, sampleTimeframe: e.target.value }))}
                  className={`w-full rounded-md border ${errors.sampleTimeframe ? 'border-red-500' : 'border-neutral-300'} px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                  placeholder="请输入打样时间"
                />
                {errors.sampleTimeframe && (
                  <p className="mt-1 text-sm text-red-500">{errors.sampleTimeframe}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  生产周期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.productionTimeframe}
                  onChange={(e) => setForm(prev => ({ ...prev, productionTimeframe: e.target.value }))}
                  className={`w-full rounded-md border ${errors.productionTimeframe ? 'border-red-500' : 'border-neutral-300'} px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                  placeholder="请输入生产周期"
                />
                {errors.productionTimeframe && (
                  <p className="mt-1 text-sm text-red-500">{errors.productionTimeframe}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  最小起订量 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.minimumOrderQuantity}
                  onChange={(e) => setForm(prev => ({ ...prev, minimumOrderQuantity: e.target.value }))}
                  className={`w-full rounded-md border ${errors.minimumOrderQuantity ? 'border-red-500' : 'border-neutral-300'} px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                  placeholder="请输入最小起订量"
                  min="1"
                />
                {errors.minimumOrderQuantity && (
                  <p className="mt-1 text-sm text-red-500">{errors.minimumOrderQuantity}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  风险等级
                </label>
                <select
                  value={form.riskLevel}
                  onChange={(e) => setForm(prev => ({ ...prev, riskLevel: e.target.value as 'high' | 'medium' | 'low' }))}
                  className="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="low">低风险</option>
                  <option value="medium">中等风险</option>
                  <option value="high">高风险</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-800">补充信息</h2>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  竞品链接
                </label>
                <input
                  type="text"
                  value={form.competitorLinks}
                  onChange={(e) => setForm(prev => ({ ...prev, competitorLinks: e.target.value }))}
                  className="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入竞品链接，多个链接用逗号分隔"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  产品描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-neutral-300'} px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                  placeholder="请输入产品描述"
                  rows={4}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  定制要求
                </label>
                <textarea
                  value={form.customizationRequirements}
                  onChange={(e) => setForm(prev => ({ ...prev, customizationRequirements: e.target.value }))}
                  className="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入定制要求"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-800">产品图片</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="product-images"
                />
                <label
                  htmlFor="product-images"
                  className="btn-secondary flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  选择图片
                </label>
                <p className="text-sm text-neutral-500">
                  最多上传10张图片，支持jpg、png格式，可拖拽排序
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {form.productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`group relative aspect-square overflow-hidden rounded-lg border border-neutral-200 ${
                      isDragging && dragIndex === index ? 'ring-2 ring-primary-500' : ''
                    }`}
                    draggable
                    onDragStart={() => handleImageDragStart(index)}
                    onDragOver={(e) => handleImageDragOver(e, index)}
                    onDragEnd={handleImageDragEnd}
                  >
                    <img
                      src={image}
                      alt={`产品图片 ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between bg-black bg-opacity-50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="rounded-full bg-white p-1 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          value={imageAnnotations[index]}
                          onChange={(e) => handleAnnotationChange(index, e.target.value)}
                          className="w-full rounded-md border border-white bg-white bg-opacity-90 px-2 py-1 text-sm"
                          placeholder="图片备注"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Analysis Results */}
          {analysisResult && (
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-neutral-800">AI分析结果</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium text-neutral-700">市场分析</h3>
                  <p className="text-neutral-600">{analysisResult.marketAnalysis}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-neutral-700">竞品分析</h3>
                  <p className="text-neutral-600">{analysisResult.competitorAnalysis}</p>
                </div>
              </div>
            </div>
          )}

          {/* Modals */}
          {showEvaluationModal && renderEvaluationModal()}
          {showSupplierModal && renderSupplierModal()}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  提交中...
                </>
              ) : (
                '提交'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPoolPage; 