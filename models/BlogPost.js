const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a blog post title'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long']
  },
  content: {
    type: String,
    required: [true, 'Please provide blog post content'],
    minlength: [20, 'Content must be at least 20 characters long']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Blog post must have an author']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Indexes for better query performance
BlogPostSchema.index({ author: 1 });
BlogPostSchema.index({ createdAt: -1 }); // For sorting by newest posts first

// Pre-populate author information when querying blog posts
BlogPostSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'username email' // Only select these fields from user
  });
  next();
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPost;