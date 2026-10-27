const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, storyId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;
