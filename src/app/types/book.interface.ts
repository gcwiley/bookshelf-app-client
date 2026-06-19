// ISO 8601 date/time string type for consistent date handling across the app
export type ISODateString = string;

// define the book interface
export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  pageCount: string;
  genre: string;
  isFavorite: boolean;
  summary: string;
  coverImageUrl?: string; // optional field
  publisher: string;
  language: string;
  publishedFormat: string | null;
  tags: string;
  rating: string;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

// payload to create a book (client -> server)
// excludes server-generated fields like id, created, updatedAt
export type BookInput = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;

// --- HELPER INTERFACES FOR UI LIST ---

// single generic interface
export interface SelectOption<T = string> {
  value: T;
  viewValue: string;
}
