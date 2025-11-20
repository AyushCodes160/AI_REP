// Quick test script to verify OpenAI connection
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

console.log('\n🔍 OpenAI Configuration Check:');
console.log('================================');
console.log('API Key exists:', !!apiKey);
console.log('API Key length:', apiKey ? apiKey.length : 0);
console.log('API Key starts with:', apiKey ? apiKey.substring(0, 7) + '...' : 'N/A');

if (apiKey) {
  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');
  console.log('Cleaned key length:', cleanKey.length);
  
  try {
    const openai = new OpenAI({
      apiKey: cleanKey,
    });
    
    console.log('\n✅ OpenAI client created successfully');
    console.log('Testing API connection...\n');
    
    // Test with a simple request
    openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "Hello" if you can read this.' }],
      max_tokens: 10,
    })
    .then((response) => {
      console.log('✅ OpenAI API is working!');
      console.log('Response:', response.choices[0].message.content);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ OpenAI API Error:');
      console.error('Status:', error.status);
      console.error('Message:', error.message);
      if (error.status === 401) {
        console.error('\n⚠️  Invalid API key. Please check your OPENAI_API_KEY in .env');
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to create OpenAI client:', error.message);
    process.exit(1);
  }
} else {
  console.error('\n❌ OPENAI_API_KEY not found in .env file');
  console.error('Please add: OPENAI_API_KEY=your-key-here');
  process.exit(1);
}

