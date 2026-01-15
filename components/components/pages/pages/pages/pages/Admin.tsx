import React from 'react';
import { BlogPost, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, FileText, Activity, CheckCircle, XCircle } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface AdminProps {
  posts: BlogPost[];
  users: User[];
}

const Admin: React.FC<AdminProps> = ({ posts, users }) => {
  const pendingPosts = posts.filter(p => p.status === 'pending');
  
  const handleApprove = async (id: string) => {
      try {
          await updateDoc(doc(db, 'posts', id), { status: 'published' });
      } catch (error) {
          alert('Error approving post');
      }
  };

  const handleDelete = async (id: string) => {
      if (!window.confirm("Sure?")) return;
      try {
          await deleteDoc(doc(db, 'posts', id));
      } catch (error) {
          alert('Error deleting post');
      }
  };

  // Mock Data for Charts
  const viewsData = [
    { name: 'শনি', views: 4000 },
    { name: 'রবি', views: 3000 },
    { name: 'সোম', views: 2000 },
    { name: 'মঙ্গল', views: 2780 },
  ];

  const categoryData = [
    { name: 'মহাকাশ', posts: posts.filter(p=>p.category==='মহাকাশ').length },
    { name: 'প্রযুক্তি', posts: posts.filter(p=>p.category==='প্রযুক্তি').length },
  ];

  return (
    <div className="animate-fade-in space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">অ্যাডমিন ড্যাশবোর্ড</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-space-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                    <Users className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">মোট ব্যবহারকারী</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
                </div>
            </div>
            <div className="bg-white dark:bg-space-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
                    <FileText className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">মোট ব্লগ</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
                </div>
            </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-space-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">সাপ্তাহিক ভিউয়ার (ডেমো)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={viewsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937' }} />
                            <Line type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white dark:bg-space-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">ক্যাটাগরি অনুযায়ী ব্লগ</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937' }} />
                            <Bar dataKey="posts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Moderation Section */}
        <div className="bg-white dark:bg-space-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">মডারেশন প্রয়োজন ({pendingPosts.length})</h3>
            
            {pendingPosts.length === 0 ? (
                <p className="text-gray-500">কোন পেন্ডিং পোস্ট নেই।</p>
            ) : (
                <div className="space-y-4">
                    {pendingPosts.map(post => (
                        <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-space-900 rounded-lg gap-4">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{post.title}</h4>
                                <p className="text-sm text-gray-500">লেখক: {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleApprove(post.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 transition-colors"
                                >
                                    <CheckCircle className="w-4 h-4" /> অনুমোদন
                                </button>
                                <button 
                                    onClick={() => handleDelete(post.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 transition-colors"
                                >
                                    <XCircle className="w-4 h-4" /> ডিলিট
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default Admin;
