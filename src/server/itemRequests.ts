/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
import connectDB from '@/lib/db/connection';
import ItemRequest, { IItemRequest } from '@/lib/db/models/ItemRequest';
import { PAGINATION_PAGE_SIZE } from '@/lib/constants/config';
import { InvalidInputError } from '@/lib/errors/inputExceptions';
import {
  PaginatedItemRequests,
} from '@/lib/types/itemRequest';
import { RequestStatus } from '@/lib/types/request';
import {
  isValidStatus,
  validateCreateItemRequest,
  validateEditStatusRequest,
} from '@/lib/validation/itemRequests';

export async function getItemRequests(
  status: string | null,
  page: number
): Promise<PaginatedItemRequests> {
  await connectDB();

  if (page < 1) {
    throw new InvalidInputError("page number");
  }

  // Build query filter
  const filter: any = {};
  if (status && isValidStatus(status)) {
    filter.status = status;
  }

  // Get total count for pagination
  const totalRecords = await ItemRequest.countDocuments(filter);
  const totalPages = Math.ceil(totalRecords / PAGINATION_PAGE_SIZE);

  // If page is beyond available pages, return empty data
  if (page > totalPages && totalRecords > 0) {
    return {
      data: [],
      totalPages,
      totalRecords,
      currentPage: page,
      pageSize: PAGINATION_PAGE_SIZE,
    };
  }

  // Calculate skip value for pagination
  const skip = (page - 1) * PAGINATION_PAGE_SIZE;

  // Fetch paginated data, sorted by creation date (descending)
  const requests = await ItemRequest.find(filter)
    .sort({ requestCreatedDate: -1 })
    .skip(skip)
    .limit(PAGINATION_PAGE_SIZE)
    .lean();

  // Transform MongoDB documents to our interface
  const transformedRequests = requests.map((req: any) => ({
    _id: req._id.toString(),
    requestorName: req.requestorName,
    itemRequested: req.itemRequested,
    requestCreatedDate: req.requestCreatedDate,
    lastEditedDate: req.lastEditedDate,
    status: req.status,
  }));

  return {
    data: transformedRequests,
    totalPages,
    totalRecords,
    currentPage: page,
    pageSize: PAGINATION_PAGE_SIZE,
  };
}

export async function createNewItemRequest(request: any): Promise<IItemRequest> {
  await connectDB();

  const validatedRequest = validateCreateItemRequest(request);
  if (!validatedRequest) {
    throw new InvalidInputError("created item request");
  }

  const newRequest = new ItemRequest({
    requestorName: validatedRequest.requestorName,
    itemRequested: validatedRequest.itemRequested,
    requestCreatedDate: new Date(),
    lastEditedDate: new Date(),
    status: RequestStatus.PENDING,
  });

  const savedRequest = await newRequest.save();
  return savedRequest;
}

export async function editItemRequestStatus(request: any): Promise<IItemRequest> {
  await connectDB();

  const validatedRequest = validateEditStatusRequest(request);
  if (!validatedRequest) {
    throw new InvalidInputError("edit item request");
  }

  const updatedRequest = await ItemRequest.findByIdAndUpdate(
    validatedRequest.id,
    {
      status: validatedRequest.status,
      lastEditedDate: new Date(),
    },
    { new: true, runValidators: true }
  );

  if (!updatedRequest) {
    throw new InvalidInputError("edit item ID");
  }

  return updatedRequest;
}
