import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, BookOpen, GraduationCap, Send, CheckCircle2 } from 'lucide-react';
import suggestionService from '../services/suggestionService';

export default function SuggestionForm() {
  const [activeTab, setActiveTab] = useState('course'); // 'course' or 'blog'
  const [formData, setFormData] = useState({ title: '', description: '', email: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    suggestionService.addSuggestion({
      type: activeTab,
      ...formData
    });
    
    setIsLoading(false);
    setIsSubmitted(true);
    setFormData({ title: '', description: '', email: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="py-16 px-4 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-4xl mx-auto my-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#14627a]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-[#FFC27A]/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center mb-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14627a]/10 text-[#14627a] text-sm font-bold mb-4"
        >
          <Lightbulb size={16} />
          Have an Idea?
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#06213d] mb-4">Help us grow EduTech</h2>
        <p className="text-[#6d737a] max-w-xl mx-auto">
          Suggest a topic for our next blog or a course you'd like to see on our platform. Your feedback shapes our future!
        </p>
      </div>

      <div className="flex justify-center mb-8 p-1 bg-gray-100 rounded-xl w-fit mx-auto">
        <button
          onClick={() => setActiveTab('course')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'course' 
              ? 'bg-white text-[#14627a] shadow-md' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <GraduationCap size={18} />
          Suggest Course
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'blog' 
              ? 'bg-white text-[#14627a] shadow-md' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen size={18} />
          Suggest Blog
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-10"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-[#06213d] mb-2">Thank You!</h3>
            <p className="text-[#6d737a]">Your suggestion for a {activeTab} has been received.</p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="mt-6 text-[#14627a] font-semibold hover:underline"
            >
              Submit another suggestion
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, x: activeTab === 'course' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'course' ? 20 : -20 }}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-[#06213d] mb-2">
                What's the {activeTab} about?
              </label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={activeTab === 'course' ? "e.g. Advanced Rust Programming" : "e.g. The Future of WebAssembly"}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#14627a] transition-all outline-none"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-[#06213d] mb-2">
                Your Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="We'll notify you if we pick it!"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#14627a] transition-all outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#06213d] mb-2">
                Tell us more (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Provide some details or specific topics you're interested in..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#14627a] transition-all outline-none resize-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-center">
              <button
                disabled={isLoading}
                type="submit"
                className="flex items-center gap-2 bg-[#14627a] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0f4a5b] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Submit Suggestion
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
