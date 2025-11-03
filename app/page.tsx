import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Fund.me</h1>
            <div className="flex gap-2 sm:gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Connect Donors with NGOs
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            A transparent platform to bridge the gap between generous donors and NGOs
            making a real difference in communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">Start Donating</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">For Donors</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Browse verified NGO requests and make donations with full transparency.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>✓ View open donation requests</li>
              <li>✓ Track your donation history</li>
              <li>✓ Support verified NGOs</li>
            </ul>
          </Card>

          <Card className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">For NGOs</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Post your needs and receive donations from caring individuals.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>✓ Create donation requests</li>
              <li>✓ Manage incoming donations</li>
              <li>✓ Get verified by admins</li>
            </ul>
          </Card>

          <Card className="p-6 text-center sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-semibold mb-3">Transparent</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
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

