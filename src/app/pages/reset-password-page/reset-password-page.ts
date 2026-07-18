import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// auth service
import { AuthService } from '../../services/auth.service';

// constants
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class ResetPasswordPage implements OnInit {
  public readonly isLoading = signal(false);
  public readonly showPassword = signal(false);
  public readonly showConfirmPassword = signal(false);
  public readonly submitted = signal(false);
  public readonly invalidCode = signal(false);
  public readonly year = new Date().getFullYear();

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  public resetPasswordForm!: FormGroup;
  private oobCode: string | null = null;

  public ngOnInit(): void {
    // Retrieve the 'oobCode' parameter sent by Firebase in the email link
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode');
    
    if (!this.oobCode) {
      this.invalidCode.set(true);
      this.snackBar.open('Invalid or missing password reset link.', 'Close', {
        duration: SNACK_BAR_DURATION_MS,
      });
    }

    this.initializeForm();
  }

  private initializeForm(): void {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  public toggleShowPassword(): void {
    this.showPassword.update((show) => !show);
  }

  public toggleShowConfirmPassword(): void {
    this.showConfirmPassword.update((show) => !show);
  }

  public onSubmit(): void {
    if (this.resetPasswordForm.invalid || !this.oobCode) return;

    this.isLoading.set(true);
    const { password } = this.resetPasswordForm.value;

    this.authService
      .confirmPasswordReset(this.oobCode, password)
      .pipe(
        catchError((error) => {
          this.snackBar.open(error.message || 'Failed to reset password.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        if (response !== null) {
          this.submitted.set(true);
          this.snackBar.open('Password reset successful! You can now sign in.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
        }
      });
  }

  public get formControls(): Record<string, AbstractControl> {
    return this.resetPasswordForm.controls;
  }
}
