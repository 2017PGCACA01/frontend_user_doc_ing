import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { AuthService } from "./core/services/auth.service";
import { Router } from "@angular/router";
import { of } from "rxjs";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj(
      "AuthService",
      ["logout", "hasRole"],
      {
        currentUser$: of({ email: "admin@example.com", role: "admin", id: 1 }),
      }
    );

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatCardModule,
        MatMenuModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it("should create the AppComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should call logout on AuthService when onLogout is triggered", () => {
    component.onLogout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it("should return true if user has admin role", () => {
    authServiceSpy.hasRole.and.returnValue(true);
    expect(component.isAdmin()).toBeTrue();
    expect(authServiceSpy.hasRole).toHaveBeenCalledWith("admin");
  });

  it("should return false if user does not have admin role", () => {
    authServiceSpy.hasRole.and.returnValue(false);
    expect(component.isAdmin()).toBeFalse();
    expect(authServiceSpy.hasRole).toHaveBeenCalledWith("admin");
  });
});
