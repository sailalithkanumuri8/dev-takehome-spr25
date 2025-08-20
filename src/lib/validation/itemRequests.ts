/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateItemRequest, EditStatusRequest } from '@/lib/types/itemRequest';
import { RequestStatus } from '@/lib/types/request';

const isValidString = (str: any, min = 1, max = Infinity): boolean => 
  typeof str === "string" && str.trim().length >= min && str.trim().length <= max;

const isValidRequestorName = (name: string): boolean => isValidString(name, 3, 30);
const isValidItemRequested = (item: string): boolean => isValidString(item, 2, 100);

export const isValidStatus = (status: any): boolean => 
  typeof status === "string" && Object.values(RequestStatus).includes(status as RequestStatus);

export const isValidId = (id: any): boolean => typeof id === "string" && id.trim().length > 0;

export const validateCreateItemRequest = (request: any): CreateItemRequest | null => {
  if (!request?.requestorName || !request?.itemRequested) return null;
  if (!isValidRequestorName(request.requestorName) || !isValidItemRequested(request.itemRequested)) return null;
  
  return {
    requestorName: request.requestorName.trim(),
    itemRequested: request.itemRequested.trim(),
  };
};

export const validateEditStatusRequest = (request: any): EditStatusRequest | null => {
  if (!request?.id || !request?.status) return null;
  if (!isValidId(request.id) || !isValidStatus(request.status)) return null;
  
  return {
    id: request.id.trim(),
    status: request.status,
  };
};
