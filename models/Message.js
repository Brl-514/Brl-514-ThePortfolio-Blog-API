const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Please provide a valid email']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    trim: true,
    minlength: [5, 'Message must be at least 5 characters long'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Index for better query performance
MessageSchema.index({ createdAt: -1 }); // For sorting by newest messages first
MessageSchema.index({ email: 1 }); // For querying messages from a specific email

// You could add a method here to flag messages as read if needed in the future
MessageSchema.methods.markAsRead = function() {
  this.read = true;
  return this.save();
};

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;