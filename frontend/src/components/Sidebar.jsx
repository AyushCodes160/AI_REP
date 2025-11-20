import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BarChart3,
  Link2,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/drafts', icon: FileText, label: 'Drafts' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/connect-accounts', icon: Link2, label: 'Accounts' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 bg-dark-card border-r border-dark-border flex flex-col z-50"
    >
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">AI Social Rep</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-dark-text-muted hover:bg-dark-card-hover hover:text-dark-text'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-dark-border">
        <div className="mb-3 px-4 py-2 text-sm text-dark-text-muted">
          {user?.username}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;

