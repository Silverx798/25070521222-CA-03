const Story = require('../models/Story');
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');

// Helper to make slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// @desc    Get current user profile
// @route   GET /api/me
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const submissionCount = await Story.countDocuments({ createdBy: req.user._id });
    const bookmarkCount = await Bookmark.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        stats: {
          submissions: submissionCount,
          bookmarks: bookmarkCount
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PATCH /api/me
exports.updateProfile = async (req, res, next) => {
  try {
    const { displayName, bio, avatarUrl } = req.body;
    const updates = {};
    if (displayName) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-passwordHash');

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's submitted stories and their review statuses
// @route   GET /api/me/submissions
exports.getUserSubmissions = async (req, res, next) => {
  try {
    const submissions = await Story.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's bookmarked stories
// @route   GET /api/me/bookmarks
exports.getUserBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .populate({
        path: 'storyId',
        select: 'title slug summary category continent country region heroImage viewCount visualEffect status'
      })
      .sort({ createdAt: -1 })
      .lean();

    // Filter out bookmarks for stories that may have been deleted
    const validBookmarks = bookmarks
      .filter(b => b.storyId)
      .map(b => ({
        bookmarkId: b._id,
        savedAt: b.createdAt,
        story: b.storyId
      }));

    res.json({
      success: true,
      count: validBookmarks.length,
      data: validBookmarks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Bookmark a story
// @route   POST /api/stories/:id/bookmark
exports.addBookmark = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story || story.status !== 'published') {
      return res.status(404).json({ success: false, message: 'Story not found or not published.' });
    }

    const existing = await Bookmark.findOne({
      userId: req.user._id,
      storyId: story._id
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Story already bookmarked.' });
    }

    await Bookmark.create({
      userId: req.user._id,
      storyId: story._id
    });

    res.status(201).json({
      success: true,
      message: 'Story added to personal collection.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/stories/:id/bookmark
exports.removeBookmark = async (req, res, next) => {
  try {
    const result = await Bookmark.findOneAndDelete({
      userId: req.user._id,
      storyId: req.params.id
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Bookmark not found.' });
    }

    res.json({
      success: true,
      message: 'Story removed from personal collection.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit a new story for moderation review
// @route   POST /api/submissions
exports.createSubmission = async (req, res, next) => {
  try {
    const {
      title,
      summary,
      body,
      category,
      continent,
      country,
      region,
      originCommunity,
      historicalPeriod,
      coordinates, // [lng, lat]
      locationIsApproximate = true,
      tags = [],
      heroImageUrl,
      sources = []
    } = req.body;

    if (!title || !summary || !body || !category || !continent || !country) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, summary, body, category, continent, and country.'
      });
    }

    // Generate unique slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Story.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Ensure valid coordinates
    let coords = [0, 0];
    if (Array.isArray(coordinates) && coordinates.length === 2) {
      const lng = parseFloat(coordinates[0]);
      const lat = parseFloat(coordinates[1]);
      if (!isNaN(lng) && !isNaN(lat)) {
        coords = [lng, lat];
      }
    }

    const newStory = await Story.create({
      title,
      slug,
      summary,
      body,
      category,
      continent,
      country,
      region: region || '',
      originCommunity: originCommunity || '',
      historicalPeriod: historicalPeriod || '',
      location: {
        type: 'Point',
        coordinates: coords
      },
      locationIsApproximate: !!locationIsApproximate,
      tags: Array.isArray(tags) ? tags.map(t => t.trim().toLowerCase()) : [],
      heroImage: {
        url: heroImageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        alt: title,
        credit: `Submitted by ${req.user.displayName}`,
        license: 'Community Submission'
      },
      sources: Array.isArray(sources) ? sources : [],
      status: 'pending', // Submissions ALWAYS enter as pending review
      featured: false,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Story successfully submitted for moderation review. It will become publicly visible once approved by a curator.',
      data: newStory
    });
  } catch (err) {
    next(err);
  }
};
