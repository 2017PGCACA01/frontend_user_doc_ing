export enum ModelType {
  LLM = "llm",
  EMBEDDING = "embedding",
}

export interface ModelParameters {
  temperature?: number;
  max_tokens?: number;
  [key: string]: any;
}

export interface Model {
  id: number;
  name: string;
  type: ModelType;
  description: string;
  parameters: ModelParameters;
  created_at: string;
  updated_at: string;
}
