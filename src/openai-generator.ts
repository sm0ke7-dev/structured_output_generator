import OpenAI from 'openai';
import { pullPrompt } from './repositories/data/pull_prompt';

// Define the structure for subtopics
export interface Subtopic {
  heading: string;
  description: string;
}

// Define the response structure
export interface StructuredResponse {
  response: Subtopic[];
}

// Define the input structure
export interface GenerateRequest {
  keyword: string;
  promptTemplate?: string;
  promptId?: string;
}

export class OpenAIGenerator {
  private client: OpenAI;
  private defaultPromptId = 'subtopics-default';

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env['OPENAI_API_KEY'],
    });
  }

  /**
   * Generate structured output from OpenAI API
   */
  async generateStructuredOutput(request: GenerateRequest): Promise<StructuredResponse> {
    const { keyword, promptTemplate, promptId } = request;
    
    // Determine which prompt to use
    let finalPrompt: string;
    
    if (promptTemplate) {
      // Use custom prompt template if provided
      finalPrompt = promptTemplate.replace('{keyword}', keyword);
    } else if (promptId) {
      // Use prompt from repository by ID
      finalPrompt = pullPrompt(promptId).replace('{keyword}', keyword);
    } else {
      // Use default prompt
      finalPrompt = pullPrompt(this.defaultPromptId).replace('{keyword}', keyword);
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides structured responses. Always respond with valid JSON in this exact format: {"response": [{"heading": "Title", "description": "Description"}, {"heading": "Title 2", "description": "Description 2"}]}. Each item must have both "heading" and "description" fields.'
          },
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1000,
      });

      const responseContent = completion.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error('No response content received from OpenAI');
      }

      // Parse the JSON response
      const parsedResponse = JSON.parse(responseContent) as StructuredResponse;
      
      // Validate the response structure
      this.validateResponse(parsedResponse);
      
      return parsedResponse;

    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON response from OpenAI API');
      }
      throw error;
    }
  }

  /**
   * Validate the response structure
   */
  private validateResponse(response: any): asserts response is StructuredResponse {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response structure: expected an object');
    }

    if (!Array.isArray(response.response)) {
      throw new Error('Invalid response structure: expected "response" to be an array');
    }

    for (const item of response.response) {
      if (typeof item !== 'object' || item === null) {
        throw new Error('Invalid response structure: each item should be an object');
      }

      if (typeof item.heading !== 'string') {
        throw new Error('Invalid response structure: each item should have a "heading" string');
      }

      if (typeof item.description !== 'string') {
        throw new Error('Invalid response structure: each item should have a "description" string');
      }
    }
  }

  /**
   * Set a custom default prompt ID
   */
  setDefaultPromptId(promptId: string): void {
    this.defaultPromptId = promptId;
  }

  /**
   * Get the current default prompt ID
   */
  getDefaultPromptId(): string {
    return this.defaultPromptId;
  }
} 