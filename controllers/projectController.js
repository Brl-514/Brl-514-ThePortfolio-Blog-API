const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
        message: `Project with ID ${req.params.id} does not exist`
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid project ID format',
        message: 'Please provide a valid project ID'
      });
    }
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Protected (User must be logged in)
const createProject = async (req, res, next) => {
  try {
    // Add user ID to the request body
    req.body.user = req.user.id;
    
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Protected (User must be logged in)
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
        message: `Project with ID ${req.params.id} does not exist`
      });
    }
    
    // More robust ID comparison - handle populated user object
    const projectUserId = String(project.user._id || project.user);
    const currentUserId = String(req.user.id);
    
    // Debug logs for ID comparison
    console.log('Project user ID (extracted):', projectUserId);
    console.log('Current user ID:', currentUserId);
    console.log('ID match result:', projectUserId === currentUserId);
    
    // Check if user is the project owner with more robust string conversion
    if (projectUserId !== currentUserId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
        message: 'You are not authorized to update this project',
        details: {
          projectUserId: projectUserId,
          currentUserId: currentUserId,
          match: false
        }
      });
    }
    
    // Update the project with new data
    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid project ID format',
        message: 'Please provide a valid project ID'
      });
    }
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Protected (User must be logged in)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
        message: `Project with ID ${req.params.id} does not exist`
      });
    }
    
    // More robust ID comparison - handle populated user object
    const projectUserId = String(project.user._id || project.user);
    const currentUserId = String(req.user.id);
    
    // Debug logs for ID comparison
    console.log('Project user ID (extracted):', projectUserId);
    console.log('Current user ID:', currentUserId);
    console.log('ID match result:', projectUserId === currentUserId);
    
    // Check if user is the project owner with more robust string conversion
    if (projectUserId !== currentUserId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
        message: 'You are not authorized to delete this project',
        details: {
          projectUserId: projectUserId,
          currentUserId: currentUserId,
          match: false
        }
      });
    }
    
    await project.remove();
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: null
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid project ID format',
        message: 'Please provide a valid project ID'
      });
    }
    next(error);
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };