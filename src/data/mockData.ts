import { ProductPool, Requirement, WorkflowStatus } from '../types/productTypes';
import { User } from '../types/userTypes';
import { Supplier } from '../types/supplyChainTypes';
import { Requirement as RequirementType } from '../types/requirementTypes';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: '管理员',
    email: 'admin@bearfire.com',
    phoneNumber: '13800000000',
    role: 'admin',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    username: 'ops',
    name: '袁鹏',
    email: 'yuanpeng@bearfire.com',
    phoneNumber: '13800000001',
    role: 'operations_manager',
    isActive: true,
    createdAt: '2023-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    username: 'product',
    name: '马少华',
    email: 'mashaohua@bearfire.com',
    phoneNumber: '13800000002',
    role: 'product_manager',
    isActive: true,
    createdAt: '2023-01-03T00:00:00.000Z'
  },
  {
    id: '4',
    username: 'purchase',
    name: '张晓燕',
    email: 'zhangxiaoyan@bearfire.com',
    phoneNumber: '13800000003',
    role: 'purchasing_specialist',
    isActive: true,
    createdAt: '2023-01-04T00:00:00.000Z'
  },
  {
    id: '5',
    username: 'erp',
    name: '刘洋',
    email: 'liuyang@bearfire.com',
    phoneNumber: '13800000004',
    role: 'erp_specialist',
    isActive: true,
    createdAt: '2023-01-05T00:00:00.000Z'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: '南江市润兴工贸有限公司',
    contactPerson: '李明',
    phoneNumber: '13988888888',
    email: 'liming@runxing.com',
    address: {
      province: '江苏省',
      city: '南江市',
      address: '高新区科技路88号'
    },
    businessLicense: 'GSZJ88888888',
    taxId: '91320000MA1ABCDE1X',
    bankInfo: {
      bankName: '中国工商银行',
      accountName: '南江市润兴工贸有限公司',
      accountNumber: '1234567890123456789'
    },
    rating: 5,
    performanceMetrics: {
      onTimeDeliveryRate: 98,
      qualityPassRate: 99,
      responseTime: 4,
      cooperationYears: 3
    },
    productCategories: ['fishing_rod', 'fishing_reel'],
    notes: '优质供应商，合作多年，品质稳定',
    createdAt: '2021-06-01T00:00:00.000Z',
    updatedAt: '2023-05-10T00:00:00.000Z'
  },
  {
    id: 'supplier-2',
    name: '南江市江城区清竹五金厂',
    contactPerson: '张伟',
    phoneNumber: '13977777777',
    email: 'zhangwei@qingzhu.com',
    address: {
      province: '江苏省',
      city: '南江市',
      address: '江城区工业园区23号'
    },
    rating: 4,
    performanceMetrics: {
      onTimeDeliveryRate: 92,
      qualityPassRate: 95,
      responseTime: 6,
      cooperationYears: 2
    },
    productCategories: ['fishing_accessory'],
    createdAt: '2022-03-15T00:00:00.000Z'
  },
  {
    id: 'supplier-3',
    name: '南江和创渔具',
    contactPerson: '王刚',
    phoneNumber: '13966666666',
    email: 'wanggang@hechang.com',
    address: {
      province: '江苏省',
      city: '南江市',
      address: '高新区产业园C区12栋'
    },
    rating: 3,
    performanceMetrics: {
      onTimeDeliveryRate: 85,
      qualityPassRate: 90,
      responseTime: 8,
      cooperationYears: 1
    },
    productCategories: ['fishing_lure', 'fishing_hook'],
    createdAt: '2022-08-20T00:00:00.000Z'
  }
];

