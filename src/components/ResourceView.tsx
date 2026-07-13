import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Tag, 
  Settings, 
  CheckCircle,
  Clock,
  BookOpen,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { Resource } from '../types';

interface ResourceViewProps {
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  darkMode: boolean;
  globalSearch: string;
  showFavouritesOnly: boolean;
}

export const ResourceView: React.FC<ResourceViewProps> = ({
  resources,
  setResources,
  categories,
  setCategories,
  darkMode,
  globalSearch,
  showFavouritesOnly,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const [formName, setFormName] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'To Read' | 'In Progress' | 'Completed'>('To Read');
  const [formNotes, setFormNotes] = useState('');
  const [formIsFav, setFormIsFav] = useState(false);

  // Custom Category adding state
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const searchStr = `${resource.name} ${resource.link} ${resource.category} ${resource.description} ${resource.notes}`.toLowerCase();
      const matchesGlobal = searchStr.includes(globalSearch.toLowerCase());
      const matchesLocal = searchStr.includes(search.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || resource.status === selectedStatus;
      const matchesFav = !showFavouritesOnly || resource.isFavourite;

      return matchesGlobal && matchesLocal && matchesCategory && matchesStatus && matchesFav;
    });
  }, [resources, globalSearch, search, selectedCategory, selectedStatus, showFavouritesOnly]);

  const handleOpenCreate = () => {
    setEditingResource(null);
    setFormName('');
    setFormLink('');
    setFormCategory(categories[0] || 'General');
    setFormDescription('');
    setFormStatus('To Read');
    setFormNotes('');
    setFormIsFav(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (res: Resource) => {
    setEditingResource(res);
    setFormName(res.name);
    setFormLink(res.link);
    setFormCategory(res.category);
    setFormDescription(res.description);
    setFormStatus(res.status);
    setFormNotes(res.notes);
    setFormIsFav(res.isFavourite);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(r => r.id !== id));
    }
  };

  const handleToggleFav = (res: Resource) => {
    setResources(resources.map(r => r.id === res.id ? { ...r, isFavourite: !r.isFavourite } : r));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingResource) {
      setResources(resources.map(r => r.id === editingResource.id ? {
        ...r,
        name: formName,
        link: formLink,
        category: formCategory,
        description: formDescription,
        status: formStatus,
        notes: formNotes,
        isFavourite: formIsFav
      } : r));
    } else {
      const newRes: Resource = {
        id: `res-${Date.now()}`,
        name: formName,
        link: formLink,
        category: formCategory,
        description: formDescription,
        status: formStatus,
        notes: formNotes,
        isFavourite: formIsFav
      };
      setResources([newRes, ...resources]);
    }
    setIsFormOpen(false);
  };

  const handleAddCategory = () => {
    const cleanCat = newCatName.trim();
    if (cleanCat && !categories.includes(cleanCat)) {
      setCategories([...categories, cleanCat]);
      setNewCatName('');
    }
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (categories.length <= 1) {
      alert("You must keep at least one category.");
      return;
    }
    if (window.confirm(`Are you sure you want to remove the category "${catToDelete}"? (Resources assigned to this category will keep their label but won't be filtered by this Category list until assigned elsewhere).`)) {
      setCategories(categories.filter(c => c !== catToDelete));
      if (selectedCategory === catToDelete) {
        setSelectedCategory('All');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Resource Library</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Store documents, video links, tutorial portals, and bookmarks categorized by subject.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              darkMode 
                ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300' 
                : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
            }`}
          >
            <Settings size={13} />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span>Add Resource</span>
          </button>
        </div>
      </div>

      {/* Category Management Drawer/Section */}
      {isCategoryOpen && (
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300' : 'bg-neutral-100/40 border-neutral-200 text-neutral-800'
        } space-y-3`}>
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">Manage Resource Categories</h3>
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                  darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
                }`}
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat)}
                  className="text-neutral-400 hover:text-red-500 font-bold ml-1 text-[11px]"
                  title="Remove Category option"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add custom category name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              className={`flex-1 px-3 py-1.5 text-xs rounded-lg border outline-none ${
                darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-300'
              }`}
            />
            <button
              onClick={handleAddCategory}
              className="px-3 py-1.5 text-xs rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Filters and Searches */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-1 flex-wrap gap-2.5 items-center max-w-2xl">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search resource name, links, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs outline-none border transition-all ${
                darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 placeholder-neutral-500 focus:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:border-neutral-300'
              }`}
            />
          </div>

          {/* Category drop */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs outline-none border ${
              darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
            }`}
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Drop */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs outline-none border ${
              darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="To Read">To Read</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="text-xs font-mono text-neutral-400">
          Mapped: {filteredResources.length} elements
        </div>
      </div>

      {/* Grid of Resources Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          const statusColor = 
            res.status === 'Completed'
              ? 'bg-green-500/10 text-green-500 border-green-500/20'
              : res.status === 'In Progress'
                ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                : 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';

          return (
            <div
              key={res.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-workspace ${
                darkMode 
                  ? 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 text-neutral-200' 
                  : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFav(res)}
                      className={`transition-colors ${
                        res.isFavourite 
                          ? 'text-amber-500' 
                          : 'text-neutral-300 dark:text-neutral-700 hover:text-amber-500'
                      }`}
                    >
                      <Star size={13} fill={res.isFavourite ? 'currentColor' : 'none'} />
                    </button>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest border ${
                      darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                    }`}>
                      <Tag size={10} />
                      {res.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(res)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(res.id)}
                      className="p-1 rounded text-neutral-400 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Name & Link */}
                <div>
                  {res.link ? (
                    <a
                      href={res.link.startsWith('http') ? res.link : `https://${res.link}`}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer"
                      className="font-display font-semibold text-sm hover:underline flex items-center gap-1 text-neutral-900 dark:text-white"
                    >
                      <span>{res.name}</span>
                      <ExternalLink size={11} className="opacity-60" />
                    </a>
                  ) : (
                    <h3 className="font-display font-semibold text-sm text-neutral-900 dark:text-white">{res.name}</h3>
                  )}
                  {res.description && (
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1.5 line-clamp-2">
                      {res.description}
                    </p>
                  )}
                </div>

                {/* Notes */}
                {res.notes && (
                  <div className="p-2 rounded text-xs font-mono border border-neutral-150 dark:border-neutral-900/50 bg-neutral-50/50 dark:bg-neutral-950/20 text-neutral-500 dark:text-neutral-400">
                    <p className="line-clamp-2">{res.notes}</p>
                  </div>
                )}
              </div>

              {/* Footer status row */}
              <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900 pt-2 text-[10px]">
                <span className={`px-2 py-0.5 rounded border ${statusColor}`}>
                  {res.status}
                </span>
                <span className="text-neutral-400 dark:text-neutral-500">Resource Bookmark</span>
              </div>
            </div>
          );
        })}

        {filteredResources.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-400 dark:text-neutral-500 italic">
            No bookmarks found matching selected filters.
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h2 className="text-lg font-display font-semibold mb-4">
              {editingResource ? '✏ Edit Resource Item' : '➕ Add Resource Link'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Resource Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NeetCode 150 List"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Hyperlink URL (e.g. docs.python.org)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Category Option
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                        : 'bg-white border-neutral-200 text-neutral-800'
                    }`}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Study Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                        : 'bg-white border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <option value="To Read">To Read</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Brief Description
                </label>
                <input
                  type="text"
                  placeholder="Interactive visual roadmap charting algorithms dependencies..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Private Notes
                </label>
                <textarea
                  placeholder="Take notes, record chapters, write codes or reminders..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all resize-none ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
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
                  ⭐ Mark as Favourite Resource
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
                  {editingResource ? 'Save Changes' : 'Create Bookmark'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
