export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publicationYear: number;
  genre?: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  location?: string;
  isAvailable: boolean;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publicationYear: number;
  genre?: string;
  description?: string;
  totalCopies: number;
  location?: string;
}

export interface UpdateBookRequest {
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publicationYear: number;
  genre?: string;
  description?: string;
  totalCopies: number;
  location?: string;
}

export interface BookListResponse {
  data: Book[];
  page: number;
  pageSize: number;
  total: number;
}