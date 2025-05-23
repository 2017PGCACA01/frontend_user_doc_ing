import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DocumentService } from "../../../../core/services/document.service";

@Component({
  selector: "app-document-upload",
  templateUrl: "./document-upload.component.html",
  styleUrls: ["./document-upload.component.scss"],
})
export class DocumentUploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ["", Validators.required],
      description: [""],
      fileType: ["", Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      const { title, description, fileType } = this.uploadForm.value;

      this.documentService
        .uploadDocument(this.selectedFile, {
          title,
          description,
          file_type: fileType,
        })
        .subscribe({
          next: () => {
            this.router.navigate(["/documents"]);
          },
          error: (error) => {
            console.error("Error uploading document:", error);
          },
        });
    }
  }
}
