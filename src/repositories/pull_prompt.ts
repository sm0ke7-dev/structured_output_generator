/**
 * Pull prompt function for retrieving prompt templates
 * 
 * This function acts as a repository layer for accessing prompt templates.
 * It can be extended to pull from different sources (database, files, etc.)
 */

import * as fs from 'fs';
import * as path from 'path';

export interface PromptTemplate {
  name: string;
  description: string;
  template: string;
  category: string;
  tags: string[];
  
  // Model configuration parameters
  model?: string;           // "gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo", etc.
  temperature?: number;     // 0.0 to 2.0
  maxTokens?: number;       // max_tokens
  
  // Custom prompts
  systemPrompt?: string;    // Override default system prompt
  
  // Response format
  responseFormat?: { 
    type: 'json_object' | 'text';
  };
}

export interface PromptData {
  [key: string]: PromptTemplate;
}

export interface PullPromptOptions {
  fallbackToDefault?: boolean;
  throwOnNotFound?: boolean;
}

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