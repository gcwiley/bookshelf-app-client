import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

// rxjs
import { map, of, catchError } from 'rxjs';

// book service
import { BookService } from '../services/book.service';

const DEFAULT_TITLE = 'Book Details | Portfolio';

export const bookTitleResolver: ResolveFn<string> = (route) => {
  const bookService = inject(BookService);
  const id = route.paramMap.get('id');

  if (!id) {
    return of(DEFAULT_TITLE);
  }

  return bookService.getBookById(id).pipe(
    map((book) => (book ? `${book.title} | Portfolio` : DEFAULT_TITLE)),
    catchError(() => of(DEFAULT_TITLE)),
  );
};
