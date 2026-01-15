import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlogPost, User, Comment } from '../types';
import { Heart, MessageCircle, Share2, Eye, Send } from 'lucide-react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface BlogPostProps {
  posts: BlogPost[];
  user: User | null;
}

const BlogPostView: React.FC<BlogPostProps> = ({ posts, user }) => {
  const { id } = useParams<{ id: string }>();
  const post = posts.find(p => p.id === id);
  const [commentText, setCommentText] = useState('');
  
  // Note: For a real app, comments should be a subcollection. 
  // For this version, we will assume comments are fetched locally or we skip fetching logic for brevity
  // and just focus on visual rendering of a "demo" comment list + local state or future subcollection.
  // To keep it simple, we'll just show the post details correctly.
  const [comments, setComments] = useState<Comment[]>([]);

  if (!post) return <div className="text-center py-20">ব্লগটি লোড হচ্ছে অথবা পাওয়া যায়নি...</div>;

  const handleLike = async () => {
    if (!user) return alert("লাইক দিতে লগইন করুন");
    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, {
        likes: increment(1)
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    // In a full implementation, you'd add this to a 'comments' subcollection in Firestore
    const newComment: Comment = {
        id: Date.now().toString(),
        postId: post.id,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: commentText,
        createdAt: new Date().toISOString()
    };
    setComments([...comments, newComment]);
    setCommentText('');
    alert("মন্তব্য সেভ ফিচারটি শীঘ্রই আসছে! (বর্তমানে লোকাল ভিউ)");
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="bg-white dark:bg-space-800 rounded-b-3xl shadow-xl overflow-hidden mb-8 border-x border-b border-gray-100 dark:border-gray-700">
            <div className="relative h-64 md:h-96 w-full">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-8 w-full">
                        <div className="flex gap-2 mb-4">
                            <span className="bg-science-600 text-white px-3 py-1 rounded-full text-sm font-semibold">{post.category}</span>
                            {post.tags.map(tag => (
                                <span key={tag} className="bg-black/40 backdrop-blur text-white px-3 py-1 rounded-full text-sm">#{tag}</span>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
                        <div className="flex items-center justify-between text-gray-200">
                            <div className="flex items-center gap-3">
                                <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full border-2 border-white" />
                                <div>
                                    <p className="font-semibold text-white">{post.authorName}</p>
                                    <p className="text-xs opacity-80">{new Date(post.createdAt).toLocaleDateString('bn-BD')}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 text-sm font-medium">
                                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {post.views} বার পড়া হয়েছে</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12">
                <div className="prose dark:prose-invert max-w-none prose-lg prose-blue">
                    {post.content.split('\n').map((para, idx) => (
                        <p key={idx} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                            {para}
                        </p>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex gap-4">
                        <button 
                            onClick={handleLike}
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        >
                            <Heart className={`w-5 h-5 ${post.likes > 0 ? 'fill-current' : ''}`} />
                            <span className="font-bold">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <Share2 className="w-5 h-5" />
                            শেয়ার
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-space-800 rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                মন্তব্য ({comments.length})
            </h3>
            
            {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-8 flex gap-4">
                    <img src={user.avatar} className="w-10 h-10 rounded-full" alt="User" />
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="আপনার মতামত লিখুন..." 
                            className="w-full bg-gray-50 dark:bg-space-900 border border-gray-200 dark:border-gray-600 rounded-full px-6 py-3 pr-12 focus:ring-2 focus:ring-science-500 outline-none dark:text-white"
                        />
                        <button type="submit" className="absolute right-2 top-2 p-1.5 bg-science-600 text-white rounded-full hover:bg-science-700 transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 dark:bg-space-900 p-4 rounded-lg text-center text-gray-500 mb-8">
                    মন্তব্য করতে দয়া করে লগইন করুন।
                </div>
            )}

            <div className="space-y-6">
                {comments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                        <img src={comment.userAvatar} alt={comment.userName} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="bg-gray-50 dark:bg-space-900 rounded-2xl px-5 py-3">
                                <p className="font-bold text-sm text-gray-900 dark:text-white mb-1">{comment.userName}</p>
                                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                            </div>
                            <span className="text-xs text-gray-500 ml-4 mt-1">এখনই</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default BlogPostView;
