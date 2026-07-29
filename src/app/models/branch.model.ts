export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  openingTime: string;
  closingTime: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  totalBooks: number;
  totalMembers: number;
  createdAt: string;
}

export interface CreateBranchRequest {
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  openingTime: string;
  closingTime: string;
  description?: string;
  latitude?: string;
  longitude?: string;
}

export interface UpdateBranchRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  openingTime: string;
  closingTime: string;
  description?: string;
  latitude?: string;
  longitude?: string;
}

export interface BranchInventory {
  branchId: string;
  branchName: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookISBN: string;
  totalCopies: number;
  availableCopies: number;
  reservedCopies: number;
  borrowedCopies: number;
  locationInBranch?: string;
  isAvailable: boolean;
  lastInventoryCheck: string;
}

export interface UpdateBranchInventoryRequest {
  branchId: string;
  bookId: string;
  totalCopies: number;
  locationInBranch?: string;
}