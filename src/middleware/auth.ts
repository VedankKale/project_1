import type { APIContext } from 'astro';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

export async function isAuthenticated(context: APIContext) {
  const token = context.cookies.get('token')?.value;
  
  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return !!decoded;
  } catch (error) {
    return false;
  }
}

export function setAuthCookie(context: APIContext, token: string) {
  context.cookies.set('token', token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  });
}