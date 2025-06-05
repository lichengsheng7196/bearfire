import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Category, RequirementStatus } from '../types/requirementTypes';

const categoryOptions: Category[] = [
  'fishing_rod',
  'fishing_reel',
  'fishing_accessory',
  'fishing_clothing',
];

const priorityOptions = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

const CreateRequirementPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categoryOptions[0],
    priority: 'medium',
    plannedLaunchDate: '',
    attachment: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm(prev => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('需求创建成功！');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="rounded-2xl bg-white/80 shadow-2xl backdrop-blur-md p-8 animate-fade-in">
        <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-green-600 drop-shadow-md">创建新需求</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-neutral-700">需求标题</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="input w-full rounded-lg border border-neutral-300 px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              placeholder="请输入需求标题"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-neutral-700">需求描述</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="input w-full rounded-lg border border-neutral-300 px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              placeholder="请输入需求描述"
              rows={4}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-neutral-700">品类</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input w-full rounded-lg border border-neutral-300 px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            >
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-neutral-700">优先级</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="input w-full rounded-lg border border-neutral-300 px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            >
              {priorityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-neutral-700">计划上线日期</label>
            <input
              type="date"
              name="plannedLaunchDate"
              value={form.plannedLaunchDate}
              onChange={handleChange}
              className="input w-full rounded-lg border border-neutral-300 px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-neutral-700">附件上传</label>
            <input
              type="file"
              name="attachment"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-60"
          >
            {isSubmitting ? '提交中...' : '提交'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRequirementPage; 