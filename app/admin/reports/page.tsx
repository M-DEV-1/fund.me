'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';

interface Stats {
  totalDonations: number;
  totalRequests: number;
  totalNGOs: number;
  verifiedNGOs: number;
  pendingDonations: number;
  verifiedDonations: number;
}

export default function AdminReportsPage() {
  const [stats, setStats] = useState<Stats>({
    totalDonations: 0,
    totalRequests: 0,
    totalNGOs: 0,
    verifiedNGOs: 0,
    pendingDonations: 0,
    verifiedDonations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all data and calculate stats
      const [donationsRes, requestsRes, ngosRes] = await Promise.all([
        fetch('/api/donations'),
        fetch('/api/requests'),
        fetch('/api/admin/ngos'),
      ]);

      const donationsData = await donationsRes.json();
      const requestsData = await requestsRes.json();
      const ngosData = await ngosRes.json();

      const donations = donationsData.donations || [];
      const requests = requestsData.requests || [];
      const ngos = ngosData.ngos || [];

      setStats({
        totalDonations: donations.length,
        totalRequests: requests.length,
        totalNGOs: ngos.length,
        verifiedNGOs: ngos.filter((ngo: any) => ngo.verified).length,
        pendingDonations: donations.filter((d: any) => d.status === 'PENDING').length,
        verifiedDonations: donations.filter((d: any) => d.status === 'VERIFIED').length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, description }: { title: string; value: number; description: string }) => (
    <Card>
      <div className="text-center">
        <h3 className="text-4xl font-bold text-blue-600 mb-2">{value}</h3>
        <p className="text-lg font-semibold text-gray-900 mb-1">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: 'Admin', role: 'ADMIN' }} />
      
      <div className="flex">
        <Sidebar role="ADMIN" />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Statistics</h1>
            <p className="text-gray-600 mb-6">Overview of platform activity</p>

            {loading ? (
              <p className="text-center py-8 text-gray-600">Loading statistics...</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  title="Total Donations"
                  value={stats.totalDonations}
                  description="All donations on platform"
                />
                <StatCard
                  title="Total Requests"
                  value={stats.totalRequests}
                  description="All donation requests"
                />
                <StatCard
                  title="Total NGOs"
                  value={stats.totalNGOs}
                  description="Registered NGO accounts"
                />
                <StatCard
                  title="Verified NGOs"
                  value={stats.verifiedNGOs}
                  description="Admin-verified organizations"
                />
                <StatCard
                  title="Pending Donations"
                  value={stats.pendingDonations}
                  description="Awaiting NGO confirmation"
                />
                <StatCard
                  title="Verified Donations"
                  value={stats.verifiedDonations}
                  description="Completed donations"
                />
              </div>
            )}

            <div className="mt-8">
              <Card title="Quick Actions">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">NGO Management</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {stats.totalNGOs - stats.verifiedNGOs} NGO(s) awaiting verification
                    </p>
                    <a
                      href="/admin/ngos"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Go to NGO Management →
                    </a>
                  </div>

                  <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Platform Activity</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {stats.pendingDonations} donation(s) in progress
                    </p>
                    <p className="text-sm text-gray-500">
                      Monitor donation flow and NGO activity
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
