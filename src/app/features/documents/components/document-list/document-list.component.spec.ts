import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { DocumentListComponent } from "./document-list.component";
import { DocumentService } from "../../../../core/services/document.service";
import { AuthService } from "../../../../core/services/auth.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { Document } from "../../../../core/models/document.model";
import { UserRole } from "../../../../core/models/user.model";

// Angular Material Modules
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("DocumentListComponent", () => {
  let component: DocumentListComponent;
  let fixture: ComponentFixture<DocumentListComponent>;
  let documentServiceSpy: jasmine.SpyObj<DocumentService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockDocuments: Document[] = [
    {
      id: 1,
      title: "Doc 1",
      description: "Description 1",
      file_type: "pdf",
      file_path: "/files/1.pdf",
      created_by: 1,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  ];

  beforeEach(async () => {
    documentServiceSpy = jasmine.createSpyObj("DocumentService", [
      "getDocuments",
      "deleteDocument",
    ]);
    authServiceSpy = jasmine.createSpyObj("AuthService", ["hasRole"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [DocumentListComponent],
      imports: [
        MatCardModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: DocumentService, useValue: documentServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentListComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should load documents on init", () => {
    documentServiceSpy.getDocuments.and.returnValue(of(mockDocuments));
    fixture.detectChanges(); // triggers ngOnInit
    expect(component.documents.length).toBe(1);
    expect(documentServiceSpy.getDocuments).toHaveBeenCalled();
  });

  it("should handle document load error", () => {
    spyOn(console, "error");
    documentServiceSpy.getDocuments.and.returnValue(
      throwError(() => new Error("Load failed"))
    );
    fixture.detectChanges();
    expect(console.error).toHaveBeenCalledWith(
      "Error loading documents:",
      jasmine.any(Error)
    );
  });

  it("should delete document after confirmation", fakeAsync(() => {
    spyOn(window, "confirm").and.returnValue(true);
    documentServiceSpy.getDocuments.and.returnValue(of([]));
    documentServiceSpy.deleteDocument.and.returnValue(of(void 0));

    component.deleteDocument(1);
    tick();

    expect(documentServiceSpy.deleteDocument).toHaveBeenCalledWith(1);
    expect(documentServiceSpy.getDocuments).toHaveBeenCalled();
  }));

  it("should not delete document if not confirmed", () => {
    spyOn(window, "confirm").and.returnValue(false);
    component.deleteDocument(1);
    expect(documentServiceSpy.deleteDocument).not.toHaveBeenCalled();
  });

  it("should handle delete error", fakeAsync(() => {
    spyOn(window, "confirm").and.returnValue(true);
    spyOn(console, "error");
    documentServiceSpy.deleteDocument.and.returnValue(
      throwError(() => new Error("Delete error"))
    );

    component.deleteDocument(1);
    tick();

    expect(console.error).toHaveBeenCalledWith(
      "Error deleting document:",
      jasmine.any(Error)
    );
  }));

  it("should return true for canEdit if role is admin or editor", () => {
    authServiceSpy.hasRole.withArgs("admin").and.returnValue(false);
    authServiceSpy.hasRole.withArgs("editor").and.returnValue(true);
    expect(component.canEdit()).toBeTrue();
  });

  it("should return false for canEdit if no roles match", () => {
    authServiceSpy.hasRole.and.returnValue(false);
    expect(component.canEdit()).toBeFalse();
  });

  it("should return true for canDelete if role is admin", () => {
    authServiceSpy.hasRole.withArgs("admin").and.returnValue(true);
    expect(component.canDelete()).toBeTrue();
  });

  it("should return false for canDelete if role is not admin", () => {
    authServiceSpy.hasRole.withArgs("admin").and.returnValue(false);
    expect(component.canDelete()).toBeFalse();
  });
});
