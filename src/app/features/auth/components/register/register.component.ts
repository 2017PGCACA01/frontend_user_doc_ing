import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../../core/services/auth.service";
import { UserRole } from "../../../../core/models/user.model";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  registerForm: FormGroup;
  UserRole = UserRole;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      role: [UserRole.VIEWER, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { fullName, email, password, role } = this.registerForm.value;
      this.authService.register(fullName, email, password, role).subscribe({
        next: () => {
          this.router.navigate(["/auth/login"]);
        },
        error: (error) => {
          console.error("Registration failed:", error);
        },
      });
    }
  }
}
