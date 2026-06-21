import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

// rxjs
import { of, first, switchMap, finalize } from 'rxjs';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// book service and interfaces
import { BookService } from '../../services/book.service';
import { BookInput } from '../../types/book.interface';

// snackbar
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.html',
  styleUrl: './book-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
  ],
})
export class BookForm implements OnInit {
  public mode = signal<'create' | 'edit'>('create');
  public isSaving = signal(false);
  public submitted = signal(false);
  private id: string | null = null;

  // inject dependencies
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);
  private readonly snackBar = inject(MatSnackBar);

  // book form
  bookForm = this.formBuilder.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    publisher: ['', Validators.required],
    isbn: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?:97[89]-?)?\d{1,5}-?\d{1,7}-?\d{1,7}-?[\dX]$/i),
      ],
    ],
    publicationDate: [null as Date | null, Validators.required],
    pageCount: ['', [Validators.required, Validators.min(1)]],
    genre: ['', Validators.required],
    isFavorite: [false, Validators.required],
    summary: ['', Validators.required],
    language: ['', Validators.required],
    publishedFormat: ['', Validators.required],
    tags: ['', Validators.required],
    rating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
    coverImageUrl: [''],
  });

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        first(),
        switchMap((paramMap: ParamMap) => {
          if (paramMap.has('id')) {
            this.mode.set('edit');
            this.id = paramMap.get('id');
            return this.bookService.getBookById(this.id!);
          } else {
            this.mode.set('create');
            return of(undefined);
          }
        }),
      )
      .subscribe({
        next: (book) => {
          if (book) {
            this.bookForm.patchValue({
              // need to fix the author form control to not be an object!
              title: book.title ?? '',
              author:
                typeof book.author === 'string'
                  ? book.author
                  : (book.author?.name ?? ''),
              isbn: book.isbn ?? '',
              publicationDate: book.publicationDate
                ? new Date(book.publicationDate)
                : null,
              pageCount: book.pageCount ?? '',
              genre: book.genre ?? '',
              isFavorite: book.isFavorite ?? false,
              summary: book.summary ?? '',
              language: book.language ?? '',
              publishedFormat: book.publishedFormat ?? '',
              tags: book.tags ? book.tags.join(', ') : '',
              rating: book.rating ?? '',
              publisher: book.publisher ?? '',
              coverImageUrl: book.coverImageUrl ?? '',
            });
          }
        },
        error: (error) => {
          console.error('Failed to load book.', error);
          this.snackBar.open('Error loading book.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
        },
      });
  }

  // saves a new book
  public onSaveBook(): void {
    this.submitted.set(true);
    if (!this.bookForm.valid) {
      // mark all controls touches to show errors
      Object.values(this.bookForm.controls).forEach((c) => c.markAsTouched());
      return;
    }

    const rawValue = this.bookForm.value;
    const formValue = {
      title: rawValue.title ?? '',
      author: rawValue.author ?? '',
      isbn: rawValue.isbn ?? '',
      publicationDate: rawValue.publicationDate
        ? (rawValue.publicationDate as Date).toISOString()
        : '',
      pageCount: rawValue.pageCount ?? '',
      genre: rawValue.genre ?? '',
      isFavorite: !!rawValue.isFavorite,
      summary: rawValue.summary ?? '',
      language: rawValue.language ?? '',
      publishedFormat: rawValue.publishedFormat || null,
      tags: rawValue.tags
        ? rawValue.tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
        : [],
      rating: rawValue.rating ?? '',
      publisher: rawValue.publisher ?? '',
      coverImageUrl: rawValue.coverImageUrl ?? '',
    } as unknown as BookInput;

    this.isSaving.set(true);

    if (this.mode() === 'create') {
      this.bookService
        .addBook(formValue)
        .pipe(
          first(),
          finalize(() => this.isSaving.set(false)),
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Book added.', 'Close', {
              duration: SNACK_BAR_DURATION_MS,
            });
            this.router.navigateByUrl('/');
          },
          error: (error) => {
            console.error(error);
            this.snackBar.open('Error adding Book.', 'Close', {
              duration: SNACK_BAR_DURATION_MS,
            });
          },
        });
    } else {
      this.bookService
        .updateBookById(this.id!, formValue)
        .pipe(
          first(),
          finalize(() => this.isSaving.set(false)),
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Book updated successfully', 'Close', {
              duration: SNACK_BAR_DURATION_MS,
            });
            this.router.navigate(['/books', this.id]);
          },
          error: (error) => {
            console.error(error);
            this.snackBar.open('Error updating book', 'Close', {
              duration: SNACK_BAR_DURATION_MS,
            });
          },
        });
    }
  }

  // navigates away from the form without saving
  public onCancel(): void {
    const destination = this.mode() === 'edit' ? `/books/${this.id}` : '/books';
    this.router.navigateByUrl(destination);
  }
}
