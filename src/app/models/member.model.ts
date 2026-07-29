export interface Member {
  id: string;
  userId: string;
  membershipNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  address?: string;
  membershipDate: string;
  membershipExpiryDate?: string;
  isActive: boolean;
  outstandingFines: number;
  maxBooksAllowed: number;
  currentBorrowedCount: number;
  canBorrow: boolean;
}

export interface CreateMemberRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  maxBooksAllowed: number;
}

export interface UpdateMemberRequest {
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  isActive: boolean;
  maxBooksAllowed: number;
}

export interface MemberListResponse {
  data: Member[];
  page: number;
  pageSize: number;
  total: number;
}