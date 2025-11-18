const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: [true, 'Please provide a comment body'],
    trim: true,
    minlength: [1, 'Comment cannot be empty'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have an author']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: [true, 'Comment must belong to a blog post']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Indexes for better query performance
CommentSchema.index({ post: 1, createdAt: 1 });
CommentSchema.index({ author: 1 });

// Pre-populate author information when querying comments
CommentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'username email' // Only select these fields from user
  });
  next();
});

// Cascade delete comments when a blog post is deleted
CommentSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    // If we wanted to perform any additional cleanup, we could do it here
    console.log(`Comment ${doc._id} deleted for post ${doc.post}`);
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;