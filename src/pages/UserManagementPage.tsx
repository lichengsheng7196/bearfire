import React from 'react';

const mockUsers = [
  { id: '1', name: '管理员', username: 'admin', email: 'admin@bearfire.com', role: 'admin', status: '启用' },
  { id: '2', name: '袁鹏', username: 'ops', email: 'yuanpeng@bearfire.com', role: 'operations_manager', status: '启用' },
  { id: '3', name: '马少华', username: 'product', email: 'mashaohua@bearfire.com', role: 'product_manager', status: '启用' },
  { id: '4', name: '张晓燕', username: 'purchase', email: 'zhangxiaoyan@bearfire.com', role: 'purchasing_specialist', status: '启用' },
  { id: '5', name: '刘洋', username: 'erp', email: 'liuyang@bearfire.com', role: 'erp_specialist', status: '启用' },
];

const UserManagementPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">用户管理</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">姓名</th>
            <th className="border px-3 py-2">用户名</th>
            <th className="border px-3 py-2">邮箱</th>
            <th className="border px-3 py-2">角色</th>
            <th className="border px-3 py-2">状态</th>
            <th className="border px-3 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map(user => (
            <tr key={user.id}>
              <td className="border px-3 py-2">{user.name}</td>
              <td className="border px-3 py-2">{user.username}</td>
              <td className="border px-3 py-2">{user.email}</td>
              <td className="border px-3 py-2">{user.role}</td>
              <td className="border px-3 py-2">{user.status}</td>
              <td className="border px-3 py-2">
                <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs mr-2">编辑</button>
                <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">禁用</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementPage; 