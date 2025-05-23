import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";

// Material modules
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj("AuthService", ["login"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule, // Required by Material components
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the login component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with empty fields", () => {
    const form = component.loginForm;
    expect(form.get("email")?.value).toBe("");
    expect(form.get("password")?.value).toBe("");
  });

  it("should make email and password required", () => {
    const form = component.loginForm;
    form.get("email")?.setValue("");
    form.get("password")?.setValue("");
    expect(form.valid).toBeFalse();

    form.get("email")?.setValue("invalid");
    expect(form.get("email")?.valid).toBeFalse();

    form.get("email")?.setValue("test@example.com");
    form.get("password")?.setValue("pass123");
    expect(form.valid).toBeTrue();
  });

  it("should call login and navigate on success", fakeAsync(() => {
    authServiceSpy.login.and.returnValue(of({ access_token: "fake-token" }));
    component.loginForm.setValue({
      email: "user@example.com",
      password: "password123",
    });

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith(
      "user@example.com",
      "password123"
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/documents"]);
  }));

  it("should handle login error and not navigate", fakeAsync(() => {
    spyOn(console, "error");
    authServiceSpy.login.and.returnValue(
      throwError(() => new Error("Invalid credentials"))
    );

    component.loginForm.setValue({
      email: "fail@example.com",
      password: "wrongpass",
    });

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "Login failed:",
      jasmine.any(Error)
    );
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
