/**
 * Pull prompt function for retrieving prompt templates
 * 
 * This function acts as a repository layer for accessing prompt templates.
 * It can be extended to pull from different sources (database, files, etc.)
 */

import { getPromptTemplate, PromptTemplate } from './prompts';

export interface PullPromptOptions {
  fallbackToDefault?: boolean;
  throwOnNotFound?: boolean;
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
  // This could be extended to pull from different sources
  return ['subtopics-default', 'analysis-breakdown', 'best-practices', 'comparison-analysis', 'step-by-step-guide'];
}
