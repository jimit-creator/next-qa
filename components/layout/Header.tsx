'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';

export default function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-xl font-bold text-gray-900">InterviewQA</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Browse Questions
            </Link>
            {session?.user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FiUser className="w-5 h-5" />
                  <span>{session.user.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
                    {session.user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiSettings className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Admin Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Questions
              </Link>
              {session?.user?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="text-left text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/admin/login"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}