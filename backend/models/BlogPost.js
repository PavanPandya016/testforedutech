const mongoose = require('mongoose');

// ─── Utilities ────────────────────────────────────────────────────────────────
const toSlug = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const calcReadTime = (content = '') => {
  const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200)); // avg 200 wpm
};

// ─── Schema ───────────────────────────────────────────────────────────────────
const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
      trim: true,
    },
    featuredImage: { type: String, trim: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    status: {
      type: String,
      enum: { values: ['draft', 'published'], message: 'Status must be draft or published' },
      default: 'draft',
    },
    isFeatured: { type: Boolean, default: false },
    publishedAt: Date,
    viewCount:   { type: Number, default: 0, min: 0 },
    readTime:    { type: Number, default: 1 }, // minutes
  },
  { timestamps: true }
);

// ─── Pre-save hooks ───────────────────────────────────────────────────────────
blogPostSchema.pre('save', function (next) {
  // Auto-slug from title with unique suffix for new posts
  if (this.isModified('title') && (this.isNew || !this.slug)) {
    const baseSlug = toSlug(this.title);
    this.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;
  }
  // Auto-set publishedAt on first publish
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  // Calculate readTime and auto-excerpt
  if (this.isModified('content')) {
    this.readTime = calcReadTime(this.content);
    if (!this.excerpt || this.excerpt.trim() === '') {
      const plain = this.content.replace(/<[^>]*>/g, '').trim();
      this.excerpt = plain.length > 200 ? plain.slice(0, 200) + '…' : plain;
    }
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Compound indexes for the most common queries
blogPostSchema.index({ status: 1, publishedAt: -1 });                // main listing
blogPostSchema.index({ status: 1, isFeatured: 1, publishedAt: -1 }); // featured
blogPostSchema.index({ status: 1, category: 1, publishedAt: -1 });   // category filter
blogPostSchema.index({ status: 1, tags: 1, publishedAt: -1 });       // tag filter
blogPostSchema.index({ author: 1 });                                   // author posts

// Full-text search with field weights
blogPostSchema.index(
  { title: 'text', excerpt: 'text', content: 'text' },
  { weights: { title: 10, excerpt: 5, content: 1 }, name: 'blog_text_index' }
);

// ─── Static helpers ───────────────────────────────────────────────────────────
/**
 * Find a post by ObjectId or slug string.
 */
blogPostSchema.statics.findBySlugOrId = function (idOrSlug, projection) {
  const query = /^[0-9a-fA-F]{24}$/.test(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };
  return this.findOne(query, projection);
};

module.exports = mongoose.model('BlogPost', blogPostSchema);
