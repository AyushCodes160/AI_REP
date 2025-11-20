import OpenAI from "openai";
import { promptTemplates } from './promptTemplates.js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize OpenAI client
let openai = null;

// Function to initialize OpenAI (called after dotenv.config())
export const initializeOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (apiKey) {
    // Remove any whitespace or quotes
    const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');
    
    if (cleanKey && cleanKey.length > 0) {
      openai = new OpenAI({
        apiKey: cleanKey,
      });
      console.log('✅ OpenAI client initialized successfully');
      return true;
    } else {
      console.warn('⚠️  OPENAI_API_KEY is empty or invalid');
      return false;
    }
  } else {
    console.warn('⚠️  OPENAI_API_KEY not found in environment variables');
    return false;
  }
};

// Check OpenAI status
export const getOpenAIStatus = () => {
  return {
    initialized: openai !== null,
    hasApiKey: !!process.env.OPENAI_API_KEY,
    apiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
  };
};

// Initialize on module load (will be re-initialized after dotenv.config() in server.js)
initializeOpenAI();

// Generic text generation function (OpenAI only)
export const generateText = async ({ prompt, model = 'openai' }) => {
  try {
    if (!openai) {
      return 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.';
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant specialized in social media content creation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI generation error:', error);
    
    // Provide helpful error messages
    if (error.status === 401) {
      return 'Invalid OpenAI API key. Please check your OPENAI_API_KEY in the .env file.';
    } else if (error.status === 429) {
      return 'OpenAI API rate limit exceeded. Please try again later.';
    } else if (error.status === 500) {
      return 'OpenAI API server error. Please try again later.';
    }
    
    return 'AI service temporarily unavailable. Please try again later.';
  }
};

// Generate caption from idea
export const generateCaption = async (idea, platform, tone = 'professional') => {
  const prompt = promptTemplates.generateCaption(idea, platform, tone);
  return await generateText({ prompt });
};

// Generate script
export const generateScript = async (idea, platform, tone = 'professional') => {
  const prompt = promptTemplates.generateScript(idea, platform, tone);
  return await generateText({ prompt });
};

// Generate posting schedule suggestions
export const generateScheduleSuggestions = async (niche, platform) => {
  const prompt = promptTemplates.generateSchedule(niche, platform);
  return await generateText({ prompt });
};

// Generate content ideas
export const generateContentIdeas = async (niche, count = 10) => {
  const prompt = promptTemplates.generateIdeas(niche, count);
  return await generateText({ prompt });
};

// Rewrite content in user's tone
export const rewriteContent = async (content, tone, platform) => {
  const prompt = promptTemplates.rewriteContent(content, tone, platform);
  return await generateText({ prompt });
};
