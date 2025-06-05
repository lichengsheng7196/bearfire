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
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-2xl bg-white/80 shadow-2xl backdrop-blur-md p-8 animate-fade-in">
        <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-green-600 drop-shadow-md">用户管理</h2>
        <div className="overflow-x-auto rounded-2xl bg-white/90 shadow-xl">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr className="bg-neutral-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">姓名</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">用户名</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white/80">
              {mockUsers.map(user => (
                <tr key={user.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`badge ${user.status === '启用' ? 'badge-success' : 'badge-error'}`}>{user.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white px-3 py-1 text-xs font-semibold shadow mr-2 transition hover:scale-105 hover:shadow-lg">编辑</button>
                    <button className="rounded-lg bg-gradient-to-r from-red-500 to-pink-400 text-white px-3 py-1 text-xs font-semibold shadow transition hover:scale-105 hover:shadow-lg">禁用</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage; 