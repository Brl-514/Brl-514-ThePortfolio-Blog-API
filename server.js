const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// 定义CORS白名单
const allowedOrigins = [
  'https://portfolio-front-end-indol.vercel.app', // Vercel生产环境
  'http://localhost:3000' // 本地开发环境
];

// 配置CORS选项
const corsOptions = {
  origin: function(origin, callback) {
    // 检查请求的来源是否在白名单中
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// 配置中间件 - 确保CORS在所有路由和express.json()之前
app.use(helmet()); // 安全头
app.use(cors(corsOptions)); // 跨域资源共享
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