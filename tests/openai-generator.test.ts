import { OpenAIGenerator, StructuredResponse, GenerateRequest, Subtopic } from '../src/openai-generator';

// Mock OpenAI client
jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn()
        }
      }
    }))
  };
});

describe('OpenAIGenerator', () => {
  let generator: OpenAIGenerator;
  let mockOpenAI: any;

  beforeEach(() => {
    jest.clearAllMocks();
    generator = new OpenAIGenerator('test-api-key');
    mockOpenAI = require('openai').default;
  });

  describe('constructor', () => {
    it('should initialize with API key', () => {
      expect(mockOpenAI).toHaveBeenCalledWith({
        apiKey: 'test-api-key'
      });
    });

    it('should use environment variable when no API key provided', () => {
      const originalEnv = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = 'env-api-key';
      
      new OpenAIGenerator();
      
      expect(mockOpenAI).toHaveBeenCalledWith({
        apiKey: 'env-api-key'
      });
      
      process.env.OPENAI_API_KEY = originalEnv;
    });
  });

  describe('generateStructuredOutput', () => {
    it('should generate structured output with default template', async () => {
      const mockResponse: StructuredResponse = {
        response: [
          {
            heading: 'Test Heading 1',
            description: 'Test Description 1'
          },
          {
            heading: 'Test Heading 2',
            description: 'Test Description 2'
          }
        ]
      };

      const mockCreate = jest.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(mockResponse) } }]
      });

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }));

      const request: GenerateRequest = {
        keyword: 'test keyword'
      };

      const result = await generator.generateStructuredOutput(request);

      expect(result).toEqual(mockResponse);
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides structured responses. Always respond with valid JSON containing an array of subtopics, where each subtopic has a "heading" and "description" field.'
          },
          {
            role: 'user',
            content: 'Give me a list of subtopics related to the search keyphrase "test keyword". For each subtopic, provide a heading and a brief description.'
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1000,
      });
    });

    it('should use custom prompt template', async () => {
      const mockResponse: StructuredResponse = {
        response: [
          {
            heading: 'Custom Heading',
            description: 'Custom Description'
          }
        ]
      };

      const mockCreate = jest.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(mockResponse) } }]
      });

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }));

      const request: GenerateRequest = {
        keyword: 'test keyword',
        promptTemplate: 'Custom prompt for "{keyword}"'
      };

      await generator.generateStructuredOutput(request);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: 'Custom prompt for "test keyword"'
            })
          ])
        })
      );
    });

    it('should throw error for invalid JSON response', async () => {
      const mockCreate = jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'invalid json' } }]
      });

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }));

      const request: GenerateRequest = {
        keyword: 'test keyword'
      };

      await expect(generator.generateStructuredOutput(request))
        .rejects
        .toThrow('Invalid JSON response from OpenAI API');
    });

    it('should throw error for invalid response structure', async () => {
      const invalidResponse = {
        invalid: 'structure'
      };

      const mockCreate = jest.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(invalidResponse) } }]
      });

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }));

      const request: GenerateRequest = {
        keyword: 'test keyword'
      };

      await expect(generator.generateStructuredOutput(request))
        .rejects
        .toThrow('Invalid response structure: expected "response" to be an array');
    });
  });

  describe('prompt template management', () => {
    it('should set and get prompt template', () => {
      const customTemplate = 'Custom template for {keyword}';
      generator.setPromptTemplate(customTemplate);
      
      expect(generator.getPromptTemplate()).toBe(customTemplate);
    });

    it('should use default template initially', () => {
      const defaultTemplate = 'Give me a list of subtopics related to the search keyphrase "{keyword}". For each subtopic, provide a heading and a brief description.';
      expect(generator.getPromptTemplate()).toBe(defaultTemplate);
    });
  });

  describe('response validation', () => {
    it('should validate correct response structure', () => {
      const validResponse: StructuredResponse = {
        response: [
          {
            heading: 'Valid Heading',
            description: 'Valid Description'
          }
        ]
      };

      // This should not throw
      expect(() => {
        (generator as any).validateResponse(validResponse);
      }).not.toThrow();
    });

    it('should throw for missing response array', () => {
      const invalidResponse = {
        something: 'else'
      };

      expect(() => {
        (generator as any).validateResponse(invalidResponse);
      }).toThrow('Invalid response structure: expected "response" to be an array');
    });

    it('should throw for invalid subtopic structure', () => {
      const invalidResponse = {
        response: [
          {
            heading: 'Valid Heading'
            // missing description
          }
        ]
      };

      expect(() => {
        (generator as any).validateResponse(invalidResponse);
      }).toThrow('Invalid response structure: each item should have a "description" string');
    });
  });
}); 