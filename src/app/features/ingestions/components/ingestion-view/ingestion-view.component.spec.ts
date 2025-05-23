import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { IngestionViewComponent } from "./ingestion-view.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../../core/services/api.service";
import { of, throwError } from "rxjs";
import {
  Ingestion,
  IngestionStatus,
} from "../../../../core/models/ingestion.model";

import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

describe("IngestionViewComponent", () => {
  let component: IngestionViewComponent;
  let fixture: ComponentFixture<IngestionViewComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockIngestion: Ingestion = {
    id: 1,
    document_id: 101,
    status: IngestionStatus.COMPLETED,
    started_at: "2024-01-01T00:00:00Z",
    completed_at: "2024-01-01T01:00:00Z",
    summary: "Test summary",
    error_message: null,
  };

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj("ApiService", ["get"]);

    await TestBed.configureTestingModule({
      declarations: [IngestionViewComponent],
      imports: [
        MatCardModule,
        MatTableModule,
        MatIconModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: "1" },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IngestionViewComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should load ingestion on init", fakeAsync(() => {
    apiServiceSpy.get.and.returnValue(of(mockIngestion));
    fixture.detectChanges();
    tick();

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/ingestion/1/status");
    expect(component.ingestion?.id).toBe(1);
  }));

  it("should start polling if ingestion is PROCESSING", fakeAsync(() => {
    const processingIngestion: Ingestion = {
      ...mockIngestion,
      status: IngestionStatus.PROCESSING,
    };

    const completedIngestion: Ingestion = {
      ...mockIngestion,
      status: IngestionStatus.COMPLETED,
    };

    const getSpy = apiServiceSpy.get.and.returnValues(
      of(processingIngestion),
      of(completedIngestion)
    );

    fixture.detectChanges();
    tick(5000);

    expect(getSpy.calls.count()).toBe(2);
    expect(component.ingestion?.status).toBe(IngestionStatus.COMPLETED);
  }));

  it("should handle error on initial ingestion load", fakeAsync(() => {
    spyOn(console, "error");
    apiServiceSpy.get.and.returnValue(
      throwError(() => new Error("Load error"))
    );

    fixture.detectChanges();
    tick();

    expect(console.error).toHaveBeenCalledWith(
      "Error loading ingestion:",
      jasmine.any(Error)
    );
  }));

  it("should stop polling on error", fakeAsync(() => {
    spyOn(console, "error");
    const processingIngestion: Ingestion = {
      ...mockIngestion,
      status: IngestionStatus.PROCESSING,
    };

    apiServiceSpy.get.and.returnValues(
      of(processingIngestion),
      throwError(() => new Error("Polling error"))
    );

    fixture.detectChanges();
    tick(5000);

    expect(console.error).toHaveBeenCalledWith(
      "Error polling ingestion status:",
      jasmine.any(Error)
    );
  }));
});
