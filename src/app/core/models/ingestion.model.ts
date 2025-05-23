export enum IngestionStatus {
  PENDING = "queued",
  PROCESSING = "processing",
  COMPLETED = "done",
  FAILED = "failed",
}

export interface Ingestion {
  id: number;
  document_id: number;
  status: IngestionStatus;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
  summary: string | null;
}
