import React, { useState } from 'react';
import { BookOpen, Search, Plus, Trash2, Edit2, ArrowLeft, Tag, Calendar, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { WikiNote } from '../types';

interface KnowledgeVaultViewProps {
  notes: WikiNote[];
  setNotes: (notelist: WikiNote[]) => void;
  categories: string[];
  darkMode: boolean;
}

export const KnowledgeVaultView: React.FC<KnowledgeVaultViewProps> = ({
  notes,
  setNotes,
  categories,
  darkMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Active viewing/editing state
  const [activeNote, setActiveNote] = useState<WikiNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0] || 'General');
  const [tagsString, setTagsString] = useState('');

  // Handle adding/editing note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedLinks = tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (activeNote && isEditing) {
      // Edit existing note
      const updated: WikiNote = {
        ...activeNote,
        title,
        content,
        category,
        links: parsedLinks,
        lastModified: new Date().toISOString().split('T')[0]
      };
      setNotes(notes.map(n => n.id === activeNote.id ? updated : n));
      setActiveNote(updated);
      setIsEditing(false);
    } else {
      // Create new note
      const added: WikiNote = {
        id: `note-${Date.now()}`,
        title,
        content,
        category,
        links: parsedLinks,
        lastModified: new Date().toISOString().split('T')[0]
      };
      setNotes([added, ...notes]);
      setActiveNote(added);
      setIsEditing(false);
    }
    resetForm();
  };

  const handleCreateNewTrigger = () => {
    resetForm();
    setIsEditing(true);
    setActiveNote(null);
  };

  const handleEditTrigger = (note: WikiNote) => {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setTagsString(note.links?.join(', ') || '');
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    setActiveNote(null);
    setIsEditing(false);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory(categories[0] || 'General');
    setTagsString('');
  };

  // Filters notes list
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || n.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in" id="knowledge-vault-container">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display font-bold text-2xl tracking-tight">Knowledge Vault</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Build your personal curriculum Wikipedia. Keep DSA cheat sheets, study summaries, and interview notes preserved safely.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleCreateNewTrigger}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold shadow-sm cursor-pointer transition-all"
          >
            <Plus size={14} />
            <span>Create Wiki Note</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit Note View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs Panel */}
          <form onSubmit={handleSaveNote} className={`p-6 rounded-xl border space-y-4 ${
            darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'
          }`} id="wiki-editor-form">
            <h2 className="font-display font-bold text-base">
              {activeNote ? "Update Wiki Note" : "Draft a New Wiki Note"}
            </h2>

            <div className="space-y-1">
              <label className="text-xs font-medium opacity-70">Note Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Dynamic Programming Optimization Tricks"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-md border outline-none ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-700' : 'bg-white border-neutral-200 focus:border-neutral-300'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium opacity-70">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-md border outline-none ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200'
                  }`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium opacity-70">Inter-Wiki Connections (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. DSA, Dynamic Programming"
                  value={tagsString}
                  onChange={(e) => setTagsString(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-md border outline-none ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium opacity-70">Markdown Content Body</label>
                <span className="text-[10px] text-neutral-400">Supports standard markdown structure</span>
              </div>
              <textarea
                rows={12}
                required
                placeholder="Write your wikipedia note content... Use # for headings, * list elements, ``` for code blocks"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full px-3 py-2 text-xs font-mono rounded-md border outline-none ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-700' : 'bg-white border-neutral-200 focus:border-neutral-300'
                }`}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  resetForm();
                }}
                className={`px-4 py-2 rounded-lg text-xs font-medium border ${
                  darkMode ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-400' : 'border-neutral-200 hover:bg-neutral-100 text-neutral-600'
                }`}
              >
                Back to Wiki
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold cursor-pointer"
              >
                Save Wiki Note
              </button>
            </div>
          </form>

          {/* Visual Live Markdown Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Live Visual Note Preview</span>
              <span className="text-[10px] font-mono">Render view</span>
            </div>
            <div className={`p-6 rounded-xl border min-h-[450px] overflow-y-auto ${
              darkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
            }`} id="markdown-live-preview">
              <h1 className="font-display font-bold text-xl text-neutral-200 dark:text-white mb-2">{title || 'Untitled Note'}</h1>
              <div className="flex gap-2 items-center text-xs text-neutral-400 mb-6 border-b pb-3 border-neutral-200 dark:border-neutral-800">
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] uppercase font-mono">{category}</span>
                <span>•</span>
                <span>Last saved: Today</span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 space-y-4 leading-relaxed font-sans markdown-body">
                <ReactMarkdown>{content || '*No content written yet. Use the editor on the left.*'}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      ) : activeNote ? (
        /* Detailed View of an Active Note */
        <div className="space-y-6">
          <button
            onClick={() => setActiveNote(null)}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Wikipedia Index</span>
          </button>

          <div className={`p-8 rounded-xl border min-h-[500px] flex flex-col ${
            darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'
          }`} id="active-note-sheet">
            <div className="flex justify-between items-start border-b pb-4 mb-6 border-neutral-200 dark:border-neutral-800">
              <div className="space-y-1">
                <h1 className="font-display font-bold text-2xl text-neutral-200 dark:text-white">
                  {activeNote.title}
                </h1>
                <div className="flex gap-3 items-center text-xs text-neutral-400">
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] uppercase font-mono">{activeNote.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    <span>Last modified: {activeNote.lastModified}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditTrigger(activeNote)}
                  className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  title="Edit Note"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(activeNote.id)}
                  className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-red-500 transition-colors"
                  title="Delete Note"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 prose prose-sm dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 space-y-4 leading-relaxed font-sans markdown-body">
              <ReactMarkdown>{activeNote.content}</ReactMarkdown>
            </div>

            {/* Note tags/connections footer */}
            {activeNote.links && activeNote.links.length > 0 && (
              <div className="border-t pt-4 mt-8 border-neutral-200 dark:border-neutral-800 flex items-center gap-2 flex-wrap">
                <Tag size={12} className="text-neutral-500" />
                <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-400">Wiki Connections:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {activeNote.links.map((link, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-neutral-950/60 border border-neutral-800 px-2 py-0.5 rounded text-neutral-300"
                    >
                      {link}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Notes Grid Dashboard */
        <div className="space-y-6">
          {/* Search and Category Filter bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search wiki articles or cheat sheets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-md text-xs outline-none border transition-all ${
                  darkMode
                    ? 'bg-neutral-900/50 border-neutral-800 text-neutral-300 placeholder-neutral-600 focus:border-neutral-700'
                    : 'bg-white border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:border-neutral-300'
                }`}
              />
            </div>

            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-neutral-800 text-white dark:bg-white dark:text-neutral-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-neutral-800 text-white dark:bg-white dark:text-neutral-950'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Card list Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="notes-grid">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNote(note)}
                className={`p-6 rounded-xl border flex flex-col justify-between gap-4 transition-all cursor-pointer group ${
                  darkMode 
                    ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850/50' 
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono uppercase bg-neutral-850 dark:bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                      {note.category}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {note.lastModified}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-neutral-200 dark:text-white group-hover:text-blue-500 transition-colors truncate">
                    {note.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {note.content.replace(/[#*`]/g, '')}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="flex items-center gap-1.5">
                    <FileText size={11} />
                    <span>{note.links?.length || 0} Connection{note.links?.length !== 1 ? 's' : ''}</span>
                  </span>
                  <span className="text-blue-500 text-xs font-medium group-hover:translate-x-1 transition-transform inline-block">
                    Read Wiki &rarr;
                  </span>
                </div>
              </div>
            ))}

            {filteredNotes.length === 0 && (
              <div className="col-span-full text-center py-12 text-neutral-400 italic">
                No articles or study notes found in the knowledge vault.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
