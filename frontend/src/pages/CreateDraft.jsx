import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Save } from 'lucide-react';
import api from '../api/axios';

const CreateDraft = () => {
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('id');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    idea: '',
    caption: '',
    script: '',
    platform: 'youtube',
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState({});

  useEffect(() => {
    if (draftId) {
      fetchDraft();
    }
  }, [draftId]);

  const fetchDraft = async () => {
    try {
      const response = await api.get(`/drafts/${draftId}`);
      setFormData({
        title: response.data.title,
        idea: response.data.idea,
        caption: response.data.caption || '',
        script: response.data.script || '',
        platform: response.data.platform,
      });
    } catch (error) {
      console.error('Error fetching draft:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateCaption = async () => {
    if (!formData.idea) {
      alert('Please enter an idea first');
      return;
    }
    setAiLoading({ ...aiLoading, caption: true });
    try {
      const response = await api.post('/ai/generate-caption', {
        idea: formData.idea,
        platform: formData.platform,
      });
      setFormData({ ...formData, caption: response.data.caption });
    } catch (error) {
      console.error('Error generating caption:', error);
      alert('Failed to generate caption');
    } finally {
      setAiLoading({ ...aiLoading, caption: false });
    }
  };

  const handleGenerateScript = async () => {
    if (!formData.idea) {
      alert('Please enter an idea first');
      return;
    }
    setAiLoading({ ...aiLoading, script: true });
    try {
      const response = await api.post('/ai/generate-script', {
        idea: formData.idea,
        platform: formData.platform,
      });
      setFormData({ ...formData, script: response.data.script });
    } catch (error) {
      console.error('Error generating script:', error);
      alert('Failed to generate script');
    } finally {
      setAiLoading({ ...aiLoading, script: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (draftId) {
        await api.put(`/drafts/${draftId}`, formData);
      } else {
        await api.post('/drafts', formData);
      }
      navigate('/drafts');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/drafts')}
          className="p-2 hover:bg-dark-card-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-dark-text-muted" />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-dark-text mb-2">
            {draftId ? 'Edit Draft' : 'Create Draft'}
          </h1>
          <p className="text-dark-text-muted">Create and manage your content</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark-text-muted mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input w-full"
              placeholder="Enter draft title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text-muted mb-2">
              Platform *
            </label>
            <select
              name="platform"
              required
              value={formData.platform}
              onChange={handleChange}
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
            Content Idea *
          </label>
          <textarea
            name="idea"
            required
            rows="4"
            value={formData.idea}
            onChange={handleChange}
            placeholder="Describe your content idea..."
            className="input w-full resize-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-dark-text-muted">
              Caption
            </label>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateCaption}
              disabled={aiLoading.caption || !formData.idea}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              {aiLoading.caption ? 'Generating...' : 'AI Generate'}
            </motion.button>
          </div>
          <textarea
            name="caption"
            rows="4"
            value={formData.caption}
            onChange={handleChange}
            placeholder="Social media caption..."
            className="input w-full resize-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-dark-text-muted">
              Script
            </label>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateScript}
              disabled={aiLoading.script || !formData.idea}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              {aiLoading.script ? 'Generating...' : 'AI Generate'}
            </motion.button>
          </div>
          <textarea
            name="script"
            rows="8"
            value={formData.script}
            onChange={handleChange}
            placeholder="Video script..."
            className="input w-full resize-none font-mono text-sm"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/drafts')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Draft'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default CreateDraft;
