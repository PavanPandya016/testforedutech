const asyncHandler = require('../middleware/asyncHandler');
const { BlogPost, Category, Tag } = require('../models');
const { clearCache } = require('../middleware/cache');

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_LIMIT  = 50;
const MAX_TAGS   = 10;

// Reusable populate configs (avoids repeated object literals)
const POPULATE_AUTHOR   = { path: 'author',   select: 'firstName lastName' };
const POPULATE_CATEGORY = { path: 'category', select: 'name slug' };
const POPULATE_TAGS     = { path: 'tags',      select: 'name slug' };

// Fields returned in list views (excludes heavy content field)
const LIST_SELECT =
  'title slug excerpt featuredImage author category tags status isFeatured publishedAt viewCount readTime createdAt';

// ─── Private helpers ──────────────────────────────────────────────────────────

/** Escape regex special chars to prevent ReDoS. */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Normalize status input to a valid enum value. */
const normalizeStatus = (s) =>
  typeof s === 'string' && s.toLowerCase() === 'published' ? 'published' : 'draft';

/**
 * Resolve a category name/id to an ObjectId.
 * Uses findOneAndUpdate with upsert — atomic, race-condition safe.
 */
const resolveCategory = async (input) => {
  if (!input) return null;
  const str = String(input).trim();
  if (/^[0-9a-fA-F]{24}$/.test(str)) return str;

  const name = str;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const cat = await Category.findOneAndUpdate(
    { name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') } },
    { $setOnInsert: { name, slug } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return cat._id;
};

/**
 * Resolve an array of tag names/ids to ObjectIds.
 * Max MAX_TAGS tags; creates missing ones atomically.
 */
const resolveTags = async (input) => {
  if (!Array.isArray(input) || input.length === 0) return [];
  return Promise.all(
    input.slice(0, MAX_TAGS).map(async (t) => {
      const str = String(t).trim();
      if (/^[0-9a-fA-F]{24}$/.test(str)) return str;

      const name = str;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const tag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') } },
        { $setOnInsert: { name, slug } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return tag._id;
    })
  );
};

/** Flush all cached blog API responses. */
const invalidateBlogCache = () => clearCache('/api/blog');

// ─── GET /api/blog ────────────────────────────────────────────────────────────
exports.getBlogPosts = asyncHandler(async (req, res) => {
  let { search, category, tag, page = 1, limit = 10 } = req.query;

  page  = Math.max(1, parseInt(page)  || 1);
  limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit) || 10));
  const skip = (page - 1) * limit;

  const query = { status: 'published' };

  if (search) {
    query.$text = { $search: String(search).slice(0, 200) };
  }

  // Category slug → _id
  if (category) {
    const cat = await Category.findOne({ slug: String(category).toLowerCase() }).select('_id').lean();
    if (!cat) return res.json({ success: true, posts: [], total: 0, page, pages: 0 });
    query.category = cat._id;
  }

  // Tag slug → _id
  if (tag) {
    const tagDoc = await Tag.findOne({ slug: String(tag).toLowerCase() }).select('_id').lean();
    if (!tagDoc) return res.json({ success: true, posts: [], total: 0, page, pages: 0 });
    query.tags = tagDoc._id;
  }

  const sort = search
    ? { score: { $meta: 'textScore' }, publishedAt: -1 }
    : { publishedAt: -1 };

  const projection = search ? { score: { $meta: 'textScore' } } : {};

  const [posts, total] = await Promise.all([
    BlogPost.find(query, projection)
      .select(LIST_SELECT)
      .populate(POPULATE_AUTHOR)
      .populate(POPULATE_CATEGORY)
      .populate(POPULATE_TAGS)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(query),
  ]);

  res.json({ success: true, posts, total, page, pages: Math.ceil(total / limit), limit });
});

// ─── GET /api/blog/featured ───────────────────────────────────────────────────
exports.getFeaturedPosts = asyncHandler(async (req, res) => {
  const limit = Math.min(12, Math.max(1, parseInt(req.query.limit) || 6));

  const posts = await BlogPost.find({ status: 'published', isFeatured: true })
    .select(LIST_SELECT)
    .populate(POPULATE_AUTHOR)
    .populate(POPULATE_CATEGORY)
    .populate(POPULATE_TAGS)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  res.json({ success: true, posts });
});

// ─── GET /api/blog/categories ─────────────────────────────────────────────────
exports.getCategories = asyncHandler(async (req, res) => {
  const [categories, postCounts] = await Promise.all([
    Category.find().select('name slug description').sort({ name: 1 }).lean(),
    BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ])
  ]);

  const countMap = postCounts.reduce((acc, curr) => {
    if (curr._id) acc[curr._id.toString()] = curr.count;
    return acc;
  }, {});

  const enriched = categories.map(cat => ({
    ...cat,
    postCount: countMap[cat._id.toString()] || 0
  }));

  res.json({ success: true, categories: enriched });
});

