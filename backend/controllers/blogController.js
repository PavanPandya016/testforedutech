const asyncHandler = require('../middleware/asyncHandler');
const { BlogPost, Category, Tag } = require('../models');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Given a category string (name or ObjectId), returns the ObjectId.
 * Creates the category if it doesn't exist.
 */
const resolveCategory = async (categoryInput) => {
  if (!categoryInput) return null;
  // Already an ObjectId string
  if (/^[0-9a-fA-F]{24}$/.test(categoryInput)) return categoryInput;
  // Find or create by name
  let cat = await Category.findOne({ name: { $regex: new RegExp(`^${categoryInput}$`, 'i') } });
  if (!cat) {
    cat = await Category.create({ name: categoryInput });
  }
  return cat._id;
};

/**
 * Given an array of tag names/ids, returns an array of ObjectIds.
 * Creates tags that don't exist.
 */
const resolveTags = async (tagsInput) => {
  if (!Array.isArray(tagsInput) || tagsInput.length === 0) return [];
  const ids = await Promise.all(
    tagsInput.map(async (t) => {
      if (/^[0-9a-fA-F]{24}$/.test(t)) return t;
      let tag = await Tag.findOne({ name: { $regex: new RegExp(`^${t}$`, 'i') } });
      if (!tag) tag = await Tag.create({ name: t });
      return tag._id;
    })
  );
  return ids;
};

// ─── GET /api/blog ───────────────────────────────────────────────────────────
exports.getBlogPosts = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  let query = { status: 'published' };
  if (search) query.$text = { $search: search };
  const skip = (page - 1) * limit;

  const posts = await BlogPost.find(query)
    .populate('author', 'firstName lastName')
    .populate('category', 'name slug')
    .populate('tags', 'name slug')
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await BlogPost.countDocuments(query);
  res.json({ success: true, posts, total, page: parseInt(page), pages: Math.ceil(total / limit) });
});

// ─── GET /api/blog/featured ──────────────────────────────────────────────────
exports.getFeaturedPosts = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({ status: 'published', isFeatured: true })
    .populate('author category')
    .limit(6);
  res.json({ success: true, posts });
});

// ─── GET /api/blog/categories ────────────────────────────────────────────────
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, categories });
});

// ─── GET /api/blog/tags ──────────────────────────────────────────────────────
exports.getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().sort({ name: 1 });
  res.json({ success: true, tags });
});

// ─── GET /api/blog/:slug ─────────────────────────────────────────────────────
exports.getBlogPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  let query = {};
  if (slug.match(/^[0-9a-fA-F]{24}$/)) {
    query.$or = [{ slug }, { _id: slug }];
  } else {
    query.slug = slug;
  }

  const post = await BlogPost.findOne(query)
    .populate('author', 'firstName lastName')
    .populate('category', 'name slug')
    .populate('tags', 'name slug');

  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  // Only increment view count for published posts
  if (post.status === 'published') {
    post.viewCount += 1;
    await post.save();
  }

  res.json({ success: true, post });
});

// ─── POST /api/blog ──────────────────────────────────────────────────────────
exports.createBlogPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, featuredImage, category, tags, status } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, error: 'Title and content are required' });
  }

  const categoryId = await resolveCategory(category);
  const tagIds = await resolveTags(tags);

  const postStatus = status === 'Published' || status === 'published' ? 'published' : 'draft';

  const post = await BlogPost.create({
    title,
    content,
    excerpt,
    featuredImage,
    author: req.user._id,
    category: categoryId,
    tags: tagIds,
    status: postStatus,
    publishedAt: postStatus === 'published' ? new Date() : undefined,
  });

  const populated = await post.populate([
    { path: 'author', select: 'firstName lastName' },
    { path: 'category', select: 'name slug' },
    { path: 'tags', select: 'name slug' },
  ]);

  res.status(201).json({ success: true, post: populated });
});

// ─── PUT /api/blog/:slug ─────────────────────────────────────────────────────
exports.updateBlogPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { title, content, excerpt, featuredImage, category, tags, status } = req.body;

  let query = {};
  if (slug.match(/^[0-9a-fA-F]{24}$/)) {
    query.$or = [{ slug }, { _id: slug }];
  } else {
    query.slug = slug;
  }

  const post = await BlogPost.findOne(query);
  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  // Only the author or an admin can update
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Not authorized to edit this post' });
  }

  if (title) post.title = title;
  if (content !== undefined) post.content = content;
  if (excerpt !== undefined) post.excerpt = excerpt;
  if (featuredImage !== undefined) post.featuredImage = featuredImage;

  if (category !== undefined) {
    post.category = await resolveCategory(category);
  }
  if (tags !== undefined) {
    post.tags = await resolveTags(tags);
  }
  if (status !== undefined) {
    const newStatus = status === 'Published' || status === 'published' ? 'published' : 'draft';
    if (newStatus === 'published' && post.status !== 'published') {
      post.publishedAt = new Date();
    }
    post.status = newStatus;
  }

  await post.save();

  const populated = await post.populate([
    { path: 'author', select: 'firstName lastName' },
    { path: 'category', select: 'name slug' },
    { path: 'tags', select: 'name slug' },
  ]);

  res.json({ success: true, post: populated });
});

// ─── DELETE /api/blog/:slug ──────────────────────────────────────────────────
exports.deleteBlogPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  let query = {};
  if (slug.match(/^[0-9a-fA-F]{24}$/)) {
    query.$or = [{ slug }, { _id: slug }];
  } else {
    query.slug = slug;
  }

  const post = await BlogPost.findOne(query);
  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  // Only the author or an admin can delete
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Not authorized to delete this post' });
  }

  await post.deleteOne();
  res.json({ success: true, message: 'Post deleted successfully' });
});

// ─── GET /api/blog/feed ──────────────────────────────────────────────────────
// Combined endpoint: posts + categories in one round-trip, replaces two calls
exports.getBlogFeed = asyncHandler(async (req, res) => {
  const [posts, categoryDocs] = await Promise.all([
    BlogPost.find({ status: 'published' })
      .populate('author', 'firstName lastName')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort({ publishedAt: -1 })
      .lean(),
    Category.find().sort({ name: 1 }).select('name').lean(),
  ]);

  res.json({
    success: true,
    posts,
    categories: categoryDocs.map(c => c.name),
  });
});
