import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">DonationHub</h1>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Connect Donors with NGOs
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A transparent platform to bridge the gap between generous donors and NGOs
            making a real difference in communities.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg">Start Donating</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="secondary">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <Card title="For Donors" className="text-center">
            <p className="text-gray-600 mb-4">
              Browse verified NGO requests and make donations with full transparency.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>✓ View open donation requests</li>
              <li>✓ Track your donation history</li>
              <li>✓ Support verified NGOs</li>
            </ul>
          </Card>

          <Card title="For NGOs" className="text-center">
            <p className="text-gray-600 mb-4">
              Post your needs and receive donations from caring individuals.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>✓ Create donation requests</li>
              <li>✓ Manage incoming donations</li>
              <li>✓ Get verified by admins</li>
            </ul>
          </Card>

          <Card title="Transparent" className="text-center">
            <p className="text-gray-600 mb-4">
              Admin oversight ensures all NGOs are verified and legitimate.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>✓ Admin verification process</li>
              <li>✓ Real-time status updates</li>
              <li>✓ Complete donation tracking</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

