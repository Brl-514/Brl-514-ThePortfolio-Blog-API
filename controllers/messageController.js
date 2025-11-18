const Message = require('../models/Message');

// @desc    Create a new message (contact form submission)
// @route   POST /api/contact
// @access  Public
const createMessage = async (req, res, next) => {
  try {
    const { name, email, message: messageBody } = req.body;

    // Validate required fields
    if (!name || !email || !messageBody) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide name, email, and message'
      });
    }

    // Create the message
    const message = await Message.create({
      name,
      email,
      message: messageBody
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: message._id,
        name: message.name,
        email: message.email,
        message: message.message,
        createdAt: message.createdAt
      }
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

module.exports = { createMessage };