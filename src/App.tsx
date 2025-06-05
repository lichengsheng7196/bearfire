import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoadingScreen from './components/LoadingScreen';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProductPoolPage = lazy(() => import('./pages/ProductPoolPage'));
const ProductPoolDetailPage = lazy(() => import('./pages/ProductPoolDetailPage'));
const ProductRequirementPage = lazy(() => import('./pages/ProductRequirementPage'));
const ProductRequirementDetailPage = lazy(() => import('./pages/ProductRequirementDetailPage'));
const CreateRequirementPage = lazy(() => import('./pages/CreateRequirementPage'));
const CreateProductPoolPage = lazy(() => import('./pages/CreateProductPoolPage'));
const SupplyChainPage = lazy(() => import('./pages/SupplyChainPage'));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'));

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/product-pool" />} />
        
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="product-pool" element={<ProductPoolPage />} />
          <Route path="product-pool/:id" element={<ProductPoolDetailPage />} />
          <Route path="product-pool/create" element={<CreateProductPoolPage />} />
          <Route path="requirements" element={<ProductRequirementPage />} />
          <Route path="requirements/:id" element={<ProductRequirementDetailPage />} />
          <Route path="requirements/create" element={<CreateRequirementPage />} />
          <Route path="supply-chain" element={<SupplyChainPage />} />
          <Route path="users" element={<UserManagementPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;