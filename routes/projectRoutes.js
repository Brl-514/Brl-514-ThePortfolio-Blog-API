const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// Project routes
router
  .route('/')
  .get(getProjects)         // Public: GET /api/projects
  .post(protect, createProject);  // Protected: POST /api/projects

router
  .route('/:id')
  .get(getProject)          // Public: GET /api/projects/:id
  .put(protect, updateProject)    // Protected: PUT /api/projects/:id
  .delete(protect, deleteProject); // Protected: DELETE /api/projects/:id

module.exports = router;