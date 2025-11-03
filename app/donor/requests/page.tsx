'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
      
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar role="DONOR" />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Browse Requests</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">View open donation requests from verified NGOs</p>

            <Card className="p-0">
              {loading ? (
                <p className="text-center py-8 text-gray-600">Loading requests...</p>
              ) : requests.length === 0 ? (
                <p className="text-center py-8 text-gray-600">No open requests available</p>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="block lg:hidden divide-y">
                    {requests.map((request) => (
                      <div key={request.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.ngo.name}</h3>
                            {request.ngo.verified && (
                              <span className="text-xs text-green-600">✓ Verified</span>
                            )}
                          </div>
                          <Button size="sm" onClick={() => handleDonate(request)}>
                            Donate
                          </Button>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Item:</span> {request.itemName}</p>
                          <p><span className="font-medium">Quantity:</span> {request.quantity} {request.unit}</p>
                          {request.description && (
                            <p className="text-gray-600 line-clamp-2">{request.description}</p>
                          )}
                          <p className="text-gray-500 text-xs">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>NGO</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div className="text-sm font-medium text-gray-900">{request.ngo.name}</div>
                              {request.ngo.verified && (
                                <span className="text-xs text-green-600">✓ Verified</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-gray-900">
                              {request.itemName}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {request.quantity} {request.unit}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                              {request.description || 'N/A'}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" onClick={() => handleDonate(request)}>
                                Donate
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Donate to {selectedRequest?.ngo.name}</DialogTitle>
            <DialogDescription>
              Fill in the details below to submit your donation.
            </DialogDescription>
          </DialogHeader>
          
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

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (optional)</Label>
              <Input
                id="quantity"
                type="number"
                value={donationForm.quantity}
                onChange={(e) => setDonationForm({ ...donationForm, quantity: e.target.value })}
                placeholder={`How many ${selectedRequest?.unit}?`}
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={donationForm.notes}
                onChange={(e) => setDonationForm({ ...donationForm, notes: e.target.value })}
                placeholder="Any message for the NGO..."
                rows={3}
                disabled={submitting}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Donation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
