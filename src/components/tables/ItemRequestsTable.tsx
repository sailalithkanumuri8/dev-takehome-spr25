import React from "react";
import Dropdown, { DropdownOption } from "@/components/atoms/Dropdown";
import { ItemRequest } from "@/lib/types/itemRequest";
import { RequestStatus } from "@/lib/types/request";

interface ItemRequestsTableProps {
  requests: ItemRequest[];
  onStatusChange?: (id: string, status: RequestStatus) => void;
  loading?: boolean;
}

const STATUS_OPTIONS: DropdownOption[] = [
  { value: RequestStatus.PENDING, label: "Pending" },
  { value: RequestStatus.APPROVED, label: "Approved" },
  { value: RequestStatus.COMPLETED, label: "Completed" },
  { value: RequestStatus.REJECTED, label: "Rejected" },
];

const STATUS_COLORS = {
  [RequestStatus.APPROVED]: "bg-green-100 text-green-800 border-green-200",
  [RequestStatus.COMPLETED]: "bg-green-100 text-green-800 border-green-200", 
  [RequestStatus.REJECTED]: "bg-red-100 text-red-800 border-red-200",
  [RequestStatus.PENDING]: "bg-orange-100 text-orange-800 border-orange-200",
};

const StatusBadge = ({ status, onStatusChange, requestId }: { 
  status: RequestStatus; 
  onStatusChange?: (id: string, status: RequestStatus) => void;
  requestId: string;
}) => (
  onStatusChange ? (
    <div className="w-32">
      <Dropdown
        options={STATUS_OPTIONS}
        value={status}
        onChange={(newStatus) => onStatusChange(requestId, newStatus as RequestStatus)}
      />
    </div>
  ) : (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
);

const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
};

export default function ItemRequestsTable({
  requests,
  onStatusChange,
  loading = false,
}: ItemRequestsTableProps) {
  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading requests...</div>;
  }

  if (requests.length === 0) {
    return <div className="p-8 text-center text-gray-500">No item requests found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-stroke">
            {["Name", "Item Requested", "Created", "Updated", "Status"].map((header) => (
              <th key={header} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-stroke">
          {requests.map((request) => (
            <tr key={request._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {request.requestorName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {request.itemRequested}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(request.requestCreatedDate)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(request.lastEditedDate || request.requestCreatedDate)}
              </td>
              <td className="px-6 py-4">
                <StatusBadge 
                  status={request.status}
                  onStatusChange={onStatusChange}
                  requestId={request._id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
