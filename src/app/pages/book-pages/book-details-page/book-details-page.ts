import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// angular material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// shared components
import { Navbar, Footer } from '../../../components';

// book components
import { BookDescription, BookDetails } from '../../../books';

@Component({
  selector: 'app-book-details-page',
  templateUrl: './book-details-page.html',
  styleUrl: './book-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Navbar,
    Footer,
    BookDescription,
    BookDetails,
    MatButtonModule,
    MatIconModule
  ],
})
export class BookDetailsPage {
  private readonly router = inject(Router);

  public goBack(): void {
    this.router.navigate(['/books'])
  }
}
