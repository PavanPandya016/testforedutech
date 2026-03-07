import storageService from './storageService';

/**
 * Blog Data Service - Centralized data management for blog posts.
 * Provides functions for CRUD operations, searching, and exporting/importing blog data.
 * All persistent data is managed via storageService in localStorage.
 */

const BLOGS_STORAGE_KEY = 'eduTech_blogs';
const DEFAULT_BLOGS_KEY = 'eduTech_default_blogs';
// ... rest of the file using storageService.get and storageService.set

// Helper to calculate read time from HTML content
const calculateReadTime = (htmlContent) => {
  if (!htmlContent) return '1 min read';
  const text = htmlContent.replace(/<[^>]*>?/gm, '');
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.ceil(words / 200);
  return `${Math.max(1, minutes)} min read`;
};

// Default blog posts (system/admin blogs)
const defaultBlogs = [
  {
    id: 1,
    title: "Why Most React Developers Fail Those Simple Interview Questions Even Know the Answers",
    image: "https://images.unsplash.com/photo-1675495277087-10598bf7bcd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGxhcHRvcCUyMGNvZGV8ZW58MXx8fHwxNzcxNTk2ODg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Development",
    tags: ["React", "Interview", "JavaScript"],
    date: "Feb 15, 2026",
    readTime: "8 min read",
    excerpt: "Dive deep into the common pitfalls that trip up even experienced React developers during technical interviews and learn how to avoid them.",
    content: `<h2>Understanding the Core Principles</h2><p>React is built around a few core principles: declarative UI, component-based architecture, and a unidirectional data flow. Many developers fail interviews because they understand <em>how</em> to write React code, but not <em>why</em> React works the way it does.</p><p>For example, when asked to explain the Virtual DOM, a common answer is simply "It makes React fast." However, a stronger answer discusses how the Virtual DOM minimizes expensive repaints and reflows by computing a diff and applying batched updates to the real DOM.</p><h3>The useEffect Hook Pitfalls</h3><p>Another area where candidates struggle is with the <code>useEffect</code> hook. Misunderstanding the dependency array leads to infinite loops or stale closures. Let's look at why understanding closures in JavaScript is crucial for mastering React hooks.</p><p>Always ensure you are aware of what variables are captured by your effect's closure and include them in the dependency array to maintain consistency.</p>`,
    author: "Sarah Johnson",
    isDefault: true,
    status: "Published",
    views: 1250,
    likes: 340
  },
  {
    id: 2,
    title: "Building Scalable Applications with Modern DevOps Practices",
    image: "https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwd29ya3NwYWNlJTIwZGV2ZWxvcGVyfGVufDF8fHx8MTc3MTU5Njg4NXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "DevOps",
    tags: ["DevOps", "CI/CD", "Docker"],
    date: "Feb 14, 2026",
    readTime: "12 min read",
    excerpt: "Explore the latest DevOps methodologies and tools that are transforming how teams build, deploy, and maintain modern applications.",
    content: `<h2>The Evolution of DevOps</h2><p>DevOps is no longer just a buzzword; it's a fundamental shift in how engineering teams operate. By breaking down the silos between development and operations, organizations achieve faster delivery cycles and higher system reliability.</p><h3>Continuous Integration and Continuous Deployment (CI/CD)</h3><p>A robust CI/CD pipeline is the backbone of modern software delivery. Tools like GitHub Actions, GitLab CI, and Jenkins automate testing and deployment, ensuring that every commit is verified before reaching production.</p><p>In a world where downtime can cost thousands of dollars per minute, establishing a bulletproof pipeline is non-negotiable.</p>`,
    author: "Michael Chen",
    isDefault: true,
    status: "Published",
    views: 890,
    likes: 210
  },
  {
    id: 3,
    title: "The Complete Guide to Web Performance Optimization",
    image: "https://images.unsplash.com/photo-1637937459053-c788742455be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMHNjcmVlbnxlbnwxfHx8fDE3NzE1MDQxMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Performance",
    tags: ["Performance", "Web", "Optimization"],
    date: "Feb 13, 2026",
    readTime: "10 min read",
    excerpt: "Learn proven techniques to make your web applications lightning fast, from lazy loading to image optimization and beyond.",
    content: `<p>Web performance is directly tied to user experience and conversion rates. A delay of just a few milliseconds can result in a significant drop in engagement. This guide covers the essential strategies for optimizing your web applications.</p><ul><li><strong>Image Optimization:</strong> Serve images in modern formats like WebP or AVIF.</li><li><strong>Code Splitting:</strong> Break your JavaScript bundles into smaller chunks.</li><li><strong>Lazy Loading:</strong> Load resources only when they are needed.</li></ul>`,
    author: "Emily Rodriguez",
    isDefault: true,
    status: "Published",
    views: 1540,
    likes: 420
  },
  {
    id: 4,
    title: "Mastering Software Architecture in Distributed Systems",
    image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGVuZ2luZWVyaW5nJTIwb2ZmaWNlfGVufDF8fHx8MTc3MTU5Njg4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Architecture",
    tags: ["Architecture", "System Design", "Microservices"],
    date: "Feb 12, 2026",
    readTime: "15 min read",
    excerpt: "Understanding the principles and patterns that make distributed systems resilient, scalable, and maintainable in production.",
    content: `<p>Designing distributed systems requires a careful balance between consistency, availability, and partition tolerance (CAP theorem). Microservices architecture offers flexibility but introduces complexities in service communication, data synchronization, and failure handling.</p>`,
    author: "David Kim",
    isDefault: true,
    status: "Published",
    views: 1100,
    likes: 290
  },
  {
    id: 5,
    title: "Cloud Computing Trends Shaping the Future of Tech",
    image: "https://images.unsplash.com/photo-1744868562210-fffb7fa882d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnxlbnwxfHx8fDE3NzE1MDYxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Cloud",
    tags: ["Cloud", "AWS", "Serverless"],
    date: "Feb 11, 2026",
    readTime: "9 min read",
    excerpt: "Discover how serverless, edge computing, and multi-cloud strategies are revolutionizing infrastructure and application deployment.",
    content: `<p>The shift towards serverless architecture allows developers to focus purely on code without worrying about infrastructure provisioning. Combine this with edge computing, and we're moving towards a future where applications run closer to the user with near-zero latency.</p>`,
    author: "Alex Thompson",
    isDefault: true,
    status: "Published",
    views: 750,
    likes: 180
  },
  {
    id: 6,
    title: "Data Science Techniques for Real-World Business Problems",
    image: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGFuYWx5dGljc3xlbnwxfHx8fDE3NzE1NTg2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Data Science",
    tags: ["Data Science", "Analytics", "Python"],
    date: "Feb 10, 2026",
    readTime: "11 min read",
    excerpt: "Apply machine learning and statistical analysis to solve complex business challenges and drive data-driven decision making.",
    content: `<p>Data science connects raw data to actionable business insights. Using techniques like predictive modeling, clustering, and deep learning, companies can anticipate market trends and optimize their operations effectively.</p>`,
    author: "Jessica Park",
    isDefault: true,
    status: "Published",
    views: 920,
    likes: 250
  },
  {
    id: 7,
    title: "AI and Machine Learning: Beyond the Hype",
    image: "https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3R8ZW58MXx8fHwxNzcxNDk2OTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "AI/ML",
    tags: ["AI", "Machine Learning", "Tech"],
    date: "Feb 9, 2026",
    readTime: "13 min read",
    excerpt: "A practical look at implementing AI solutions in production, including ethical considerations and real-world use cases.",
    content: `<p>While AI hype is everywhere, deploying reliable models to production requires rigorous testing, dealing with concept drift, and understanding the ethical implications of algorithmic decisions.</p>`,
    author: "Robert Martinez",
    isDefault: true,
    status: "Published",
    views: 2100,
    likes: 600
  },
  {
    id: 8,
    title: "Cybersecurity Best Practices for Modern Applications",
    image: "https://images.unsplash.com/photo-1768224656445-33d078c250b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwbmV0d29yayUyMGRpZ2l0YWx8ZW58MXx8fHwxNzcxNTgxMDIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Security",
    tags: ["Security", "Cyber", "Web"],
    date: "Feb 8, 2026",
    readTime: "10 min read",
    excerpt: "Essential security practices every developer should implement to protect applications from common vulnerabilities and threats.",
    content: `<p>Security should never be an afterthought. Integrating tools like static code analysis into your CI/CD pipeline, regularly updating dependencies, and employing strict access controls significantly reduce the attack surface for bad actors.</p>`,
    author: "Lisa Anderson",
    isDefault: true,
    status: "Published",
    views: 840,
    likes: 230
  },
  {
    id: 9,
    title: "Mobile-First Design: Creating Exceptional User Experiences",
    image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ258ZW58MXx8fHwxNzcxNTQ5ODc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Design",
    tags: ["Design", "UI/UX", "Mobile"],
    date: "Feb 7, 2026",
    readTime: "7 min read",
    excerpt: "Design principles and techniques for creating engaging mobile experiences that users love and come back to regularly.",
    content: `<p>Mobile-first design is about prioritizing mobile context from the very beginning. By focusing on core features and optimizing performance for constrained networks, we create experiences that scale beautifully to larger screens.</p>`,
    author: "Tom Wilson",
    isDefault: true,
    status: "Published",
    views: 670,
    likes: 190
  },
  {
    id: 10,
    title: "Startup Innovation: Lessons from Silicon Valley",
    image: "https://images.unsplash.com/photo-1733925457822-64c3e048fa1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RhcnR1cCUyMGlubm92YXRpb258ZW58MXx8fHwxNzcxNTk2ODg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Business",
    tags: ["Business", "Startup", "Innovation"],
    date: "Feb 6, 2026",
    readTime: "14 min read",
    excerpt: "Insights from successful tech entrepreneurs on building products, scaling teams, and navigating the startup ecosystem.",
    content: `<p>Success in the startup world demands rapid iteration, customer obsession, and the ability to pivot when necessary. The most successful founders are those who treat their vision as an evolving hypothesis.</p>`,
    author: "Kevin Brown",
    isDefault: true,
    status: "Published",
    views: 1300,
    likes: 380
  }
];

