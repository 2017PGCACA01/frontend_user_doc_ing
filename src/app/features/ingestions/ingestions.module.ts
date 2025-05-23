import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { IngestionListComponent } from './components/ingestion-list/ingestion-list.component';
import { IngestionCreateComponent } from './components/ingestion-create/ingestion-create.component';
import { IngestionViewComponent } from './components/ingestion-view/ingestion-view.component';

const routes: Routes = [
  { path: '', component: IngestionListComponent },
  { path: 'create', component: IngestionCreateComponent },
  { path: ':id', component: IngestionViewComponent }
];

@NgModule({
  declarations: [
    IngestionListComponent,
    IngestionCreateComponent,
    IngestionViewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule
  ]
})
export class IngestionsModule { } 