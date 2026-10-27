const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    enum: ['inaccurate', 'offensive', 'plagiarized', 'cultural_insensitivity', 'other']
  },
  details: {
    type: String,
    trim: true,
    maxlength: [1000, 'Details cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'dismissed'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
