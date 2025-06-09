'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiBookmark, FiHeart } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Question, Category } from '@/types';
import useSWR from 'swr';

export default function Home() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Define a fetcher function for SWR
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error('An error occurred while fetching data.');
      // Attach extra info to the error object.
      // @ts-ignore
      error.info = await res.json();
      // @ts-ignore
      error.status = res.status;
      throw error;
    }
    return res.json();
  };

  // Use SWR for categories
  const { data: categoriesData, error: categoriesError } = useSWR<Category[]>('/api/categories', fetcher);
  const categories = categoriesData || [];
  const categoriesLoading = !categoriesData && !categoriesError;

  // Use SWR for questions
  const questionsUrl = `/api/questions?page=${currentPage}&limit=10&search=${searchTerm}&categoryId=${selectedCategory}`;
  const { data: questionsData, error: questionsError, mutate } = useSWR<{
    questions: Question[];
    total: number;
    page: number;
    totalPages: number;
  }>(questionsUrl, fetcher);

  const questions = questionsData?.questions || [];
  const totalPages = questionsData?.totalPages || 1;
  const questionsLoading = !questionsData && !questionsError;

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    }
  };

  const toggleBookmark = async (questionId: string) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.bookmarked) {
          setBookmarks([...bookmarks, questionId]);
        } else {
          setBookmarks(bookmarks.filter(id => id !== questionId));
        }
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Helper function to render HTML content safely
  const renderHtmlContent = (html: string) => {
    return { __html: html };
  };

  if (categoriesLoading || questionsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (categoriesError || questionsError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">Failed to load data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search questions, answers, or tags..."
                  value={searchTerm}
                  onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
                  className="pl-9 text-sm"
                />
              </div>
            </div>
            <div className="md:w-56">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => { setCurrentPage(1); setSelectedCategory(e.target.value); }}
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Questions List */}
        {questionsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {questions.map((question, index) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-4 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                          {question.categoryName}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-3">
                        {question.question}
                      </h3>
                      <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm mb-3">
                        <div
                          className="prose-content text-sm text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={renderHtmlContent(question.answer)}
                        />
                      </div>
                    </div>
                    {/* <button
                      onClick={() => toggleBookmark(question._id!)}
                      className={`p-1.5 rounded-lg transition-colors ml-3 ${
                        bookmarks.includes(question._id!)
                          ? 'text-red-600 bg-red-50 hover:bg-red-100'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <FiHeart className={`w-4 h-4 ${bookmarks.includes(question._id!) ? 'fill-current' : ''}`} />
                    </button> */}
                  </div>

                  {question.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {question.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No questions found matching your criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 mt-6">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                
                <span className="px-3 py-1 text-sm text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .prose h1, .prose h2, .prose h3 {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }
        
        .prose h1 { font-size: 1.25em; }
        .prose h2 { font-size: 1.125em; }
        .prose h3 { font-size: 1em; }
        
        .prose p {
          margin-bottom: 0.75em;
        }
        
        .prose ul, .prose ol {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }
        
        .prose li {
          margin-bottom: 0.25em;
        }
        
        .prose blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .prose code {
          background-color: #f3f4f6;
          padding: 0.125em 0.25em;
          border-radius: 0.25em;
          font-size: 0.875em;
        }
        
        .prose pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        .prose pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        
        .prose a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .prose a:hover {
          color: #1d4ed8;
        }
        
        .prose strong {
          font-weight: 600;
        }
        
        .prose em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}