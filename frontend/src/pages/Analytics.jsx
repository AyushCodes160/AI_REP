import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';

const Analytics = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await api.get('/analytics/weekly-report');
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-dark-text-muted">Loading...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-dark-text">Analytics</h1>
        <div className="card p-12 text-center">
          <p className="text-dark-text-muted">No analytics data available yet.</p>
        </div>
      </div>
    );
  }

  const chartData = Object.entries(report.analytics.postsByPlatform).map(([platform, count]) => ({
    platform: platform.charAt(0).toUpperCase() + platform.slice(1),
    posts: count,
  }));

  const statCards = [
    { label: 'Total Posts', value: report.analytics.totalPosts, icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Views', value: report.analytics.totalViews.toLocaleString(), icon: Eye, color: 'from-green-500 to-emerald-500' },
    { label: 'Total Likes', value: report.analytics.totalLikes.toLocaleString(), icon: Heart, color: 'from-red-500 to-pink-500' },
    { label: 'Total Comments', value: report.analytics.totalComments.toLocaleString(), icon: MessageCircle, color: 'from-purple-500 to-indigo-500' },
    { label: 'Total Shares', value: report.analytics.totalShares.toLocaleString(), icon: Share2, color: 'from-orange-500 to-yellow-500' },
    { label: 'Avg Engagement', value: report.analytics.averageEngagement, icon: TrendingUp, color: 'from-primary to-accent' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-dark-text mb-2">Analytics</h1>
        <p className="text-dark-text-muted">Weekly Performance Report - {report.period}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-dark-text mb-1">{stat.value}</div>
              <div className="text-sm text-dark-text-muted">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-dark-text mb-6">Posts by Platform</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="platform" stroke="#a3a3a3" />
              <YAxis stroke="#a3a3a3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#181818',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  color: '#e5e5e5',
                }}
              />
              <Bar dataKey="posts" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-dark-text mb-6">Platform Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="posts"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#181818',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  color: '#e5e5e5',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-dark-text mb-4">AI Insights & Recommendations</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-dark-text whitespace-pre-line leading-relaxed">
            {report.summary}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
