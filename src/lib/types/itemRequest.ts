import { RequestStatus } from './request';

export interface ItemRequest {
  _id: string;
  requestorName: string;
  itemRequested: string;
  requestCreatedDate: Date;
  lastEditedDate?: Date;
  status: RequestStatus;
}

export interface CreateItemRequest {
  requestorName: string;
  itemRequested: string;
}

export interface EditStatusRequest {
  id: string;
  status: RequestStatus;
}

export interface PaginatedItemRequests {
  data: ItemRequest[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  pageSize: number;
}
