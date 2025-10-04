require('dotenv').config();
const mongoose = require('mongoose');
const Permission = require('./schema/permission');
const Role = require('./schema/role');
const User = require('./schema/user');

// Dummy permissions based on README
const dummyPermissions = [
  {
    name: 'read',
    description: 'Permission to view and read data'
  },
  {
    name: 'write',
    description: 'Permission to create and edit data'
  },
  {
    name: 'delete',
    description: 'Permission to delete data'
  }
];

// Dummy roles based on README
const dummyRoles = [
  {
    name: 'Admin',
    description: 'Full access - can read, write, and delete',
    permissions: ['read', 'write', 'delete']
  },
  {
    name: 'Dev',
    description: 'Developer access - can read and write',
    permissions: ['read', 'write']
  },
  {
    name: 'Viewer',
    description: 'View-only access - can only read',
    permissions: ['read']
  }
];

// Dummy users based on README
const dummyUsers = [
  {
    name: 'Admin User',
    email: 'admin@mail.com',
    password: 'admin',
    role: 'Admin',
    permissions: ['read', 'write', 'delete'],
    provider: 'local'
  },
  {
    name: 'Developer User',
    email: 'dev@mail.com',
    password: 'dev',
    role: 'Dev',
    permissions: ['read', 'write'],
    provider: 'local'
  },
  {
    name: 'Viewer User',
    email: 'viewer@mail.com',
    password: 'viewer',
    role: 'Viewer',
    permissions: ['read'],
    provider: 'local'
  }
];

/**
 * Seed database with dummy data if collections are empty
 */
async function seedDatabase() {
  try {
    console.log('🌱 Checking database for seed data...');

    // Check and seed Permissions
    const permissionCount = await Permission.countDocuments();
    if (permissionCount === 0) {
      console.log('📝 No permissions found. Creating dummy permissions...');
      await Permission.insertMany(dummyPermissions);
      console.log('✅ Permissions created successfully!');
    } else {
      console.log(`✓ Found ${permissionCount} existing permissions.`);
    }

    // Check and seed Roles
    const roleCount = await Role.countDocuments();
    if (roleCount === 0) {
      console.log('👥 No roles found. Creating dummy roles...');
      await Role.insertMany(dummyRoles);
      console.log('✅ Roles created successfully!');
    } else {
      console.log(`✓ Found ${roleCount} existing roles.`);
    }

    // Check and seed Users (optional - uncomment if you want to auto-create users)
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('👤 No users found. Creating dummy users...');
      
      // Register users using the User model's register method (handles password hashing)
      for (const userData of dummyUsers) {
        try {
          const { password, ...userDataWithoutPassword } = userData;
          const user = new User(userDataWithoutPassword);
          await User.register(user, password);
          console.log(`✓ User created: ${userData.email}`);
        } catch (error) {
          console.error(`✗ Error creating user ${userData.email}:`, error.message);
        }
      }
      console.log('✅ Users created successfully!');
    } else {
      console.log(`✓ Found ${userCount} existing users.`);
    }

    console.log('🎉 Database seeding completed!\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

module.exports = seedDatabase;
