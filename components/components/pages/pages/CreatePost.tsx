import React, { useState } from 'react';
import { User, BlogPost } from '../types';
import { CATEGORIES } from '../constants';
import { generateBlogContent, suggestTags } from '../services/geminiService';
import { Wand2, Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

interface CreatePostProps {
  user: User;
}

const CreatePost: React.FC<CreatePostProps> = ({ user }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleAIWrite = async () => {
    if (!title) {
        alert("অনুগ্রহ করে একটি বিষয় বা শিরোনাম লিখুন");
        return;
    }
    setIsGenerating(true);
    const generated = await generateBlogContent(title);
    setContent(prev => prev + '\n\n' + generated);
    
    const suggestions = await suggestTags(generated);
    setTags(prev => Array.from(new Set([...prev, ...suggestions])));
    
    setIsGenerating(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
        e.preventDefault();
        if(!tags.includes(tagInput)) setTags([...tags, tagInput]);
        setTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
        const newPost: Omit<BlogPost, 'id'> = {
            title,
            excerpt: content.substring(0, 100) + '...',
            content,
            authorId: user.id,
            authorName: user.name,
            authorAvatar: user.avatar,
            coverImage: `https://picsum.photos/seed/${Date.now()}/800/400`,
            category,
            tags,
            likes: 0,
            views: 0,
            status: user.role === 'admin' ? 'published' : 'pending',
            createdAt: new Date().toISOString()
        };
        
        await addDoc(collection(db, 'posts'), newPost);
        navigate('/');
    } catch (error) {
        console.error("Error saving post:", error);
        alert("পোস্ট সেভ করতে সমস্যা হয়েছে।");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="bg-white dark:bg-space-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="p-2 bg-science-100 dark:bg-science-900 rounded-lg text-science-600">✍️</span>
                নতুন ব্লগ লিখুন
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">শিরোনাম</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-space-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-science-500 focus:border-transparent transition-shadow text-lg"
                        placeholder="ব্লগের শিরোনাম দিন..."
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ক্যাটাগরি</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-space-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-science-500"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">কভার ছবি (অটো জেনারেটেড)</label>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-space-900 text-gray-500">
                            <ImageIcon className="w-5 h-5" />
                            <span className="text-sm">প্রকাশের সময় স্বয়ংক্রিয়ভাবে যুক্ত হবে</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">মূল বিষয়বস্তু</label>
                        <button 
                            type="button"
                            onClick={handleAIWrite}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                            {isGenerating ? 'লিখছে...' : 'AI দিয়ে লিখুন'}
                        </button>
                    </div>
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-space-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-science-500 focus:border-transparent transition-shadow font-sans"
                        placeholder="এখানে আপনার ব্লগের বিস্তারিত লিখুন... (Markdown সমর্থন করে)"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ট্যাগ সমূহ (Enter চাপুন)</label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-space-900 focus-within:ring-2 focus-within:ring-science-500">
                        {tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-science-100 dark:bg-science-900 text-science-700 dark:text-science-300 rounded text-sm flex items-center gap-1">
                                # {tag}
                                <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500">×</button>
                            </span>
                        ))}
                        <input 
                            type="text" 
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm min-w-[100px] text-gray-900 dark:text-white"
                            placeholder="ট্যাগ লিখুন..."
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-science-600 text-white rounded-lg hover:bg-science-700 font-semibold shadow-lg shadow-science-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-70"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSaving ? 'প্রকাশ করা হচ্ছে...' : 'প্রকাশ করুন'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default CreatePost;
