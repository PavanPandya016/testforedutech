import React from 'react';
import { motion } from 'framer-motion';
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export default function About() {
  return (
    <div className="bg-white min-h-screen font-outfit">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-black text-[#06213d] mb-4">
                About <span className="text-[#14627a]">Us</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                We provide quality education through expert-led courses, insightful blogs, 
                and engaging events to help you achieve your learning goals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeInUp} className="text-center mb-10">
              <h2 className="text-3xl font-black text-[#06213d] mb-3">Our Mission</h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                To make quality education accessible to everyone through innovative learning experiences.
              </p>
            </motion.div>

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
                <motion.div
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeInUp} className="text-center mb-10">
              <h2 className="text-3xl font-black text-[#06213d] mb-3">What We Offer</h2>
              <p className="text-gray-600 font-medium">
                Three key areas to accelerate your learning journey.
              </p>
            </motion.div>

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
                <motion.div
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: Users, value: '10,000+', label: 'Students' },
                { icon: BookOpen, value: '200+', label: 'Courses' },
                { icon: MessageSquare, value: '500+', label: 'Articles' },
                { icon: Calendar, value: '100+', label: 'Events' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="p-4"
                >
                  <stat.icon className="w-8 h-8 text-[#14627a] mx-auto mb-2 opacity-80" />
                  <div className="text-2xl font-black text-[#06213d]">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeInUp} className="text-center mb-8">
              <h2 className="text-3xl font-black text-[#06213d] mb-3">Why Choose Us</h2>
              <p className="text-gray-600 font-medium">
                We're committed to providing the best learning experience.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                'Expert instructors with industry experience',
                'Flexible learning at your own pace',
                'Practical projects and applications',
                'Supportive learning community',
                'Affordable pricing options',
                'Career guidance and support'
              ].map((point, index) => (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-[#14627a] flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-semibold">{point}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl font-black text-[#06213d] mb-4">
                Start Your Learning Journey
              </h2>
              <p className="text-gray-600 mb-8 font-medium">
                Join thousands of learners transforming their careers with our platform.
              </p>
              <Link to="/courses" className="px-10 py-4 bg-[#14627a] text-white rounded-xl font-bold hover:bg-[#0f4a5b] transition-all shadow-lg hover:shadow-[#14627a]/20 inline-block">
                Explore Courses
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
