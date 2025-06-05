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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">供应链管理</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">供应链流程（占位）</h3>
        <div className="flex gap-4 mb-4">
          <div className="flex-1 p-4 bg-gray-50 rounded text-center">原材料采购</div>
          <div className="flex-1 p-4 bg-gray-50 rounded text-center">生产制造</div>
          <div className="flex-1 p-4 bg-gray-50 rounded text-center">质检入库</div>
          <div className="flex-1 p-4 bg-gray-50 rounded text-center">物流发货</div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">供应链列表</h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">供应商</th>
              <th className="border px-3 py-2">产品</th>
              <th className="border px-3 py-2">当前环节</th>
              <th className="border px-3 py-2">最后更新时间</th>
            </tr>
          </thead>
          <tbody>
            {mockSupplyChains.map(item => (
              <tr key={item.id}>
                <td className="border px-3 py-2">{item.supplier}</td>
                <td className="border px-3 py-2">{item.product}</td>
                <td className="border px-3 py-2">{item.status}</td>
                <td className="border px-3 py-2">{item.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplyChainPage; 