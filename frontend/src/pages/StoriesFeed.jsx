import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import StoryCard from '../components/StoryCard';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import { Search, Compass, BookOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const StoriesFeed = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.get('/stories');
        setStories(res.data);
      } catch (err) {
        console.error(err);
        showToast(err.response?.data?.message || 'Failed to load stories feed', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [showToast]);

  const filteredStories = stories.filter((story) => {
    const query = searchQuery.toLowerCase();
    return (
      story.title.toLowerCase().includes(query) ||
      story.description.toLowerCase().includes(query) ||
      story.author?.username?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/50 via-slate-900 to-indigo-950/20 border border-slate-800 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover Community Write-ups</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Explore Stories Feed
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Browse creative drafts and finished works from the ScribbleCollab community. Learn from peers, join collaborations, or start your own workspace.
          </p>
        </div>

        <Link
          to="/story/create"
          className="relative z-10 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] rounded-2xl text-sm font-semibold text-white shadow-xl shadow-indigo-600/15 transition-all duration-200"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Write a Story</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search stories by title, description, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
          />
        </div>
        <div className="text-xs font-medium text-slate-500 sm:ml-auto">
          Showing {filteredStories.length} of {stories.length} stories
        </div>
      </div>

      {/* Stories Listing */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-16 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 border border-slate-800 text-indigo-400 rounded-2xl mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">No Stories Found</h3>
          <p className="text-sm text-slate-400 mb-6">
            We couldn't find any stories matching your search query. Try typing something else or draft a new story page.
          </p>
          <Link
            to="/story/create"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-xl text-xs font-semibold text-slate-300 hover:text-indigo-400 transition-all duration-200"
          >
            Create New Story
          </Link>
        </div>
      )}
    </div>
  );
};

export default StoriesFeed;
