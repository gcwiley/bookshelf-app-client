import {
  Directive,
  HostListener,
  output,
  input,
  inject,
  DestroyRef,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// rxjs
import { filter, switchMap, catchError, finalize, EMPTY } from 'rxjs';

// angular material
import { MatSnackBar } from '@angular/material/snack-bar';

// book service
import { BookService } from '../services/book.service';

import {
  CustomConfirmDialog,
  CustomConfirmDialogService,
} from '../services/custom-confirm-dialog.service';

// snackbar duration
import { SNACK_BAR_DURATION_MS } from '../constants/ui.constants';

@Directive({
  selector: '[appBookDelete]',
})
export class BookDeleteDirective {
  public id = input.required<string>({ alias: 'appBookDelete' });

  public deleted = output<string>();

  private readonly bookService = inject(BookService);
  private readonly confirm = inject(CustomConfirmDialogService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  private readonly isDeleting = signal(false);

  @HostListener('click')
  public onClick(): void {
    if (this.isDeleting()) return;
    this.isDeleting.set(true);

    this.confirm
      .openCustomConfirmDialog(CustomConfirmDialog.Delete)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((confirmed) => !!confirmed),
        switchMap(() => this.bookService.deleteBookById(this.id())),
        catchError((error) => {
          console.error('Error deleting book:', error);
          this.snackBar.open('Unable to delete book.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
          return EMPTY;
        }),
        finalize(() => this.isDeleting.set(false)),
      )
      .subscribe(() => {
        this.deleted.emit(this.id());
        this.snackBar.open('Book successfully deleted.', 'Close', {
          duration: SNACK_BAR_DURATION_MS,
        });
      });
  }
}
