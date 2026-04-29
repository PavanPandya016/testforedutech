const mongoose = require('mongoose');

const toSlug = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// ─── Category ─────────────────────────────────────────────────────────────────
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug:        { type: String, unique: true, lowercase: true },
    description: { type: String, maxlength: [300, 'Description too long'], trim: true },
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) this.slug = toSlug(this.name);
  next();
});

categorySchema.index({ slug: 1 });
categorySchema.index({ name: 1 });

// ─── Tag ──────────────────────────────────────────────────────────────────────
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Tag name cannot exceed 50 characters'],
    },
    slug: { type: String, unique: true, lowercase: true },
  },
  { timestamps: true }
);

tagSchema.pre('save', function (next) {
  if (this.isModified('name')) this.slug = toSlug(this.name);
  next();
});

tagSchema.index({ slug: 1 });
tagSchema.index({ name: 1 });

module.exports = {
  Category: mongoose.model('Category', categorySchema),
  Tag:      mongoose.model('Tag', tagSchema),
};
