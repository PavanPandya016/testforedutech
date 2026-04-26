import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Users, 
  Target, 
  Award,
  TrendingUp,
  Heart,
  CheckCircle
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import adminService from '../services/adminService';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export default function About() {
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState({ users: 0, courses: 0, blogs: 0, events: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          adminService.getSiteSettings(),
          adminService.getPublicStats()
        ]);

        // Handle Site Settings
        if (results[0].status === 'fulfilled') {
          setSettings(results[0].value || null);
        }

        // Handle Stats
        if (results[1].status === 'fulfilled') {
          const statsData = results[1].value;
          setStats(statsData?.stats || { users: 0, courses: 0, blogs: 0, events: 0 });
        } else {
          console.warn("About page stats fetch failed, using default values.");
        }
      } catch (err) {
        console.error("About page fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const displayStats = [
    { icon: Users, value: stats.users ? `${stats.users.toLocaleString()}+` : '10,000+', label: 'Students' },
    { icon: BookOpen, value: stats.courses ? `${stats.courses.toLocaleString()}+` : '200+', label: 'Courses' },
    { icon: MessageSquare, value: stats.blogs ? `${stats.blogs.toLocaleString()}+` : '500+', label: 'Articles' },
    { icon: Calendar, value: stats.events ? `${stats.events.toLocaleString()}+` : '100+', label: 'Events' }
  ];

  return (
    <div className="bg-white min-h-screen font-outfit">
      <Helmet>
        <title>About Us | eduTech – Modern Learning Platform</title>
        <meta name="description" content="Learn about eduTech's mission to make quality education accessible to everyone. Meet our expert instructors and explore 200+ courses, workshops and events." />
        <meta property="og:title" content="About Us | eduTech" />
        <meta property="og:description" content="Quality education for everyone. Expert-led courses, workshops, and community." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://edutech-5psu.vercel.app/about" />
      </Helmet>
      <Header />
      
      <main id="main-content">
        {/* Hero Section */}
        <section className="py-10 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-black text-[#06213d] mb-4">
                About <span className="text-[#14627a]">Us</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                {settings?.aboutHeroSubtitle || "We provide quality education through expert-led courses, insightful blogs, and engaging events to help you achieve your learning goals."}
              </p>
            </m.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-8 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <m.div {...fadeInUp} className="text-center mb-10">
              <h2 className="text-3xl font-black text-[#06213d] mb-3">Our Mission</h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                {settings?.missionText || "To make quality education accessible to everyone through innovative learning experiences."}
              </p>
            </m.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: 'Goal-Oriented',
                  description: 'Focused on helping you achieve your career goals with practical skills.'
                },
                {
                  icon: Heart,
                  title: 'Student-First',
                  description: 'We prioritize learner experience in everything we create.'
                },
                {
                  icon: TrendingUp,
                  title: 'Industry-Relevant',
                  description: 'Content updated with the latest trends and best practices.'
                }
              ].map((item, index) => (
                <m.div
                  key={index}
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100"
                >
                  <div className="w-12 h-12 bg-[#14627a] rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-[#14627a]/20">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-[#06213d] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 font-medium">{item.description}</p>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <m.div {...fadeInUp} className="text-center mb-10">
              <h2 className="text-3xl font-black text-[#06213d] mb-3">What We Offer</h2>
              <p className="text-gray-600 font-medium">
                Three key areas to accelerate your learning journey.
              </p>
            </m.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: BookOpen,
                  title: 'Courses',
                  description: 'Expert-led courses covering diverse topics from beginner to advanced levels.'
                },
                {
                  icon: MessageSquare,
                  title: 'Blog',
                  description: 'Stay updated with articles, tutorials, and insights from industry professionals.'
                },
                {
                  icon: Calendar,
                  title: 'Events',
                  description: 'Join workshops, webinars, and networking events with mentors and peers.'
                }
              ].map((item, index) => (
                <m.div
                  key={index}
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="w-12 h-12 bg-[#14627a]/10 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-[#14627a]" />
                  </div>
                  <h3 className="text-lg font-black text-[#06213d] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 font-medium">{item.description}</p>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {displayStats.map((stat, index) => (
                <m.div
                  key={index}
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="p-4"
                >
                  <stat.icon className="w-8 h-8 text-[#14627a] mx-auto mb-2 opacity-80" />
                  <div className="text-2xl font-black text-[#06213d]">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">{stat.label}</div>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <m.div {...fadeInUp} className="text-center mb-8">
              <h2 className="text-3xl font-black text-[#06213d] mb-3">Why Choose Us</h2>
              <p className="text-gray-600 font-medium">
                We're committed to providing the best learning experience.
              </p>
            </m.div>

            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                'Expert instructors with industry experience',
                'Flexible learning at your own pace',
                'Practical projects and applications',
                'Supportive learning community',
                'Affordable pricing options',
                'Career guidance and support'
              ].map((point, index) => (
                <m.div
                  key={index}
                  {...fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-[#14627a] flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-semibold">{point}</span>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <m.div {...fadeInUp}>
              <h2 className="text-3xl font-black text-[#06213d] mb-4">
                {settings?.ctaTitle || "Start Your Learning Journey"}
              </h2>
              <p className="text-gray-600 mb-8 font-medium">
                {settings?.ctaSubtitle || "Join thousands of learners transforming their careers with our platform."}
              </p>
              <Link to={settings?.ctaButtonLink || "/courses"} className="px-10 py-4 bg-[#14627a] text-white rounded-xl font-bold hover:bg-[#0f4a5b] transition-all shadow-lg hover:shadow-[#14627a]/20 inline-block">
                {settings?.ctaButtonText || "Explore Courses"}
              </Link>
            </m.div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>

  );
}
