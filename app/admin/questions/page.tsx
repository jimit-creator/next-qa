'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiArrowLeft, FiEye } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Question, Category } from '@/types';
import Link from 'next/link';
import useSWR from 'swr';

export default function QuestionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    categoryId: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
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
      const url = '/api/questions';
      const method = editingQuestion ? 'PUT' : 'POST';
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const body = editingQuestion 
        ? { ...formData, _id: editingQuestion._id, tags }
        : { ...formData, tags };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        mutate(); // Revalidate questions data after successful submission
        setIsModalOpen(false);
        setEditingQuestion(null);
        setFormData({
          question: '',
          answer: '',
          categoryId: '',
          difficulty: 'Medium',
          tags: '',
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save question');
      }
    } catch (error) {
      alert('Failed to save question');
    } finally {
      setSubmitting(false);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/questions?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutate(); // Revalidate questions data after successful deletion
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete question');
      }
    } catch (error) {
      alert('Failed to delete question');
    }
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
  const renderHtmlContent = (html: string) => {
    return { __html: html };
  };

  if (status === 'loading' || categoriesLoading || questionsLoading) {
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

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 transition-colors">
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and organize questions</p>
            </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="sm">
            <FiPlus className="w-4 h-4 mr-1.5" />
            Add Question
          </Button>
        </motion.div>

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
                  placeholder="Search questions..."
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {questions.map((question, index) => (
              <Card key={question._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                    {(currentPage - 1) * 10 + index + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {stripHtml(question.question)}
                        </h3>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          {question.categoryId && (
                            <span className="text-sm text-gray-600">
                              {categories.find(c => c._id === question.categoryId)?.name}
                            </span>
                          )}
                        </div>
                        {question.tags && question.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {question.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewAnswer(question)}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <FiEye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(question)}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(question._id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
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
              difficulty: 'Medium',
              tags: '',
            });
          }}
          title={editingQuestion ? 'Edit Question' : 'Add Question'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              required
              placeholder="Enter the interview question"
              className="text-sm"
            />
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Answer
              </label>
              <RichTextEditor
                value={formData.answer}
                onChange={(value) => setFormData({ ...formData, answer: value })}
                placeholder="Enter the detailed answer with formatting..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <Input
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. javascript, react, node"
              className="text-sm"
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingQuestion(null);
                  setFormData({
                    question: '',
                    answer: '',
                    categoryId: '',
                    difficulty: 'Medium',
                    tags: '',
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={submitting} size="sm">
                {editingQuestion ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>

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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Question:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div
                    className="prose-content text-gray-700"
                    dangerouslySetInnerHTML={renderHtmlContent(viewingQuestion.question || '')}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Answer:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div
                    className="prose-content text-gray-700"
                    dangerouslySetInnerHTML={renderHtmlContent(viewingQuestion.answer || '')}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setViewingQuestion(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}