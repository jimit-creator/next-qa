'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiArrowLeft, FiEye, FiList } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Question, Category } from '@/types';
import Link from 'next/link';
import useSWR from 'swr';

export default function AdminQuestionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    categoryId: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);

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
  const categoriesLoading = !categoriesData && !categoriesError;

  // Use SWR for questions
  const questionsUrl = `/api/questions?page=${currentPage}&limit=${pageSize}${searchTerm ? `&search=${searchTerm}` : ''}${selectedCategory ? `&category=${selectedCategory}` : ''}`;
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
    if (status === 'loading') return;
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/questions', {
        method: editingQuestion ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingQuestion?._id,
          question: formData.question,
          answer: formData.answer,
          categoryId: formData.categoryId,
          difficulty: formData.difficulty,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        }),
      });

      if (response.ok) {
        mutate(); // Revalidate questions data after successful submission
        setIsModalOpen(false);
        setEditingQuestion(null);
        setFormData({
          question: '',
          answer: '',
          categoryId: '',
          difficulty: 'Easy',
          tags: '',
        });
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to save question');
      }
    } catch (error) {
      setError('An error occurred while saving the question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutate(); // Revalidate questions data after successful deletion
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to delete question');
      }
    } catch (error) {
      setError('An error occurred while deleting the question');
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      answer: question.answer,
      categoryId: question.categoryId,
      difficulty: question.difficulty,
      tags: question.tags?.join(', ') || '',
    });
    setIsModalOpen(true);
  };

  const handleViewAnswer = (question: Question) => {
    setViewingQuestion(question);
    setIsViewModalOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Helper function to strip HTML tags for display
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Helper function to render HTML content safely
  const renderHtmlContent = (html: string | undefined): { __html: string } => {
    return { __html: html || '' };
  };

  if (status === 'loading' || categoriesLoading || questionsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-4"
        >
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 transition-colors">
              <FiArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Questions</h1>
              <p className="text-xs text-gray-600">Manage and organize questions</p>
            </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="text-sm">
            <FiPlus className="w-3.5 h-3.5 mr-1" />
            Add Question
          </Button>
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
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
                  className="pl-8 text-sm h-8"
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
        {questionsLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {questions.map((question, index) => (
              <Card key={question._id} className="p-3 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs">
                    {(currentPage - 1) * pageSize + index + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-grow">
                        <h3 className="text-sm font-medium text-gray-900 mb-1.5">
                          {stripHtml(question.question)}
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
                                {question.tags.map((tag, i) => (
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
                          onClick={() => handleDelete(question._id)}
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
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-4 gap-1"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-7 h-7 text-sm"
              >
                {page}
              </Button>
            ))}
          </motion.div>
        )}
      </div>

      {/* View Answer Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingQuestion(null);
        }}
        title="View Answer"
        size="lg"
      >
        {viewingQuestion && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Question:</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <div
                  className="prose-content text-sm text-gray-700"
                  dangerouslySetInnerHTML={renderHtmlContent(viewingQuestion.question)}
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Answer:</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <div
                  className="prose-content text-sm text-gray-700"
                  dangerouslySetInnerHTML={renderHtmlContent(viewingQuestion.answer)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingQuestion(null);
                }}
                className="text-sm"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuestion(null);
          setFormData({
            question: '',
            answer: '',
            categoryId: '',
            difficulty: 'Easy',
            tags: '',
          });
        }}
        title={editingQuestion ? 'Edit Question' : 'Add Question'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>

          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              required
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
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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
                  tags: '',
                });
              }}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="text-sm">
              {submitting ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}