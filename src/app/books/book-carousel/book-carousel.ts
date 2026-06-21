import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  computed,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// interface
import { Book } from '../../types/book.interface';

@Component({
  selector: 'app-book-carousel',
  templateUrl: './book-carousel.html',
  styleUrl: './book-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class BookCarousel {
  // input signal for books
  books = input<Book[]>([]);

  // track current index
  currentIndex = signal(0);

  // calculated max index to prevent scrolling out of bounds
  maxIndex = computed(() => {
    const listLength = this.books().length;
    return Math.max(0, listLength - 1);
  });

  // helper to get populated or gradient style cover
  getCoverStyle(book: Book) {
    if (book.coverImageUrl) {
      return { 'background-image': `url(${book.coverImageUrl})` };
    }
    // Return a harmonious theme gradient based on the title length to randomize
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
      'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
      'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    ];
    const index = book.title.length % gradients.length;
    return { 'background': gradients[index] };
  }

  // helper to check if author is string or object
  getAuthorName(book: Book): string {
    if (typeof book.author === 'string') {
      return book.author;
    }
    return book.author?.name ?? 'Unknown Author';
  }

  // navigate methods
  public prevSlide(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    } else {
      // Loop back to the end
      this.currentIndex.set(this.maxIndex());
    }
  }

  public nextSlide(): void {
    if (this.currentIndex() < this.maxIndex()) {
      this.currentIndex.update((i) => i + 1);
    } else {
      // Loop back to the start
      this.currentIndex.set(0);
    }
  }

  public goToSlide(idx: number): void {
    this.currentIndex.set(idx);
  }
}
