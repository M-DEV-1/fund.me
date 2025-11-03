'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

interface Donation {
  id: string;
  donationType: string;
  quantity: number | null;
  notes: string | null;
  status: string;
  createdAt: string;
  ngo: {
    id: string;
    name: string;
  };
  request: {
    id: string;
    itemName: string;
  } | null;
}

export default function DonorDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Navbar user={{ name: 'Donor', role: 'DONOR' }} />
      
      <div className="flex">
        <Sidebar role="DONOR" />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donations</h1>
            <p className="text-gray-600 mb-6">Track the status of your donations</p>

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
                        <TableHead>NGO</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donations.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell>
                            <div className="text-sm font-medium text-gray-900">{donation.ngo.name}</div>
                            {donation.request && (
                              <div className="text-xs text-gray-500">For: {donation.request.itemName}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-900">
                            {donation.donationType}
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
