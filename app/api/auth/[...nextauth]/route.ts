import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';

const handler = (req: NextRequest, context: { params: { nextauth: string[] } }) => {
  return NextAuth(req, context, authOptions);
};

export { handler as GET, handler as POST };