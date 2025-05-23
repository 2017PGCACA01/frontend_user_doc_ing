import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-ingestion-create',
  templateUrl: './ingestion-create.component.html',
  styleUrls: ['./ingestion-create.component.scss']
})
export class IngestionCreateComponent implements OnInit {
  createForm: FormGroup;
  isSubmitting = false;
  documents: { id: string; title: string; filename: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      documentId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.apiService
      .get<{ id: string; title: string; filename: string }[]>('/api/docs/')
      .subscribe({
        next: (data) => {
          this.documents = data;
        },
        error: (err) => {
          console.error('Failed to fetch documents:', err);
        },
      });
  }

  onSubmit(): void {
    if (this.createForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const docId = this.createForm.value.documentId;

      this.apiService.post(`/api/ingestion/${docId}/trigger`, {}).subscribe({
        next: () => {
          this.router.navigate(['/ingestions']);
        },
        error: (error) => {
          console.error('Error triggering ingestion:', error);
          this.isSubmitting = false;
        },
      });
    }
  }
}
