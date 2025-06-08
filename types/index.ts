export interface Category {
  _id?: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  _id?: string;
  question: string;
  answer: string;
  categoryId: string;
  categoryName?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Bookmark {
  _id?: string;
  userId: string;
  questionId: string;
  createdAt: Date;
}