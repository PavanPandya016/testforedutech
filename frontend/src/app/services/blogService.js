import { api } from './api/api';

/**
 * Blog Service - Centralized data management for blog posts using Backend API.
 */

// Helper to calculate read time from HTML content
const calculateReadTime = (htmlContent) => {
  if (!htmlContent) return '1 min read';
  const text = htmlContent.replace(/<[^>]*>?/gm, '');
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.ceil(words / 200);
  return `${Math.max(1, minutes)} min read`;
};

// Normalize a backend BlogPost document to the shape the UI expects
const normalizePost = (post) => {
  if (!post) return null;
  const authorObj = post.author || {};
  const authorName = authorObj.firstName
    ? `${authorObj.firstName} ${authorObj.lastName || ''}`.trim()
    : (typeof authorObj === 'string' ? authorObj : 'EduTech');
  const categoryName = post.category?.name || post.category || 'General';
  return {
    ...post,
    authorId: authorObj._id || authorObj.id || null,
    id: post._id || post.id,
    image: post.featuredImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
    author: authorName,
    date: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Recent',
    readTime: calculateReadTime(post.content),
    category: categoryName,
    tags: (post.tags || []).map(t => (typeof t === 'object' ? t.name : t)),
    excerpt: post.excerpt || '',
    slug: post.slug || post._id,
  };
};

export const blogService = {
  /**
   * Retrieves all blogs from the API.
   * @returns {Promise<Array>}
   */
  getAllBlogs: async () => {
    try {
      const data = await api.get('/blog');
      return (data.posts || []).map(normalizePost);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  /**
   * Retrieves featured blogs.
   */
  getFeaturedBlogs: async () => {
    try {
      const data = await api.get('/blog/featured');
      return (data.posts || []).map(normalizePost);
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
      throw error;
    }
  },

  /**
   * Get a single blog by slug.
   */
  getBlogBySlug: async (slug) => {
    try {
      const data = await api.get(`/blog/${slug}`);
      return normalizePost(data.post);
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      throw error;
    }
  },

  /**
   * Adds a new blog post.
   * @param {Object} blogData
   */
  addBlog: async (blogData) => {
    try {
      const data = await api.post('/blog', blogData);
      return data.post || data;
    } catch (error) {
      console.error('Error adding blog:', error);
      throw error;
    }
  },

  /**
   * Updates an existing blog post.
   */
  updateBlog: async (slug, updatedData) => {
    try {
      const data = await api.put(`/blog/${slug}`, updatedData);
      return data.post || data;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  /**
   * Delete blog.
   */
  deleteBlog: async (slug) => {
    try {
      return await api.delete(`/blog/${slug}`);
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  /**
   * Fetches all unique blog categories.
   */
  getCategories: async () => {
    try {
      const data = await api.get('/blog/categories');
      // categories is an array of objects with { name }; return just the names
      return (data.categories || []).map(c => c.name);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Fetches all unique blog tags.
   */
  getTags: async () => {
    try {
      const data = await api.get('/blog/tags');
      return (data.tags || []).map(t => t.name);
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  /**
   * Upload an image to the backend and return the secure URL.
   */
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('edutech_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const uploadUrl = apiUrl.replace(/\/api\/?$/, '/upload');

      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data.filepath;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

export default blogService;
