'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface NGO {
  id: string;
  name: string;
  description: string | null;
  verified: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    requests: number;
    donations: number;
  };
}

export default function AdminNGOsPage() {
  const [ngos, setNGOs] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const response = await fetch('/api/admin/ngos');
      const data = await response.json();
      setNGOs(data.ngos || []);
    } catch (error) {
      console.error('Failed to fetch NGOs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (ngoId: string, currentStatus: boolean) => {
    setUpdating(ngoId);

    try {
      const response = await fetch('/api/admin/ngos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoId,
          verified: !currentStatus,
        }),
      });

      if (response.ok) {
        fetchNGOs();
      } else {
        alert('Failed to update NGO verification status');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: 'Admin', role: 'ADMIN' }} />
      
      <div className="flex">
        <Sidebar role="ADMIN" />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage NGOs</h1>
            <p className="text-gray-600 mb-6">Verify and manage NGO accounts</p>

            <Card className="p-0">
              {loading ? (
                <p className="text-center py-8 text-gray-600">Loading NGOs...</p>
              ) : ngos.length === 0 ? (
                <p className="text-center py-8 text-gray-600">No NGOs registered yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>NGO Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">Requests</TableHead>
                        <TableHead className="text-center">Donations</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ngos.map((ngo) => (
                        <TableRow key={ngo.id}>
                          <TableCell>
                            <div className="text-sm font-medium text-gray-900">{ngo.name}</div>
                            <div className="text-xs text-gray-500">
                              Joined {new Date(ngo.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">{ngo.user.name}</div>
                            <div className="text-xs text-gray-500">{ngo.user.email}</div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {ngo.description || 'No description'}
                          </TableCell>
                          <TableCell className="text-center">
                            {ngo._count.requests}
                          </TableCell>
                          <TableCell className="text-center">
                            {ngo._count.donations}
                          </TableCell>
                          <TableCell>
                            {ngo.verified ? (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant={ngo.verified ? 'destructive' : 'default'}
                              onClick={() => handleToggleVerification(ngo.id, ngo.verified)}
                              disabled={updating === ngo.id}
                            >
                              {updating === ngo.id
                                ? 'Updating...'
                                : ngo.verified
                                ? 'Unverify'
                                : 'Verify'}
                            </Button>
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
