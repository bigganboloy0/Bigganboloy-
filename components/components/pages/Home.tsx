import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { CATEGORIES } from '../constants';
import { Calendar, Eye, Heart, ArrowRight } from 'lucide-react';

interface HomeProps {
  posts: BlogPost[];
}

const Home: React.FC<HomeProps> = ({ posts }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch && post.status === 'published';
  });

  const featuredPost = posts[0];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-space-900 text-white overflow-hidden rounded-3xl mb-12 shadow-2xl">
        <div className="absolute inset-0">
          <img src="https://picsum.photos/seed/galaxy/1200/600" alt="Space" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-900/60 to-transparent"></div>
        </div>
        <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            জ্ঞানের <span className="text-science-500 text-transparent bg-clip-text bg-gradient-to-r from-science-400 to-purple-400">মহাবিশ্বে</span> আপনাকে স্বাগতম
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl text-gray-300 mb-10">
            বিজ্ঞান, প্রযুক্তি এবং মহাকাশের অজানা রহস্য জানুন এবং আপনার চিন্তা শেয়ার করুন বিশ্বের সাথে।
          </p>
          <div className="flex w-full max-w-md bg-white/10 backdrop-blur-md rounded-full p-1 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-science-500 transition-all">
            <input 
              type="text" 
              placeholder="কি জানতে চান? (যেমন: ব্ল্যাকহোল, AI...)" 
              className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 px-6 py-3 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-science-600 hover:bg-science-700 text-white rounded-full px-8 py-2 font-medium transition-colors">
              খুঁজুন
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-4 justify-center mb-12">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-science-600 text-white shadow-lg shadow-science-500/30' : 'bg-white dark:bg-space-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-space-700'}`}
        >
          সব
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory ===(cat.name) ? 'bg-science-600 text-white shadow-lg shadow-science-500/30' : 'bg-white dark:bg-space-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-space-700'}`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Featured Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <Link to={`/post/${post.id}`} key={post.id} className="group bg-white dark:bg-space-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-1">
            <div className="relative h-48 overflow-hidden">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">
                {post.category}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-science-500 transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <img src={post.authorAvatar} alt={post.authorName} className="w-6 h-6 rounded-full" />
                  <span>{post.authorName}</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString('bn-BD')}</span>
                   <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
         <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">কোন ব্লগ পাওয়া যায়নি।</p>
         </div>
      )}
    </div>
  );
};

export default Home;
