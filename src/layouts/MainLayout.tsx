import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconMenu2,
  IconX,
  IconLayoutDashboard,
  IconShoppingCart,
  IconFlame,
  IconTruckDelivery,
  IconUsers,
  IconAtom
} from '@tabler/icons-react';
import { useAuthStore } from '../stores/authStore';

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editPhone, setEditPhone] = useState(user?.phoneNumber || '');
  const [editRole, setEditRole] = useState(user?.role || '');
  const [showPwd, setShowPwd] = useState(false);
  const [editPwd, setEditPwd] = useState('');

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if current path matches the provided path
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Only show supply chain management for admin and product managers
  const canAccessSupplyChain = user?.role === 'admin' || user?.role === 'product_manager';
  
  // Only show user management for admin
  const canAccessUserManagement = user?.role === 'admin';

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-100 via-white to-purple-100">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 shadow-md backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-green-400 p-2 shadow-lg">
              <IconAtom className="h-10 w-10 text-white drop-shadow-lg" />
            </span>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-green-600 drop-shadow-md">BEARFIRE</span>
              <span className="ml-2 text-2xl font-bold text-green-600">产品开发工作台</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Mobile */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-neutral-600 bg-opacity-60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative flex h-full w-60 max-w-xs flex-col overflow-y-auto bg-white/90 rounded-r-2xl shadow-2xl pb-4 pt-5 animate-slide-in">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center">
                  <IconLayoutDashboard className="h-8 w-8 text-primary-600" />
                  <span className="ml-2 text-xl font-medium">BEARFIRE</span>
                </div>
                <button
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <IconX size={20} />
                </button>
              </div>
              <nav className="mt-5 flex flex-col gap-1 px-2">
                <Link
                  to="/"
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <IconLayoutDashboard size={18} />
                  <span>工作看板</span>
                </Link>
                <Link
                  to="/product-pool"
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive('/product-pool') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <IconShoppingCart size={18} />
                  <span>选品管理</span>
                </Link>
                <Link
                  to="/requirements"
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive('/requirements') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <IconFlame size={18} />
                  <span>熊火产品</span>
                </Link>
                {canAccessSupplyChain && (
                  <Link
                    to="/supply-chain"
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive('/supply-chain') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <IconTruckDelivery size={18} />
                    <span>供应链管理</span>
                  </Link>
                )}
                {canAccessUserManagement && (
                  <Link
                    to="/users"
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive('/users') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <IconUsers size={18} />
                    <span>用户管理</span>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <div className="hidden w-64 flex-shrink-0 border-r border-neutral-200 bg-gradient-to-b from-white/90 via-blue-50 to-purple-50 rounded-r-3xl shadow-2xl lg:block relative">
          <nav className="mt-10 flex flex-col gap-2 px-6 pb-24">
            <Link
              to="/"
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all shadow-sm hover:bg-gradient-to-r hover:from-blue-100 hover:to-green-100 hover:shadow-lg ${
                isActive('/') ? 'bg-gradient-to-r from-blue-200 to-green-100 text-blue-700 font-bold shadow-lg' : 'text-neutral-700'
              }`}
            >
              <IconLayoutDashboard size={22} className={`transition ${isActive('/') ? 'text-blue-600' : 'text-neutral-400 group-hover:text-blue-500'}`} />
              <span>工作看板</span>
            </Link>
            <Link
              to="/product-pool"
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all shadow-sm hover:bg-gradient-to-r hover:from-blue-100 hover:to-green-100 hover:shadow-lg ${
                isActive('/product-pool') ? 'bg-gradient-to-r from-blue-200 to-green-100 text-blue-700 font-bold shadow-lg' : 'text-neutral-700'
              }`}
            >
              <IconShoppingCart size={22} className={`transition ${isActive('/product-pool') ? 'text-blue-600' : 'text-neutral-400 group-hover:text-blue-500'}`} />
              <span>选品管理</span>
            </Link>
            <Link
              to="/requirements"
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all shadow-sm hover:bg-gradient-to-r hover:from-blue-100 hover:to-green-100 hover:shadow-lg ${
                isActive('/requirements') ? 'bg-gradient-to-r from-blue-200 to-green-100 text-blue-700 font-bold shadow-lg' : 'text-neutral-700'
              }`}
            >
              <IconFlame size={22} className={`transition ${isActive('/requirements') ? 'text-blue-600' : 'text-neutral-400 group-hover:text-blue-500'}`} />
              <span>熊火产品</span>
            </Link>
            <Link
              to="/supply-chain"
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all shadow-sm hover:bg-gradient-to-r hover:from-blue-100 hover:to-green-100 hover:shadow-lg ${
                isActive('/supply-chain') ? 'bg-gradient-to-r from-blue-200 to-green-100 text-blue-700 font-bold shadow-lg' : 'text-neutral-700'
              }`}
            >
              <IconTruckDelivery size={22} className={`transition ${isActive('/supply-chain') ? 'text-blue-600' : 'text-neutral-400 group-hover:text-blue-500'}`} />
              <span>供应链管理</span>
            </Link>
            {canAccessUserManagement && (
              <Link
                to="/users"
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all shadow-sm hover:bg-gradient-to-r hover:from-blue-100 hover:to-green-100 hover:shadow-lg ${
                  isActive('/users') ? 'bg-gradient-to-r from-blue-200 to-green-100 text-blue-700 font-bold shadow-lg' : 'text-neutral-700'
                }`}
              >
                <IconUsers size={22} className={`transition ${isActive('/users') ? 'text-blue-600' : 'text-neutral-400 group-hover:text-blue-500'}`} />
                <span>用户管理</span>
              </Link>
            )}
          </nav>
          {/* 左下角用户信息 */}
          <div className="absolute left-0 bottom-0 w-full px-6 pb-4">
            <div className="flex items-center gap-2 rounded-xl bg-white/80 shadow p-3 mb-2">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="头像" className="h-9 w-9 rounded-full object-cover" />
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setShowProfileModal(true)}>
                <div className="font-medium truncate hover:underline">{user?.name || 'User'}</div>
                <div className="text-xs text-neutral-500 truncate">
                  {user?.role === 'admin' && '管理员'}
                  {user?.role === 'operations_manager' && '运营经理'}
                  {user?.role === 'product_manager' && '产品经理'}
                  {user?.role === 'purchasing_specialist' && '采购专员'}
                  {user?.role === 'erp_specialist' && 'ERP专员'}
                </div>
              </div>
              <button
                className="ml-1 flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                onClick={handleLogout}
                title="退出登录"
              >
                <IconLogout size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 p-6 md:p-10">
          <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-md animate-fade-in min-h-[80vh]">
            <Outlet />
          </div>
        </main>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-8 w-[350px] relative" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center mb-4">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="头像" className="h-16 w-16 rounded-full object-cover mb-2" />
              <div className="text-lg font-bold">{user?.name}</div>
              <div className="text-xs text-neutral-500">熊火产品项目组</div>
            </div>
            <div className="space-y-3">
              <div><span className="text-neutral-500">用户名：</span>{user?.username}</div>
              <div>
                <span className="text-neutral-500">手机号：</span>
                <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="border rounded px-2 py-1 w-32 text-sm" />
              </div>
              <div>
                <span className="text-neutral-500">岗位名称：</span>
                <input value={editRole} onChange={e => setEditRole(e.target.value)} className="border rounded px-2 py-1 w-32 text-sm" />
              </div>
              <div>
                <button className="text-blue-600 text-sm hover:underline" onClick={() => setShowPwd(v => !v)}>{showPwd ? '取消修改密码' : '修改密码'}</button>
                {showPwd && (
                  <input type="password" value={editPwd} onChange={e => setEditPwd(e.target.value)} className="border rounded px-2 py-1 w-full mt-2 text-sm" placeholder="新密码" />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-1 rounded bg-neutral-100 hover:bg-neutral-200" onClick={() => setShowProfileModal(false)}>取消</button>
              <button className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => { setShowProfileModal(false); /* mock保存 */ }}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;