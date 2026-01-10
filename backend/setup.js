#!/usr/bin/env node

/**
 * Setup script for RootCause Backend
 * This script helps initialize the environment and dependencies
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Setting up RootCause Backend...\n');

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  console.log('   Please run: npm install\n');
} else {
  console.log('✅ Dependencies already installed\n');
}

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file with default configuration...');
  
  const envContent = `MONGO_URI=mongodb+srv://soumayanchatterjee2_db_user:Hello@cluster0.rfqpn5a.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
PORT=5000

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSCODE=admin123
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with default configuration\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Check if MongoDB URI is set
let mongoUri = 'not set';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const mongoMatch = envContent.match(/MONGO_URI=(.*)/);
  if (mongoMatch && mongoMatch[1]) {
    mongoUri = mongoMatch[1];
  }
}

console.log('📡 MongoDB URI:', mongoUri);
console.log('');

// Provide next steps
console.log('🚀 Next Steps:');
console.log('   1. Make sure MongoDB is running');
console.log('   2. Update .env file with your actual credentials if needed');
console.log('   3. Start the server with: npm run dev\n');

console.log('📋 Authentication System:');
console.log('   - Farmer login: phone number + password');
console.log('   - Admin login: email + password');
console.log('   - Passwords are securely hashed with bcrypt\n');

console.log('✅ Setup complete! Your authentication system is ready.');