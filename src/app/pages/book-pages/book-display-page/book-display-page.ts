import { Component, ChangeDetectionStrategy } from '@angular/core';

// shared components
import { Navbar, Footer } from '../../../components';

// book components
import { BookGrid } from '../../../books';

@Component({
  selector: 'app-book-display-page',
  templateUrl: './book-display-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './book-display-page.scss',
  imports: [Navbar, Footer, BookGrid],
})
export class BookDisplayPage {}
