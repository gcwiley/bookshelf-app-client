import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// rxjs
import { catchError, of, finalize, first } from 'rxjs';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// auth service
import { AuthService } from '../../services/auth.service';

// constants
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

const ERROR_MESSAGES = {
  UNKNOWN_ERROR: 'An unexpected error occurred during Google Sign In.',
} as const;

@Component({
  selector: 'app-signin',
  templateUrl: './signin-page.html',
  styleUrl: './signin-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class SignInPage implements OnInit {
  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly year = new Date().getFullYear();

  // inject dependencies
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  public ngOnInit(): void {
    // redirect to home if user is already authenticated
    this.authService.user$.pipe(
      first(),
    ).subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/');
      }
    });
  }

  public onSignInWithGoogle(): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService
      .signInWithGoogle()
      .pipe(
        catchError((error) => {
          this.errorMessage.set(error.message);
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.router.navigateByUrl('/');
          } else if (this.errorMessage()) {
            this.snackBar.open(this.errorMessage()!, 'Close', {
              duration: SNACK_BAR_DURATION_MS,
            });
          }
        },
        error: () => {
          this.snackBar.open(ERROR_MESSAGES.UNKNOWN_ERROR, 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
        },
      });
  }
}
