import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import multer from 'multer';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import eventsRouter from './routes/events';
import bookingsRouter from './routes/bookings';
import adminRouter from './routes/admin';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:4200' }));

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);

import { upload } from './middleware/upload';
app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the URL relative to the server
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Internal Server Error' });
});

export default app;