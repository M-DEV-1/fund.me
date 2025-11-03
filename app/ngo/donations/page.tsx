'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Donation {
  id: string;
  donationType: string;
  quantity: number | null;
  notes: string | null;
  status: string;
  createdAt: string;
  donor: {
    id: string;
    name: string;
    email: string;
  };
  request: {
    id: string;
    itemName: string;
  } | null;
}

export default function NGODonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/donations');
      const data = await response.json();
      setDonations(data.donations || []);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (donationId: string, newStatus: string) => {
    setUpdating(donationId);

    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchDonations();
      } else {
        alert('Failed to update donation status');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      RECEIVED: 'bg-blue-100 text-blue-800',
      VERIFIED: 'bg-green-100 text-green-800',
      CANCELED: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: 'NGO', role: 'NGO' }} />
      
      <div className="flex">
        <Sidebar role="NGO" />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Incoming Donations</h1>
            <p className="text-gray-600 mb-6">View and manage donations to your NGO</p>

            <Card className="p-0">
              {loading ? (
                <p className="text-center py-8 text-gray-600">Loading donations...</p>
              ) : donations.length === 0 ? (
                <p className="text-center py-8 text-gray-600">No donations yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Donor</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donations.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell>
                            <div className="text-sm font-medium text-gray-900">{donation.donor.name}</div>
                            <div className="text-xs text-gray-500">{donation.donor.email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">{donation.donationType}</div>
                            {donation.request && (
                              <div className="text-xs text-gray-500">For: {donation.request.itemName}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {donation.quantity || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(donation.status)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                            {donation.notes || 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {donation.status === 'PENDING' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(donation.id, 'RECEIVED')}
                                disabled={updating === donation.id}
                              >
                                Mark Received
                              </Button>
                            )}
                            {donation.status === 'RECEIVED' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(donation.id, 'VERIFIED')}
                                disabled={updating === donation.id}
                              >
                                Verify
                              </Button>
                            )}
                            {donation.status === 'VERIFIED' && (
                              <span className="text-sm text-green-600">✓ Verified</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
