import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// rxjs
import { catchError, of } from 'rxjs';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

// auth service
import { AuthService } from '../../services/auth.service';

// constants
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class SignUpPage implements OnInit {
  public readonly isLoading = signal(false);
  public readonly showPassword = signal(false);
  public readonly showConfirmPassword = signal(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly year = new Date().getFullYear();

  public signupForm!: FormGroup;

  // inject dependencies
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  public ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signupForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
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

  public onSubmitSignUp(): void {
    this.errorMessage.set(null);

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.signupForm.value;

    this.authService
      .signUpWithEmailAndPassword(email, password)
      .pipe(
        catchError((error) => {
          this.errorMessage.set(error.message);
          return of(null);
        }),
      )
      .subscribe({
        next: (user) => {
          this.isLoading.set(false);
          if (user) {
            this.snackBar.open('Registration successful! Welcome.', 'Close', {
              duration: SNACK_BAR_DURATION_MS,
            });
            this.router.navigateByUrl('/');
          } else if (this.errorMessage()) {
            this.snackBar.open(this.errorMessage()!, 'Close', {
              duration: SNACK_BAR_DURATION_MS,
            });
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.snackBar.open('An unexpected error occurred during signup.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
        },
      });
  }

  public get formControls(): Record<string, AbstractControl> {
    return this.signupForm.controls;
  }
}
