import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { DocumentUploadComponent } from "./document-upload.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DocumentService } from "../../../../core/services/document.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { Document } from "../../../../core/models/document.model";

import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("DocumentUploadComponent", () => {
  let component: DocumentUploadComponent;
  let fixture: ComponentFixture<DocumentUploadComponent>;
  let documentServiceSpy: jasmine.SpyObj<DocumentService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockDocument: Document = {
    id: 1,
    title: "Mock Title",
    description: "Mock Description",
    file_type: "pdf",
    file_path: "/mock/path.pdf",
    created_by: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  beforeEach(async () => {
    documentServiceSpy = jasmine.createSpyObj("DocumentService", [
      "uploadDocument",
    ]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [DocumentUploadComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [
        { provide: DocumentService, useValue: documentServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with empty form values", () => {
    const form = component.uploadForm;
    expect(form.get("title")?.value).toBe("");
    expect(form.get("fileType")?.value).toBe("");
    expect(form.valid).toBeFalse();
  });

  it("should select a file when onFileSelected is called", () => {
    const mockFile = new File(["content"], "file.pdf", {
      type: "application/pdf",
    });
    const event = {
      target: {
        files: [mockFile],
      },
    } as unknown as Event;

    component.onFileSelected(event);
    expect(component.selectedFile).toBe(mockFile);
  });

  it("should upload document and navigate on success", fakeAsync(() => {
    const mockFile = new File(["content"], "file.pdf", {
      type: "application/pdf",
    });
    component.selectedFile = mockFile;

    component.uploadForm.setValue({
      title: "Sample",
      description: "Description",
      fileType: "pdf",
    });

    documentServiceSpy.uploadDocument.and.returnValue(of(mockDocument));

    component.onSubmit();
    tick();

    expect(documentServiceSpy.uploadDocument).toHaveBeenCalledWith(mockFile, {
      title: "Sample",
      description: "Description",
      file_type: "pdf",
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith(["/documents"]);
  }));

  it("should handle upload error", fakeAsync(() => {
    spyOn(console, "error");
    const mockFile = new File(["content"], "file.pdf", {
      type: "application/pdf",
    });
    component.selectedFile = mockFile;

    component.uploadForm.setValue({
      title: "Fail File",
      description: "Fail",
      fileType: "pdf",
    });

    documentServiceSpy.uploadDocument.and.returnValue(
      throwError(() => new Error("Upload failed"))
    );

    component.onSubmit();
    tick();

    expect(console.error).toHaveBeenCalledWith(
      "Error uploading document:",
      jasmine.any(Error)
    );
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
