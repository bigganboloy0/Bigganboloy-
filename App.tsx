import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, ADMIN_EMAIL } from './firebaseConfig';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import BlogPostView from './pages/BlogPost';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import { User, BlogPost, UserRole } from './types';
import { INITIAL_POSTS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // Theme Management
  useEffect(() => {
    const savedTheme = localStorage.getItem('bigganboloy_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('bigganboloy_theme', newTheme ? 'dark' : 'light');
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 1. Listen for Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user data exists in Firestore, if not create it
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        let userData: User;
        
        if (userSnap.exists()) {
          userData = userSnap.data() as User;
        } else {
          // New user setup
          const role = firebaseUser.email === ADMIN_EMAIL ? UserRole.ADMIN : UserRole.USER;
          userData = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Unknown',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email}`,
            role: role,
            joinedAt: new Date().toISOString()
          };
          await setDoc(userRef, userData);
        }
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Listen for Realtime Posts Updates
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(fetchedPosts.length > 0 ? fetchedPosts : INITIAL_POSTS);
    }, (error) => {
        console.error("Error fetching posts:", error);
        // Fallback to initial posts if offline or permission denied
        setPosts(INITIAL_POSTS);
    });

    return () => unsubscribe();
  }, []);


  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-space-950">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-science-500"></div>
          </div>
      );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-space-950 transition-colors duration-200 flex flex-col font-sans">
        <Navbar 
          user={user} 
          onLoginClick={() => setAuthModalOpen(true)} 
          onLogout={handleLogout}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home posts={posts} />} />
            <Route path="/post/:id" element={<BlogPostView posts={posts} user={user} />} />
            
            <Route path="/create" element={
              user ? <CreatePost user={user} /> : <div className="text-center py-20 text-red-500">লগইন প্রয়োজন</div>
            } />
            
            <Route path="/profile" element={
              user ? <Profile user={user} posts={posts} /> : <Navigate to="/" />
            } />
            
            <Route path="/admin" element={
              user?.role === UserRole.ADMIN ? (
                <Admin 
                    posts={posts} 
                    users={[]} // Real user count would require a separate collection query or function
                />
              ) : (
                <Navigate to="/" />
              )
            } />
          </Routes>
        </main>

        <footer className="bg-white dark:bg-space-900 border-t border-gray-200 dark:border-gray-800 py-8">
            <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} বিজ্ঞানবলয়। সর্বস্বত্ব সংরক্ষিত।</p>
            </div>
        </footer>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
        />
      </div>
    </Router>
  );
};

export default App;
