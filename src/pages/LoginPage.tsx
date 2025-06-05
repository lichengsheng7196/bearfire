import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconAtom, IconLoader2, IconRefresh } from '@tabler/icons-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const getRandomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除容易混淆的字符
  let code = '';
  for (let i = 0; i < 4; i++) {
    let ch = chars.charAt(Math.floor(Math.random() * chars.length));
    // 如果是字母，50%概率转为小写
    if (/[A-Z]/.test(ch) && Math.random() < 0.5) {
      ch = ch.toLowerCase();
    }
    code += ch;
  }
  return code;
};

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
    if (verificationCode.trim().toUpperCase() !== code.toUpperCase()) {
      toast.error('验证码错误');
      refreshCode();
      return;
    }
    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/product-pool'); // 所有用户统一跳转到选品管理列表
      toast.success('登录成功');
    } catch (error) {
      toast.error('用户名或密码错误');
      refreshCode();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white/90 p-10 shadow-2xl backdrop-blur-md animate-fade-in">
        <div className="mb-8 flex flex-col items-center justify-center gap-3">
          <span className="flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-green-400 p-3 shadow-lg">
            <IconAtom className="h-14 w-14 text-white drop-shadow-lg" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-green-600 drop-shadow-md">
            BEARFIRE<span className="ml-2 text-2xl font-bold text-green-600">产品开发工作台</span>
          </h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-7">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-semibold text-neutral-700">用户名</label>
            <input
              id="username"
              type="text"
              className="input w-full rounded-lg border border-neutral-300 px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-neutral-700">密码</label>
            <input
              id="password"
              type="password"
              className="input w-full rounded-lg border border-neutral-300 px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="verificationCode" className="mb-1 block text-sm font-semibold text-neutral-700">验证码</label>
            <div className="flex gap-2">
              <input
                id="verificationCode"
                type="text"
                className="input w-full rounded-lg border border-neutral-300 px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="请输入验证码"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={refreshCode}
                className="flex h-12 w-28 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-100 via-purple-100 to-green-100 font-mono text-lg font-bold text-neutral-800 hover:bg-blue-50 select-none border border-neutral-200 shadow-sm transition"
                title="点击刷新验证码"
              >
                {code}
                <IconRefresh className="ml-2 h-4 w-4 text-neutral-400" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <IconLoader2 className="h-5 w-5 animate-spin" />
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