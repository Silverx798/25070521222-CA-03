const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
    maxlength: [400, 'Summary cannot exceed 400 characters']
  },
  body: {
    type: String,
    required: [true, 'Story body content is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'myths-legends',
      'urban-legends',
      'ghost-stories',
      'cryptids',
      'haunted-places',
      'unexplained-phenomena'
    ],
    index: true
  },
  continent: {
    type: String,
    required: [true, 'Continent is required'],
    enum: ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica'],
    index: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    index: true
  },
  region: {
    type: String,
    trim: true,
    default: ''
  },
  originCommunity: {
    type: String,
    trim: true,
    default: ''
  },
  historicalPeriod: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    // Longitude, Latitude
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0]
    }
  },
  locationIsApproximate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  heroImage: {
    url: {
      type: String,
      required: true
    },
    thumbnailUrl: {
      type: String,
      default: ''
    },
    sourcePageUrl: {
      type: String,
      default: ''
    },
    fileTitle: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    credit: {
      type: String,
      default: ''
    },
    license: {
      type: String,
      default: 'Public Domain / Editorial Reference'
    },
    licenseUrl: {
      type: String,
      default: ''
    },
    mediaType: {
      type: String,
      enum: ['photograph', 'archival-image', 'artistic-interpretation', 'illustration', 'unknown'],
      default: 'illustration'
    },
    isVerified: {
      type: Boolean,
      default: true
    }
  },
  sourceId: {
    type: String,
    index: true,
    default: ''
  },
  sourceProvider: {
    type: String,
    enum: ['wikipedia', 'wikimedia', 'wikidata', 'loc', 'community'],
    default: 'community',
    index: true
  },
  sourceLicense: {
    type: String,
    default: 'CC-BY-SA 4.0 / Public Domain'
  },
  sourceRevision: {
    type: String,
    default: ''
  },

  gallery: [{
    url: { type: String, required: true },
    caption: { type: String, default: '' }
  }],
  visualEffect: {
    type: String,
    enum: ['wendigo-parallax', 'spectral-glow', 'flickering-lantern', 'abyssal-vortex', 'standard'],
    default: 'standard'
  },
  sources: [{
    title: { type: String, required: true },
    url: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  status: {
    type: String,
    enum: ['pending', 'published', 'rejected', 'changes-requested'],
    default: 'published',
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// 2dsphere index for geospatial queries
storySchema.index({ location: '2dsphere' });

// Text search index for title, summary, and tags
storySchema.index({
  title: 'text',
  summary: 'text',
  originCommunity: 'text',
  tags: 'text'
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
