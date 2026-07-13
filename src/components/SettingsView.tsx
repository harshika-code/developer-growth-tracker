import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Star, 
  FileJson,
  Link,
  ShieldAlert,
  Key
} from 'lucide-react';
import { QuickLink, TrackerState } from '../types';

interface SettingsViewProps {
  quickLinks: QuickLink[];
  setQuickLinks: (links: QuickLink[]) => void;
  onResetWorkspace: () => void;
  onImportWorkspace: (imported: TrackerState) => void;
  fullState: TrackerState;
  darkMode: boolean;
  profileName?: string;
  setProfileName: (name: string) => void;
  targetRole?: string;
  setTargetRole: (role: string) => void;
  startDate?: string;
  setStartDate: (date: string) => void;
  endDate?: string;
  setEndDate: (date: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  quickLinks,
  setQuickLinks,
  onResetWorkspace,
  onImportWorkspace,
  fullState,
  darkMode,
  profileName = 'Developer',
  setProfileName,
  targetRole = 'Big Tech Software Engineer',
  setTargetRole,
  startDate = '2026-07-12',
  setStartDate,
  endDate = '2027-06-30',
  setEndDate,
}) => {
  // Add Quick link states
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkIsFav, setLinkIsFav] = useState(false);

  // File import state
  const [importError, setImportError] = useState<string | null>(null);

  // Custom Gemini API Key state
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    try {
      return localStorage.getItem('dev_growth_tracker_gemini_api_key') || '';
    } catch {
      return '';
    }
  });

  const handleOpenCreateLink = () => {
    setEditingLink(null);
    setLinkLabel('');
    setLinkUrl('');
    setLinkIsFav(false);
    setIsLinkModalOpen(true);
  };

  const handleOpenEditLink = (link: QuickLink) => {
    setEditingLink(link);
    setLinkLabel(link.label);
    setLinkUrl(link.url);
    setLinkIsFav(link.isFavourite);
    setIsLinkModalOpen(true);
  };

  const handleDeleteLink = (id: string) => {
    if (window.confirm('Are you sure you want to delete this launch link?')) {
      setQuickLinks(quickLinks.filter(l => l.id !== id));
    }
  };

  const handleToggleFav = (link: QuickLink) => {
    setQuickLinks(quickLinks.map(l => l.id === link.id ? { ...l, isFavourite: !l.isFavourite } : l));
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkLabel.trim() || !linkUrl.trim()) return;

    if (editingLink) {
      setQuickLinks(quickLinks.map(l => l.id === editingLink.id ? {
        ...l,
        label: linkLabel,
        url: linkUrl,
        isFavourite: linkIsFav
      } : l));
    } else {
      const newLink: QuickLink = {
        id: `ql-${Date.now()}`,
        label: linkLabel,
        url: linkUrl,
        isFavourite: linkIsFav
      };
      setQuickLinks([...quickLinks, newLink]);
    }
    setIsLinkModalOpen(false);
  };

  // Export JSON file
  const handleExport = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullState, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `developer_growth_tracker_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  // Import JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        // Verify a couple of basic fields to make sure it's valid state
        if (parsed && typeof parsed === 'object' && ('tasks' in parsed || 'skills' in parsed)) {
          onImportWorkspace(parsed as TrackerState);
          alert('Workspace backup successfully restored!');
        } else {
          setImportError('Invalid backup file. The uploaded JSON is missing required tracker parameters.');
        }
      } catch (err) {
        setImportError('Failed to parse file. Make sure it is a valid backup JSON file.');
      }
    };
    fileReader.readAsText(files[0]);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to delete and reset all your tracker data? This action will permanently restore default empty starter values and wipe any custom progress entries. This cannot be undone. Proceed?')) {
      onResetWorkspace();
      alert('All tracker data has been successfully reset.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-2xl font-display font-semibold tracking-tight">Workspace Config Suite</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Add custom launch links, backup your milestones, restore JSON files, or reset variables.
        </p>
      </div>

      {/* 0. Profile and Target Settings Card */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-neutral-950/20 border-neutral-800' : 'bg-white border-neutral-200'} space-y-4`}>
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-sm flex items-center gap-2">
            <Settings size={15} className="text-blue-500" />
            <span>Developer Profile & Target Journey Settings</span>
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Customize the global profile name, career objectives, starting timestamps, and dream benchmarks across your tracker.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
              Developer Profile Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-xs border outline-none transition-all ${
                darkMode
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
              Target Career Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-xs border outline-none transition-all ${
                darkMode
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
              Journey Start Date
            </label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-xs border outline-none transition-all ${
                darkMode
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
              Journey Target End Date
            </label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-xs border outline-none transition-all ${
                darkMode
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 1. Quick Launch Shortcuts */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-neutral-950/20 border-neutral-800' : 'bg-white border-neutral-200'} space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-sm flex items-center gap-2">
              <Link size={15} />
              <span>Workspace Quick Launch Shortcuts</span>
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Customize standard URLs shown in your sidebar footer for instant navigation.
            </p>
          </div>
          <button
            onClick={handleOpenCreateLink}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all"
          >
            <Plus size={12} />
            <span>Add Launch Link</span>
          </button>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <div
              key={link.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                darkMode ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-750' : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <button
                  onClick={() => handleToggleFav(link)}
                  className={`transition-colors shrink-0 ${link.isFavourite ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-750'}`}
                >
                  <Star size={13} fill={link.isFavourite ? 'currentColor' : 'none'} />
                </button>
                <div className="truncate text-xs">
                  <span className="font-semibold block truncate text-neutral-900 dark:text-white">{link.label}</span>
                  <a
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate hover:underline flex items-center gap-0.5"
                  >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink size={8} />
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  onClick={() => handleOpenEditLink(link)}
                  className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 rounded"
                >
                  <Edit size={11} />
                </button>
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="p-1 hover:text-red-500 text-neutral-400 rounded"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
          {quickLinks.length === 0 && (
            <p className="text-xs text-neutral-400 italic py-2 col-span-full text-center">No shortcuts added yet.</p>
          )}
        </div>
      </div>

      {/* 1.5 Gemini API Key Override */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-neutral-950/20 border-neutral-800' : 'bg-white border-neutral-200'} space-y-4`} id="gemini-api-key-panel">
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-sm flex items-center gap-2">
            <Key size={15} className="text-indigo-500 dark:text-indigo-400" />
            <span>Google Gemini API Key Overwrite</span>
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            If you cannot configure the GEMINI_API_KEY inside the Google AI Studio secrets/settings panel (e.g. if it gives you a 'no projects found' error or only offers select key), you can paste your API key directly here. It remains secure inside your local browser.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            className={`flex-1 px-3 py-2 text-xs rounded-lg border outline-none transition-all ${
              darkMode
                ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700 font-mono'
                : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400 font-mono'
            }`}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                localStorage.setItem('dev_growth_tracker_gemini_api_key', apiKeyInput.trim());
                alert('Gemini API Key saved successfully! The AI tools will now use this key.');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm shrink-0 cursor-pointer"
            >
              Save Key
            </button>
            {apiKeyInput && (
              <button
                onClick={() => {
                  localStorage.removeItem('dev_growth_tracker_gemini_api_key');
                  setApiKeyInput('');
                  alert('Custom Gemini API Key removed.');
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all shadow-sm shrink-0 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <p className="text-[10px] text-neutral-400">
          🔑 Don't have a key? Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="text-indigo-500 underline hover:text-indigo-400">Google AI Studio</a> to generate a free Gemini API Key under "Get API Key".
        </p>
      </div>

      {/* 2. Export & Import Backup */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-neutral-950/20 border-neutral-800' : 'bg-white border-neutral-200'} space-y-4`}>
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-sm flex items-center gap-2">
            <FileJson size={15} />
            <span>Data Backup & Recovery</span>
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Export all custom tasks, skills progress, logged learning hours, and bookmarks as a single backup file, or restore.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Export Button */}
          <button
            onClick={handleExport}
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border text-xs font-semibold hover:scale-[1.01] transition-all cursor-pointer ${
              darkMode 
                ? 'bg-neutral-900/50 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700 text-neutral-200' 
                : 'bg-neutral-50 border-neutral-200 hover:bg-white hover:border-neutral-350 text-neutral-800 shadow-sm'
            }`}
          >
            <Download size={14} />
            <div className="text-left">
              <span className="block font-bold">Export Data</span>
              <span className="block text-[10px] text-neutral-400 font-normal">Download complete tracker data as JSON file</span>
            </div>
          </button>

          {/* Import Button Wrapper */}
          <label
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border text-xs font-semibold hover:scale-[1.01] transition-all cursor-pointer ${
              darkMode 
                ? 'bg-neutral-900/50 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700 text-neutral-200' 
                : 'bg-neutral-50 border-neutral-200 hover:bg-white hover:border-neutral-350 text-neutral-800 shadow-sm'
            }`}
          >
            <Upload size={14} />
            <div className="text-left">
              <span className="block font-bold">Import Data</span>
              <span className="block text-[10px] text-neutral-400 font-normal">Upload previous backup and restore everything</span>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {importError && (
          <div className="p-3 text-xs text-red-500 bg-red-500/10 rounded-lg border border-red-500/20 font-mono">
            {importError}
          </div>
        )}
      </div>

      {/* 3. Dangerous Area */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'border-red-900/20 bg-red-900/5' : 'border-red-200 bg-red-50/20'} space-y-4`}>
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-sm text-red-500 flex items-center gap-2">
            <ShieldAlert size={15} />
            <span>Danger Zone Settings</span>
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Proceed with extreme care. Toggling reset values wipes custom progress entries instantly.
          </p>
        </div>

        <div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer shadow"
          >
            <RotateCcw size={14} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* ================= LINK MODAL ================= */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h2 className="text-lg font-display font-semibold mb-4">
              {editingLink ? '✏ Edit Launch Shortcut' : '➕ Add Launch Shortcut'}
            </h2>

            <form onSubmit={handleSaveLink} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Shortcut Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LeetCode Profile"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Launch URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://leetcode.com/username"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="linkIsFav"
                  checked={linkIsFav}
                  onChange={(e) => setLinkIsFav(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                />
                <label htmlFor="linkIsFav" className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer select-none">
                  ⭐ Star as key shortcut (favourited shortcuts pin inside dashboard widget)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
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
                  Save Shortcut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
