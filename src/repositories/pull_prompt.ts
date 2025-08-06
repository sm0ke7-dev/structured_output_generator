/**
 * Pull prompt function for retrieving prompt templates and structure definitions
 * 
 * This function acts as a repository layer for accessing prompt templates and structures.
 * It can be extended to pull from different sources (database, files, etc.)
 */

import * as fs from 'fs';
import * as path from 'path';

// Structure definitions
export interface Subtopic {
  heading: string;
  description: string;
}

export interface StructuredResponse {
  response: Subtopic[];
}

export interface GenerateRequest {
  // Core content
  keyword: string;
  promptTemplate?: string;
  promptId?: string;
  
  // Model configuration
  model?: string;
  temperature?: number;
  maxTokens?: number;
  
  // Custom prompts
  systemPrompt?: string;
  userPrompt?: string;
  
  // Response format
  responseFormat?: { type: 'json_object' | 'text' };
}

export interface ResponseFormat {
  type: 'json_object' | 'text';
}

export interface PromptTemplate {
  name: string;
  description: string;
  template: string;
  category: string;
  tags: string[];
  
  // Model configuration parameters
  model?: string;
  temperature?: number;
  maxTokens?: number;
  
  // Custom prompts
  systemPrompt?: string;
  
  // Response format
  responseFormat?: ResponseFormat;
}

export interface PromptData {
  [key: string]: PromptTemplate;
}

export interface PullPromptOptions {
  fallbackToDefault?: boolean;
  throwOnNotFound?: boolean;
}

// Utility functions for consistent structure handling
export const STRUCTURE_UTILS: {
  getSystemPrompt: (customPrompt?: string) => string;
  getResponseFormat: () => ResponseFormat;
  validateResponse: (response: any) => asserts response is StructuredResponse;
} = {
  // Get the standard system prompt with the correct structure
  getSystemPrompt: (customPrompt?: string): string => {
    const basePrompt = 'You are a helpful assistant that provides structured responses. Always respond with valid JSON in this exact format: {"response": [{"heading": "Title", "description": "Description"}, {"heading": "Title 2", "description": "Description 2"}]}. Each item must have both "heading" and "description" fields.';
    return customPrompt || basePrompt;
  },

  // Get the standard response format
  getResponseFormat: (): ResponseFormat => ({
    type: 'json_object'
  }),

  // Validate response structure
  validateResponse: (response: any): asserts response is StructuredResponse => {
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
};

/**
 * Load prompt data from multiple files
 */
function loadPromptData(): PromptData {
  const promptData: PromptData = {};
  const baseDir = path.join(__dirname, '..', '..', 'src', 'repositories', 'data');
  
  // Define which prompt IDs are in which files
  const fileMapping: { [key: string]: string } = {
    'subtopics-default': 'subtopics-prompts',
    'analysis-breakdown': 'analysis-prompts',
    'comparison-analysis': 'analysis-prompts',
    'best-practices': 'guidance-prompts',
    'step-by-step-guide': 'tutorial-prompts'
  };
  
  // Load each file and merge the data
  const filesToLoad = [...new Set(Object.values(fileMapping))];
  
  for (const fileName of filesToLoad) {
    try {
      const filePath = path.join(baseDir, fileName);
      const data = fs.readFileSync(filePath, 'utf8');
      const fileData = JSON.parse(data);
      
      // Merge this file's data into the main object
      Object.assign(promptData, fileData);
    } catch (error) {
      console.error(`Error loading prompts file ${fileName}:`, error);
    }
  }
  
  return promptData;
}

/**
 * Get a prompt template by ID
 */
function getPromptTemplate(id: string): PromptTemplate | undefined {
  const promptData = loadPromptData();
  return promptData[id];
}

/**
 * Pull a prompt template by ID
 */
export function pullPrompt(
  promptId: string, 
  options: PullPromptOptions = {}
): string {
  const { fallbackToDefault = true, throwOnNotFound = false } = options;
  
  // Try to get the requested prompt
  const promptTemplate = getPromptTemplate(promptId);
  
  if (promptTemplate) {
    return promptTemplate.template;
  }
  
  // If not found and fallback is enabled, return default
  if (fallbackToDefault) {
    const defaultTemplate = getPromptTemplate('subtopics-default');
    if (defaultTemplate) {
      console.warn(`Prompt template "${promptId}" not found, using default template`);
      return defaultTemplate.template;
    }
  }
  
  // If still not found and we should throw, throw an error
  if (throwOnNotFound) {
    throw new Error(`Prompt template "${promptId}" not found`);
  }
  
  // Last resort: return a basic template
  return 'Generate content related to "{keyword}".';
}

/**
 * Pull a prompt template object by ID (returns full template object)
 */
export function pullPromptTemplate(
  promptId: string,
  options: PullPromptOptions = {}
): PromptTemplate | undefined {
  const { fallbackToDefault = true, throwOnNotFound = false } = options;
  
  // Try to get the requested prompt
  const promptTemplate = getPromptTemplate(promptId);
  
  if (promptTemplate) {
    return promptTemplate;
  }
  
  // If not found and fallback is enabled, return default
  if (fallbackToDefault) {
    const defaultTemplate = getPromptTemplate('subtopics-default');
    if (defaultTemplate) {
      console.warn(`Prompt template "${promptId}" not found, using default template`);
      return defaultTemplate;
    }
  }
  
  // If still not found and we should throw, throw an error
  if (throwOnNotFound) {
    throw new Error(`Prompt template "${promptId}" not found`);
  }
  
  // Last resort: return undefined
  return undefined;
}

/**
 * Get available prompt IDs
 */
export function getAvailablePromptIds(): string[] {
  const promptData = loadPromptData();
  return Object.keys(promptData);
} 