const Story = require('../models/Story');
const Report = require('../models/Report');

// @desc    Get all pending submissions for moderation
// @route   GET /api/admin/submissions
exports.getPendingSubmissions = async (req, res, next) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    const query = status === 'all' ? {} : { status };

    const [submissions, total] = await Promise.all([
      Story.find(query)
        .populate('createdBy', 'displayName email avatarUrl')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Story.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: submissions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve, reject, or request changes on a submission
// @route   PATCH /api/admin/submissions/:id
exports.updateSubmissionStatus = async (req, res, next) => {
  try {
    const { status, feedback, featured } = req.body;

    if (!['published', 'rejected', 'changes-requested', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: published, rejected, changes-requested, or pending.'
      });
    }

    const updates = {
      status,
      reviewedBy: req.user._id,
      reviewedAt: new Date()
    };

    if (featured !== undefined) updates.featured = !!featured;

    const story = await Story.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('createdBy', 'displayName email');

    if (!story) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    res.json({
      success: true,
      message: `Story status updated to '${status}'.`,
      data: story
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user-submitted reports
// @route   GET /api/admin/reports
exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('storyId', 'title slug category country')
      .populate('reportedBy', 'displayName email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve or dismiss a report
// @route   PATCH /api/admin/reports/:id
exports.updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid report status.' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, reviewedBy: req.user._id },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    res.json({
      success: true,
      message: `Report marked as '${status}'.`,
      data: report
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get diagnostics report for media assets and stories
// @route   GET /api/admin/diagnostics
exports.getAssetDiagnostics = async (req, res, next) => {
  try {
    const totalStories = await Story.countDocuments();
    const verifiedImages = await Story.countDocuments({ 'heroImage.isVerified': true });
    const fallbackImages = await Story.countDocuments({ 'heroImage.isVerified': false });
    
    const unverifiedStories = await Story.find({ 'heroImage.isVerified': false })
      .select('title slug category country heroImage')
      .lean();

    // Find any duplicate images across stories
    const duplicateImages = await Story.aggregate([
      { $match: { 'heroImage.url': { $ne: '' } } },
      { $group: { _id: '$heroImage.url', count: { $sum: 1 }, titles: { $push: '$title' } } },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryStats = await Story.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const continentStats = await Story.aggregate([
      { $group: { _id: '$continent', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalStories,
        verifiedImages,
        fallbackImages,
        verificationRate: totalStories > 0 ? ((verifiedImages / totalStories) * 100).toFixed(1) + '%' : '0%',
        unverifiedStories,
        duplicateImages,
        categoryStats,
        continentStats
      }
    });
  } catch (err) {
    next(err);
  }
};

