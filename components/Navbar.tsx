import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Sun, Moon, Menu, X, Edit3, LogOut, User as UserIcon, LogIn } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  onLoginClick: () => void;
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogout, isDark, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-science-500 font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-science-500";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-space-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-science-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                বি
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-800 dark:text-white">
                বিজ্ঞান<span className="text-science-500">বলয়</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={isActive('/')}>হোম</Link>
            <Link to="/about" className={isActive('/about')}>আমাদের সম্পর্কে</Link>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-space-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                 <Link 
                  to="/create" 
                  className="flex items-center gap-2 px-4 py-2 bg-science-600 text-white rounded-full hover:bg-science-700 transition-colors shadow-lg shadow-science-500/30 text-sm font-medium"
                >
                  <Edit3 className="w-4 h-4" />
                  লিখুন
                </Link>
                
                <div className="relative group">
                    <button className="flex items-center gap-2 focus:outline-none">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-science-500" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-space-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-2 hidden group-hover:block animate-fade-in">
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-space-700">প্রোফাইল</Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">অ্যাডমিন প্যানেল</Link>
                        )}
                        <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-space-700">লগ আউট</button>
                    </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 border border-science-500 text-science-600 dark:text-science-400 rounded-full hover:bg-science-50 dark:hover:bg-space-800 transition-colors text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                লগইন / সাইনআপ
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
             <button 
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-space-800"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-science-500 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-space-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-science-500 hover:bg-gray-50 dark:hover:bg-space-800">হোম</Link>
             {user && (
                 <>
                    <Link to="/create" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-science-500 hover:bg-gray-50 dark:hover:bg-space-800">নতুন ব্লগ লিখুন</Link>
                    <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-science-500 hover:bg-gray-50 dark:hover:bg-space-800">প্রোফাইল</Link>
                    {user.role === 'admin' && (
                        <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50">অ্যাডমিন ড্যাশবোর্ড</Link>
                    )}
                 </>
             )}
             
             {user ? (
                 <button onClick={onLogout} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-space-800">লগ আউট</button>
             ) : (
                 <button onClick={onLoginClick} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-science-600 font-bold hover:bg-gray-50 dark:hover:bg-space-800">লগইন করুন</button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
