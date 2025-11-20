import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import draftRoutes from './routes/draftRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import { startCronJob } from './cron/scheduler.js';
import { initializeOpenAI, getOpenAIStatus } from './utils/ai.js';

dotenv.config();

// Initialize OpenAI after dotenv.config()
initializeOpenAI();

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/schedule', scheduleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const openAIStatus = getOpenAIStatus();
  res.json({ 
    status: 'ok', 
    message: 'AI Social Rep API is running',
    openai: openAIStatus
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-social-rep')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Log OpenAI status
    const openAIStatus = getOpenAIStatus();
    if (openAIStatus.initialized) {
      console.log('✅ OpenAI is configured and ready');
    } else {
      console.warn('⚠️  OpenAI is not configured. AI features will not work.');
      console.warn('   Please set OPENAI_API_KEY in your .env file');
    }
    
    // Start cron job for scheduled posts
    startCronJob();
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

