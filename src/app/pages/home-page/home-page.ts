import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// rxjs
import { Observable } from 'rxjs';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

// shared components
import { Navbar, Footer, Hero } from '../../components';

// book service and interface
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book.interface';

// book components
import { BookCarousel } from '../../books';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-page.scss',
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    Navbar,
    Footer,
    BookCarousel,
    Hero,
  ],
})
export class HomePage {
  // inject dependencies
  private readonly bookService = inject(BookService);

  // expose observable directly
  public readonly featuredBooks$: Observable<Book[]> =
    this.bookService.getBooks();
}
