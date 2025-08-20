import mongoose, { Schema, Document } from 'mongoose';
import { RequestStatus } from '@/lib/types/request';

export interface IItemRequest extends Document {
  requestorName: string;
  itemRequested: string;
  requestCreatedDate: Date;
  lastEditedDate?: Date;
  status: RequestStatus;
}

const ItemRequestSchema: Schema = new Schema({
  requestorName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true,
  },
  itemRequested: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true,
  },
  requestCreatedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lastEditedDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(RequestStatus),
    default: RequestStatus.PENDING,
  },
});

// Create indexes for better query performance
ItemRequestSchema.index({ requestCreatedDate: -1 });
ItemRequestSchema.index({ status: 1 });
ItemRequestSchema.index({ status: 1, requestCreatedDate: -1 });

export default mongoose.models.ItemRequest || mongoose.model<IItemRequest>('ItemRequest', ItemRequestSchema);
