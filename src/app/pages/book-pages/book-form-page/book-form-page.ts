import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// angular material
import { MatIconModule } from '@angular/material/icon';

// shared components
import { Navbar, Footer } from '../../../components';

// book components
import { BookForm, RecentBooks } from '../../../books';

@Component({
  selector: 'app-book-form-page',
  templateUrl: './book-form-page.html',
  styleUrl: './book-form-page.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Navbar, Footer, BookForm, RecentBooks, RouterModule, MatIconModule],
})
export class BookFormPage {}
