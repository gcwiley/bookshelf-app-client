import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// angular material
// fix this!

@Component({
  selector: 'app-book-details-page',
  templateUrl: './book-details-page.html',
  styleUrl: './book-details-page.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class BookDetailsPage {}
