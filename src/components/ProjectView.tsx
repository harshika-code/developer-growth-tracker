import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  Edit, 
  Trash2, 
  Github, 
  ExternalLink, 
  Code2, 
  Hammer, 
  CheckCircle2, 
  Lightbulb 
} from 'lucide-react';
import { Project } from '../types';

interface ProjectViewProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  darkMode: boolean;
  globalSearch: string;
  showFavouritesOnly: boolean;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  projects,
  setProjects,
  darkMode,
  globalSearch,
  showFavouritesOnly,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<Project | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTech, setFormTech] = useState('');
  const [formGithub, setFormGithub] = useState('');
  const [formDemo, setFormDemo] = useState('');
  const [formStatus, setFormStatus] = useState<'Idea' | 'Building' | 'Completed'>('Idea');
  const [formIsFav, setFormIsFav] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter(proj => {
      const searchStr = `${proj.name} ${proj.description} ${proj.techStack} ${proj.status}`.toLowerCase();
      const matchesGlobal = searchStr.includes(globalSearch.toLowerCase());
      const matchesLocal = searchStr.includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'All' || proj.status === statusFilter;
      const matchesFav = !showFavouritesOnly || proj.isFavourite;

      return matchesGlobal && matchesLocal && matchesStatus && matchesFav;
    });
  }, [projects, globalSearch, search, statusFilter, showFavouritesOnly]);

  const handleOpenCreate = () => {
    setEditingProj(null);
    setFormName('');
    setFormDesc('');
    setFormTech('');
    setFormGithub('');
    setFormDemo('');
    setFormStatus('Idea');
    setFormIsFav(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProj(proj);
    setFormName(proj.name);
    setFormDesc(proj.description);
    setFormTech(proj.techStack);
    setFormGithub(proj.githubLink);
    setFormDemo(proj.demoLink);
    setFormStatus(proj.status);
    setFormIsFav(proj.isFavourite);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleToggleFav = (proj: Project) => {
    setProjects(projects.map(p => p.id === proj.id ? { ...p, isFavourite: !p.isFavourite } : p));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingProj) {
      setProjects(projects.map(p => p.id === editingProj.id ? {
        ...p,
        name: formName,
        description: formDesc,
        techStack: formTech,
        githubLink: formGithub,
        demoLink: formDemo,
        status: formStatus,
        isFavourite: formIsFav
      } : p));
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        name: formName,
        description: formDesc,
        techStack: formTech,
        githubLink: formGithub,
        demoLink: formDemo,
        status: formStatus,
        isFavourite: formIsFav
      };
      setProjects([newProj, ...projects]);
    }
    setIsFormOpen(false);
  };

  const handleStatusChange = (projId: string, nextStatus: 'Idea' | 'Building' | 'Completed') => {
    setProjects(projects.map(p => p.id === projId ? { ...p, status: nextStatus } : p));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Project Portfolio</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Map out ideas, log current sandbox apps, track build stacks, and showcase repositories.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
        >
          <Plus size={14} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search project name, technology, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs outline-none border transition-all ${
                darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 placeholder-neutral-500 focus:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:border-neutral-300'
              }`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs outline-none border ${
              darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="Idea">Idea</option>
            <option value="Building">Building</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <span className="text-xs font-mono text-neutral-400">
          Projects: {filteredProjects.length}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => {
          const statusIcon = 
            proj.status === 'Completed'
              ? <CheckCircle2 size={13} className="text-green-500" />
              : proj.status === 'Building'
                ? <Hammer size={13} className="text-blue-500 animate-pulse" />
                : <Lightbulb size={13} className="text-amber-500" />;

          const statusColor =
            proj.status === 'Completed'
              ? 'text-green-500 bg-green-500/10'
              : proj.status === 'Building'
                ? 'text-blue-500 bg-blue-500/10'
                : 'text-amber-500 bg-amber-500/10';

          return (
            <div
              key={proj.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between gap-5 transition-workspace ${
                darkMode 
                  ? 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 text-neutral-200' 
                  : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800'
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFav(proj)}
                      className={`transition-colors ${
                        proj.isFavourite 
                          ? 'text-amber-500' 
                          : 'text-neutral-300 dark:text-neutral-700 hover:text-amber-500'
                      }`}
                    >
                      <Star size={13} fill={proj.isFavourite ? 'currentColor' : 'none'} />
                    </button>
                    <span className="text-[10px] font-mono text-neutral-400">Project Workspace</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Name & Desc */}
                <div>
                  <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white leading-tight">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 line-clamp-3">
                    {proj.description || <span className="italic opacity-60">No description documented yet.</span>}
                  </p>
                </div>

                {/* Tech Badges */}
                {proj.techStack && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.techStack.split(',').map((tech) => (
                      <span
                        key={tech}
                        className={`text-[9px] font-mono tracking-wide px-2 py-0.5 rounded border ${
                          darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-250 text-neutral-600'
                        }`}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status and links */}
              <div className="border-t border-neutral-100 dark:border-neutral-900 pt-3 flex items-center justify-between">
                {/* Status Drop */}
                <div className="flex items-center gap-1.5">
                  {statusIcon}
                  <select
                    value={proj.status}
                    onChange={(e) => handleStatusChange(proj.id, e.target.value as any)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border bg-transparent font-medium cursor-pointer outline-none ${statusColor} ${
                      darkMode ? 'border-neutral-800' : 'border-neutral-200'
                    }`}
                  >
                    <option value="Idea" className={darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}>Idea</option>
                    <option value="Building" className={darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}>Building</option>
                    <option value="Completed" className={darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}>Completed</option>
                  </select>
                </div>

                {/* Launch Links */}
                <div className="flex items-center gap-2">
                  {proj.githubLink && (
                    <a
                      href={proj.githubLink.startsWith('http') ? proj.githubLink : `https://${proj.githubLink}`}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                      title="GitHub Repository"
                    >
                      <Github size={13} />
                    </a>
                  )}
                  {proj.demoLink && (
                    <a
                      href={proj.demoLink.startsWith('http') ? proj.demoLink : `https://${proj.demoLink}`}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                      title="Live Preview"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-400 dark:text-neutral-500 italic">
            No projects found. Add one above to kick off your portfolio!
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h2 className="text-lg font-display font-semibold mb-4">
              {editingProj ? '✏ Edit Project Card' : '➕ Add New Project Card'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Developer Growth Tracker"
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
                  Description
                </label>
                <textarea
                  placeholder="Detail the project goals, highlights, and architecture..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
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
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Tailwind CSS, Lucide"
                  value={formTech}
                  onChange={(e) => setFormTech(e.target.value)}
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
                    GitHub Link
                  </label>
                  <input
                    type="text"
                    placeholder="github.com/user/repo"
                    value={formGithub}
                    onChange={(e) => setFormGithub(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Demo Link (Live preview)
                  </label>
                  <input
                    type="text"
                    placeholder="my-project.vercel.app"
                    value={formDemo}
                    onChange={(e) => setFormDemo(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Development Status
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
                  <option value="Idea">Idea</option>
                  <option value="Building">Building</option>
                  <option value="Completed">Completed</option>
                </select>
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
                  ⭐ Mark as Favourite portfolio item
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
                  {editingProj ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
