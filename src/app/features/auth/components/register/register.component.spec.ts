import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { RegisterComponent } from "./register.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { User, UserRole } from "../../../../core/models/user.model";

// Angular Material Modules
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("RegisterComponent", () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    role: UserRole.EDITOR,
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj("AuthService", ["register"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the register component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with default values", () => {
    expect(component.registerForm.get("fullName")?.value).toBe("");
    expect(component.registerForm.get("role")?.value).toBe(UserRole.VIEWER);
  });

  it("should require fullName, email, password and role", () => {
    const form = component.registerForm;
    form.setValue({
      fullName: "",
      email: "",
      password: "",
      role: null,
    });
    expect(form.valid).toBeFalse();

    form.get("email")?.setValue("invalid");
    expect(form.get("email")?.valid).toBeFalse();

    form.setValue({
      fullName: "Test User",
      email: "user@example.com",
      password: "password123",
      role: UserRole.ADMIN,
    });
    expect(form.valid).toBeTrue();
  });

  it("should call register and navigate on success", fakeAsync(() => {
    authServiceSpy.register.and.returnValue(of(mockUser));
    component.registerForm.setValue({
      fullName: "Test User",
      email: "test@example.com",
      password: "securepass",
      role: UserRole.EDITOR,
    });

    component.onSubmit();
    tick();

    expect(authServiceSpy.register).toHaveBeenCalledWith(
      "Test User",
      "test@example.com",
      "securepass",
      UserRole.EDITOR
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/auth/login"]);
  }));

  it("should handle registration error and not navigate", fakeAsync(() => {
    spyOn(console, "error");
    authServiceSpy.register.and.returnValue(
      throwError(() => new Error("Email exists"))
    );

    component.registerForm.setValue({
      fullName: "Fail User",
      email: "fail@example.com",
      password: "badpass123",
      role: UserRole.ADMIN,
    });

    component.onSubmit();
    tick();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "Registration failed:",
      jasmine.any(Error)
    );
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
