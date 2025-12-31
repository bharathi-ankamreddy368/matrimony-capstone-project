import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import * as userModel from '../models/userModel';
import { registerValidators, loginValidators } from '../middleware/validators';
import { validateRequest } from '../middleware/validate';
dotenv.config();
const router = Router();

// register
router.post('/register', registerValidators, validateRequest, async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const existing = await userModel.findUserByUsername(username);
  if (existing) return res.status(409).json({ error: 'username already exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser(username, hash, role || 'attendee');
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
  res.status(201).json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// login
router.post('/login', loginValidators, validateRequest, async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const user = await userModel.findUserByUsername(username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

export default router;
