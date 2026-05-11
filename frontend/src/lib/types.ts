export interface AiResponse {
  response: string;
  model_used: "gemini" | "claude";
  is_failover: boolean;
  execution_ms: number;
}

export interface HistoryRecord extends AiResponse {
  id: string;
  created_at: string;
  prompt?: string;
}
