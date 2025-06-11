'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiArrowLeft, FiEye, FiList } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Question, Category } from '@/types';
import Link from 'next/link';
import useSWR from 'swr';
import RichTextEditor from '@/components/ui/RichTextEditor';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Helper functions
const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const getDifficultyColor = (difficulty: string | undefined) => {
  switch (difficulty) {
    case 'Easy': return 'text-green-600 bg-green-100';
    case 'Medium': return 'text-yellow-600 bg-yellow-100';
    case 'Hard': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Helper function to render HTML content safely
const renderHtmlContent = (content: string | undefined) => ({
  __html: content || '',
});

export default function AdminQuestionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    categoryId: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    tags: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch categories
  const { data: categoriesData, error: categoriesError } = useSWR<Category[]>(
    '/api/categories',
    fetcher
  );

  // Use SWR for questions with debounced search
  const questionsUrl = `/api/questions?page=${currentPage}&limit=${pageSize}&search=${debouncedSearchTerm}&categoryId=${selectedCategory}`;
  const { data: questionsData, error: questionsError, mutate } = useSWR<{
    questions: Question[];
    total: number;
    page: number;
    totalPages: number;
  }>(questionsUrl, fetcher);

  const questions = questionsData?.questions || [];
  const totalPages = questionsData?.totalPages || 1;

  // Update loading state based on SWR
  useEffect(() => {
    if (!questionsData && !questionsError) {
      setQuestionsLoading(true);
    } else {
      setQuestionsLoading(false);
    }
  }, [questionsData, questionsError]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validate required fields
    if (!formData.question.trim()) {
      setError('Question is required');
      setSubmitting(false);
      return;
    }
    if (!formData.answer.trim()) {
      setError('Answer is required');
      setSubmitting(false);
      return;
    }
    if (!formData.categoryId) {
      setError('Category is required');
      setSubmitting(false);
      return;
    }
    if (!formData.difficulty) {
      setError('Difficulty is required');
      setSubmitting(false);
      return;
    }

    try {
      const url = editingQuestion ? `/api/questions?id=${editingQuestion._id}` : '/api/questions';
      const method = editingQuestion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _id: editingQuestion?._id, // Include _id for PUT requests
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save question');
      }

      await mutate();
      setIsModalOpen(false);
      setEditingQuestion(null);
      setFormData({
        question: '',
        answer: '',
        categoryId: '',
        difficulty: 'Easy',
        tags: [],
      });
    } catch (error) {
      console.error('Error saving question:', error);
      setError(error instanceof Error ? error.message : 'Failed to save question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const response = await fetch(`/api/questions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete question');
      }

      await mutate();
    } catch (error) {
      console.error('Error deleting question:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete question');
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      answer: question.answer,
      categoryId: question.categoryId || '',
      difficulty: question.difficulty,
      tags: question.tags || [],
    });
    setIsModalOpen(true);
  };

  const handleViewAnswer = (question: Question) => {
    setViewingQuestion(question);
    setIsViewModalOpen(true);
  };

  if (status === 'loading' || !categoriesData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-base font-semibold text-gray-900 mb-1">Questions Management</h1>
              <p className="text-xs text-gray-500">Add, edit, and manage interview questions</p>
            </div>
            <Button
              onClick={() => {
                setEditingQuestion(null);
                setFormData({
                  question: '',
                  answer: '',
                  categoryId: '',
                  difficulty: 'Easy',
                  tags: [],
                });
                setIsModalOpen(true);
              }}
              className="h-8"
            >
              <FiPlus className="w-4 h-4 mr-1" />
              Add Question
            </Button>
          </div>
        </motion.div>

        {/* Search, Filter, and Page Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-3 mb-4"
        >
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => { setCurrentPage(1); setSelectedCategory(e.target.value); }}
                  className="w-48 pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-8"
                >
                  <option value="">All Categories</option>
                  {categoriesData?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <FiList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setPageSize(Number(e.target.value));
                  }}
                  className="w-32 pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-8"
                >
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                  <option value="999999">All</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Questions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 relative"
        >
          {questionsLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}
          {questions.map((question: Question, index: number) => (
            <Card key={question._id} className="p-3 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs">
                  {(currentPage - 1) * pageSize + index + 1}
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-900 mb-1.5">
                        {question.question.replace(/<[^>]*>/g, '')}
                      </h3>
                      <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        {question.categoryId && (
                          <span className="text-xs text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">
                            {categoriesData?.find(c => c._id === question.categoryId)?.name}
                          </span>
                        )}
                        {question.tags && question.tags.length > 0 && (
                          <>
                            <span className="text-gray-300">•</span>
                            <div className="flex flex-wrap gap-1">
                              {question.tags.map((tag: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs text-gray-500"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAnswer(question)}
                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors p-1"
                      >
                        <FiEye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(question)}
                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors p-1"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => question._id && handleDelete(question._id)}
                        className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors p-1"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {!questionsLoading && questions.length === 0 && (
            <div className="text-center py-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">No questions found matching your criteria.</p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex justify-center"
          >
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                    Answer
                  </label>
                  <RichTextEditor
                    value={formData.answer}
                    onChange={(value) => setFormData({ ...formData, answer: value })}
                    placeholder="Enter your answer here..."
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categoriesData?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., javascript, react, typescript"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingQuestion(null);
                      setFormData({
                        question: '',
                        answer: '',
                        categoryId: '',
                        difficulty: 'Easy',
                        tags: [],
                      });
                    }}
                    className="h-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-8"
                  >
                    {submitting ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Answer Modal */}
        {isViewModalOpen && viewingQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold">Question Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setViewingQuestion(null);
                  }}
                  className="h-8"
                >
                  Close
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Question</h3>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={renderHtmlContent(viewingQuestion.question)}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Answer</h3>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={renderHtmlContent(viewingQuestion.answer)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}