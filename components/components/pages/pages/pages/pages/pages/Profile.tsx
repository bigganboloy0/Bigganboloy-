import React from 'react';
import { User, BlogPost } from '../types';
import { User as UserIcon, Mail, Calendar, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileProps {
  user: User;
  posts: BlogPost[];
}

const Profile: React.FC<ProfileProps> = ({ user, posts }) => {
  const myPosts = posts.filter(p => p.authorId === user.id);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="bg-white dark:bg-space-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="h-32 bg-gradient-to-r from-science-500 to-purple-600"></div>
            <div className="px-8 pb-8">
                <div className="relative flex justify-between items-end -mt-12 mb-6">
                    <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white dark:border-space-800 bg-white" />
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-space-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        <Edit2 className="w-4 h-4" /> প্রোফাইল এডিট
                    </button>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{user.bio || 'কোন বায়ো দেওয়া হয়নি।'}</p>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-6 mb-8">
                    <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</span>
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> যোগ দিয়েছেন: {new Date(user.joinedAt).toLocaleDateString('bn-BD')}</span>
                    <span className="flex items-center gap-2"><UserIcon className="w-4 h-4" /> রোল: {user.role === 'admin' ? 'অ্যাডমিন' : 'ব্যবহারকারী'}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">আমার ব্লগসমূহ ({myPosts.length})</h2>
                
                {myPosts.length > 0 ? (
                    <div className="grid gap-4">
                        {myPosts.map(post => (
                            <Link to={`/post/${post.id}`} key={post.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-space-900 hover:bg-gray-100 dark:hover:bg-space-950 transition-colors">
                                <img src={post.coverImage} className="w-20 h-16 object-cover rounded-md" alt="Thumb" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{post.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {post.status === 'published' ? 'প্রকাশিত' : 'অপেক্ষমান'}
                                        </span>
                                        <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString('bn-BD')}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">আপনি এখনও কোনো ব্লগ লিখেননি।</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default Profile;
