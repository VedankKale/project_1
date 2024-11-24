import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('token', { path: '/' });
  return redirect('/admin/login');
};