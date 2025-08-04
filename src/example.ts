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

  // Example 1: Raccoons question
  console.log('📝 Example 1: Raccoons and Human Safety');
  await runExample(generator, {
    keyword: 'Are raccoons a danger to humans?',
    promptTemplate: 'Give me a list of subtopics related to the search keyphrase "{keyword}". For each subtopic, provide a heading and a brief description.'
  });

  // Example 2: Different topic
  console.log('\n📝 Example 2: Climate Change');
  await runExample(generator, {
    keyword: 'Climate change effects on agriculture',
    promptTemplate: 'Provide a structured list of subtopics for "{keyword}". Each subtopic should have a heading and description.'
  });

  // Example 3: Custom prompt
  console.log('\n📝 Example 3: Custom Prompt Template');
  await runExample(generator, {
    keyword: 'Best practices for remote work',
    promptTemplate: 'Create a comprehensive list of key areas to consider for "{keyword}". Structure the response with clear headings and detailed descriptions for each area.'
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

// Example of how to change prompt template
async function runWithCustomTemplate(): Promise<void> {
  console.log('\n🎨 Example with Custom Template');
  
  const generator = new OpenAIGenerator();
  
  // Set a custom template
  generator.setPromptTemplate('Analyze the topic "{keyword}" and break it down into key components. For each component, provide a title and explanation.');
  
  try {
    const response = await generator.generateStructuredOutput({
      keyword: 'Sustainable energy solutions'
    });
    
    console.log('✅ Custom template example successful');
    console.log(JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error('❌ Custom template example failed:', error);
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