export const mockRequirements: RequirementType[] = [
  {
    id: 'req-1',
    title: '高端台钓鱼竿新品开发',
    description: '开发一款面向专业钓鱼爱好者的高端台钓鱼竿，采用碳素材质，注重手感和耐用性',
    storeType: 'self_operated',
    category: 'fishing_rod',
    priority: 'high',
    status: 'in_progress',
    marketPositioning: '高端市场，针对专业钓鱼爱好者，价格区间500-1000元',
    marketingStrategy: '通过短视频平台展示产品性能，邀请KOL试用并发布测评',
    competitorAnalysis: '当前市场同类产品主要有X品牌和Y品牌，我们计划在材质和手感上有差异化优势',
    plannedLaunchDate: '2023-08-15T00:00:00.000Z',
    createdAt: '2023-05-01T00:00:00.000Z',
    updatedAt: '2023-05-01T00:00:00.000Z',
    createdBy: mockUsers[1], // 运营经理
    reviews: [
      {
        id: 'review-1',
        content: '建议增加防滑手柄设计，提升使用体验',
        createdAt: '2023-05-02T00:00:00.000Z',
        createdBy: mockUsers[2] // 产品经理
      }
    ],
    attachments: [
      {
        id: 'att-1',
        name: '市场调研报告.pdf',
        url: '/attachments/market-research.pdf',
        type: 'application/pdf',
        size: 2048576,
        uploadedAt: '2023-05-01T00:00:00.000Z'
      }
    ]
  },
  {
    id: 'req-2',
    title: '入门级路亚钓箱开发',
    description: '开发一款适合初学者的路亚钓箱，注重实用性和性价比',
    storeType: 'pop',
    category: 'fishing_accessory',
    priority: 'medium',
    status: 'in_progress',
    marketPositioning: '中低端市场，针对初学者，价格区间100-300元',
    marketingStrategy: '通过电商平台推广，主打性价比和实用性',
    competitorAnalysis: '市场上同类产品较多，但质量参差不齐，我们计划在材质和做工上建立优势',
    plannedLaunchDate: '2023-07-20T00:00:00.000Z',
    createdAt: '2023-05-23T00:00:00.000Z',
    updatedAt: '2023-05-23T00:00:00.000Z',
    createdBy: mockUsers[1], // 运营经理
    reviews: [],
    attachments: []
  },
  {
    id: 'req-3',
    title: '高性价比双刀剪开发',
    description: '开发一款高性价比的双刀剪，适合日常钓鱼使用',
    storeType: 'self_operated',
    category: 'fishing_accessory',
    priority: 'low',
    status: 'completed',
    marketPositioning: '大众市场，价格区间50-100元',
    marketingStrategy: '通过线下渠道推广，主打性价比',
    competitorAnalysis: '市场上已有多个品牌，我们计划通过更好的材质和工艺来建立优势',
    plannedLaunchDate: '2023-06-30T00:00:00.000Z',
    createdAt: '2023-05-26T00:00:00.000Z',
    updatedAt: '2023-06-30T00:00:00.000Z',
    createdBy: mockUsers[1], // 运营经理
    reviews: [
      {
        id: 'review-2',
        content: '产品已开发完成，质量符合预期',
        createdAt: '2023-06-30T00:00:00.000Z',
        createdBy: mockUsers[2] // 产品经理
      }
    ],
    attachments: [
      {
        id: 'att-2',
        name: '产品规格书.pdf',
        url: '/attachments/specs.pdf',
        type: 'application/pdf',
        size: 1048576,
        uploadedAt: '2023-05-26T00:00:00.000Z'
      }
    ]
  }
];

