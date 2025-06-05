import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Settings, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X,
  Boxes,
  FileText,
  Users,
  Truck,
  Home
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo and title */}
          <div className="flex items-center">
            <button 
              className="mr-2 rounded-md p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Boxes className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-primary-800">BEARFIRE<span className="text-secondary-600">产品开发工作台</span></span>
            </Link>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium">{user?.name || 'User'}</div>
                  <div className="text-xs text-neutral-500">
                    {user?.role === 'admin' && '管理员'}
                    {user?.role === 'operations_manager' && '运营经理'}
                    {user?.role === 'product_manager' && '产品经理'}
                    {user?.role === 'purchasing_specialist' && '采购专员'}
                    {user?.role === 'erp_specialist' && 'ERP专员'}
                  </div>
                </div>
                <ChevronDown size={16} className="hidden md:block" />
              </button>

              {/* Profile dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      // Open profile edit modal here
                    }}
                  >
                    <Settings size={16} />
                    <span>账户设置</span>
                  </button>
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>退出登录</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Mobile */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-neutral-600 bg-opacity-75\" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative flex h-full w-60 max-w-xs flex-col overflow-y-auto bg-white pb-4 pt-5">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center">
                  <Boxes className="h-8 w-8 text-primary-600" />
                  <span className="ml-2 text-xl font-medium">BEARFIRE</span>
                </div>
                <button
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="mt-5 flex flex-col gap-1 px-2">
                <Link
                  to="/"
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Home size={18} />
                  <span>首页</span>
                </Link>
                <Link
                  to="/product-pool"
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive('/product-pool') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Boxes size={18} />
                  <span>选品池</span>
                </Link>
                <Link
                  to="/requirements"
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive('/requirements') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <FileText size={18} />
                  <span>需求管理</span>
                </Link>
                {canAccessSupplyChain && (
                  <Link
                    to="/supply-chain"
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive('/supply-chain') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Truck size={18} />
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
                    <Users size={18} />
                    <span>用户管理</span>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <div className="hidden w-64 flex-shrink-0 border-r border-neutral-200 bg-white lg:block">
          <nav className="mt-8 flex flex-col gap-1 px-4">
            <Link
              to="/"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Home size={18} />
              <span>首页</span>
            </Link>
            <Link
              to="/product-pool"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                isActive('/product-pool') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Boxes size={18} />
              <span>选品池</span>
            </Link>
            <Link
              to="/requirements"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                isActive('/requirements') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <FileText size={18} />
              <span>需求管理</span>
            </Link>
            {canAccessSupplyChain && (
              <Link
                to="/supply-chain"
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive('/supply-chain') ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Truck size={18} />
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
                <Users size={18} />
                <span>用户管理</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;