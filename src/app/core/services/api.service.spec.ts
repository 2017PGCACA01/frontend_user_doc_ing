import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/environment";

describe("ApiService", () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.setItem("token", "mock-token");
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it("should perform GET request", () => {
    const mockData = { id: 1 };
    service.get<any>("/test").subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/test`);
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.get("Authorization")).toBe("Bearer mock-token");
    req.flush(mockData);
  });

  it("should perform POST request", () => {
    const payload = { name: "test" };
    const response = { id: 1 };
    service.post<any>("/test", payload).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${baseUrl}/test`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(payload);
    req.flush(response);
  });

  it("should perform PUT request", () => {
    const payload = { name: "updated" };
    const response = { success: true };
    service.put<any>("/test", payload).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${baseUrl}/test`);
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(payload);
    req.flush(response);
  });

  it("should perform DELETE request", () => {
    service.delete<any>("/test").subscribe((data) => {
      expect(data).toEqual({ deleted: true });
    });

    const req = httpMock.expectOne(`${baseUrl}/test`);
    expect(req.request.method).toBe("DELETE");
    req.flush({ deleted: true });
  });

  it("should upload file with metadata via POST", () => {
    const file = new File(["test"], "test.txt");
    const metadata = { title: "doc" };

    service.uploadFile("/upload", file, metadata).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/upload`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body instanceof FormData).toBeTrue();

    const formData = req.request.body as FormData;
    expect(formData.has("file")).toBeTrue();
    expect(formData.get("title")).toBe("doc");
  });

  it("should PUT file and metadata via FormData (with file)", () => {
    const file = new File(["data"], "file.txt");
    const metadata = { title: "doc" };

    service.putFile("/update", file, metadata).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/update`);
    expect(req.request.method).toBe("PUT");

    const formData = req.request.body as FormData;
    expect(formData.has("file")).toBeTrue();
    expect(formData.get("title")).toBe("doc");
  });

  it("should PUT only metadata if file is null", () => {
    const metadata = { title: "doc" };

    service.putFile("/update", null, metadata).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/update`);
    expect(req.request.method).toBe("PUT");

    const formData = req.request.body as FormData;
    expect(formData.has("file")).toBeFalse();
    expect(formData.get("title")).toBe("doc");
  });
});
