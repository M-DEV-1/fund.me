'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fund.me
          </h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Sign in to make a difference
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="donor@example.com"
                required
                disabled={loading}
                className="h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              />
            </div>

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
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-semibold mb-3">
              Demo Credentials:
            </p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md">
                <span className="font-semibold text-blue-700 dark:text-blue-400">Admin:</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">admin@example.com / admin123</span>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-md">
                <span className="font-semibold text-green-700 dark:text-green-400">Donor:</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">donor@example.com / donor123</span>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-md">
                <span className="font-semibold text-purple-700 dark:text-purple-400">NGO:</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">hope@ngo.com / ngo123</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
