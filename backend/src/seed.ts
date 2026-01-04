import 'dotenv/config';
import bcrypt from 'bcryptjs';
import * as userModel from './models/userModel';

async function run() {
  try {
    const existing = await userModel.findUserByUsername('admin');
    if (existing) {
      console.log('Admin user already exists:', existing.username);
      process.exit(0);
    }
    const hash = await bcrypt.hash('adminpass', 10);
    const user = await userModel.createUser('admin', hash, 'admin');
    console.log('Created admin user:', { id: user.id, username: user.username, role: user.role });
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

run();
