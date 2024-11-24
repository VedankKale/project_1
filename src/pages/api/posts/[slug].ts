import type { APIRoute } from 'astro';
import { deletePost, updatePost } from '../../../lib/db';
import { isAuthenticated } from '../../../middleware/auth';

export const del: APIRoute = async ({ params, request }) => {
  const auth = await isAuthenticated({ cookies: request.cookies } as any);
  if (!auth) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { slug } = params;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), { status: 400 });
  }

  try {
    deletePost(slug);
    return new Response(JSON.stringify({ message: 'Post deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete post' }), { status: 500 });
  }
};

export const put: APIRoute = async ({ params, request }) => {
  const auth = await isAuthenticated({ cookies: request.cookies } as any);
  if (!auth) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { slug } = params;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), { status: 400 });
  }

  try {
    const updates = await request.json();
    const updated = updatePost(slug, updates);
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update post' }), { status: 500 });
  }
};