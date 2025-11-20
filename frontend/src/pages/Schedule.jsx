import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, X, Plus } from 'lucide-react';
import api from '../api/axios';

const Schedule = () => {
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    draftId: '',
    scheduledTime: '',
    platform: 'youtube',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scheduledRes, draftsRes] = await Promise.all([
        api.get('/schedule'),
        api.get('/drafts'),
      ]);
      setScheduledPosts(scheduledRes.data);
      setDrafts(draftsRes.data.filter((d) => d.status === 'draft'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setScheduling(true);

    try {
      await api.post('/schedule', formData);
      setFormData({ draftId: '', scheduledTime: '', platform: 'youtube' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert('Failed to schedule post');
    } finally {
      setScheduling(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this scheduled post?')) {
      try {
        await api.delete(`/schedule/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error cancelling post:', error);
        alert('Failed to cancel post');
      }
    }
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
          <h1 className="text-4xl font-bold text-dark-text mb-2">Schedule Posts</h1>
          <p className="text-dark-text-muted">Manage your scheduled content</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Schedule Post
        </motion.button>
      </motion.div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-dark-text mb-4">Schedule New Post</h2>
          <form onSubmit={handleSchedule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text-muted mb-2">
                  Select Draft
                </label>
                <select
                  required
                  value={formData.draftId}
                  onChange={(e) => setFormData({ ...formData, draftId: e.target.value })}
                  className="input w-full"
                >
                  <option value="">Choose a draft...</option>
                  {drafts.map((draft) => (
                    <option key={draft._id} value={draft._id}>
                      {draft.title} ({draft.platform})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text-muted mb-2">
                  Platform
                </label>
                <select
                  required
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="input w-full"
                >
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text-muted mb-2">
                Scheduled Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="input w-full"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={scheduling || !formData.draftId}
                className="btn-primary"
              >
                {scheduling ? 'Scheduling...' : 'Schedule Post'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {scheduledPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 text-center"
          >
            <Calendar className="w-16 h-16 text-dark-text-muted mx-auto mb-4" />
            <p className="text-dark-text-muted">No scheduled posts.</p>
          </motion.div>
        ) : (
          scheduledPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-hover"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium capitalize">
                      {post.platform}
                    </span>
                    <div className="flex items-center gap-2 text-dark-text-muted text-sm">
                      <Clock className="w-4 h-4" />
                      {new Date(post.scheduledTime).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-dark-text line-clamp-2">{post.content}</p>
                </div>
                <button
                  onClick={() => handleCancel(post._id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors ml-4"
                  title="Cancel"
                >
                  <X className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;
