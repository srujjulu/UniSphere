import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { seedDatabase } from './config/seedData.js';
import authRoutes from './routes/authRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration to allow requests from Vite dev server
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in local development
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static images folder access
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'UniSphere CMRTC Student Clubs Portal Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/volunteer-hours', volunteerRoutes);
app.use('/api/feedback', feedbackRoutes);

// Global 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: `API route ${req.originalUrl} not found.` });
});

// Serve frontend in production if built
const distPath = path.join(__dirname, '..', 'dist');
import('fs').then(({ default: fs }) => {
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Boot and seed database
const startServer = async () => {
  try {
    await seedDatabase();
    const server = app.listen(PORT, () => {
      console.log(`\n=================================================`);
      console.log(`🚀 UniSphere Backend Server is running on port ${PORT}`);
      console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
      console.log(`🏛️ Clubs:      http://localhost:${PORT}/api/clubs`);
      console.log(`📅 Events:     http://localhost:${PORT}/api/events`);
      console.log(`=================================================\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`\n⚠️  Port ${PORT} is already active (UniSphere backend is already running!).`);
        console.log(`📡 Test it live: http://localhost:${PORT}/api/health\n`);
      } else {
        console.error('Server startup error:', err);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
