export type PromptExecution = {
  featureId: string;
  featureTitle: string;
  executedAt: string;
  promptType: 'done' | 'undone';
};