// Initialize default blogs in storage if not already present
const initializeDefaultBlogs = () => {
  try {
    const storedDefaults = storageService.get(DEFAULT_BLOGS_KEY);
    // Always map over to ensure content updates exist for older localStorage caches
    const initializedBlogs = defaultBlogs;
    if (!storedDefaults) {
      storageService.set(DEFAULT_BLOGS_KEY, initializedBlogs);
    } else {
      // Small patch to ensure default blogs have content if they were loaded previously
      if (storedDefaults.length > 0 && !storedDefaults[0].content) {
         storageService.set(DEFAULT_BLOGS_KEY, initializedBlogs);
      }
    }
  } catch (error) {
    console.error('Error initializing default blogs:', error);
  }
};

/**
 * Retrieves all blogs, combining system default blogs and user-created blogs.
 * Initializes default blogs if they don't exist in storage.
 * @returns {Array<Object>} Sorted array of all blog posts (newest first).
 */
export const getAllBlogs = () => {
  try {
    initializeDefaultBlogs();

    const defaultBlogsStored = storageService.get(DEFAULT_BLOGS_KEY, []);
    const userBlogs = storageService.get(BLOGS_STORAGE_KEY, []);

    // Combine and sort by date (newest first)
    const allBlogs = [...defaultBlogsStored, ...userBlogs];
    return allBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

// Get a single blog by ID
export const getBlogById = (id) => {
  try {
    const allBlogs = getAllBlogs();
    return allBlogs.find(blog => blog.id === parseInt(id));
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return null;
  }
};

/**
 * Adds a new blog post to user storage.
 * Automatically generates a unique ID, date, and read time.
 * @param {Object} blogData - The blog data to save.
 * @returns {Object|null} The newly created blog object or null on error.
 */
export const addBlog = (blogData) => {
  try {
    const userBlogs = storageService.get(BLOGS_STORAGE_KEY, []);

    // Generate unique ID
    const newId = userBlogs.length > 0
      ? Math.max(...userBlogs.map(b => b.id)) + 1
      : 11;

    const newBlog = {
      ...blogData,
      id: newId,
      status: blogData.status || 'Published',
      tags: blogData.tags || [],
      author: blogData.author || "Current User",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: calculateReadTime(blogData.content),
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    userBlogs.push(newBlog);
    storageService.set(BLOGS_STORAGE_KEY, userBlogs);

    return newBlog;
  } catch (error) {
    console.error('Error adding blog:', error);
    return null;
  }
};

/**
 * Updates an existing user-created blog post.
 * @param {number|string} blogId - ID of the blog to update.
 * @param {Object} updatedData - Partial or full blog data to merge.
 * @returns {Object|null} The updated blog object or null if not found/error.
 */
export const updateBlog = (blogId, updatedData) => {
  try {
    const userBlogs = storageService.get(BLOGS_STORAGE_KEY, []);

    const index = userBlogs.findIndex(b => b.id === parseInt(blogId));
    if (index !== -1) {
      userBlogs[index] = {
        ...userBlogs[index],
        ...updatedData,
        readTime: updatedData.content ? calculateReadTime(updatedData.content) : userBlogs[index].readTime,
        updatedAt: new Date().toISOString()
      };
      storageService.set(BLOGS_STORAGE_KEY, userBlogs);
      return userBlogs[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating blog:', error);
    return null;
  }
};

// Delete blog
export const deleteBlog = (blogId) => {
  try {
    const userBlogs = storageService.get(BLOGS_STORAGE_KEY, []);
    const filtered = userBlogs.filter(b => b.id !== blogId);
    storageService.set(BLOGS_STORAGE_KEY, filtered);
    return true;
  } catch (error) {
    console.error('Error deleting blog:', error);
    return false;
  }
};

/**
 * Searches blogs by query and/or category.
 * @param {string} query - Search term to match in title or excerpt.
 * @param {string|null} category - Category name to filter by.
 * @returns {Array<Object>} Filtered array of blog posts.
 */
export const searchBlogs = (query = '', category = null) => {
  try {
    const allBlogs = getAllBlogs();

    return allBlogs.filter(blog => {
      const matchesSearch =
        query === '' ||
        blog.title.toLowerCase().includes(query.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        category === null || category === 'All' || blog.category === category;

      return matchesSearch && matchesCategory;
    });
  } catch (error) {
    console.error('Error searching blogs:', error);
    return [];
  }
};

/**
 * Fetches all unique blog categories from available posts.
 * @returns {Array<string>} Array of category names, always starting with 'All'.
 */
export const getCategories = () => {
  try {
    const allBlogs = getAllBlogs();
    const categories = new Set(allBlogs.map(blog => blog.category));
    return ['All', ...Array.from(categories)];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['All'];
  }
};

/**
 * Retrieves only blogs created by the current user.
 * @returns {Array<Object>} User's blog posts.
 */
export const getUserBlogs = () => {
  try {
    return storageService.get(BLOGS_STORAGE_KEY, []);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    return [];
  }
};

/**
 * Deletes all user-created blogs from storage.
 * @returns {boolean} Success status.
 */
export const clearAllUserBlogs = () => {
  try {
    storageService.remove(BLOGS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing user blogs:', error);
    return false;
  }
};

/**
 * Triggers a download of all blog data as a JSON file.
 * @returns {boolean} Success status.
 */
export const exportBlogs = () => {
  try {
    const allBlogs = getAllBlogs();
    const dataStr = JSON.stringify(allBlogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `edutech_blogs_backup_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    return true;
  } catch (error) {
    console.error('Error exporting blogs:', error);
    return false;
  }
};

/**
 * Imports blog data from a JSON source.
 * Merges new blogs into user storage without deleting existing ones.
 * @param {string|Array} jsonData - JSON string or array of blog objects.
 * @returns {boolean} Success status.
 */
export const importBlogs = (jsonData) => {
  try {
    const blogsToImport = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (!Array.isArray(blogsToImport)) throw new Error('Invalid format');

    // Simple validation: check if items have required fields
    const validBlogs = blogsToImport.filter(b => b.title && b.content);

    const existingUserBlogs = storageService.get(BLOGS_STORAGE_KEY, []);

    // Add only blogs that aren't "default" to the user storage
    const newBlogs = validBlogs.filter(b => !b.isDefault);

    // Merge without duplicates (by title/author for simplicity if ID is missing)
    const merged = [...existingUserBlogs];
    newBlogs.forEach(nb => {
      if (!merged.find(m => m.id === nb.id)) {
        merged.push(nb);
      }
    });

    storageService.set(BLOGS_STORAGE_KEY, merged);
    return true;
  } catch (error) {
    console.error('Error importing blogs:', error);
    return false;
  }
};

// Export blog service as default
export default {
  getAllBlogs,
  getBlogById,
  addBlog,
  updateBlog,
  deleteBlog,
  searchBlogs,
  getCategories,
  getUserBlogs,
  clearAllUserBlogs,
  exportBlogs,
  importBlogs
};
