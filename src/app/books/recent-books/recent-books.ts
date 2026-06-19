import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// rxjs
import { Observable, catchError, of } from 'rxjs';

// angular material
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// book service and interface
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book.interface';

@Component({
  selector: 'app-recent-books',
  templateUrl: './recent-books.html',
  styleUrl: './recent-books.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class RecentBooks implements OnInit {
  public recentBooks$!: Observable<Book[]>;
  public isLoading = true;

  // inject dependencies
  private bookService = inject(BookService);

  public ngOnInit(): void {
    // get the observable stream of recently added books
    this.recentBooks$ = this.bookService
      .getRecentlyCreatedBooks()
      .pipe(
        catchError((error) => {
          console.error('Error getting recent books.', error);
          this.isLoading = false;
          return of([]);
        })
      );
    this.recentBooks$.subscribe(() => (this.isLoading = false));
  }
}