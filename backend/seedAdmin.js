const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the Admin model
const Admin = require('./models/Admin');

// Default admin credentials from .env or defaults
const defaultAdmin = {
  name: 'Default Admin',
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  organisationName: 'RootCause Admin Org',
  password: process.env.ADMIN_PASSCODE || 'admin123',
  state: 'Karnataka'
};

const seedAdmin = async () => {
  try {
    // Connect to MongoDB using the same URI as the main server
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: defaultAdmin.email });
    
    if (existingAdmin) {
      console.log(`Admin with email ${defaultAdmin.email} already exists. Skipping creation.`);
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
      
      // Create the admin
      const admin = new Admin({
        name: defaultAdmin.name,
        email: defaultAdmin.email,
        organisationName: defaultAdmin.organisationName,
        password: hashedPassword,
        state: defaultAdmin.state
      });
      
      await admin.save();
      console.log(`Default admin created with email: ${defaultAdmin.email}`);
    }

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedAdmin();