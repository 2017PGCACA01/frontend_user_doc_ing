import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { IngestionListComponent } from "./ingestion-list.component";
import { ApiService } from "../../../../core/services/api.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import {
  Ingestion,
  IngestionStatus,
} from "../../../../core/models/ingestion.model";

import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

describe("IngestionListComponent", () => {
  let component: IngestionListComponent;
  let fixture: ComponentFixture<IngestionListComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockIngestions: Ingestion[] = [
    {
      id: 1,
      document_id: 1,
      status: IngestionStatus.COMPLETED,
      started_at: "2024-01-01T00:00:00Z",
      completed_at: "2024-01-01T01:00:00Z",
      summary: "",
      error_message: null,
    },
  ];

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj("ApiService", ["get"]);

    await TestBed.configureTestingModule({
      declarations: [IngestionListComponent],
      imports: [
        MatCardModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(IngestionListComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should load ingestions on init", fakeAsync(() => {
    apiServiceSpy.get.and.returnValue(of(mockIngestions));
    fixture.detectChanges();
    tick();

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/ingestion/");
    expect(component.ingestions.length).toBe(1);
    expect(component.ingestions[0].id).toBe(1);
  }));

  it("should handle error when loading ingestions fails", fakeAsync(() => {
    spyOn(console, "error");
    apiServiceSpy.get.and.returnValue(
      throwError(() => new Error("Load failed"))
    );
    fixture.detectChanges();
    tick();

    expect(console.error).toHaveBeenCalledWith(
      "Error loading ingestions:",
      jasmine.any(Error)
    );
  }));
});
