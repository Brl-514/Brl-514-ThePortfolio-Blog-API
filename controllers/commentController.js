const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');

// @desc    Get all comments for a blog post
// @route   GET /api/blog/:postId/comments
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Check if the blog post exists
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
        message: `Blog post with ID ${postId} does not exist`
      });
    }

    // Get all comments for this post
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
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

// @desc    Create a new comment for a blog post
// @route   POST /api/blog/:postId/comments
// @access  Protected (User must be logged in)
const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;

    // Check if body is provided
    if (!body || body.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Comment body is required',
        message: 'Please provide a comment body'
      });
    }

    // Check if the blog post exists
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
        message: `Blog post with ID ${postId} does not exist`
      });
    }

    // Create comment with user as author and post reference
    const comment = await Comment.create({
      body,
      author: req.user.id,
      post: postId
    });

    // Populate author information in the response
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username email');

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: populatedComment
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

module.exports = { getComments, createComment };