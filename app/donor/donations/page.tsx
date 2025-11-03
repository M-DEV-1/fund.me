'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';

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

            <Card>
              {loading ? (
                <p className="text-center py-8 text-gray-600">Loading donations...</p>
              ) : donations.length === 0 ? (
                <p className="text-center py-8 text-gray-600">No donations yet</p>
              ) : (
                <Table headers={['NGO', 'Type', 'Quantity', 'Status', 'Notes', 'Date']}>
                  {donations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{donation.ngo.name}</div>
                        {donation.request && (
                          <div className="text-xs text-gray-500">For: {donation.request.itemName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {donation.donationType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {donation.quantity || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(donation.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {donation.notes || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </Table>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
