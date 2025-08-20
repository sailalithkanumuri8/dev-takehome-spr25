"use client";

import { useState, useEffect } from "react";
import ItemRequestsTable from "@/components/tables/ItemRequestsTable";
import Pagination from "@/components/molecules/Pagination";
import { ItemRequest, PaginatedItemRequests } from "@/lib/types/itemRequest";
import { RequestStatus } from "@/lib/types/request";

/**
 * Admin portal for managing item requests with full table interface
 */
export default function ItemRequestsPage() {
  const [requests, setRequests] = useState<ItemRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [updating, setUpdating] = useState("");

  const fetchRequests = async (page = currentPage, status?: string) => {
    setLoading(true);
    setError("");
    
    try {
      const url = `/api/request?page=${page}${status && status !== "all" ? `&status=${status}` : ""}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Failed to fetch requests');
      
      const data: PaginatedItemRequests = await response.json();
      setRequests(data.data || []);
      setTotalPages(data.totalPages || 0);
      setTotalRecords(data.totalRecords || 0);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: RequestStatus) => {
    setUpdating(id);
    
    try {
      const response = await fetch('/api/request', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      await fetchRequests(currentPage, activeTab === "all" ? undefined : activeTab);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating("");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchRequests(page, activeTab === "all" ? undefined : activeTab);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    fetchRequests(1, tab === "all" ? undefined : tab);
  };

  useEffect(() => {
    fetchRequests(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tabs = [
    { id: "all", label: "All Requests" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "completed", label: "Completed" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen bg-gray-fill-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Item Requests Management
          </h1>
          <p className="text-gray-text">
            Manage and track item requests from disaster-affected areas
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-danger-fill text-danger-text rounded-md border border-danger-indicator">
            {error}
          </div>
        )}

        {/* Status Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-fill p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-text hover:text-gray-text-dark hover:bg-white/50"
                  }
                `}
              >
                {tab.label}
                {tab.id === "all" && totalRecords > 0 && (
                  <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-200 text-gray-600 text-xs">
                    {totalRecords}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-stroke overflow-visible">
          <ItemRequestsTable
            requests={requests}
            onStatusChange={handleStatusChange}
            loading={loading}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-stroke">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-text">
                  Showing {requests.length} of {totalRecords} requests
                </div>
                <Pagination
                  pageNumber={currentPage}
                  pageSize={6}
                  totalRecords={totalRecords}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Loading overlay */}
        {updating && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="animate-pulse text-gray-900">Updating status...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
