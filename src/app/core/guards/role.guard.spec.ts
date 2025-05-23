import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RoleGuard } from "./role.guard";
import { AuthService } from "../services/auth.service";
import { ActivatedRouteSnapshot } from "@angular/router";

describe("RoleGuard", () => {
  let guard: RoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeSnapshot: ActivatedRouteSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj("AuthService", ["hasRole"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(RoleGuard);
    routeSnapshot = new ActivatedRouteSnapshot();
  });

  it("should allow access if user has required role", () => {
    routeSnapshot.data = { role: "admin" };
    authServiceSpy.hasRole.and.returnValue(true);

    const result = guard.canActivate(routeSnapshot);

    expect(result).toBeTrue();
    expect(authServiceSpy.hasRole).toHaveBeenCalledWith("admin");
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it("should redirect to /documents if user lacks required role", () => {
    routeSnapshot.data = { role: "admin" };
    authServiceSpy.hasRole.and.returnValue(false);

    const result = guard.canActivate(routeSnapshot);

    expect(result).toBeFalse();
    expect(authServiceSpy.hasRole).toHaveBeenCalledWith("admin");
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/documents"]);
  });
});
