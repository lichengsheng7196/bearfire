import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes, Loader2, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const getRandomCode = () => Math.floor(1000 + Math.random() * 9000).toString();

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  // 可刷新验证码
  const [code, setCode] = useState(getRandomCode());
  const refreshCode = () => setCode(getRandomCode());

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !verificationCode) {
      toast.error('请填写所有字段');
      return;
    }
    if (verificationCode !== code) {
      toast.error('验证码错误');
      refreshCode();
      return;
    }
    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/product-pool'); // 所有用户统一跳转到选品池列表
      toast.success('登录成功');
    } catch (error) {
      toast.error('用户名或密码错误');
      refreshCode();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Boxes className="h-12 w-12 text-primary-600" />
          <h1 className="text-2xl font-bold text-primary-800">
            BEARFIRE<span className="text-secondary-600">产品开发工作台</span>
          </h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="label">
              用户名
            </label>
            <input
              id="username"
              type="text"
              className="input w-full"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              密码
            </label>
            <input
              id="password"
              type="password"
              className="input w-full"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="verificationCode" className="label">
              验证码
            </label>
            <div className="flex gap-2">
              <input
                id="verificationCode"
                type="text"
                className="input w-full"
                placeholder="请输入验证码"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={refreshCode}
                className="flex h-10 w-32 items-center justify-center rounded-md bg-neutral-100 font-mono text-lg font-bold text-neutral-800 hover:bg-neutral-200 select-none"
                title="点击刷新验证码"
              >
                {code}
                <RefreshCw className="ml-2 h-4 w-4 text-neutral-400" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>登录中...</span>
              </div>
            ) : (
              '登录'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;