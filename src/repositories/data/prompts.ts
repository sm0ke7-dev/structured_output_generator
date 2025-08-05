/**
 * Prompt templates for structured output generation
 * 
 * This file contains reusable prompt templates that can be used
 * with the OpenAIGenerator to create different types of structured outputs.
 */

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
  tags: string[];
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'subtopics-default',
    name: 'Default Subtopics Generator',
    description: 'Generate a list of subtopics related to a keyword with headings and descriptions',
    template: 'Give me a list of subtopics related to the search keyphrase "{keyword}". For each subtopic, provide a heading and a brief description.',
    category: 'content-generation',
    tags: ['subtopics', 'default', 'general']
  },
  {
    id: 'analysis-breakdown',
    name: 'Topic Analysis Breakdown',
    description: 'Break down a topic into key components with detailed analysis',
    template: 'Analyze the topic "{keyword}" and break it down into key components. For each component, provide a title and explanation.',
    category: 'analysis',
    tags: ['analysis', 'breakdown', 'components']
  },
  {
    id: 'best-practices',
    name: 'Best Practices Generator',
    description: 'Generate best practices for a given topic or field',
    template: 'Create a comprehensive list of best practices for "{keyword}". Structure the response with clear headings and detailed descriptions for each practice.',
    category: 'guidance',
    tags: ['best-practices', 'guidance', 'recommendations']
  },
  {
    id: 'comparison-analysis',
    name: 'Comparison Analysis',
    description: 'Compare different aspects or options related to a topic',
    template: 'Provide a structured comparison of different aspects related to "{keyword}". For each aspect, provide a heading and detailed comparison points.',
    category: 'analysis',
    tags: ['comparison', 'analysis', 'evaluation']
  },
  {
    id: 'step-by-step-guide',
    name: 'Step-by-Step Guide',
    description: 'Create a step-by-step guide for a process or procedure',
    template: 'Create a step-by-step guide for "{keyword}". Each step should have a clear heading and detailed instructions.',
    category: 'tutorial',
    tags: ['tutorial', 'steps', 'guide']
  }
];

/**
 * Get a prompt template by ID
 */
export function getPromptTemplate(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find(template => template.id === id);
}

/**
 * Get prompt templates by category
 */
export function getPromptTemplatesByCategory(category: string): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter(template => template.category === category);
}

/**
 * Get prompt templates by tag
 */
export function getPromptTemplatesByTag(tag: string): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter(template => template.tags.includes(tag));
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): string[] {
  return [...new Set(PROMPT_TEMPLATES.map(template => template.category))];
}

/**
 * Get all available tags
 */
export function getAvailableTags(): string[] {
  const allTags = PROMPT_TEMPLATES.flatMap(template => template.tags);
  return [...new Set(allTags)];
} 