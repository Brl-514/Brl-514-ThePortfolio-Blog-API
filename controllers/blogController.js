const BlogPost = require('../models/BlogPost');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
const getBlogPosts = async (req, res, next) => {
  try {
    const blogPosts = await BlogPost.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: blogPosts.length,
      data: blogPosts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post
// @route   GET /api/blog/:id
// @access  Public
const getBlogPost = async (req, res, next) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id)
      .populate('author', 'username email')
      .populate('comments', 'body author createdAt');
    
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
        message: `Blog post with ID ${req.params.id} does not exist`
      });
    }
    
    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid blog post ID format',
        message: 'Please provide a valid blog post ID'
      });
    }
    next(error);
  }
};

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Protected (User must be logged in)
const createBlogPost = async (req, res, next) => {
  try {
    // Add author ID to the request body
    req.body.author = req.user.id;
    
    const blogPost = await BlogPost.create(req.body);
    
    // Populate author information in the response
    const populatedBlogPost = await BlogPost.findById(blogPost._id)
      .populate('author', 'username email');
    
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: populatedBlogPost
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: messages.join(', ')
      });
    }
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Protected (Only author can update)
const updateBlogPost = async (req, res, next) => {
  try {
    let blogPost = await BlogPost.findById(req.params.id);
    
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
        message: `Blog post with ID ${req.params.id} does not exist`
      });
    }
    
    // Check if user is the author
    if (blogPost.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
        message: 'You are not authorized to update this blog post'
      });
    }
    
    // Update the blog post with new data
    blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'username email');
    
    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blogPost
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid blog post ID format',
        message: 'Please provide a valid blog post ID'
      });
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: messages.join(', ')
      });
    }
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Protected (Only author can delete)
const deleteBlogPost = async (req, res, next) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
        message: `Blog post with ID ${req.params.id} does not exist`
      });
    }
    
    // Check if user is the author
    if (blogPost.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
        message: 'You are not authorized to delete this blog post'
      });
    }
    
    await blogPost.remove();
    
    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
      data: null
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid blog post ID format',
        message: 'Please provide a valid blog post ID'
      });
    }
    next(error);
  }
};

module.exports = { getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost };