import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  DestroyRef,
} from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

// rxjs
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, startWith, switchMap, map } from 'rxjs/operators';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

// book service, interface, and pipes
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book.interface';
import { TimeAgoPipe } from '../../pipes';

@Component({
  selector: 'app-book-grid',
  templateUrl: './book-grid.html',
  styleUrl: './book-grid.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AsyncPipe,
    DatePipe,
    TimeAgoPipe,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,],
})
export class BookGrid implements OnInit {
   private readonly bookService = inject(BookService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly pageParams$ = new BehaviorSubject({ page: 1, pageSize: 6 });

  public books$!: Observable<Book[] | null>;
  public hasError = signal(false);
  public totalBooks = signal(0);
  public pageSize = signal(6);

  public ngOnInit(): void {
    this.books$ = this.pageParams$.pipe(
      switchMap(({ page, pageSize }) =>
        this.bookService.getBooks(page, pageSize).pipe(
          takeUntilDestroyed(this.destroyRef),
          map((res) => {
            this.totalBooks.set(res.total);
            return res.data;
          }),
          startWith(null),
          catchError(() => {
            this.hasError.set(true);
            return of([]);
          }),
        ),
      ),
    );
  }

  public onPageChange(event: PageEvent): void {
    this.hasError.set(false);
    this.pageSize.set(event.pageSize);
    this.pageParams$.next({ page: event.pageIndex + 1, pageSize: event.pageSize });
  }
}