export const mockProductPools: ProductPool[] = [
  {
    id: 'pp-1',
    productName: '高端碳素台钓竿',
    productImages: [
      'https://images.pexels.com/photos/8127835/pexels-photo-8127835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'fishing_rod',
    requirementId: 'req-1',
    factoryPrice: 376,
    tax: 24,
    supplier: mockSuppliers[0],
    description: '高端碳素材质，轻量化设计，手感舒适，抗疲劳性强',
    customizationRequirements: '改粉色渐变为湖光蓝，添加LOGO',
    specifications: {
      dimensions: '长度4.5米，收缩后110厘米',
      weight: '207克',
      materials: ['高模量碳纤维', '不锈钢导环', '软木手柄']
    },
    accessories: ['竿包', '备用竿尖'],
    packaging: '纸盒',
    sampleTimeframe: '15天',
    productionTimeframe: '30天',
    minimumOrderQuantity: 200,
    competitorLinks: [
      'https://item.taobao.com/item.htm?spm=a21bo.7929913.198967.13.5bdd4d78h5Sdeq&id=679306843'
    ],
    competitorAnalysis: '竞品价格在550-650元区间，主打轻量化和手感，但耐用性一般',
    riskLevel: 'low',
    createdAt: '2023-05-03T00:00:00.000Z',
    createdBy: mockUsers[2], // 产品经理
    workflowStatus: 'launched',
    evaluationStatus: 'approved',
    timeline: [
      {
        id: 'tl-10',
        date: '2023-06-01T00:00:00.000Z',
        title: '产品上架',
        description: '袁鹏上架了产品',
        status: 'launched'
      },
      {
        id: 'tl-9',
        date: '2023-05-30T00:00:00.000Z',
        title: '确认入仓',
        description: '刘洋确认产品入仓',
        status: 'stock_received'
      },
      {
        id: 'tl-8',
        date: '2023-05-21T00:00:00.000Z',
        title: '发起订货',
        description: '张晓燕发起订货',
        status: 'order_placed'
      },
      {
        id: 'tl-7',
        date: '2023-05-20T00:00:00.000Z',
        title: '上传合同',
        description: '马少华上传了合同',
        status: 'contract_uploaded'
      },
      {
        id: 'tl-6',
        date: '2023-05-19T00:00:00.000Z',
        title: '确认订货',
        description: '袁鹏确认订货',
        status: 'order_approved'
      },
      {
        id: 'tl-5',
        date: '2023-05-18T00:00:00.000Z',
        title: '样品签收',
        description: '马少华签收了样品',
        status: 'sample_received'
      },
      {
        id: 'tl-4',
        date: '2023-05-16T00:00:00.000Z',
        title: '确认拿样',
        description: '袁鹏确认拿样',
        status: 'sample_approved'
      },
      {
        id: 'tl-3',
        date: '2023-05-15T10:30:00.000Z',
        title: '新增评审意见',
        description: '袁鹏新增了评审意见',
        status: 'reviewed'
      },
      {
        id: 'tl-2',
        date: '2023-05-04T00:00:00.000Z',
        title: '更新选品池',
        description: '马少华更新了选品池',
        status: 'updated'
      },
      {
        id: 'tl-1',
        date: '2023-05-03T00:00:00.000Z',
        title: '创建选品池',
        description: '马少华创建了选品池',
        status: 'created'
      }
    ],
    reviews: [
      {
        id: 'review-1',
        reviewer: mockUsers[1], // 运营经理
        content: '建议涂装颜色更改为湖光蓝，区分竞品差异化',
        createdAt: '2023-05-15T10:30:00.000Z'
      }
    ],
    productLink: 'https://item.taobao.com/item.htm?spm=a21bo.7929913.198967.13.5bdd4d78h5Sdeq&id=679306843',
    inventory: {
      totalStock: 200,
      available: 185,
      reserved: 15,
      threshold: 20,
      lastUpdated: '2023-05-30T00:00:00.000Z'
    }
  },
  {
    id: 'pp-2',
    productName: '路亚箱铝合金',
    productImages: [
      'https://images.pexels.com/photos/7664118/pexels-photo-7664118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'fishing_accessory',
    requirementId: 'req-2',
    factoryPrice: 318,
    tax: 0,
    supplier: mockSuppliers[1],
    description: '铝合金材质，精致做工，轻便耐用',
    specifications: {
      dimensions: '19.4×12cm(含扣环)',
      weight: '138g',
      materials: ['铝合金', '不锈钢扣环'],
      colors: ['银色', '灰色']
    },
    accessories: ['生漆笔'],
    packaging: '纸盒',
    sampleTimeframe: '5天',
    productionTimeframe: '15天',
    minimumOrderQuantity: 63.6,
    riskLevel: 'medium',
    createdAt: '2023-05-23T00:00:00.000Z',
    createdBy: mockUsers[2], // 产品经理
    workflowStatus: 'sample_approved',
    evaluationStatus: 'approved',
    timeline: [
      {
        id: 'tl-3',
        date: '2023-05-25T00:00:00.000Z',
        title: '确认拿样',
        description: '袁鹏确认拿样',
        status: 'sample_approved'
      },
      {
        id: 'tl-2',
        date: '2023-05-24T00:00:00.000Z',
        title: '新增评审意见',
        description: '袁鹏新增了评审意见',
        status: 'reviewed'
      },
      {
        id: 'tl-1',
        date: '2023-05-23T00:00:00.000Z',
        title: '创建选品池',
        description: '马少华创建了选品池',
        status: 'created'
      }
    ],
    reviews: [
      {
        id: 'review-2',
        reviewer: mockUsers[1], // 运营经理
        content: '样品整体不错，建议加上LOGO',
        createdAt: '2023-05-24T15:20:00.000Z'
      }
    ]
  },
  {
    id: 'pp-3',
    productName: '路亚钳',
    productImages: [
      'https://images.pexels.com/photos/5708072/pexels-photo-5708072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'fishing_accessory',
    requirementId: 'req-2',
    factoryPrice: 145,
    tax: 0,
    supplier: mockSuppliers[2],
    description: '轻便小巧，携带方便，不易生锈',
    specifications: {
      dimensions: '折叠：16.1×5.5×1.6cm，展开：16.1×10.6×1.6cm',
      weight: '118g',
      materials: ['不锈钢']
    },
    accessories: ['布袋'],
    packaging: '纸盒',
    sampleTimeframe: '7天',
    productionTimeframe: '10天',
    minimumOrderQuantity: 200,
    riskLevel: 'low',
    createdAt: '2023-05-24T00:00:00.000Z',
    createdBy: mockUsers[2], // 产品经理
    workflowStatus: 'pending_review',
    timeline: [
      {
        id: 'tl-1',
        date: '2023-05-24T00:00:00.000Z',
        title: '创建选品池',
        description: '马少华创建了选品池',
        status: 'created'
      }
    ],
    reviews: []
  },
  {
    id: 'pp-4',
    productName: '路亚钳双刀款',
    productImages: [
      'https://images.pexels.com/photos/4792065/pexels-photo-4792065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'fishing_accessory',
    requirementId: 'req-3',
    factoryPrice: 115,
    tax: 0,
    supplier: mockSuppliers[0],
    description: '双刀款，多功能，携带方便',
    specifications: {
      dimensions: '16.3×5.5cm',
      weight: '120g',
      materials: ['不锈钢']
    },
    accessories: ['布袋'],
    packaging: '纸盒',
    sampleTimeframe: '7天',
    productionTimeframe: '15天',
    minimumOrderQuantity: 300,
    riskLevel: 'low',
    createdAt: '2023-05-26T00:00:00.000Z',
    createdBy: mockUsers[2], // 产品经理
    workflowStatus: 'sample_approved',
    evaluationStatus: 'approved',
    timeline: [
      {
        id: 'tl-2',
        date: '2023-05-27T00:00:00.000Z',
        title: '确认拿样',
        description: '袁鹏确认拿样',
        status: 'sample_approved'
      },
      {
        id: 'tl-1',
        date: '2023-05-26T00:00:00.000Z',
        title: '创建选品池',
        description: '马少华创建了选品池',
        status: 'created'
      }
    ],
    reviews: []
  }
];