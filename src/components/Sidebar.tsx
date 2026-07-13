import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Compass, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  Building2, 
  Calendar, 
  Search, 
  Star,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  Plus,
  Settings,
  Github,
  CalendarCheck,
  Sparkles,
  FileText,
  Award,
  Library
} from 'lucide-react';
import { QuickLink } from '../types';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  showFavouritesOnly: boolean;
  setShowFavouritesOnly: (fav: boolean) => void;
  quickLinks: QuickLink[];
  onAddQuickLink: () => void;
  profileName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setView,
  darkMode,
  setDarkMode,
  globalSearch,
  setGlobalSearch,
  showFavouritesOnly,
  setShowFavouritesOnly,
  quickLinks,
  onAddQuickLink,
  profileName
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'skills', label: 'Skills Roadmap', icon: Compass },
    { id: 'apna', label: 'Apna College', icon: GraduationCap },
    { id: 'resources', label: 'Resource Library', icon: BookOpen },
    { id: 'projects', label: 'Project Portfolio', icon: Briefcase },
    { id: 'internships', label: 'Opportunities', icon: Building2 },
    { id: 'integrations', label: 'GitHub & LeetCode', icon: Github },
    { id: 'calendar', label: 'Calendar Sync', icon: CalendarCheck },
    { id: 'coach', label: 'AI Career Coach', icon: Sparkles },
    { id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: 'interviews', label: 'Interview Tracker', icon: Award },
    { id: 'vault', label: 'Knowledge Vault', icon: Library },
    { id: 'weekly', label: 'Weekly Reviews', icon: Calendar },
    { id: 'settings', label: 'Settings & Config', icon: Settings },
  ];

  return (
    <aside className={`w-64 border-r flex flex-col h-screen overflow-y-auto shrink-0 transition-workspace ${
      darkMode 
        ? 'bg-neutral-900 border-neutral-800 text-neutral-200' 
        : 'bg-neutral-50 border-neutral-200 text-neutral-800'
    }`}>
      {/* Brand Header */}
      <div className={`p-5 border-b flex flex-col gap-1 ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
            {profileName ? `${profileName} Growth` : 'Growth Tracker'}
          </span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-1.5 rounded-lg border transition-all ${
              darkMode 
                ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-yellow-400' 
                : 'bg-white border-neutral-200 hover:bg-neutral-100 text-neutral-600'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 dark:text-neutral-500">
          Career Workspace
        </span>
      </div>

      {/* Global Filter Control Panel */}
      <div className={`p-4 border-b flex flex-col gap-2 ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
        {/* Search bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search workspace..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-md text-xs font-sans outline-none border transition-all ${
              darkMode
                ? 'bg-neutral-950 border-neutral-800 text-neutral-300 placeholder-neutral-600 focus:border-neutral-700'
                : 'bg-white border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:border-neutral-300'
            }`}
          />
        </div>

        {/* Favourites Toggle */}
        <button
          onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
          className={`flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-all ${
            showFavouritesOnly
              ? 'bg-amber-500/10 text-amber-500 font-medium'
              : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Star size={13} fill={showFavouritesOnly ? 'currentColor' : 'none'} />
            <span>Show Favourites Only</span>
          </div>
          {showFavouritesOnly && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-sans transition-workspace ${
                isActive
                  ? darkMode
                    ? 'bg-neutral-800 text-white font-medium shadow-sm'
                    : 'bg-neutral-200/70 text-neutral-900 font-medium'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'} />
                <span>{item.label}</span>
              </div>
              <ChevronRight size={12} className={`opacity-0 transition-opacity ${isActive ? 'opacity-40' : ''}`} />
            </button>
          );
        })}
      </nav>

      {/* Quick Links Footer */}
      <div className={`p-4 border-t mt-auto ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 dark:text-neutral-500">
            Quick Launch
          </span>
          <button
            onClick={onAddQuickLink}
            className={`p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200`}
            title="Add Launch Link"
          >
            <Plus size={12} />
          </button>
        </div>
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
          {quickLinks.map((link) => (
            <a
              key={link.id}
              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-all ${
                darkMode
                  ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {link.isFavourite && <Star size={10} className="text-amber-500 shrink-0" fill="currentColor" />}
                <span className="truncate font-sans">{link.label}</span>
              </div>
              <ExternalLink size={10} className="opacity-40 hover:opacity-100 shrink-0" />
            </a>
          ))}
          {quickLinks.length === 0 && (
            <span className="text-[10px] text-neutral-400 block italic py-1">No links yet.</span>
          )}
        </div>
      </div>
    </aside>
  );
};
