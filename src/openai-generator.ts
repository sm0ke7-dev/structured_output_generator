import OpenAI from 'openai';
import { pullPrompt, pullPromptTemplate } from './repositories/pull_prompt';

// Define the structure for subtopics
export interface Subtopic {
  heading: string;
  description: string;
}

// Define the response structure
export interface StructuredResponse {
  response: Subtopic[];
}

// Define response format options
export interface ResponseFormat {
  type: 'json_object' | 'text';
}

// Define the input structure
export interface GenerateRequest {
  // Core content
  keyword: string;
  promptTemplate?: string;
  promptId?: string;
  
  // Model configuration
  model?: string;           // "gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo", etc.
  temperature?: number;     // 0.0 to 2.0
  maxTokens?: number;       // max_tokens
  
  // Custom prompts
  systemPrompt?: string;    // Override default system prompt
  userPrompt?: string;      // Override the generated user prompt
  
  // Response format
  responseFormat?: { type: 'json_object' | 'text' };
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
    const { 
      keyword, 
      promptTemplate, 
      promptId,
      model: requestModel,
      temperature: requestTemperature,
      maxTokens: requestMaxTokens,
      systemPrompt: requestSystemPrompt,
      userPrompt,
      responseFormat: requestResponseFormat
    } = request;
    
    // Get prompt template with settings
    let promptTemplateObj: any = null;
    let finalPrompt: string;
    
    if (userPrompt) {
      // Use custom user prompt if provided
      finalPrompt = userPrompt.replace('{keyword}', keyword);
    } else if (promptTemplate) {
      // Use custom prompt template if provided
      finalPrompt = promptTemplate.replace('{keyword}', keyword);
    } else if (promptId) {
      // Use prompt from repository by ID
      promptTemplateObj = pullPromptTemplate(promptId);
      finalPrompt = promptTemplateObj?.template.replace('{keyword}', keyword) || 
                   pullPrompt(promptId).replace('{keyword}', keyword);
    } else {
      // Use default prompt
      promptTemplateObj = pullPromptTemplate(this.defaultPromptId);
      finalPrompt = promptTemplateObj?.template.replace('{keyword}', keyword) || 
                   pullPrompt(this.defaultPromptId).replace('{keyword}', keyword);
    }

    // Use settings from prompt template, with request overrides
    const model = requestModel || promptTemplateObj?.model || 'gpt-3.5-turbo';
    const temperature = requestTemperature ?? promptTemplateObj?.temperature ?? 0.7;
    const maxTokens = requestMaxTokens || promptTemplateObj?.maxTokens || 1000;
    const systemPrompt = requestSystemPrompt || promptTemplateObj?.systemPrompt || 
                        'You are a helpful assistant that provides structured responses. Always respond with valid JSON in this exact format: {"response": [{"heading": "Title", "description": "Description"}, {"heading": "Title 2", "description": "Description 2"}]}. Each item must have both "heading" and "description" fields.';
    const responseFormat = requestResponseFormat || promptTemplateObj?.responseFormat || { type: 'json_object' };

    try {
      const completion = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        response_format: responseFormat,
        temperature,
        max_tokens: maxTokens,
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