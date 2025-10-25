export type SuggestionCategory = 'feature' | 'enhancement' | 'integration' | 'optimization';
export type SuggestionPriority = 'low' | 'medium' | 'high';

export type Suggestion = {
  id: string;
  title: string;
  description: string;
  category: SuggestionCategory;
  priority: SuggestionPriority;
  estimatedTime: string;
  benefits: string[];
  requirements?: string[];
  prompt: string;
};

export type ExecutedPrompt = {
  id: string;
  featureId: string;
  featureTitle: string;
  type: 'done' | 'undone';
  prompt: string;
  executedAt: string;
  source: 'business-model' | 'system-suggestion';
};
