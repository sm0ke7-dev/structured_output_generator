/**
 * Structured Output Generator
 * Main entry point for the application
 */

// Load environment variables from .env file
import 'dotenv/config';
import * as readline from 'readline';

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

// Helper function to get user input
function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
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

  // Interactive OpenAI structured output
  console.log('\n🤖 Interactive OpenAI Integration...');
  
  try {
    const openaiGenerator = new OpenAIGenerator();
    
    // Get user input
    const keyword = await askQuestion('\n🔍 Enter your search keyphrase: ');
    
    if (!keyword) {
      console.log('❌ No keyphrase provided. Exiting...');
      return;
    }

    // Show available prompt types
    console.log('\n📋 Available prompt types:');
    console.log('1. subtopics-default (Default)');
    console.log('2. analysis-breakdown');
    console.log('3. best-practices');
    console.log('4. comparison-analysis');
    console.log('5. step-by-step-guide');
    
    const promptChoice = await askQuestion('\n🎯 Choose prompt type (1-5, or press Enter for default): ');
    
    let promptId = 'subtopics-default';
    switch (promptChoice) {
      case '2':
        promptId = 'analysis-breakdown';
        break;
      case '3':
        promptId = 'best-practices';
        break;
      case '4':
        promptId = 'comparison-analysis';
        break;
      case '5':
        promptId = 'step-by-step-guide';
        break;
      default:
        promptId = 'subtopics-default';
    }

    const request: GenerateRequest = {
      keyword,
      promptId
    };

    console.log(`\n🔍 Generating structured output for: "${request.keyword}"`);
    console.log(`📋 Using prompt type: ${promptId}`);
    
    const structuredResponse = await openaiGenerator.generateStructuredOutput(request);

    console.log('\n📋 OpenAI Response:');
    console.log(JSON.stringify(structuredResponse, null, 2));

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