# 🎓 eduTech - Online Learning Platform

A modern, fully responsive educational platform built with React, JavaScript, and Tailwind CSS, featuring beautiful animations and an intuitive user experience.

## ✨ Features

- 🎨 **Pixel-Perfect Design** - Converted from Figma with attention to detail
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🎭 **Smooth Animations** - Motion/React animations throughout the application
- 🔐 **Authentication System** - Login/Signup with role-based access
- 📚 **Course Catalog** - Browse, search, and filter courses
- 📊 **Student Dashboard** - Track progress, view enrolled courses
- 👨‍💼 **Admin Dashboard** - Manage courses, users, and content
- 📝 **Blog System** - Read articles with detailed views
- 🎪 **Workshop/Events** - View and register for upcoming events

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 👥 Test Accounts

### Student Account
```
Email: student@edutech.com
Password: student123
Role: Student
```

**Features:**
- Access all courses
- Enroll in courses
- Track learning progress
- View personal dashboard
- Read blog posts
- Register for events

### Admin Account
```
Email: admin@edutech.com
Password: admin123
Role: Administrator
```

**Features:**
- All student features
- Manage courses (Create, Edit, Delete)
- View all enrolled students
- Manage blog posts
- Manage events/workshops
- View analytics and reports
- User management

## 📂 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Header.jsx          # Responsive navigation with animations
│   │   ├── Footer.jsx          # Site footer
│   │   └── figma/              # Figma imported components
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── About.jsx           # About page
│   │   ├── Courses.jsx         # Course catalog
│   │   ├── CourseDetail.jsx    # Individual course view
│   │   ├── Blog.jsx            # Blog listing
│   │   ├── BlogDetail.jsx      # Individual blog post
│   │   ├── Workshop.jsx        # Events listing
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Registration page
│   │   └── Dashboard.jsx       # Student/Admin dashboard
│   └── App.tsx                 # Main app with routing
├── imports/                    # Figma imports
└── styles/                     # Global styles
```

## 🎨 Tech Stack

- **Frontend Framework:** React 18
- **Language:** JavaScript (ES6+)
- **Styling:** Tailwind CSS v4
- **Animations:** Motion/React
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Build Tool:** Vite

## 🎯 Key Pages

### Public Pages
- **Home** (`/`) - Hero section, featured courses, categories
- **About** (`/about`) - Company information and values
- **Courses** (`/courses`) - Complete course catalog with filters
- **Course Detail** (`/course/:id`) - Detailed course information
- **Blog** (`/blog`) - Article listings
- **Blog Post** (`/blog/:id`) - Individual article view
- **Workshop** (`/workshop`) - Events and workshops
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - New user registration

### Protected Pages
- **Dashboard** (`/dashboard`) - User dashboard (requires login)

## 🔑 Features Breakdown

### Authentication
- Login/Signup functionality
- localStorage-based session management
- Role-based access control (Student/Admin)
- Protected routes
- Auto-redirect for unauthorized access

### Course System
- Browse all courses
- Filter by category, price (free/paid)
- Search functionality
- Course detail pages with syllabus
- Enrollment tracking
- Progress monitoring

### Dashboard
- Welcome section with user info
- Statistics cards (Enrolled, Completed, In Progress, Certificates)
- My Courses section with progress bars
- Recent activity feed
- Quick actions and navigation

### Animations
- Page transitions
- Hover effects
- Loading states
- Scroll animations
- Card animations
- Button interactions
- Navigation transitions

## 🎨 Design System

### Colors
- **Primary:** #14627a (Teal)
- **Secondary:** #ffc27a (Orange)
- **Light Teal:** #6fa7b8
- **Dark Teal:** #0f4a5b
- **Text Primary:** #1b1d1f
- **Text Secondary:** #6d737a
- **Background:** #f8f9fa
- **Border:** #e7e9eb

### Typography
- **Headings:** Public Sans (Bold, SemiBold)
- **Body:** Public Sans (Regular, Medium)
- **Special:** PT Serif (Italic) for logo
- **Display:** DM Serif Text for hero headings

## 📱 Responsive Breakpoints

```css
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
```

## 🔧 Development Tips

### Adding New Routes
Edit `src/app/App.tsx` and add your route:

```jsx
<Route path="/your-path" element={<YourComponent />} />
```

### Creating Animated Components
Import motion and use it:

```jsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Your content
</motion.div>
```

### Checking Authentication
```javascript
const isLoggedIn = localStorage.getItem('isLoggedIn');
const userRole = localStorage.getItem('userRole'); // 'student' or 'admin'
const userName = localStorage.getItem('userName');
const userEmail = localStorage.getItem('userEmail');
```

## 🐛 Troubleshooting

### Can't login?
Use the test accounts provided above. Make sure localStorage is enabled in your browser.

### Animations not working?
Clear browser cache and reload. Check console for errors.

### Dashboard not showing?
Make sure you're logged in. The dashboard is a protected route.

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ for eduTech

---

**Happy Learning! 🎓**
