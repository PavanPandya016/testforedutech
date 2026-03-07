import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import blogService from '../services/blogService';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Image as ImageIcon, Link as LinkIcon, Youtube as YoutubeIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Quote, Code, Undo, Redo, Save, X, BookOpen, Settings, List as ListIcon
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const handleImageUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          editor.chain().focus().setImage({ src: event.target.result }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url, width: Math.max(320, parseInt('640', 10)), height: Math.max(180, parseInt('480', 10)) });
    }
  };

  const insertCourseCard = () => {
    const courseUrl = prompt('Enter Course URL');
    const courseTitle = prompt('Enter Course Title');
    if (courseUrl && courseTitle) {
      const html = `<div class="p-6 my-6 border-2 border-[#14627a] rounded-xl bg-[#f0f9fc] flex items-center justify-between">
        <div>
          <h4 class="text-[#06213d] font-bold text-lg mb-1">🎓 Recommended Course</h4>
          <p class="text-[#14627a] font-medium">${courseTitle}</p>
        </div>
        <a href="${courseUrl}" class="px-4 py-2 bg-[#14627a] text-white rounded-lg font-semibold whitespace-nowrap">View Course &rarr;</a>
      </div><p></p>`;
      editor.commands.insertContent(html);
    }
  };

  const btnClass = (isActive) => `p-2 rounded-lg transition-colors ${isActive ? 'bg-[#14627a] text-white' : 'text-gray-600 hover:bg-gray-100'} `;

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm rounded-t-xl items-center">
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Bold"><Bold className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Italic"><Italic className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))} title="Underline"><UnderlineIcon className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))} title="Strike"><Strikethrough className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} title="Heading 1"><Heading1 className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Heading 2"><Heading2 className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))} title="Heading 3"><Heading3 className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="Align Left"><AlignLeft className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="Align Center"><AlignCenter className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))} title="Align Right"><AlignRight className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={btnClass(editor.isActive({ textAlign: 'justify' }))} title="Justify"><AlignJustify className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Bullet List"><List className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))} title="Quote"><Quote className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive('codeBlock'))} title="Code Block"><Code className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
        <button onClick={handleImageUpload} className={btnClass(false)} title="Upload Image"><ImageIcon className="w-4 h-4" /></button>
        <button onClick={setLink} className={btnClass(editor.isActive('link'))} title="Insert Link"><LinkIcon className="w-4 h-4" /></button>
        <button onClick={addYoutubeVideo} className={btnClass(false)} title="Embed YouTube"><YoutubeIcon className="w-4 h-4" /></button>
        <button onClick={insertCourseCard} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-[#e8f2f8] text-[#14627a] rounded-lg hover:bg-[#14627a] hover:text-white transition-colors border border-[#14627a]/20" title="Insert Course Card">
          <BookOpen className="w-3.5 h-3.5" /> Course Form
        </button>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-50"><Undo className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-50"><Redo className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    category: 'Development',
    tags: '',
    excerpt: '',
    image: '',
    status: 'Published'
  });

  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toc, setToc] = useState([]);

  // Initialize TipTap
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Youtube.configure({ inline: false }),
      Placeholder.configure({ placeholder: 'Start writing your amazing story...' })
    ],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg sm:prose-xl focus:outline-none min-h-[500px] w-full max-w-none p-4 sm:p-8',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const headings = doc.querySelectorAll('h2, h3');
      const tocItems = Array.from(headings).map((h, i) => ({
        id: `section-${i}`,
        title: h.textContent,
        level: h.tagName.toLowerCase()
      }));
      setToc(tocItems);
    }
  });

  useEffect(() => {
    if (isEditing && editor) {
      const existing = blogService.getBlogById(id);
      if (existing) {
        setFormData({
          title: existing.title || '',
          category: existing.category || 'Development',
          tags: Array.isArray(existing.tags) ? existing.tags.join(', ') : '',
          excerpt: existing.excerpt || '',
          image: existing.image || '',
          status: existing.status || 'Published'
        });
        editor.commands.setContent(existing.content || '');
      } else {
        navigate('/blog');
      }
    }
  }, [id, editor, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHeroImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert("Please provide a title for your blog.");
      return;
    }

    const htmlContent = editor.getHTML();
    
    // Convert comma-separated tags to array
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

    const dataToSave = {
      title: formData.title,
      category: formData.category,
      tags: tagsArray,
      excerpt: formData.excerpt,
      image: formData.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80',
      content: htmlContent,
      status: formData.status
    };

    if (isEditing) {
      blogService.updateBlog(parseInt(id), dataToSave);
      navigate(`/blog/${id}`);
    } else {
      const saved = blogService.addBlog(dataToSave);
      if (saved) {
        navigate(`/blog/${saved.id}`);
      }
    }
  };

  const categories = blogService.getCategories().filter(c => c !== 'All');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8 relative items-start">
          
          {/* Main Editor Section */}
          <div className="flex-1 w-full bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header / Title Area */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Blog Post Title..."
                className="w-full text-3xl sm:text-4xl font-bold bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-300 text-gray-900"
              />
              <div className="mt-4 flex flex-wrap gap-4 items-center">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-white border text-sm border-gray-300 text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a]"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className={`w-2 h-2 rounded-full ${formData.status === 'Published' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  {formData.status}
                </div>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="ml-auto text-gray-400 hover:text-[#14627a] flex items-center gap-1 text-sm font-medium md:hidden"
                >
                  <Settings className="w-4 h-4"/> Settings
                </button>
              </div>
            </div>

            {/* TipTap Editor */}
            <div className="relative">
              <MenuBar editor={editor} />
              <div className="prose-container min-h-[500px]">
                 <style dangerouslySetInnerHTML={{__html: `
                    .ProseMirror p.is-editor-empty:first-child::before {
                      content: attr(data-placeholder);
                      float: left;
                      color: #adb5bd;
                      pointer-events: none;
                      height: 0;
                    }
                    .ProseMirror p { margin-bottom: 1rem; line-height: 1.75; }
                    .ProseMirror h1 { font-size: 2.25rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
                    .ProseMirror h2 { font-size: 1.875rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; }
                    .ProseMirror h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; }
                    .ProseMirror blockquote { border-left: 4px solid #14627a; padding-left: 1rem; color: #4b5563; font-style: italic; background:#f0f9fc; padding: 1rem; border-radius: 0 0.5rem 0.5rem 0; margin-bottom:1rem;}
                    .ProseMirror pre { background: #1e293b; color: #f8fafc; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; font-family: monospace; }
                    .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5rem; }
                    .ProseMirror a { color: #14627a; text-decoration: underline; cursor: pointer; }
                    .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
                    .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
                 `}} />
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Settings */}
          <div className={`${showSettings ? 'block' : 'hidden'} md:block w-full md:w-80 space-y-6 md:sticky md:top-24`}>
            
            {/* Table of Contents Preview */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <ListIcon size={16} className="text-[#14627a]" /> Structure
              </h3>
              {toc.length > 0 ? (
                <ul className="space-y-2">
                  {toc.map((item, index) => (
                    <li key={index} className={item.level === 'h3' ? 'ml-4' : ''}>
                      <span className="text-xs font-medium text-gray-400 mr-2 uppercase">{item.level}</span>
                      <span className="text-sm text-gray-600 truncate inline-block max-w-[180px] align-bottom">
                        {item.title || '(Empty Heading)'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 italic">Add H2 or H3 headings to generate ToC.</p>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <button 
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 bg-[#14627a] hover:bg-[#0f4a5b] text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Save className="w-5 h-5" />
                {isEditing ? 'Update Post' : 'Publish Post'}
              </button>
              <button 
                onClick={() => navigate('/blog/dashboard')}
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-semibold transition-all"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>

            {/* Post Settings */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Post Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] transition-all"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="React, Frontend, Web"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">Comma-separated keywords.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Brief summary for preview cards..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] transition-all resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                <div 
                  className="relative group border-2 border-dashed border-gray-300 rounded-lg overflow-hidden h-40 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {formData.image ? (
                    <>
                      <img src={formData.image} alt="Featured" className="w-full h-full object-cover" />
                      {isHoveringImage && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white z-0">
                          <ImageIcon className="w-8 h-8 mb-1" />
                          <span className="text-sm font-medium">Change Image</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-500">Click to upload cover</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
