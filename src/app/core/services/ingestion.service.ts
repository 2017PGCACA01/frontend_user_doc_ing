import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { Ingestion, IngestionStatus } from "../models/ingestion.model";

@Injectable({
  providedIn: "root",
})
export class IngestionService {
  constructor(private apiService: ApiService) {}

  getIngestions(): Observable<Ingestion[]> {
    return this.apiService.get<Ingestion[]>("/api/ingestion/");
  }

  getIngestion(id: number): Observable<Ingestion> {
    return this.apiService.get<Ingestion>(`/api/ingestion/${id}`);
  }

  triggerIngestion(documentId: number): Observable<Ingestion> {
    return this.apiService.post<Ingestion>(`/api/ingestion/trigger`, {
      document_id: documentId,
    });
  }

  getIngestionStatus(id: number): Observable<IngestionStatus> {
    return this.apiService.get<IngestionStatus>(`/api/ingestion/${id}/status`);
  }
}
