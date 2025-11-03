'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Request {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  description: string;
  status: string;
  createdAt: string;
  ngo: {
    id: string;
    name: string;
    verified: boolean;
  };
}

export default function DonorRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [donationForm, setDonationForm] = useState({
    quantity: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests?status=OPEN');
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = (request: Request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
    setDonationForm({ quantity: '', notes: '' });
    setMessage('');
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoId: selectedRequest.ngo.id,
          requestId: selectedRequest.id,
          donationType: selectedRequest.itemName,
          quantity: parseInt(donationForm.quantity) || undefined,
          notes: donationForm.notes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Donation submitted successfully!');
        setTimeout(() => {
          setDialogOpen(false);
          setSelectedRequest(null);
        }, 2000);
      } else {
        setMessage(data.error || 'Failed to submit donation');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: 'Donor', role: 'DONOR' }} />
      
      <div className="flex">
        <Sidebar role="DONOR" />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Requests</h1>
            <p className="text-gray-600 mb-6">View open donation requests from verified NGOs</p>

            <Card>
              {loading ? (
                <p className="text-center py-8 text-gray-600">Loading requests...</p>
              ) : requests.length === 0 ? (
                <p className="text-center py-8 text-gray-600">No open requests available</p>
              ) : (
                <Table headers={['NGO', 'Item', 'Quantity', 'Description', 'Date', 'Action']}>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.ngo.name}</div>
                        {request.ngo.verified && (
                          <span className="text-xs text-green-600">✓ Verified</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {request.quantity} {request.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {request.description || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button size="sm" onClick={() => handleDonate(request)}>
                          Donate
                        </Button>
                      </td>
                    </tr>
                  ))}
                </Table>
              )}
            </Card>
          </div>
        </main>
      </div>

      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={`Donate to ${selectedRequest?.ngo.name}`}
      >
        <form onSubmit={handleSubmitDonation} className="space-y-4">
          {message && (
            <div
              className={`px-4 py-3 rounded ${
                message.includes('success')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>Item:</strong> {selectedRequest?.itemName}</p>
            <p><strong>Needed:</strong> {selectedRequest?.quantity} {selectedRequest?.unit}</p>
          </div>

          <Input
            type="number"
            label="Quantity (optional)"
            value={donationForm.quantity}
            onChange={(e) => setDonationForm({ ...donationForm, quantity: e.target.value })}
            placeholder={`How many ${selectedRequest?.unit}?`}
            disabled={submitting}
          />

          <Textarea
            label="Notes (optional)"
            value={donationForm.notes}
            onChange={(e) => setDonationForm({ ...donationForm, notes: e.target.value })}
            placeholder="Any message for the NGO..."
            rows={3}
            disabled={submitting}
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Submitting...' : 'Submit Donation'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
