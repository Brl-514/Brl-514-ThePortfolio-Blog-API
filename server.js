const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Set up middleware
app.use(helmet()); // Security headers
app.use(cors()); // Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON requests

// Import routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api', require('./routes/messageRoutes'));

// Central error handling middleware
app.use(require('./middleware/errorHandler'));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio_blog';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });