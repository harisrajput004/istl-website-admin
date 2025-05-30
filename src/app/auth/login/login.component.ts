import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  showPassword = false;
  submitted = false;
  isSubadmin = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      authId: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roleId: [1, Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleRole(event: Event): void {
    this.isSubadmin = (event.target as HTMLInputElement).checked;
    const roleId = this.isSubadmin ? 2 : 1;
    this.loginForm.get('roleId')?.setValue(roleId);
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const { authId, password, roleId } = this.loginForm.value;

    this.authService.login(authId!, password!, roleId!).subscribe({
      next: () => {
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 100);
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403 || error.status === 404) {
          this.errorMessage = 'Wrong username or password';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your connection.';
        } else {
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }
}
