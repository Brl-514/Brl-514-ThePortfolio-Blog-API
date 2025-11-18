const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long']
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '',
    match: [/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i, 'Please provide a valid image URL']
  },
  repoUrl: {
    type: String,
    trim: true,
    default: '',
    match: [/^(https?:\/\/github\.com\/[^\/]+\/[^\/]+(?:\.git)?)$/i, 'Please provide a valid GitHub repository URL']
  },
  liveUrl: {
    type: String,
    trim: true,
    default: '',
    match: [/^(https?:\/\/.*)$/i, 'Please provide a valid live project URL']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project must belong to a user']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for user field to optimize queries
ProjectSchema.index({ user: 1 });

// Pre-populate user information when querying projects
ProjectSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username email' // Only select these fields from user
  });
  next();
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;