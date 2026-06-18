import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Feather, Mail, Lock, User, UserPlus } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'author',
  });
  const [loading, setLoading] = useState(false);

  const { username, email, password, confirmPassword, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      return showToast('Please fill out all fields', 'warning');
    }

    if (password.length < 6) {
      return showToast('Password must be at least 6 characters long', 'warning');
    }

    if (password !== confirmPassword) {
      return showToast('Passwords do not match', 'error');
    }

    setLoading(true);
    try {
      await register(username, email, password, role);
      showToast('Account created successfully!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err || 'Failed to register. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative z-10 animate-fade-in">
        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-indigo-600 rounded-2xl mb-3 shadow-lg shadow-indigo-600/35">
            <Feather className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">Create Account</h2>
          <p className="text-sm text-slate-400">Join ScribbleCollab to start co-writing</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                placeholder="writer_john"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Account Role
            </label>
            <div className="relative">
              <select
                name="role"
                value={role}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-2xl py-3 px-4 text-sm text-slate-200 outline-none transition-all duration-200 cursor-pointer appearance-none"
              >
                <option value="reader">Reader (Read Public Stories only)</option>
                <option value="contributor">Contributor (Collaborate & submit sections)</option>
                <option value="author">Author (Create stories & invite co-writers)</option>
                <option value="admin">Admin (Manage platform & user roles)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-sm font-semibold py-3.5 px-4 rounded-2xl text-white shadow-xl shadow-indigo-600/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center border-t border-slate-800/60 pt-5">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
