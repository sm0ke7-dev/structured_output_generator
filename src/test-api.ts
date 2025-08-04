/**
 * Simple script to test if your OpenAI API key is properly configured
 */

// Load environment variables from .env file
import 'dotenv/config';

import { OpenAIGenerator } from './openai-generator';

async function testAPIKey(): Promise<void> {
  console.log('🔑 Testing OpenAI API Key Configuration...\n');

  // Debug: Check if environment variable is loaded
  const apiKey = process.env['OPENAI_API_KEY'];
  if (apiKey) {
    console.log('✅ Environment variable found');
    console.log(`   Key starts with: ${apiKey.substring(0, 7)}...`);
  } else {
    console.log('❌ Environment variable not found');
    console.log('   Make sure your .env file exists and contains:');
    console.log('   OPENAI_API_KEY=sk-your-actual-key-here');
  }

  try {
    // Try to create the generator
    const generator = new OpenAIGenerator();
    
    console.log('✅ OpenAIGenerator created successfully');
    console.log('📋 Testing with a simple request...\n');

    // Test with a simple request
    const response = await generator.generateStructuredOutput({
      keyword: 'test',
      promptTemplate: 'Give me 2 simple subtopics for "{keyword}". Each should have a heading and description.'
    });

    console.log('✅ API call successful!');
    console.log('📊 Response received:');
    console.log(JSON.stringify(response, null, 2));

  } catch (error) {
    console.error('❌ Error occurred:');
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('🔑 API Key Issue:');
        console.error('   - Make sure you have set the OPENAI_API_KEY environment variable');
        console.error('   - Or pass the API key directly to the constructor');
        console.error('\n💡 How to fix:');
        console.error('   Windows (PowerShell): $env:OPENAI_API_KEY="your-key-here"');
        console.error('   Windows (CMD): set OPENAI_API_KEY=your-key-here');
        console.error('   macOS/Linux: export OPENAI_API_KEY="your-key-here"');
      } else if (error.message.includes('rate limit')) {
        console.error('⏱️  Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.message.includes('quota')) {
        console.error('💰 API quota exceeded. Please check your OpenAI account.');
      } else {
        console.error(`   ${error.message}`);
      }
    } else {
      console.error('   Unknown error occurred');
    }
  }
}

// Run the test
if (require.main === module) {
  testAPIKey().catch(console.error);
}

export { testAPIKey }; 