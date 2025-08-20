"use client";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useState, useEffect } from "react";
import { ItemRequest } from "@/lib/types/itemRequest";

/**
 * Admin portal connected to real MongoDB backend
 */
export default function ItemRequestsPage() {
  const [item, setItem] = useState<string>("");
  const [requestorName, setRequestorName] = useState<string>("");
  const [approvedItems, setApprovedItems] = useState<ItemRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch approved items on component mount
  useEffect(() => {
    fetchApprovedItems();
  }, []);

  const fetchApprovedItems = async (): Promise<void> => {
    try {
      const response = await fetch('/api/request?status=approved&page=1');
      if (response.ok) {
        const data = await response.json();
        setApprovedItems(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching approved items:', err);
    }
  };

  const handleAddItem = async (): Promise<void> => {
    if (!item.trim() || !requestorName.trim()) {
      setError("Both requestor name and item are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create the request
      const createResponse = await fetch('/api/request', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestorName: requestorName.trim(),
          itemRequested: item.trim(),
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create request');
      }

      const newRequest = await createResponse.json();

      // Immediately approve it
      const approveResponse = await fetch('/api/request', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newRequest._id,
          status: 'approved',
        }),
      });

      if (!approveResponse.ok) {
        throw new Error('Failed to approve request');
      }

      // Clear form and refresh list
      setItem("");
      setRequestorName("");
      await fetchApprovedItems();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 flex flex-col items-center gap-6">
      <h2 className="font-bold">Approve Items</h2>

      {error && (
        <div className="w-full p-3 bg-danger-fill text-danger-text rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col w-full gap-4">
        <Input
          type="text"
          placeholder="Enter your name"
          value={requestorName}
          onChange={(e) => setRequestorName(e.target.value)}
          label="Requestor Name"
        />
        <Input
          type="text"
          placeholder="Type an item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          label="Item"
        />
        <Button 
          onClick={handleAddItem}
          disabled={loading}
        >
          {loading ? "Adding..." : "Approve"}
        </Button>
      </div>
      
      <div className="flex flex-col gap-3">
        <h3 className="underline">Currently approved items:</h3>
        {approvedItems.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {approvedItems.map((request) => (
              <li key={request._id}>
                <strong>{request.itemRequested}</strong> 
                <span className="text-gray-text-dark text-sm">
                  {" "}(requested by {request.requestorName})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          "None :("
        )}
      </div>
    </div>
  );
}
