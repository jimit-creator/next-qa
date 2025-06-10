'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiBookmark, FiHeart, FiArrowRight } from 'react-icons/fi';
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
  const questionsUrl = `/api/questions?page=${currentPage}&limit=20&search=${searchTerm}&categoryId=${selectedCategory}`;
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Question Bank
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of carefully curated questions and answers. 
            Find solutions, learn new concepts, and enhance your knowledge.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search questions, answers, or tags..."
                  value={searchTerm}
                  onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
                  className="pl-12 text-base py-3"
                />
              </div>
            </div>
            <div className="md:w-64">
              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => { setCurrentPage(1); setSelectedCategory(e.target.value); }}
                  className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {questions.map((question, index) => (
              <Card key={question._id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-lg">
                    {(currentPage - 1) * 20 + index + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                        {question.categoryName}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {question.question}
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-4">
                      <div
                        className="prose-content text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={renderHtmlContent(question.answer)}
                      />
                    </div>
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500 text-lg">No questions found matching your criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-8 gap-2"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </motion.div>
            )}
          </motion.div>
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