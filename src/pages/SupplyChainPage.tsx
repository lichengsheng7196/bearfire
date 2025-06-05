import React from 'react';

const mockSupplyChains = [
  {
    id: 'sc-1',
    supplier: '南江市润兴工贸有限公司',
    product: '碳素鱼竿',
    status: '原材料采购',
    lastUpdate: '2024-06-01',
  },
  {
    id: 'sc-2',
    supplier: '南江市江城区清竹五金厂',
    product: '渔具配件',
    status: '生产制造',
    lastUpdate: '2024-06-02',
  },
];

const SupplyChainPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="rounded-2xl bg-white/80 shadow-2xl backdrop-blur-md p-8 animate-fade-in">
        <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-green-600 drop-shadow-md">供应链管理</h2>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">供应链流程（占位）</h3>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 p-4 bg-gradient-to-br from-blue-100 via-white to-purple-100 rounded-xl text-center font-semibold shadow">原材料采购</div>
            <div className="flex-1 p-4 bg-gradient-to-br from-green-100 via-white to-blue-100 rounded-xl text-center font-semibold shadow">生产制造</div>
            <div className="flex-1 p-4 bg-gradient-to-br from-yellow-100 via-white to-blue-100 rounded-xl text-center font-semibold shadow">质检入库</div>
            <div className="flex-1 p-4 bg-gradient-to-br from-purple-100 via-white to-green-100 rounded-xl text-center font-semibold shadow">物流发货</div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-700">供应链列表</h3>
          <div className="overflow-x-auto rounded-2xl bg-white/90 shadow-xl">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">供应商</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">产品</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">当前环节</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">最后更新时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white/80">
                {mockSupplyChains.map(item => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">{item.supplier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">{item.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-semibold">{item.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{item.lastUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainPage; 