import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, finalize } from 'rxjs';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

// navbar
import { Navbar } from '../../components/navbar/navbar';

// services
import { AuthService } from '../../services/auth.service';

// constants
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.html',
  styleUrl: './user-profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    Navbar,
  ],
})
export class UserProfilePage {
  public readonly isLoading = signal(false);
  public readonly showDeleteConfirm = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  // user observable from AuthService
  public readonly user$ = this.authService.user$;

  public onSignOut(): void {
    this.isLoading.set(true);
    this.authService
      .signOutUser()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('You have successfully signed out.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
          this.router.navigateByUrl('/signin');
        },
        error: (error) => {
          console.error('Error signing out:', error);
          this.snackBar.open('Error signing out. Please try again.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
        },
      });
  }

  public confirmDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  public cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  public onDeleteAccount(): void {
    this.isLoading.set(true);
    this.authService
      .deleteAccount()
      .pipe(
        catchError((error) => {
          console.error('Error deleting account:', error);
          this.snackBar.open(
            error.message || 'Failed to delete account. Please try re-authenticating.',
            'Close',
            { duration: SNACK_BAR_DURATION_MS }
          );
          return of(null);
        }),
        finalize(() => {
          this.isLoading.set(false);
          this.showDeleteConfirm.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((response) => {
        if (response !== null) {
          this.snackBar.open('Your account has been permanently deleted.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
          this.router.navigateByUrl('/signin');
        }
      });
  }
}
