import fs from 'fs';
import bcrypt from 'bcryptjs';

const DB_PATH = 'data';
const USERS_FILE = `${DB_PATH}/users.json`;

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH);
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '[]');
}

// Create admin user
const email = 'admin@chronosphere.com';
const password = 'admin123';
const name = 'Admin User';

try {
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  // Check if admin user already exists
  const adminIndex = users.findIndex(u => u.email === email);
  
  if (adminIndex === -1) {
    users.push({
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  } else {
    users[adminIndex] = {
      ...users[adminIndex],
      password: hashedPassword,
      updated_at: new Date().toISOString()
    };
  }
  
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log('Admin user created successfully:');
  console.log('Email:', email);
  console.log('Password:', password);
} catch (error) {
  console.error('Error creating admin user:', error);
}