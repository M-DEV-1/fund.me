'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DONOR',
    ngoName: '',
    ngoDescription: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === 'NGO') {
        payload.ngo = {
          name: formData.ngoName,
          description: formData.ngoDescription,
        };
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const isNGO = formData.role === 'NGO';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fund.me
          </h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Join our community of changemakers
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
                disabled={loading}
                className="h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
                disabled={loading}
                className="h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                disabled={loading}
                className="h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700 dark:text-gray-300 font-medium">Account Type</Label>
              <Select
                value={formData.role}
                onValueChange={(value: string) => setFormData({ ...formData, role: value })}
                disabled={loading}
              >
                <SelectTrigger id="role" className="w-full h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DONOR">🤝 Donor - Make donations</SelectItem>
                  <SelectItem value="NGO">🏛️ NGO - Request donations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isNGO && (
              <>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <span className="mr-2">🏛️</span> NGO Information
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ngoName" className="text-gray-700 dark:text-gray-300 font-medium">NGO Name</Label>
                  <Input
                    id="ngoName"
                    type="text"
                    value={formData.ngoName}
                    onChange={(e) => setFormData({ ...formData, ngoName: e.target.value })}
                    placeholder="Hope Foundation"
                    required={isNGO}
                    disabled={loading}
                    className="h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ngoDescription" className="text-gray-700 dark:text-gray-300 font-medium">NGO Description</Label>
                  <Textarea
                    id="ngoDescription"
                    value={formData.ngoDescription}
                    onChange={(e) => setFormData({ ...formData, ngoDescription: e.target.value })}
                    placeholder="Brief description of your NGO and its mission..."
                    rows={3}
                    disabled={loading}
                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all resize-none"
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-4 py-3 rounded-lg text-sm text-yellow-800 dark:text-yellow-400">
                  <span className="font-semibold">⚠️ Note:</span> NGO accounts require admin verification before you can create requests.
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
