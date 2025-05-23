import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { IngestionCreateComponent } from "./ingestion-create.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ApiService } from "../../../../core/services/api.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";

import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("IngestionCreateComponent", () => {
  let component: IngestionCreateComponent;
  let fixture: ComponentFixture<IngestionCreateComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockDocuments = [
    { id: "1", title: "Doc 1", filename: "doc1.pdf" },
    { id: "2", title: "Doc 2", filename: "doc2.pdf" },
  ];

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj("ApiService", ["get", "post"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [IngestionCreateComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IngestionCreateComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form and fetch documents", fakeAsync(() => {
    apiServiceSpy.get.and.returnValue(of(mockDocuments));
    fixture.detectChanges(); // triggers ngOnInit
    tick();

    expect(component.documents.length).toBe(2);
    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/docs/");
  }));

  it("should handle error if document fetch fails", fakeAsync(() => {
    spyOn(console, "error");
    apiServiceSpy.get.and.returnValue(
      throwError(() => new Error("Fetch error"))
    );
    fixture.detectChanges();
    tick();

    expect(console.error).toHaveBeenCalledWith(
      "Failed to fetch documents:",
      jasmine.any(Error)
    );
  }));

  it("should trigger ingestion and navigate on success", fakeAsync(() => {
    component.createForm.setValue({ documentId: "1" });
    component.isSubmitting = false;
    apiServiceSpy.post.and.returnValue(of({}));

    component.onSubmit();
    tick();

    expect(apiServiceSpy.post).toHaveBeenCalledWith(
      "/api/ingestion/1/trigger",
      {}
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/ingestions"]);
    expect(component.isSubmitting).toBeTrue();
  }));

  it("should handle error on ingestion failure", fakeAsync(() => {
    spyOn(console, "error");
    component.createForm.setValue({ documentId: "1" });
    component.isSubmitting = false;
    apiServiceSpy.post.and.returnValue(
      throwError(() => new Error("Trigger error"))
    );

    component.onSubmit();
    tick();

    expect(console.error).toHaveBeenCalledWith(
      "Error triggering ingestion:",
      jasmine.any(Error)
    );
    expect(component.isSubmitting).toBeFalse();
  }));

  it("should not submit if form is invalid or already submitting", () => {
    component.createForm.setValue({ documentId: "" });
    component.isSubmitting = false;
    component.onSubmit();
    expect(apiServiceSpy.post).not.toHaveBeenCalled();

    component.createForm.setValue({ documentId: "1" });
    component.isSubmitting = true;
    component.onSubmit();
    expect(apiServiceSpy.post).not.toHaveBeenCalled();
  });
});
