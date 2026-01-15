import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { X, Mail, Chrome, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        onClose();
    } catch (err: any) {
        if(err.code === 'auth/invalid-credential') setError('ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।');
        else if (err.code === 'auth/email-already-in-use') setError('এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে।');
        else if (err.code === 'auth/weak-password') setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
        else setError('কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
      setError('');
      try {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
          onClose();
      } catch (err) {
          setError('Google সাইন-ইন ব্যর্থ হয়েছে।');
      }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900/75 backdrop-blur-sm" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-space-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
          <div className="absolute top-4 right-4">
             <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
               <X className="h-6 w-6" />
             </button>
          </div>
          
          <div className="px-8 py-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              {isLogin ? 'স্বাগতম' : 'অ্যাকাউন্ট খুলুন'}
            </h3>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ইমেইল</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-science-500 focus:border-science-500 dark:bg-space-900 dark:text-white p-2.5" 
                      required 
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">পাসওয়ার্ড</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-science-500 focus:border-science-500 dark:bg-space-900 dark:text-white p-2.5" 
                    required 
                />
              </div>

              <button disabled={loading} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-science-600 hover:bg-science-700 focus:outline-none transition-colors disabled:opacity-50">
                {loading ? 'অপেক্ষা করুন...' : (isLogin ? 'লগইন' : 'সাইন আপ')}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-space-800 text-gray-500">অথবা</span>
                </div>
              </div>

              <div className="mt-6">
                <button onClick={handleGoogleLogin} className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-space-700 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-space-600">
                  <Chrome className="h-5 w-5 text-red-500" /> Google দিয়ে লগইন
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
                <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-science-600 hover:text-science-500 font-medium"
                >
                    {isLogin ? 'অ্যাকাউন্ট নেই? সাইন আপ করুন' : 'আগেই অ্যাকাউন্ট আছে? লগইন করুন'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
