/**
 * Structured Output Generator
 * Main entry point for the application
 */

// Load environment variables from .env file
import 'dotenv/config';

import { OpenAIGenerator, StructuredResponse, GenerateRequest } from './openai-generator';

interface StructuredOutput {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

class OutputGenerator {
  private static instance: OutputGenerator;
  private counter = 0;

  private constructor() {}

  static getInstance(): OutputGenerator {
    if (!OutputGenerator.instance) {
      OutputGenerator.instance = new OutputGenerator();
    }
    return OutputGenerator.instance;
  }

  generateOutput(type: string, data: Record<string, unknown>, metadata?: Record<string, unknown>): StructuredOutput {
    this.counter++;
    
    return {
      id: `output_${this.counter}`,
      type,
      data,
      timestamp: new Date(),
      ...(metadata && { metadata })
    };
  }

  getStats(): { totalGenerated: number } {
    return {
      totalGenerated: this.counter
    };
  }
}

// Example usage with OpenAI integration
async function main(): Promise<void> {
  console.log('🚀 Structured Output Generator Starting...\n');

  const generator = OutputGenerator.getInstance();

  // Example 1: Basic structured output
  const output1 = generator.generateOutput('user', {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  }, {
    source: 'registration',
    priority: 'high'
  });

  const output2 = generator.generateOutput('product', {
    name: 'Sample Product',
    price: 29.99,
    category: 'electronics'
  });

  console.log('Generated Basic Outputs:');
  console.log(JSON.stringify(output1, null, 2));
  console.log('\n' + JSON.stringify(output2, null, 2));

  console.log('\n📊 Basic Statistics:');
  console.log(JSON.stringify(generator.getStats(), null, 2));

  // Example 2: OpenAI structured output
  console.log('\n🤖 Testing OpenAI Integration...');
  
  try {
    const openaiGenerator = new OpenAIGenerator();
    
    // Example request
    const request: GenerateRequest = {
      keyword: 'Are raccoons a danger to humans?',
      promptTemplate: 'Give me a list of subtopics related to the search keyphrase "{keyword}". For each subtopic, provide a heading and a brief description.'
    };

    console.log(`\n🔍 Generating structured output for: "${request.keyword}"`);
    
    const structuredResponse = await openaiGenerator.generateStructuredOutput(request);
    
    // Create a structured output record
    const openaiOutput = generator.generateOutput('openai_response', {
      keyword: request.keyword,
      subtopics: structuredResponse.response
    }, {
      source: 'openai_api',
      model: 'gpt-3.5-turbo',
      prompt_template: request.promptTemplate
    });

    console.log('\n📋 OpenAI Structured Response:');
    console.log(JSON.stringify(structuredResponse, null, 2));
    
    console.log('\n💾 Stored as Structured Output:');
    console.log(JSON.stringify(openaiOutput, null, 2));

  } catch (error) {
    console.error('\n❌ OpenAI API Error:', error instanceof Error ? error.message : error);
    console.log('\n💡 Make sure to set your OPENAI_API_KEY environment variable');
  }

  console.log('\n✅ Application completed successfully!');
}

// Run the application
if (require.main === module) {
  main().catch(console.error);
}

export { OutputGenerator, StructuredOutput, main, OpenAIGenerator, StructuredResponse, GenerateRequest }; 