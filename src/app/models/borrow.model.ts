export interface BorrowTransaction {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
  statusDisplay: string;
  fineAmount?: number;
  notes?: string;
  isOverdue: boolean;
  daysOverdue: number;
}

export interface BorrowBookRequest {
  bookId: string;
  memberId: string;
  loanPeriodDays: number;
  notes?: string;
}

export interface ReturnBookRequest {
  transactionId: string;
  notes?: string;
}

export interface BorrowHistoryRequest {
  memberId?: string;
  bookId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
}

export interface BorrowHistoryResponse {
  data: BorrowTransaction[];
  page: number;
  pageSize: number;
  total: number;
}