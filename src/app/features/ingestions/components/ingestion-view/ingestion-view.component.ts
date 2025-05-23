import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../../core/services/api.service";
import {
  Ingestion,
  IngestionStatus,
} from "../../../../core/models/ingestion.model";
import { MatTableDataSource } from "@angular/material/table";
import { Document } from "../../../../core/models/document.model";

@Component({
  selector: "app-ingestion-view",
  templateUrl: "./ingestion-view.component.html",
  styleUrls: ["./ingestion-view.component.scss"],
})
export class IngestionViewComponent implements OnInit {
  ingestion: Ingestion | null = null;
  documentColumns: string[] = ["title", "fileType", "createdAt"];
  documentsDataSource = new MatTableDataSource<Document>([]);

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const ingestionId = this.route.snapshot.params["id"];
    this.loadIngestion(ingestionId);
  }

  loadIngestion(id: number): void {
    this.apiService.get<Ingestion>(`/api/ingestion/${id}/status`).subscribe({
      next: (ingestion) => {
        this.ingestion = ingestion;
        if (ingestion.status === IngestionStatus.PROCESSING) {
          this.pollIngestionStatus(id);
        }
      },
      error: (error) => {
        console.error("Error loading ingestion:", error);
      },
    });
  }

  private pollIngestionStatus(id: number): void {
    const pollInterval = setInterval(() => {
      this.apiService.get<Ingestion>(`/api/ingestion/${id}/status`).subscribe({
        next: (ingestion) => {
          this.ingestion = ingestion;
          if (ingestion.status !== IngestionStatus.PROCESSING) {
            clearInterval(pollInterval);
          }
        },
        error: (error) => {
          console.error("Error polling ingestion status:", error);
          clearInterval(pollInterval);
        },
      });
    }, 5000);
  }
}
