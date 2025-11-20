import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ExternalLink, Youtube, Instagram, Twitter, Linkedin, Music } from 'lucide-react';
import api from '../api/axios';

const ConnectAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'youtube',
    url: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/social/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setError('');
    setConnecting(true);

    try {
      const response = await api.post('/social/connect', formData);
      setAccounts(response.data.accounts);
      setFormData({ platform: 'youtube', url: '' });
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to connect account');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (platform) => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      try {
        const response = await api.delete(`/social/accounts/${platform}`);
        setAccounts(response.data.accounts);
      } catch (error) {
        console.error('Error disconnecting account:', error);
        alert('Failed to disconnect account');
      }
    }
  };

  const platformIcons = {
    youtube: Youtube,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    tiktok: Music,
  };

  const platformColors = {
    youtube: 'from-red-500 to-red-600',
    instagram: 'from-purple-500 to-pink-500',
    twitter: 'from-blue-400 to-blue-500',
    linkedin: 'from-blue-600 to-blue-700',
    tiktok: 'from-black to-gray-800',
  };

  const getPlatformIcon = (platform) => {
    const Icon = platformIcons[platform] || ExternalLink;
    return <Icon className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-dark-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-dark-text mb-2">Connected Accounts</h1>
          <p className="text-dark-text-muted">Manage your social media accounts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Connect Account
        </motion.button>
      </motion.div>

      {accounts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <p className="text-dark-text-muted mb-4">No accounts connected yet.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Connect Your First Account
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account, index) => (
            <motion.div
              key={account.platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-hover"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${platformColors[account.platform]} flex items-center justify-center text-white mb-4`}>
                {getPlatformIcon(account.platform)}
              </div>
              <h3 className="text-lg font-semibold text-dark-text capitalize mb-2">
                {account.platform}
              </h3>
              <a
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover text-sm flex items-center gap-1 mb-4"
              >
                View Profile <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => handleDisconnect(account.platform)}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Disconnect
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark-text">Connect Account</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-dark-card-hover rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-dark-text-muted" />
                </button>
              </div>

              <form onSubmit={handleConnect} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-dark-text-muted mb-2">
                    Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="input w-full"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text-muted mb-2">
                    Profile URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="input w-full"
                    placeholder="https://instagram.com/username"
                  />
                  <p className="text-xs text-dark-text-muted mt-1">
                    Enter your complete profile URL
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={connecting}
                    className="btn-primary flex-1"
                  >
                    {connecting ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectAccounts;
