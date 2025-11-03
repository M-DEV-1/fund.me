import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const dashboardContent = {
    DONOR: {
      title: 'Donor Dashboard',
      description: 'Browse requests and track your donations',
      cards: [
        {
          title: 'Browse Requests',
          description: 'View open donation requests from verified NGOs',
          link: '/donor/requests',
          linkText: 'View Requests',
        },
        {
          title: 'My Donations',
          description: 'Track the status of your donations',
          link: '/donor/donations',
          linkText: 'View History',
        },
      ],
    },
    NGO: {
      title: 'NGO Dashboard',
      description: 'Manage your requests and incoming donations',
      cards: [
        {
          title: 'My Requests',
          description: 'Create and manage your donation requests',
          link: '/ngo/requests',
          linkText: 'Manage Requests',
        },
        {
          title: 'Incoming Donations',
          description: 'View and update donation statuses',
          link: '/ngo/donations',
          linkText: 'View Donations',
        },
      ],
    },
    ADMIN: {
      title: 'Admin Dashboard',
      description: 'Manage NGOs and view reports',
      cards: [
        {
          title: 'Manage NGOs',
          description: 'Verify and manage NGO accounts',
          link: '/admin/ngos',
          linkText: 'Manage NGOs',
        },
        {
          title: 'Reports',
          description: 'View donation and request statistics',
          link: '/admin/reports',
          linkText: 'View Reports',
        },
      ],
    },
  };

  const content = dashboardContent[user.role];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: user.email.split('@')[0], role: user.role }} />
      
      <div className="flex">
        <Sidebar role={user.role} />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
              <p className="text-gray-600 mt-2">{content.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {content.cards.map((card, index) => (
                <Card key={index} title={card.title}>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <Link
                    href={card.link}
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    {card.linkText} →
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
