import { ResponseType } from "@/lib/types/apiResponse";
import {
  createNewItemRequest,
  editItemRequestStatus,
  getItemRequests,
} from "@/server/itemRequests";
import { ServerResponseBuilder } from "@/lib/builders/serverResponseBuilder";
import { InputException } from "@/lib/errors/inputExceptions";
import { Types } from "mongoose";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const page = parseInt(url.searchParams.get("page") || "1");

  try {
    const paginatedRequests = await getItemRequests(status, page);
    return new Response(JSON.stringify(paginatedRequests), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("GET /api/request error:", e);
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PUT(request: Request) {
  try {
    const req = await request.json();
    const newRequest = await createNewItemRequest(req);
    
    // Transform to match frontend expectations
    const response = {
      _id: (newRequest._id as Types.ObjectId).toString(),
      requestorName: newRequest.requestorName,
      itemRequested: newRequest.itemRequested,
      requestCreatedDate: newRequest.requestCreatedDate,
      lastEditedDate: newRequest.lastEditedDate,
      status: newRequest.status,
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("PUT /api/request error:", e);
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PATCH(request: Request) {
  try {
    const req = await request.json();
    const editedRequest = await editItemRequestStatus(req);
    
    // Transform to match frontend expectations
    const response = {
      _id: (editedRequest._id as Types.ObjectId).toString(),
      requestorName: editedRequest.requestorName,
      itemRequested: editedRequest.itemRequested,
      requestCreatedDate: editedRequest.requestCreatedDate,
      lastEditedDate: editedRequest.lastEditedDate,
      status: editedRequest.status,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("PATCH /api/request error:", e);
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}
