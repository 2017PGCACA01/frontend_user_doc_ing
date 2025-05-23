import { TestBed } from "@angular/core/testing";
import { IngestionService } from "./ingestion.service";
import { ApiService } from "./api.service";
import { of } from "rxjs";
import { Ingestion, IngestionStatus } from "../models/ingestion.model";

describe("IngestionService", () => {
  let service: IngestionService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockIngestion: Ingestion = {
    id: 1,
    document_id: 2,
    status: "COMPLETED" as IngestionStatus,
    started_at: "2024-01-01T10:00:00Z",
    completed_at: "2024-01-01T10:10:00Z",
    error_message: null,
    summary: "Test summary",
  };

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj("ApiService", ["get", "post"]);

    TestBed.configureTestingModule({
      providers: [
        IngestionService,
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    service = TestBed.inject(IngestionService);
  });

  it("should fetch all ingestions", () => {
    apiServiceSpy.get.and.returnValue(of([mockIngestion]));

    service.getIngestions().subscribe((ingestions) => {
      expect(ingestions.length).toBe(1);
      expect(ingestions[0].id).toBe(1);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/ingestion/");
  });

  it("should fetch a single ingestion by ID", () => {
    apiServiceSpy.get.and.returnValue(of(mockIngestion));

    service.getIngestion(1).subscribe((ingestion) => {
      expect(ingestion).toEqual(mockIngestion);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/ingestion/1");
  });

  it("should trigger an ingestion", () => {
    apiServiceSpy.post.and.returnValue(of(mockIngestion));

    service.triggerIngestion(2).subscribe((ingestion) => {
      expect(ingestion).toEqual(mockIngestion);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith("/api/ingestion/trigger", {
      document_id: 2,
    });
  });

  it("should fetch ingestion status", () => {
    apiServiceSpy.get.and.returnValue(of("PROCESSING" as IngestionStatus));

    service.getIngestionStatus(1).subscribe((status) => {
      expect(status).toBe("PROCESSING");
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/ingestion/1/status");
  });
});
