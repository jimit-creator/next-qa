'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInitButton, setShowInitButton] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        setShowInitButton(true);
      } else {
        const session = await getSession();
        if (session?.user?.role === 'admin') {
          router.push('/admin');
        } else {
          setError('Access denied. Admin privileges required.');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/init', { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        alert(`Database initialized! Admin credentials:\nEmail: ${data.adminCredentials.email}\nPassword: ${data.adminCredentials.password}`);
        setEmail(data.adminCredentials.email);
        setPassword(data.adminCredentials.password);
        setShowInitButton(false);
      } else {
        setError(data.error || 'Failed to initialize database');
      }
    } catch (error) {
      setError('Failed to initialize database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-gray-600">Sign in to access the admin panel</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Sign In
            </Button>

            {showInitButton && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  First time setup? Initialize the database with sample data.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={initializeDatabase}
                  loading={loading}
                  className="w-full"
                >
                  Initialize Database
                </Button>
              </div>
            )}
          </form>
        </Card>
      </motion.div>
    </div>
  );
}