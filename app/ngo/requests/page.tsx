'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
// import { Card } from '@/components/ui/card';{ Table } from '@/components/ui/Table';
// import { Button } from '@/components/ui/Button';
// import { Dialog } from '@/components/ui/Dialog';
// import { Input } from '@/components/ui/Input';
// import { Textarea } from '@/components/ui/Textarea';
// import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/card';

interface Request {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function NGORequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: '',
    description: '',
    status: 'OPEN',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests');
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRequest(null);
    setFormData({
      itemName: '',
      quantity: '',
      unit: '',
      description: '',
      status: 'OPEN',
    });
    setMessage('');
    setDialogOpen(true);
  };

  const handleEdit = (request: Request) => {
    setEditingRequest(request);
    setFormData({
      itemName: request.itemName,
      quantity: request.quantity.toString(),
      unit: request.unit,
      description: request.description || '',
      status: request.status,
    });
    setMessage('');
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const payload = {
        itemName: formData.itemName,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        description: formData.description || undefined,
        status: formData.status,
      };

      const url = editingRequest ? `/api/requests/${editingRequest.id}` : '/api/requests';
      const method = editingRequest ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Request ${editingRequest ? 'updated' : 'created'} successfully!`);
        fetchRequests();
        setTimeout(() => {
          setDialogOpen(false);
        }, 1500);
      } else {
        setMessage(data.error || 'Operation failed');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchRequests();
      } else {
        alert('Failed to delete request');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-green-100 text-green-800',
      FULFILLED: 'bg-blue-100 text-blue-800',
      ARCHIVED: 'bg-gray-100 text-gray-800',
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
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Requests</h1>
                <p className="text-gray-600">Create and manage your donation requests</p>
              </div>
              <Button onClick={handleCreate}>Create Request</Button>
            </div>

            <Card>
              {loading ? (
                <p className="text-center py-8 text-gray-600">Loading requests...</p>
              ) : requests.length === 0 ? (
                <p className="text-center py-8 text-gray-600">No requests yet. Create your first one!</p>
              ) : (
                <Table headers={['Item', 'Quantity', 'Status', 'Description', 'Date', 'Actions']}>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {request.quantity} {request.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {request.description || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(request)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(request.id)}>
                          Delete
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
        title={editingRequest ? 'Edit Request' : 'Create Request'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Input
            label="Item Name"
            value={formData.itemName}
            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
            placeholder="e.g., Rice, Blankets, Books"
            required
            disabled={submitting}
          />

          <Input
            type="number"
            label="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="How many?"
            required
            disabled={submitting}
          />

          <Input
            label="Unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="e.g., kg, pieces, liters"
            required
            disabled={submitting}
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Additional details about this request..."
            rows={3}
            disabled={submitting}
          />

          {editingRequest && (
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'OPEN', label: 'Open' },
                { value: 'FULFILLED', label: 'Fulfilled' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
              disabled={submitting}
            />
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Saving...' : editingRequest ? 'Update' : 'Create'}
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
