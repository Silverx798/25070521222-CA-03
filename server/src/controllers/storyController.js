const Story = require('../models/Story');

// @desc    Get published stories with query filters & pagination
// @route   GET /api/stories
exports.getStories = async (req, res, next) => {
  try {
    const {
      category,
      continent,
      country,
      region,
      search,
      sort = 'recent',
      page = 1,
      limit = 12
    } = req.query;

    const query = { status: 'published' };

    if (category) query.category = category;
    if (continent) query.continent = continent;
    if (country) query.country = new RegExp(`^${country}$`, 'i');
    if (region) query.region = new RegExp(region, 'i');

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { originCommunity: { $regex: search, $options: 'i' } }
      ];
    }

    // Determine sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') {
      sortOptions = { viewCount: -1, createdAt: -1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 12, 50);
    const skip = (pageNum - 1) * limitNum;

    const [stories, total] = await Promise.all([
      Story.find(query)
        .select('title slug summary category continent country region location locationIsApproximate heroImage tags viewCount createdAt visualEffect')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Story.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: stories,
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

// @desc    Get featured stories
// @route   GET /api/stories/featured
exports.getFeaturedStories = async (req, res, next) => {
  try {
    const featured = await Story.find({ status: 'published', featured: true })
      .select('title slug summary category continent country region location heroImage tags viewCount visualEffect')
      .limit(6)
      .lean();

    res.json({
      success: true,
      data: featured
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get popular stories
// @route   GET /api/stories/popular
exports.getPopularStories = async (req, res, next) => {
  try {
    const popular = await Story.find({ status: 'published' })
      .select('title slug summary category continent country region heroImage viewCount visualEffect')
      .sort({ viewCount: -1 })
      .limit(6)
      .lean();

    res.json({
      success: true,
      data: popular
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get recent stories
// @route   GET /api/stories/recent
exports.getRecentStories = async (req, res, next) => {
  try {
    const recent = await Story.find({ status: 'published' })
      .select('title slug summary category continent country region heroImage createdAt visualEffect')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.json({
      success: true,
      data: recent
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single story by slug and increment view count
// @route   GET /api/stories/:slug
exports.getStoryBySlug = async (req, res, next) => {
  try {
    const story = await Story.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('createdBy', 'displayName avatarUrl');

    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }

    // Fetch related stories from same category or region
    const related = await Story.find({
      status: 'published',
      _id: { $ne: story._id },
      $or: [
        { category: story.category },
        { country: story.country },
        { continent: story.continent }
      ]
    })
      .select('title slug summary category continent country heroImage')
      .limit(3)
      .lean();

    res.json({
      success: true,
      data: story,
      related
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get geographic markers for interactive world map
// @route   GET /api/stories/map
exports.getMapStories = async (req, res, next) => {
  try {
    const { category, continent, country } = req.query;
    const filter = {
      status: 'published',
      'location.coordinates': { $exists: true, $ne: [0, 0] }
    };

    if (category) filter.category = category;
    if (continent) filter.continent = continent;
    if (country) filter.country = new RegExp(`^${country}$`, 'i');

    const markers = await Story.find(filter)
      .select('title slug summary category continent country region location locationIsApproximate heroImage visualEffect')
      .lean();

    res.json({
      success: true,
      count: markers.length,
      data: markers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get region statistics and drill-down lists
// @route   GET /api/regions
exports.getRegions = async (req, res, next) => {
  try {
    const aggregation = await Story.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: { continent: '$continent', country: '$country' },
          count: { $sum: 1 },
          sampleImage: { $first: '$heroImage.url' },
          categories: { $addToSet: '$category' }
        }
      },
      {
        $group: {
          _id: '$_id.continent',
          totalStories: { $sum: '$count' },
          countries: {
            $push: {
              name: '$_id.country',
              count: '$count',
              sampleImage: '$sampleImage',
              categories: '$categories'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = aggregation.map(item => ({
      continent: item._id,
      totalStories: item.totalStories,
      countries: item.countries.sort((a, b) => b.count - a.count)
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Global search
// @route   GET /api/search
exports.searchStories = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    if (!q.trim()) {
      return res.json({ success: true, data: [] });
    }

    const regex = new RegExp(q.trim(), 'i');
    const results = await Story.find({
      status: 'published',
      $or: [
        { title: regex },
        { summary: regex },
        { country: regex },
        { region: regex },
        { originCommunity: regex },
        { tags: { $in: [regex] } }
      ]
    })
      .select('title slug summary category continent country region heroImage viewCount')
      .limit(10)
      .lean();

    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    next(err);
  }
};
