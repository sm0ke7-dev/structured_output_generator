/**
 * Example usage of the OpenAI Structured Output Generator
 * 
 * This script demonstrates how to use the OpenAIGenerator class
 * to generate structured responses for different keywords.
 */

// Load environment variables from .env file
import 'dotenv/config';

import { OpenAIGenerator, GenerateRequest } from './openai-generator';

async function runExamples(): Promise<void> {
  console.log('🎯 OpenAI Structured Output Generator Examples\n');

  // Initialize the generator
  const generator = new OpenAIGenerator();

  // Example 1: Raccoons question (using default prompt)
  console.log('📝 Example 1: Raccoons and Human Safety (Default Prompt)');
  await runExample(generator, {
    keyword: 'Are raccoons a danger to humans?'
  });

  // Example 2: Different topic (using analysis breakdown prompt)
  console.log('\n📝 Example 2: Climate Change (Analysis Breakdown)');
  await runExample(generator, {
    keyword: 'Climate change effects on agriculture',
    promptId: 'analysis-breakdown'
  });

  // Example 3: Best practices prompt
  console.log('\n📝 Example 3: Remote Work (Best Practices)');
  await runExample(generator, {
    keyword: 'Best practices for remote work',
    promptId: 'best-practices'
  });
}

async function runExample(generator: OpenAIGenerator, request: GenerateRequest): Promise<void> {
  try {
    console.log(`🔍 Keyword: "${request.keyword}"`);
    console.log(`📋 Prompt: ${request.promptTemplate?.replace('{keyword}', request.keyword)}`);
    
    const startTime = Date.now();
    const response = await generator.generateStructuredOutput(request);
    const endTime = Date.now();
    
    console.log(`⏱️  Response time: ${endTime - startTime}ms`);
    console.log(`📊 Number of subtopics: ${response.response.length}`);
    
    console.log('\n📋 Structured Response:');
    response.response.forEach((subtopic, index) => {
      console.log(`\n${index + 1}. ${subtopic.heading}`);
      console.log(`   ${subtopic.description}`);
    });
    
  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : error}`);
  }
}

// Example of how to use with custom API key
async function runWithCustomAPIKey(): Promise<void> {
  console.log('\n🔑 Example with Custom API Key');
  
  const customGenerator = new OpenAIGenerator('your-api-key-here');
  
  try {
    const response = await customGenerator.generateStructuredOutput({
      keyword: 'Artificial Intelligence in healthcare'
    });
    
    console.log('✅ Custom API key example successful');
    console.log(JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error('❌ Custom API key example failed:', error);
  }
}

// Example of how to change default prompt ID
async function runWithCustomTemplate(): Promise<void> {
  console.log('\n🎨 Example with Custom Default Prompt ID');
  
  const generator = new OpenAIGenerator();
  
  // Set a custom default prompt ID
  generator.setDefaultPromptId('step-by-step-guide');
  
  try {
    const response = await generator.generateStructuredOutput({
      keyword: 'Sustainable energy solutions'
    });
    
    console.log('✅ Custom default prompt ID example successful');
    console.log(JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error('❌ Custom default prompt ID example failed:', error);
  }
}

// Run all examples
if (require.main === module) {
  runExamples()
    .then(() => runWithCustomAPIKey())
    .then(() => runWithCustomTemplate())
    .then(() => console.log('\n✅ All examples completed!'))
    .catch(console.error);
}

export { runExamples, runWithCustomAPIKey, runWithCustomTemplate }; 