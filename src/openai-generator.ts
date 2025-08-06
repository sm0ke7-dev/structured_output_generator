import OpenAI from 'openai';
import { 
  pullPrompt, 
  pullPromptTemplate, 
  StructuredResponse, 
  GenerateRequest, 
  ResponseFormat, 
  STRUCTURE_UTILS 
} from './repositories/pull_prompt';

// Re-export types for backward compatibility
export type { StructuredResponse, GenerateRequest, ResponseFormat };

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
    const systemPrompt = requestSystemPrompt || promptTemplateObj?.systemPrompt || STRUCTURE_UTILS.getSystemPrompt();
    const responseFormat = requestResponseFormat || promptTemplateObj?.responseFormat || STRUCTURE_UTILS.getResponseFormat();

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
      STRUCTURE_UTILS.validateResponse(parsedResponse);
      
      return parsedResponse;

    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON response from OpenAI API');
      }
      throw error;
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