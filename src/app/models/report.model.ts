export interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalMembers: number;
  activeMembers: number;
  totalBorrows: number;
  activeBorrows: number;
  overdueBorrows: number;
  totalReservations: number;
  activeReservations: number;
  totalFines: number;
  outstandingFines: number;
  reportDate: string;
}

export interface BookStatistics {
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  totalBorrows: number;
  currentReservations: number;
  popularityScore: number;
}

export interface MemberActivity {
  memberId: string;
  memberName: string;
  email: string;
  membershipNumber: string;
  totalBorrows: number;
  currentBorrows: number;
  totalReservations: number;
  totalFines: number;
  outstandingFines: number;
  lastActivityDate: string;
  isActive: boolean;
}

export interface BorrowTrend {
  date: string;
  borrows: number;
  returns: number;
  netBorrows: number;
}

export interface OverdueReport {
  transactionId: string;
  bookTitle: string;
  memberName: string;
  memberEmail: string;
  borrowDate: string;
  dueDate: string;
  daysOverdue: number;
  fineAmount: number;
  status: string;
}