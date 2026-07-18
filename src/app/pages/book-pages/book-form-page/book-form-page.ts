import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navbar, Footer, BookForm, RecentBooks, RouterModule, MatIconModule],
})
export class BookFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  public readonly isEditMode = signal(false);

  public ngOnInit(): void {
    // Check if the route has an 'id' param to determine edit mode
    this.isEditMode.set(this.route.snapshot.paramMap.has('id'));
  }
}
