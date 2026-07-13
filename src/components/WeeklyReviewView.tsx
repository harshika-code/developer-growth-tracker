import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  Edit, 
  Trash2, 
  Calendar, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen 
} from 'lucide-react';
import { WeeklyReview } from '../types';

interface WeeklyReviewViewProps {
  weeklyReviews: WeeklyReview[];
  setWeeklyReviews: (reviews: WeeklyReview[]) => void;
  darkMode: boolean;
  globalSearch: string;
  showFavouritesOnly: boolean;
}

export const WeeklyReviewView: React.FC<WeeklyReviewViewProps> = ({
  weeklyReviews,
  setWeeklyReviews,
  darkMode,
  globalSearch,
  showFavouritesOnly,
}) => {
  const [search, setSearch] = useState('');

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<WeeklyReview | null>(null);

  const [formDate, setFormDate] = useState('');
  const [formAchievements, setFormAchievements] = useState('');
  const [formProblems, setFormProblems] = useState('');
  const [formLessons, setFormLessons] = useState('');
  const [formGoals, setFormGoals] = useState('');
  const [formIsFav, setFormIsFav] = useState(false);

  const filteredReviews = useMemo(() => {
    return weeklyReviews.filter((review) => {
      const searchStr = `${review.date} ${review.achievements} ${review.problemsFaced} ${review.lessonsLearned} ${review.nextWeekGoals}`.toLowerCase();
      const matchesGlobal = searchStr.includes(globalSearch.toLowerCase());
      const matchesLocal = searchStr.includes(search.toLowerCase());
      const matchesFav = !showFavouritesOnly || review.isFavourite;

      return matchesGlobal && matchesLocal && matchesFav;
    });
  }, [weeklyReviews, globalSearch, search, showFavouritesOnly]);

  const handleOpenCreate = () => {
    setEditingReview(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormAchievements('');
    setFormProblems('');
    setFormLessons('');
    setFormGoals('');
    setFormIsFav(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (review: WeeklyReview) => {
    setEditingReview(review);
    setFormDate(review.date);
    setFormAchievements(review.achievements);
    setFormProblems(review.problemsFaced);
    setFormLessons(review.lessonsLearned);
    setFormGoals(review.nextWeekGoals);
    setFormIsFav(review.isFavourite);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this weekly review?')) {
      setWeeklyReviews(weeklyReviews.filter(r => r.id !== id));
    }
  };

  const handleToggleFav = (review: WeeklyReview) => {
    setWeeklyReviews(weeklyReviews.map(r => r.id === review.id ? { ...r, isFavourite: !r.isFavourite } : r));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDate.trim()) return;

    if (editingReview) {
      setWeeklyReviews(weeklyReviews.map(r => r.id === editingReview.id ? {
        ...r,
        date: formDate,
        achievements: formAchievements,
        problemsFaced: formProblems,
        lessonsLearned: formLessons,
        nextWeekGoals: formGoals,
        isFavourite: formIsFav
      } : r));
    } else {
      const newReview: WeeklyReview = {
        id: `review-${Date.now()}`,
        date: formDate,
        achievements: formAchievements,
        problemsFaced: formProblems,
        lessonsLearned: formLessons,
        nextWeekGoals: formGoals,
        isFavourite: formIsFav
      };
      setWeeklyReviews([newReview, ...weeklyReviews]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Weekly Reviews</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Write reflective journals, map out blockers, audit progress, and layout milestones for subsequent weeks.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
        >
          <Plus size={14} />
          <span>New Weekly Review</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative max-w-md flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search reviews by content keywords or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs outline-none border transition-all ${
              darkMode
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300 placeholder-neutral-500 focus:border-neutral-700'
                : 'bg-white border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:border-neutral-300'
            }`}
          />
        </div>

        <span className="text-xs font-mono text-neutral-400">
          Reviews recorded: {filteredReviews.length}
        </span>
      </div>

      {/* Reviews Stack */}
      <div className="space-y-6">
        {filteredReviews.map((review) => {
          return (
            <div
              key={review.id}
              className={`rounded-2xl border p-6 space-y-4 transition-all ${
                darkMode 
                  ? 'bg-neutral-950/40 border-neutral-800 text-neutral-200' 
                  : 'bg-white border-neutral-200 text-neutral-800'
              }`}
            >
              {/* Review Header row */}
              <div className="flex items-center justify-between border-b border-neutral-150 dark:border-neutral-900 pb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleFav(review)}
                    className={`transition-colors ${
                      review.isFavourite 
                        ? 'text-amber-500' 
                        : 'text-neutral-300 dark:text-neutral-700 hover:text-amber-500'
                    }`}
                  >
                    <Star size={14} fill={review.isFavourite ? 'currentColor' : 'none'} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-neutral-400" />
                    <span className="font-display font-semibold text-sm">Review of {review.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(review)}
                    className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    title="Edit Review"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-1.5 rounded hover:bg-red-500/10 text-neutral-400 hover:text-red-500"
                    title="Delete Review"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Grid content blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
                {/* Achievements */}
                <div className="space-y-1.5">
                  <h4 className="font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
                    <Award size={12} className="text-green-500" />
                    <span>Key Achievements</span>
                  </h4>
                  <div className={`p-3.5 rounded-xl border ${
                    darkMode ? 'bg-neutral-900/30 border-neutral-800/80 text-neutral-300' : 'bg-neutral-50 border-neutral-200/50 text-neutral-700'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{review.achievements || 'None recorded.'}</p>
                  </div>
                </div>

                {/* Goals */}
                <div className="space-y-1.5">
                  <h4 className="font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-blue-500" />
                    <span>Next Week Targets</span>
                  </h4>
                  <div className={`p-3.5 rounded-xl border ${
                    darkMode ? 'bg-neutral-900/30 border-neutral-800/80 text-neutral-300' : 'bg-neutral-50 border-neutral-200/50 text-neutral-700'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{review.nextWeekGoals || 'None scheduled.'}</p>
                  </div>
                </div>

                {/* Problems */}
                <div className="space-y-1.5">
                  <h4 className="font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
                    <AlertCircle size={12} className="text-red-400" />
                    <span>Blockers / Problems Faced</span>
                  </h4>
                  <div className={`p-3.5 rounded-xl border ${
                    darkMode ? 'bg-neutral-900/30 border-neutral-800/80 text-neutral-300' : 'bg-neutral-50 border-neutral-200/50 text-neutral-700'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{review.problemsFaced || 'None recorded.'}</p>
                  </div>
                </div>

                {/* Lessons */}
                <div className="space-y-1.5">
                  <h4 className="font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
                    <BookOpen size={12} className="text-purple-400" />
                    <span>Lessons Learned</span>
                  </h4>
                  <div className={`p-3.5 rounded-xl border ${
                    darkMode ? 'bg-neutral-900/30 border-neutral-800/80 text-neutral-300' : 'bg-neutral-50 border-neutral-200/50 text-neutral-700'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{review.lessonsLearned || 'None recorded.'}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredReviews.length === 0 && (
          <div className="py-16 text-center text-neutral-400 dark:text-neutral-500 italic">
            No weekly reviews match your current criteria. Create your first reflection entry above!
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h2 className="text-lg font-display font-semibold mb-4">
              {editingReview ? '✏ Edit Weekly Review Journal' : '➕ Compile New Weekly Review'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Review Period / Date *
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Key Achievements
                </label>
                <textarea
                  placeholder="What key landmarks, lectures, problems, or portfolios did you finish?"
                  value={formAchievements}
                  onChange={(e) => setFormAchievements(e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all resize-none ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Next Week Targets & Goals
                </label>
                <textarea
                  placeholder="Detail high priority items to finish next week..."
                  value={formGoals}
                  onChange={(e) => setFormGoals(e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all resize-none ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Blockers / Problems Faced
                  </label>
                  <textarea
                    placeholder="Describe logical obstacles, debugging blockers..."
                    value={formProblems}
                    onChange={(e) => setFormProblems(e.target.value)}
                    rows={2.5}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all resize-none ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Lessons Learned
                  </label>
                  <textarea
                    placeholder="Core learnings, structural tricks, schedule fixes..."
                    value={formLessons}
                    onChange={(e) => setFormLessons(e.target.value)}
                    rows={2.5}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all resize-none ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="formIsFav"
                  checked={formIsFav}
                  onChange={(e) => setFormIsFav(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                />
                <label htmlFor="formIsFav" className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer select-none">
                  ⭐ Star as key retrospective journal
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    darkMode
                      ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300'
                      : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
