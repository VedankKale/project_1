import type { APIRoute } from 'astro';
import { createUser } from '../../lib/db';

export const get: APIRoute = async () => {
  try {
    // Create a dummy admin user
    createUser('admin@chronosphere.com', 'admin123', 'Admin User');
    
    return new Response(JSON.stringify({
      message: 'Admin user created successfully',
      email: 'admin@chronosphere.com',
      password: 'admin123'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create admin user' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}