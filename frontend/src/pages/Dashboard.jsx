import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Calendar, Link2, Plus, TrendingUp, Sparkles } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    drafts: 0,
    scheduled: 0,
    accounts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [draftsRes, scheduleRes, accountsRes] = await Promise.all([
        api.get('/drafts'),
        api.get('/schedule'),
        api.get('/social/accounts'),
      ]);

      setStats({
        drafts: draftsRes.data.length,
        scheduled: scheduleRes.data.length,
        accounts: accountsRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Drafts',
      value: stats.drafts,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      link: '/drafts',
    },
    {
      label: 'Scheduled',
      value: stats.scheduled,
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      link: '/schedule',
    },
    {
      label: 'Connected Accounts',
      value: stats.accounts,
      icon: Link2,
      color: 'from-green-500 to-emerald-500',
      link: '/connect-accounts',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-dark-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-dark-text mb-2">Dashboard</h1>
          <p className="text-dark-text-muted">Welcome back! Here's your overview.</p>
        </div>
        <Link to="/drafts/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Draft
          </motion.button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <div className="card-hover p-6 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-dark-text-muted" />
                  </div>
                  <div className="text-3xl font-bold text-dark-text mb-1">{stat.value}</div>
                  <div className="text-sm text-dark-text-muted">{stat.label}</div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-dark-text mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link to="/drafts/create">
              <div className="p-4 bg-dark-card-hover border border-dark-border rounded-lg hover:border-primary/30 transition-all cursor-pointer">
                <div className="font-medium text-dark-text">Create New Draft</div>
                <div className="text-sm text-dark-text-muted mt-1">Start creating content with AI</div>
              </div>
            </Link>
            <Link to="/analytics">
              <div className="p-4 bg-dark-card-hover border border-dark-border rounded-lg hover:border-primary/30 transition-all cursor-pointer">
                <div className="font-medium text-dark-text">View Analytics</div>
                <div className="text-sm text-dark-text-muted mt-1">Check your performance</div>
              </div>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-dark-text mb-4">Recent Activity</h2>
          <div className="text-dark-text-muted text-sm">
            Your recent activity will appear here
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
