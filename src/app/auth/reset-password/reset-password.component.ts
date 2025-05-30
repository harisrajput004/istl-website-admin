import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../shared/success-dialog/success-dialog.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {

    this.resetForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';

    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.resetForm.invalid || !this.token) {
      return;
    }

    this.isSubmitting = true;
    const password = this.resetForm.value.password;

    this.authService.resetPassword(password, this.token)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (response) => {
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: {
              title: 'Password Reset Successful',
              message: 'Your password has been reset successfully.'
            }
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/login'], {
              queryParams: { passwordReset: 'success' }
            });
          });
        },
        error: (error) => {
          console.error('Password reset failed', error);
          this.errorMessage = error.error?.message ||
            'Password reset failed. Please try again.';
        }
      });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}