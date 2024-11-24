import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const DB_PATH = 'data';
const USERS_FILE = `${DB_PATH}/users.json`;
const POSTS_FILE = `${DB_PATH}/posts.json`;
const COMMENTS_FILE = `${DB_PATH}/comments.json`;

// Ensure data directory and files exist
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH);
}

[USERS_FILE, POSTS_FILE, COMMENTS_FILE].forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '[]');
  }
});

// Helper functions
const readJSON = (file: string) => {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
};

const writeJSON = (file: string, data: any) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// User functions
export const createUser = (email: string, password: string, name: string) => {
  const users = readJSON(USERS_FILE);
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  users.push({
    id: users.length + 1,
    email,
    password: hashedPassword,
    name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  writeJSON(USERS_FILE, users);
};

export const validateUser = (email: string, password: string) => {
  const users = readJSON(USERS_FILE);
  const user = users.find((u: any) => u.email === email);
  
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password)) return null;
  
  const token = jwt.sign({ id: user.id, email: user.email }, 'your-secret-key', { expiresIn: '24h' });
  return { user, token };
};

// Post functions
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  description: string;
  category: string;
  image: string;
  published: boolean;
  publishDate?: Date | null;
  created_at: string;
  updated_at: string;
}

export const createPost = (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
  const posts = readJSON(POSTS_FILE);
  const newPost = {
    ...post,
    id: posts.length + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  posts.push(newPost);
  writeJSON(POSTS_FILE, posts);
  return newPost;
};

export const updatePost = (slug: string, updates: Partial<Post>) => {
  const posts = readJSON(POSTS_FILE);
  const index = posts.findIndex((p: Post) => p.slug === slug);
  
  if (index === -1) return null;
  
  posts[index] = {
    ...posts[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  writeJSON(POSTS_FILE, posts);
  return posts[index];
};

export const deletePost = (slug: string) => {
  const posts = readJSON(POSTS_FILE);
  const filtered = posts.filter((p: Post) => p.slug !== slug);
  writeJSON(POSTS_FILE, filtered);
};

export const getPost = (slug: string) => {
  const posts = readJSON(POSTS_FILE);
  return posts.find((p: Post) => p.slug === slug);
};

export const getAllPosts = (publishedOnly = true) => {
  const posts = readJSON(POSTS_FILE);
  const now = new Date();
  
  return posts.filter((p: Post) => {
    if (publishedOnly && !p.published) return false;
    if (p.publishDate && new Date(p.publishDate) > now) return false;
    return true;
  });
};

export const getPostsByCategory = (category: string, publishedOnly = true) => {
  const posts = readJSON(POSTS_FILE);
  const now = new Date();
  
  return posts.filter((p: Post) => {
    if (p.category !== category) return false;
    if (publishedOnly && !p.published) return false;
    if (p.publishDate && new Date(p.publishDate) > now) return false;
    return true;
  });
};

// Comment functions
interface Comment {
  id: number;
  post_slug: string;
  author: string;
  content: string;
  approved: boolean;
  created_at: string;
}

export const createComment = (comment: Omit<Comment, 'id' | 'created_at'>) => {
  const comments = readJSON(COMMENTS_FILE);
  const newComment = {
    ...comment,
    id: comments.length + 1,
    created_at: new Date().toISOString()
  };
  
  comments.push(newComment);
  writeJSON(COMMENTS_FILE, comments);
  return newComment;
};

export const approveComment = (id: number) => {
  const comments = readJSON(COMMENTS_FILE);
  const index = comments.findIndex((c: Comment) => c.id === id);
  
  if (index === -1) return null;
  
  comments[index].approved = true;
  writeJSON(COMMENTS_FILE, comments);
  return comments[index];
};

export const getComments = (post_slug: string, approvedOnly = true) => {
  const comments = readJSON(COMMENTS_FILE);
  return comments.filter((c: Comment) => 
    c.post_slug === post_slug && (!approvedOnly || c.approved)
  );
};