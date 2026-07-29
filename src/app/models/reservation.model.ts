export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  reservationDate: string;
  expiryDate: string;
  status: string;
  statusDisplay: string;
  queuePosition: number;
  isExpired: boolean;
  daysUntilExpiry: number;
}

export interface CreateReservationRequest {
  bookId: string;
  memberId: string;
  holdDays: number;
}

export interface UpdateReservationRequest {
  status: string;
}

export interface ReservationListResponse {
  data: Reservation[];
  page: number;
  pageSize: number;
  total: number;
}