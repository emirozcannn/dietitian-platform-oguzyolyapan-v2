import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/lib/mongodb.js';

// Environment variables
dotenv.config();

// Debug: JWT_SECRET kontrolü
console.log('🔑 JWT_SECRET status:', process.env.JWT_SECRET ? 'Found' : 'Not found');
console.log('🔑 JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB bağlantısı
connectDB();

// Routes
import authRoutes from './routes/auth.js';
import packagesRoutes from './routes/packages.js';
import testimonialsRoutes from './routes/testimonials.js';
import blogRoutes from './routes/blog.js';
import categoryRoutes from './routes/category.js';

app.use('/api/auth', authRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Oğuz Yolyapan API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint bulunamadı'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
