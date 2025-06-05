import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        <h2 className="text-xl font-medium text-neutral-800">加载中...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;