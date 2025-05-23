import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DocumentService } from "../../../../core/services/document.service";
import { Document } from "../../../../core/models/document.model";
import { AuthService } from "../../../../core/services/auth.service";

@Component({
  selector: "app-document-list",
  templateUrl: "./document-list.component.html",
  styleUrls: ["./document-list.component.scss"],
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  displayedColumns: string[] = [
    "title",
    "description",
    "fileType",
    "createdAt",
    "actions",
  ];

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: (documents) => {
        this.documents = documents;
      },
      error: (error) => {
        console.error("Error loading documents:", error);
      },
    });
  }

  deleteDocument(id: number): void {
    if (confirm("Are you sure you want to delete this document?")) {
      this.documentService.deleteDocument(id).subscribe({
        next: () => this.loadDocuments(),
        error: (error) => {
          console.error("Error deleting document:", error);
        },
      });
    }
  }

  canEdit(): boolean {
    return (
      this.authService.hasRole("admin") || this.authService.hasRole("editor")
    );
  }

  canDelete(): boolean {
    return this.authService.hasRole("admin");
  }
}
