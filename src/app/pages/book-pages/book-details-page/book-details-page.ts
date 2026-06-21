import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// rxjs
import { of, Observable, map, filter, switchMap, catchError } from 'rxjs';

// angular material
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// book service, interface
import { BookService } from '../../../services/book.service';
import { Book } from '../../../types/book.interface';

@Component({
  selector: 'app-book-details-page',
  templateUrl: './book-details-page.html',
  styleUrl: './book-details-page.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class BookDetailsPage {
  // inject dependencies
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);

  public books$: Observable<Book | undefined> = this.route.paramMap.pipe(
    map((pm) => pm.get('id')),
    filter((id): id is string => !!id),
    switchMap((id) =>
      this.bookService.getBookById(id).pipe(
        catchError((error) => {
          console.error('Error fetching books:', error);
          return of(undefined); // signal not found/error to template
        }),
      ),
    ),
  );
}
