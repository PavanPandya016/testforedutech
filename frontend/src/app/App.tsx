import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

// Components
import ScrollToTop from './components/ScrollToTop.jsx';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Courses = lazy(() => import('./pages/Courses.jsx'));
const CourseDetail = lazy(() => import('./pages/CourseDetail.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogDetail = lazy(() => import('./pages/BlogDetail.jsx'));
const BlogEditor = lazy(() => import('./pages/BlogEditor.jsx'));
const BlogDashboard = lazy(() => import('./pages/BlogDashboard.jsx'));
const Workshop = lazy(() => import('./pages/Workshop.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Apply = lazy(() => import('./pages/Apply.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/dashboard" element={<BlogDashboard />} />
          <Route path="/blog/editor" element={<BlogEditor />} />
          <Route path="/blog/editor/:id" element={<BlogEditor />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/workshop" element={<Workshop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}