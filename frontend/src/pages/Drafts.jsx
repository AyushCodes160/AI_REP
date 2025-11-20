import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import api from '../api/axios';

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await api.get('/drafts');
      setDrafts(response.data);
    } catch (error) {
      console.error('Error fetching drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        await api.delete(`/drafts/${id}`);
        fetchDrafts();
      } catch (error) {
        console.error('Error deleting draft:', error);
        alert('Failed to delete draft');
      }
    }
  };

  const getPlatformColor = (platform) => {
    const colors = {
      youtube: 'from-red-500 to-red-600',
      tiktok: 'from-black to-gray-800',
      twitter: 'from-blue-400 to-blue-500',
      instagram: 'from-purple-500 to-pink-500',
      linkedin: 'from-blue-600 to-blue-700',
    };
    return colors[platform] || 'from-gray-500 to-gray-600';
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
          <h1 className="text-4xl font-bold text-dark-text mb-2">Drafts</h1>
          <p className="text-dark-text-muted">Manage your content drafts</p>
        </div>
        <Link to="/drafts/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Draft
          </motion.button>
        </Link>
      </motion.div>

      {drafts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <FileText className="w-16 h-16 text-dark-text-muted mx-auto mb-4" />
          <p className="text-dark-text-muted mb-4">No drafts yet. Create your first draft!</p>
          <Link to="/drafts/create">
            <button className="btn-primary">Create Draft</button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((draft, index) => (
            <motion.div
              key={draft._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-hover group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-dark-text line-clamp-1">{draft.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded bg-gradient-to-r ${getPlatformColor(draft.platform)} text-white capitalize`}>
                  {draft.platform}
                </span>
              </div>
              <p className="text-dark-text-muted text-sm mb-4 line-clamp-3">{draft.idea}</p>
              <div className="flex justify-between items-center pt-4 border-t border-dark-border">
                <span className="text-xs text-dark-text-muted">
                  {new Date(draft.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/drafts/create?id=${draft._id}`)}
                    className="p-2 hover:bg-dark-card-hover rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-dark-text-muted" />
                  </button>
                  <button
                    onClick={() => handleDelete(draft._id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drafts;