// ─── GET /api/blog/tags ───────────────────────────────────────────────────────
exports.getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().select('name slug').sort({ name: 1 }).lean();
  res.json({ success: true, tags });
});

// ─── GET /api/blog/feed ───────────────────────────────────────────────────────
exports.getBlogFeed = asyncHandler(async (req, res) => {
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));

  const [posts, categories, tags] = await Promise.all([
    BlogPost.find({ status: 'published' })
      .select(LIST_SELECT)
      .populate(POPULATE_AUTHOR)
      .populate(POPULATE_CATEGORY)
      .populate(POPULATE_TAGS)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean(),
    Category.find().select('name slug').sort({ name: 1 }).lean(),
    Tag.find().select('name slug').sort({ name: 1 }).limit(50).lean(),
  ]);

  res.json({ success: true, posts, categories, tags });
});

// ─── GET /api/blog/:slug ──────────────────────────────────────────────────────
exports.getBlogPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await BlogPost.findBySlugOrId(slug)
    .populate(POPULATE_AUTHOR)
    .populate(POPULATE_CATEGORY)
    .populate(POPULATE_TAGS)
    .lean();

  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  // Draft posts visible only to author or admin
  if (post.status === 'draft') {
    const userId   = req.user?._id?.toString();
    const isOwner  = userId && post.author._id.toString() === userId;
    const isAdmin  = req.user?.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
  }

  // Fire-and-forget view count increment — does not block response
  if (post.status === 'published') {
    BlogPost.findByIdAndUpdate(post._id, { $inc: { viewCount: 1 } }).exec();
    post.viewCount = (post.viewCount || 0) + 1;
  }

  res.json({ success: true, post });
});

// ─── POST /api/blog ───────────────────────────────────────────────────────────
exports.createBlogPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, featuredImage, category, tags, status, isFeatured } = req.body;

  if (!title?.trim())   return res.status(400).json({ success: false, error: 'Title is required' });
  if (!content?.trim()) return res.status(400).json({ success: false, error: 'Content is required' });
  if (title.trim().length < 5)
    return res.status(400).json({ success: false, error: 'Title must be at least 5 characters' });

  const [categoryId, tagIds] = await Promise.all([
    resolveCategory(category),
    resolveTags(tags),
  ]);

  const postStatus = normalizeStatus(status);
  // Only admins can mark posts as featured
  const featured = req.user.role === 'admin' ? !!isFeatured : false;

  const post = await BlogPost.create({
    title:        title.trim(),
    content,
    excerpt:      excerpt?.trim(),
    featuredImage: featuredImage?.trim(),
    isFeatured:   featured,
    author:       req.user._id,
    category:     categoryId,
    tags:         tagIds,
    status:       postStatus,
    publishedAt:  postStatus === 'published' ? new Date() : undefined,
  });

  await post.populate([POPULATE_AUTHOR, POPULATE_CATEGORY, POPULATE_TAGS]);

  invalidateBlogCache();
  res.status(201).json({ success: true, post });
});

// ─── PUT /api/blog/:slug ──────────────────────────────────────────────────────
exports.updateBlogPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await BlogPost.findBySlugOrId(slug);
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

  const isOwner = post.author.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, error: 'Not authorized to edit this post' });
  }

  const { title, content, excerpt, featuredImage, category, tags, status, isFeatured } = req.body;

  if (title !== undefined) {
    if (!title.trim() || title.trim().length < 5)
      return res.status(400).json({ success: false, error: 'Title must be at least 5 characters' });
    post.title = title.trim();
  }
  if (content !== undefined) {
    if (!content.trim())
      return res.status(400).json({ success: false, error: 'Content cannot be empty' });
    post.content = content;
  }
  if (excerpt      !== undefined) post.excerpt       = excerpt?.trim()       || '';
  if (featuredImage !== undefined) post.featuredImage = featuredImage?.trim() || '';
  if (isFeatured   !== undefined && isAdmin) post.isFeatured = !!isFeatured;

  if (category !== undefined) post.category = await resolveCategory(category);
  if (tags     !== undefined) post.tags      = await resolveTags(tags);

  if (status !== undefined) {
    const newStatus = normalizeStatus(status);
    if (newStatus === 'published' && post.status !== 'published') post.publishedAt = new Date();
    post.status = newStatus;
  }

  await post.save();
  await post.populate([POPULATE_AUTHOR, POPULATE_CATEGORY, POPULATE_TAGS]);

  invalidateBlogCache();
  res.json({ success: true, post });
});

// ─── DELETE /api/blog/:slug ───────────────────────────────────────────────────
exports.deleteBlogPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await BlogPost.findBySlugOrId(slug);
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

  const isOwner = post.author.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, error: 'Not authorized to delete this post' });
  }

  await post.deleteOne();
  invalidateBlogCache();
  res.json({ success: true, message: 'Post deleted successfully' });
});
