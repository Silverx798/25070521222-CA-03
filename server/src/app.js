const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const storyRoutes = require('./routes/storyRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { getRegions, searchStories } = require('./controllers/storyController');
const { createSubmission } = require('./controllers/userController');
const { authenticate } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false // Allows loading local tiles and artwork
}));

app.use(cors({
  origin: true, // Allow frontend dev server
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Mythos Atlas API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount Public Discovery Endpoints
app.get('/api/regions', getRegions);
app.get('/api/search', searchStories);
app.post('/api/submissions', authenticate, createSubmission);

// Mount Modular Routes
app.use('/api/stories', storyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/me', userRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
