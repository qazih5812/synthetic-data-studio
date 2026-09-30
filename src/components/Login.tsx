'use client';

import { useState } from 'react';
import { Lock, User, Mail, ChevronRight, Loader2, ShieldCheck, Database, Sparkles } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password || (!isLogin && !email)) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (isLogin) {
      if (username === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    } else {
      onLogin();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[130px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-6">
        <div className="relative group rounded-3xl overflow-hidden backdrop-blur-2xl bg-white/[0.02] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500 hover:bg-white/[0.04]">
          {/* Subtle top border glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
          
          <div className="p-10">
            <div className="text-center mb-10">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
                  <Database className="w-8 h-8 text-indigo-400" />
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-fuchsia-400 animate-pulse" />
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-white tracking-tight mb-2">
                HackDataV2
              </h1>
              <p className="text-sm font-medium text-slate-400">
                {isLogin ? 'Access your secure workspace' : 'Begin your journey today'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Username</label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 shadow-inner"
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Work Email</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 shadow-inner"
                      placeholder="name@company.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                  {isLogin && (
                    <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 shadow-inner"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group/btn flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-70 disabled:cursor-not-allowed mt-8 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out" />
                <div className="relative flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In to Dashboard' : 'Create Account'}</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="group relative inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors duration-300"
              >
                <span className="relative">
                  {isLogin ? "New to HackDataV2? " : "Already have an account? "}
                  <span className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    {isLogin ? "Sign up" : "Sign in"}
                  </span>
                  <div className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-400 group-hover:w-full transition-all duration-300" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
