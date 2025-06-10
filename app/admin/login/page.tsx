'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Eye, EyeOff, HelpCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInitButton, setShowInitButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
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
              label={
                <div className="flex items-center gap-2">
                  Email
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setShowEmailTooltip(true)}
                      onMouseLeave={() => setShowEmailTooltip(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Email requirements"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                    {showEmailTooltip && (
                      <div className="absolute left-0 mt-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10">
                        <div className="font-medium mb-1">Email Requirements:</div>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Must be a valid email format</li>
                          <li>Example: admin@example.com</li>
                          <li>Must be registered in the system</li>
                        </ul>
                        <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
              }
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />

            <Input
              label={
                <div className="flex items-center gap-2">
                  Password
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setShowPasswordTooltip(true)}
                      onMouseLeave={() => setShowPasswordTooltip(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Password requirements"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                    {showPasswordTooltip && (
                      <div className="absolute left-0 mt-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10">
                        <div className="font-medium mb-1">Password Requirements:</div>
                        <ul className="list-disc list-inside space-y-1">
                          <li>At least 8 characters</li>
                          <li>Include uppercase and lowercase letters</li>
                          <li>Include at least one number</li>
                          <li>Include at least one special character</li>
                        </ul>
                        <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
              }
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              }
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