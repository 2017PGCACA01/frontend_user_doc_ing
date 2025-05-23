import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../../../core/services/api.service";
import { Ingestion } from "../../../../core/models/ingestion.model";

@Component({
  selector: "app-ingestion-list",
  templateUrl: "./ingestion-list.component.html",
  styleUrls: ["./ingestion-list.component.scss"],
})
export class IngestionListComponent implements OnInit {
  ingestions: Ingestion[] = [];
  displayedColumns: string[] = [
    "id",
    "documentId",
    "status",
    "startedAt",
    "completedAt",
    "errorMessage",
    "actions",
  ];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadIngestions();
  }

  loadIngestions(): void {
    this.apiService.get<Ingestion[]>("/api/ingestion/").subscribe({
      next: (ingestions) => {
        this.ingestions = ingestions;
      },
      error: (error) => {
        console.error("Error loading ingestions:", error);
      },
    });
  }
}
