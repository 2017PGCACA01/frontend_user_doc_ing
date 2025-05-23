import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { ApiService } from "./api.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { User, UserRole } from "../models/user.model";
import { environment } from "../../../environments/environment";
import { of, throwError } from "rxjs";

describe("AuthService", () => {
  let service: AuthService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    email: "user@example.com",
    role: UserRole.ADMIN,
  };

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj("ApiService", ["get", "post"]);
    apiServiceSpy.get.and.returnValue(of(mockUser));

    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should login and store token and load user", () => {
    const token = "mock-token";
    apiServiceSpy.get.and.returnValue(of(mockUser));

    service.login("test@example.com", "password").subscribe((res) => {
      expect(res.access_token).toBe(token);
      expect(localStorage.getItem("token")).toBe(token);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/users/login`);
    expect(req.request.method).toBe("POST");
    req.flush({ access_token: token });

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/users/me");
  });

  it("should register a user", () => {
    apiServiceSpy.post.and.returnValue(of(mockUser));

    service
      .register("Test", "test@example.com", "pass1234", UserRole.ADMIN)
      .subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

    expect(apiServiceSpy.post).toHaveBeenCalledWith("/api/users/register", {
      email: "test@example.com",
      password: "pass1234",
      role: UserRole.ADMIN,
    });
  });

  it("should logout and clear token", () => {
    localStorage.setItem("token", "test-token");
    service.logout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/auth/login"]);
    service.currentUser$.subscribe((user) => {
      expect(user).toBeNull();
    });
  });

  it("should return true if authenticated", () => {
    localStorage.setItem("token", "test-token");
    expect(service.isAuthenticated()).toBeTrue();
  });

  it("should return false if not authenticated", () => {
    localStorage.removeItem("token");
    expect(service.isAuthenticated()).toBeFalse();
  });

  it("should return true if user has role", () => {
    (service as any).currentUserSubject.next(mockUser);
    expect(service.hasRole(UserRole.ADMIN)).toBeTrue();
  });

  it("should return false if user does not have role", () => {
    (service as any).currentUserSubject.next(mockUser);
    expect(service.hasRole(UserRole.VIEWER)).toBeFalse();
  });

  it("should handle login error and not store token", () => {
    spyOn(console, "error");

    service.login("invalid@example.com", "wrongpass").subscribe({
      next: () => fail("should not emit success"),
      error: () => {
        expect(console.error).toHaveBeenCalledWith(
          "Login API error:",
          jasmine.anything()
        );
        expect(localStorage.getItem("token")).toBeNull();
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/users/login`);
    req.flush(
      { message: "Invalid credentials" },
      { status: 401, statusText: "Unauthorized" }
    );
  });

  it("should logout if loadCurrentUser() fails", () => {
    spyOn(service, "logout").and.callThrough();
    routerSpy.navigate.and.stub();

    // simulate /me call failing
    apiServiceSpy.get.and.returnValue(
      throwError(() => new Error("Unauthorized"))
    );

    (service as any).loadCurrentUser();

    expect(service.logout).toHaveBeenCalled();
  });
});
