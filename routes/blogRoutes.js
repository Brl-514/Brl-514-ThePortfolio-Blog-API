const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} = require('../controllers/blogController');
const { getComments, createComment } = require('../controllers/commentController');

// Blog post routes
router
  .route('/')
  .get(getBlogPosts)         // Public: GET /api/blog
  .post(protect, createBlogPost);  // Protected: POST /api/blog

router
  .route('/:id')
  .get(getBlogPost)          // Public: GET /api/blog/:id
  .put(protect, updateBlogPost)    // Protected: PUT /api/blog/:id (author only)
  .delete(protect, deleteBlogPost); // Protected: DELETE /api/blog/:id (author only)

// Comment routes for blog posts
router
  .route('/:postId/comments')
  .get(getComments)          // Public: GET /api/blog/:postId/comments
  .post(protect, createComment);  // Protected: POST /api/blog/:postId/comments

module.exports = router;