import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// angular material
import { MatIconModule } from '@angular/material/icon';

// rxjs
import { of, Observable, map, filter, switchMap, catchError } from 'rxjs';

// book service and interface
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book.interface';

@Component({
  selector: 'app-book-description',
  templateUrl: './book-description.html',
  styleUrl: './book-description.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, MatIconModule],
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

  // resolves the background color or gradient based on book properties
  public getCoverStyle(book: Book): { [key: string]: string } {
    if (book.coverImageUrl) {
      return {
        'background-image': `url(${book.coverImageUrl})`,
        'background-size': 'cover',
        'background-position': 'center',
      };
    }

    // Dynamic gradient fallback based on the book's title length and genre
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Indigo/Purple
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', // Warm pink
      'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', // Soft violet
      'linear-gradient(135deg, #fd1d1d 0%, #fcb045 100%)', // Fire gradient
      'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Clean green
      'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)', // Cool blue
    ];
    const index = (book.title.length + (book.genre?.length ?? 0)) % gradients.length;
    return {
      'background': gradients[index],
    };
  }

  // resolves the display name for the author
  public getAuthorName(book: Book): string {
    return typeof book.author === 'string'
      ? book.author
      : (book.author?.name ?? 'Unknown Author');
  }
}
