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
import { filter, switchMap, catchError, finalize, EMPTY } from 'rxjs';

// angular material
import { MatSnackBar } from '@angular/material/snack-bar';

// book service
import { BookService } from '../services/book.service';

// confirm dialog
import {
  CustomConfirmDialog,
  CustomConfirmDialogService,
} from '../services/custom-confirm-dialog.service';

// snackbar duration

