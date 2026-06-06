import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// rxjs
import { of, Observable, map, filter, switchMap, catchError } from 'rxjs';

// book service and interface
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book.interface';

@Component({
  selector: 'app-book-description',
  templateUrl: './book-description.html',
  styleUrl: './book-description.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, RouterModule],
})
export class BookDescription {
  // inject dependencies
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);

  public book$: Observable<Book | undefined> = this.route.paramMap.pipe(
    map((pm) => pm.get('id')),
    filter((id): id is string => !!id),
    switchMap((id) =>
      this.bookService.getBookById(id).pipe(
        catchError((error) => {
          console.error('Error fetching book:', error);
          return of(undefined);
        }),
      ),
    ),
  );
}
