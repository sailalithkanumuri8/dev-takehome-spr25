/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
import { CreateItemRequest, EditStatusRequest } from '@/lib/types/itemRequest';
import { RequestStatus } from '@/lib/types/request';

function isValidString(str: any, lower?: number, upper?: number): boolean {
  if (typeof str !== "string" || str.trim() === "") {
    return false;
  }
  if ((lower && str.length < lower) || (upper && str.length > upper)) {
    return false;
  }
  return true;
}

function isValidRequestorName(name: string): boolean {
  return isValidString(name, 3, 30);
}

function isValidItemRequested(item: string): boolean {
  return isValidString(item, 2, 100);
}

export function isValidStatus(status: any): boolean {
  return (
    isValidString(status) &&
    Object.values(RequestStatus).includes(status as RequestStatus)
  );
}

export function isValidId(id: any): boolean {
  return typeof id === "string" && id.trim().length > 0;
}

export function validateCreateItemRequest(
  request: any
): CreateItemRequest | null {
  if (!request.requestorName || !request.itemRequested) {
    return null;
  }
  if (
    !isValidRequestorName(request.requestorName) ||
    !isValidItemRequested(request.itemRequested)
  ) {
    return null;
  }
  const newCreateItemRequest: CreateItemRequest = {
    requestorName: request.requestorName.trim(),
    itemRequested: request.itemRequested.trim(),
  };
  return newCreateItemRequest;
}

export function validateEditStatusRequest(
  request: any
): EditStatusRequest | null {
  if (!request.id || !request.status) {
    return null;
  }
  if (!isValidId(request.id) || !isValidStatus(request.status)) {
    return null;
  }
  const newEditStatusRequest: EditStatusRequest = {
    id: request.id.trim(),
    status: request.status,
  };
  return newEditStatusRequest;
}
