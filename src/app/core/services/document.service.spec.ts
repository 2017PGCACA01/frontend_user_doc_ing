import { TestBed } from "@angular/core/testing";
import { DocumentService } from "./document.service";
import { ApiService } from "./api.service";
import { of } from "rxjs";
import { Document } from "../models/document.model";

describe("DocumentService", () => {
  let service: DocumentService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockDocument: Document = {
    id: 1,
    title: "Test Doc",
    description: "Desc",
    file_type: "pdf",
    file_path: "/files/test.pdf",
    created_by: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj("ApiService", [
      "get",
      "post",
      "put",
      "delete",
      "uploadFile",
      "putFile",
    ]);

    TestBed.configureTestingModule({
      providers: [
        DocumentService,
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    service = TestBed.inject(DocumentService);
  });

  it("should fetch documents", () => {
    apiServiceSpy.get.and.returnValue(of([mockDocument]));

    service.getDocuments().subscribe((docs) => {
      expect(docs.length).toBe(1);
      expect(docs[0].title).toBe("Test Doc");
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/docs/");
  });

  it("should fetch single document", () => {
    apiServiceSpy.get.and.returnValue(of(mockDocument));

    service.getDocument(1).subscribe((doc) => {
      expect(doc).toEqual(mockDocument);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/docs/1");
  });

  it("should create document", () => {
    const formData = new FormData();
    formData.append("title", "Test");
    apiServiceSpy.post.and.returnValue(of(mockDocument));

    service.createDocument(formData).subscribe((doc) => {
      expect(doc).toEqual(mockDocument);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith(
      "/api/docs/upload",
      formData
    );
  });

  it("should update document with file", () => {
    const file = new File(["content"], "test.pdf");
    const data = {
      title: "Updated",
      description: "Updated Desc",
      file_type: "pdf",
    };
    apiServiceSpy.putFile.and.returnValue(of(mockDocument));

    service.updateDocument(1, data, file).subscribe((doc) => {
      expect(doc).toEqual(mockDocument);
    });

    expect(apiServiceSpy.putFile).toHaveBeenCalledWith(
      "/api/docs/1",
      file,
      data
    );
  });

  it("should update document without file", () => {
    const data = {
      title: "Updated",
      description: "Updated Desc",
      file_type: "pdf",
    };
    apiServiceSpy.putFile.and.returnValue(of(mockDocument));

    service.updateDocument(1, data, null).subscribe((doc) => {
      expect(doc).toEqual(mockDocument);
    });

    expect(apiServiceSpy.putFile).toHaveBeenCalledWith(
      "/api/docs/1",
      null,
      data
    );
  });

  it("should delete document", () => {
    apiServiceSpy.delete.and.returnValue(of(void 0));

    service.deleteDocument(1).subscribe((res) => {
      expect(res).toBeUndefined();
    });

    expect(apiServiceSpy.delete).toHaveBeenCalledWith("/api/docs/1");
  });

  it("should download document", () => {
    const blob = new Blob(["test"], { type: "application/pdf" });
    apiServiceSpy.get.and.returnValue(of(blob));

    service.downloadDocument(1).subscribe((result) => {
      expect(result).toEqual(blob);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/docs/1/download");
  });

  it("should upload document with metadata", () => {
    const file = new File(["content"], "file.pdf");
    const metadata = {
      title: "Doc",
      description: "Meta",
      file_type: "pdf",
    };
    apiServiceSpy.uploadFile.and.returnValue(of(mockDocument));

    service.uploadDocument(file, metadata).subscribe((res) => {
      expect(res).toEqual(mockDocument);
    });

    expect(apiServiceSpy.uploadFile).toHaveBeenCalledWith(
      "/api/docs/upload",
      file,
      metadata
    );
  });
});
