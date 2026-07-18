import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// rxjs
import { of, Observable, map, filter, switchMap, catchError } from 'rxjs';

// angular material
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

// book service and interface
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book.interface';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
})
export class BookDetails {
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
          return of(undefined); // signal not found/error to template
        })
      )
    )
  );

  // resolves the display name for the author
  public getAuthorName(book: Book | undefined): string {
    if (!book) return '';
    return typeof book.author === 'string'
      ? book.author
      : (book.author?.name ?? 'Unknown Author');
  }
}
