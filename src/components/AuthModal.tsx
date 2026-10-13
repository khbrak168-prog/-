import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Lock, Mail, User as UserIcon, Shield, CheckCircle } from 'lucide-react';
import { initialUser } from '../data/mockData';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, language, user, setUser } = useThemeLanguage();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('monkongprak@theab.digital');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('ម៉ុន គង់ប្រាក់');
  const [roleSelect, setRoleSelect] = useState<'user' | 'admin'>('user');
  const [message, setMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const isKh = language === 'kh';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...initialUser,
      name: name || initialUser.name,
      email: email || initialUser.email,
      role: roleSelect,
    });
    setMessage(isKh ? 'ចូលប្រើប្រាស់ជោគជ័យ!' : 'Login successful!');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setMessage('');
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: `usr-${Date.now()}`,
      name: name || 'អ្នកប្រើប្រាស់ថ្មី',
      email: email,
      role: roleSelect,
      plan: 'free',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    });
    setMessage(isKh ? 'បង្កើតគណនីជោគជ័យ!' : 'Account registered successfully!');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setMessage('');
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative Top Accent */}
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 -mx-6 -mt-6 mb-6" />

        {user ? (
          /* User Profile View */
          <div className="text-center py-4 space-y-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full mx-auto border-4 border-amber-500 shadow-md object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">{user.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span className="capitalize">{user.plan} Plan ({user.role})</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 font-medium text-sm transition-all"
            >
              {isKh ? 'ចាកចេញពីគណនី' : 'Logout'}
            </button>
          </div>
        ) : (
          /* Form Tabs */
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                {authMode === 'login' && (isKh ? 'ចូលប្រើប្រាស់ ធៀប Digital' : 'Login to Theab Digital')}
                {authMode === 'register' && (isKh ? 'បង្កើតគណនីថ្មី' : 'Create New Account')}
                {authMode === 'forgot' && (isKh ? 'ភ្លេចពាក្យសម្ងាត់' : 'Forgot Password')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isKh
                  ? 'គ្រប់គ្រងធៀបការឌីជីថល ស្ទីលប្រណិតសម្រាប់ថ្ងៃពិសេសរបស់អ្នក'
                  : 'Manage your digital wedding invitations with luxury templates'}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-6 text-xs font-medium">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-bold shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                {isKh ? 'ចូលគណនី' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-bold shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                {isKh ? 'ចុះឈ្មោះ' : 'Register'}
              </button>
            </div>

            {message && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'អ៊ីមែល / Email' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-amber-500 dark:text-white"
                      placeholder="example@mail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'ពាក្យសម្ងាត់ / Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-amber-500 dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'តួនាទី / Role Simulation' : 'Role'}
                  </label>
                  <select
                    value={roleSelect}
                    onChange={(e) => setRoleSelect(e.target.value as 'user' | 'admin')}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-amber-500 dark:text-white"
                  >
                    <option value="user">{isKh ? 'ម្ចាស់ពិធីការ (Groom/Bride User)' : 'Couple / User'}</option>
                    <option value="admin">{isKh ? 'អ្នកគ្រប់គ្រងប្រព័ន្ធ (System Admin)' : 'System Admin'}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm shadow-md transition-all mt-2"
                >
                  {isKh ? 'ចូលប្រើប្រាស់' : 'Login'}
                </button>
              </form>
            )}

            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'ឈ្មោះពេញ / Name' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-amber-500 dark:text-white"
                      placeholder="ម៉ុន គង់ប្រាក់"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'អ៊ីមែល / Email' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-amber-500 dark:text-white"
                      placeholder="example@mail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'ពាក្យសម្ងាត់ / Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-amber-500 dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm shadow-md transition-all mt-2"
                >
                  {isKh ? 'បង្កើតគណនី' : 'Register Account'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
