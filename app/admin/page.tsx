'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMessageSquare, FiFolder, FiTrendingUp } from 'react-icons/fi';
import Card from '@/components/ui/Card';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalCategories: 0,
    recentQuestions: 0,
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const [questionsRes, categoriesRes] = await Promise.all([
        fetch('/api/questions?limit=1000'),
        fetch('/api/categories'),
      ]);

      const questionsData = await questionsRes.json();
      const categoriesData = await categoriesRes.json();

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentQuestions = questionsData.questions?.filter((q: any) => 
        new Date(q.createdAt) > weekAgo
      ).length || 0;

      setStats({
        totalQuestions: questionsData.total || questionsData.questions?.length || 0,
        totalCategories: categoriesData.length || 0,
        recentQuestions,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  const statCards = [
    {
      title: 'Total Questions',
      value: stats.totalQuestions,
      icon: FiMessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FiFolder,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Recent Questions',
      value: stats.recentQuestions,
      icon: FiTrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back, {session.user.name}!</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href="/admin/categories"
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <FiFolder className="w-4 h-4 text-green-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Manage Categories</h3>
                    <p className="text-xs text-gray-600">Add, edit, or delete question categories</p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/questions"
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <FiMessageSquare className="w-4 h-4 text-blue-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Manage Questions</h3>
                    <p className="text-xs text-gray-600">Add, edit, or delete interview questions</p>
                  </div>
                </div>
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}