import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Terminal, 
  Github, 
  Linkedin, 
  GraduationCap, 
  Star 
} from 'lucide-react';

// Sub views
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { TaskTrackerView } from './components/TaskTrackerView';
import { SkillTrackerView } from './components/SkillTrackerView';
import { ApnaCollegeView } from './components/ApnaCollegeView';
import { ResourceView } from './components/ResourceView';
import { ProjectView } from './components/ProjectView';
import { InternshipView } from './components/InternshipView';
import { WeeklyReviewView } from './components/WeeklyReviewView';
import { SettingsView } from './components/SettingsView';

// New Sub views
import { IntegrationsView } from './components/IntegrationsView';
import { CalendarSyncView } from './components/CalendarSyncView';
import { AICareerCoachView } from './components/AICareerCoachView';
import { ResumeBuilderView } from './components/ResumeBuilderView';
import { InterviewTrackerView } from './components/InterviewTrackerView';
import { KnowledgeVaultView } from './components/KnowledgeVaultView';

// State models
import { TrackerState, Task, Skill, DSATopic, WebDevTopic, Resource, Project, InternshipOpportunity, QuickLink, WeeklyReview, DashboardWidget, GitHubIntegration, LeetCodeIntegration, CalendarEvent, InterviewLog, WikiNote } from './types';
import { loadTrackerState, saveTrackerState, DEFAULT_STATE } from './initialState';

export default function App() {
  const [state, setState] = useState<TrackerState>(() => loadTrackerState());
  const [currentView, setView] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('dev_growth_tracker_theme');
      return savedTheme ? savedTheme === 'dark' : true; // Default to dark mode for modern feel
    } catch {
      return true;
    }
  });

  // Filters
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [showFavouritesOnly, setShowFavouritesOnly] = useState<boolean>(false);

  // Responsive sidebar toggler for smaller resolutions
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Synchronize state changes with localStorage
  useEffect(() => {
    saveTrackerState(state);
  }, [state]);

  // Synchronize theme configuration
  useEffect(() => {
    try {
      localStorage.setItem('dev_growth_tracker_theme', darkMode ? 'dark' : 'light');
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Theme sync error:', e);
    }
  }, [darkMode]);

  // Handle fully resetting the workspace
  const handleResetWorkspace = () => {
    setState(DEFAULT_STATE);
  };

  // Handle importing a backup file
  const handleImportWorkspace = (imported: TrackerState) => {
    setState(imported);
  };

  // State setters proxying
  const setTasks = (tasks: Task[]) => {
    setState(prev => ({ ...prev, tasks }));
  };

  const setSkills = (skills: Skill[]) => {
    setState(prev => ({ ...prev, skills }));
  };

  const setDsaTopics = (dsaTopics: DSATopic[]) => {
    setState(prev => ({ ...prev, dsaTopics }));
  };

  const setWebDevTopics = (webDevTopics: WebDevTopic[]) => {
    setState(prev => ({ ...prev, webDevTopics }));
  };

  const setResources = (resources: Resource[]) => {
    setState(prev => ({ ...prev, resources }));
  };

  const setProjects = (projects: Project[]) => {
    setState(prev => ({ ...prev, projects }));
  };

  const setInternships = (internships: InternshipOpportunity[]) => {
    setState(prev => ({ ...prev, internships }));
  };

  const setQuickLinks = (quickLinks: QuickLink[]) => {
    setState(prev => ({ ...prev, quickLinks }));
  };

  const setWeeklyReviews = (weeklyReviews: WeeklyReview[]) => {
    setState(prev => ({ ...prev, weeklyReviews }));
  };

  const setWidgets = (widgets: DashboardWidget[]) => {
    setState(prev => ({ ...prev, widgets }));
  };

  const setCustomResourceCategories = (customResourceCategories: string[]) => {
    setState(prev => ({ ...prev, customResourceCategories }));
  };

  const setGithubIntegration = (githubIntegration: GitHubIntegration) => {
    setState(prev => ({ ...prev, githubIntegration }));
  };

  const setLeetcodeIntegration = (leetcodeIntegration: LeetCodeIntegration) => {
    setState(prev => ({ ...prev, leetcodeIntegration }));
  };

  const setCalendarEvents = (calendarEvents: CalendarEvent[]) => {
    setState(prev => ({ ...prev, calendarEvents }));
  };

  const setInterviews = (interviews: InterviewLog[]) => {
    setState(prev => ({ ...prev, interviews }));
  };

  const setWikiNotes = (wikiNotes: WikiNote[]) => {
    setState(prev => ({ ...prev, wikiNotes }));
  };

  const setProfileName = (profileName: string) => {
    setState(prev => ({ ...prev, profileName }));
  };

  const setTargetRole = (targetRole: string) => {
    setState(prev => ({ ...prev, targetRole }));
  };

  const setStartDate = (startDate: string) => {
    setState(prev => ({ ...prev, startDate }));
  };

  const setEndDate = (endDate: string) => {
    setState(prev => ({ ...prev, endDate }));
  };

  // Helper trigger to add launch link instantly
  const handleAddLaunchLinkFromSidebar = () => {
    setView('settings');
  };

  return (
    <div className={`min-h-screen flex transition-workspace ${
      darkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50/40 text-neutral-800'
    }`}>
      {/* Sidebar navigation */}
      <div className={`hidden md:block shrink-0 h-screen sticky top-0`}>
        <Sidebar
          currentView={currentView}
          setView={setView}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          showFavouritesOnly={showFavouritesOnly}
          setShowFavouritesOnly={setShowFavouritesOnly}
          quickLinks={state.quickLinks}
          onAddQuickLink={handleAddLaunchLinkFromSidebar}
          profileName={state.profileName}
        />
      </div>

      {/* Mobile drawer sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-neutral-950/60 z-40 transition-opacity"
        />
      )}

      {/* Mobile drawer sidebar container */}
      <div className={`md:hidden fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar
          currentView={currentView}
          setView={(v) => {
            setView(v);
            setIsSidebarOpen(false);
          }}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          showFavouritesOnly={showFavouritesOnly}
          setShowFavouritesOnly={setShowFavouritesOnly}
          quickLinks={state.quickLinks}
          onAddQuickLink={handleAddLaunchLinkFromSidebar}
          profileName={state.profileName}
        />
      </div>

      {/* Right Content Workspace container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Top Header with focus timer and live clocks */}
        <TopHeader
          darkMode={darkMode}
          profileName={state.profileName}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Core content area */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto space-y-8">
          {/* Main active sub view router */}
          {currentView === 'dashboard' && (
            <DashboardView
              tasks={state.tasks}
              setTasks={setTasks}
              skills={state.skills}
              quickLinks={state.quickLinks}
              weeklyReviews={state.weeklyReviews}
              widgets={state.widgets}
              setWidgets={setWidgets}
              setView={setView}
              darkMode={darkMode}
              profileName={state.profileName}
              setProfileName={setProfileName}
              targetRole={state.targetRole}
              setTargetRole={setTargetRole}
              startDate={state.startDate}
              setStartDate={setStartDate}
              endDate={state.endDate}
              setEndDate={setEndDate}
            />
          )}

          {currentView === 'tasks' && (
            <TaskTrackerView
              tasks={state.tasks}
              setTasks={setTasks}
              darkMode={darkMode}
              globalSearch={globalSearch}
              showFavouritesOnly={showFavouritesOnly}
            />
          )}

          {currentView === 'skills' && (
            <SkillTrackerView
              skills={state.skills}
              setSkills={setSkills}
              darkMode={darkMode}
              globalSearch={globalSearch}
              showFavouritesOnly={showFavouritesOnly}
            />
          )}

          {currentView === 'apna' && (
            <ApnaCollegeView
              dsaTopics={state.dsaTopics}
              setDsaTopics={setDsaTopics}
              webDevTopics={state.webDevTopics}
              setWebDevTopics={setWebDevTopics}
              darkMode={darkMode}
              globalSearch={globalSearch}
              showFavouritesOnly={showFavouritesOnly}
            />
          )}

          {currentView === 'resources' && (
            <ResourceView
              resources={state.resources}
              setResources={setResources}
              categories={state.customResourceCategories}
              setCategories={setCustomResourceCategories}
              darkMode={darkMode}
              globalSearch={globalSearch}
              showFavouritesOnly={showFavouritesOnly}
            />
          )}

          {currentView === 'projects' && (
            <ProjectView
              projects={state.projects}
              setProjects={setProjects}
              darkMode={darkMode}
              globalSearch={globalSearch}
              showFavouritesOnly={showFavouritesOnly}
            />
          )}

          {currentView === 'internships' && (
            <InternshipView
              internships={state.internships}
              setInternships={setInternships}
              darkMode={darkMode}
              globalSearch={globalSearch}
              showFavouritesOnly={showFavouritesOnly}
            />
          )}

          {currentView === 'weekly' && (
            <WeeklyReviewView
              weeklyReviews={state.weeklyReviews}
              setWeeklyReviews={setWeeklyReviews}
              darkMode={darkMode}
              globalSearch={globalSearch}
              showFavouritesOnly={showFavouritesOnly}
            />
          )}

          {currentView === 'integrations' && (
            <IntegrationsView
              github={state.githubIntegration}
              leetcode={state.leetcodeIntegration}
              setGithub={setGithubIntegration}
              setLeetcode={setLeetcodeIntegration}
              customIntegrations={state.customIntegrations || []}
              setCustomIntegrations={(ci) => setState(prev => ({ ...prev, customIntegrations: ci }))}
              darkMode={darkMode}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarSyncView
              events={state.calendarEvents || []}
              setEvents={setCalendarEvents}
              darkMode={darkMode}
            />
          )}

          {currentView === 'coach' && (
            <AICareerCoachView
              trackerState={state}
              darkMode={darkMode}
            />
          )}

          {currentView === 'resume' && (
            <ResumeBuilderView
              projects={state.projects}
              skills={state.skills}
              darkMode={darkMode}
              profileName={state.profileName}
              targetRole={state.targetRole}
            />
          )}

          {currentView === 'interviews' && (
            <InterviewTrackerView
              interviews={state.interviews || []}
              setInterviews={setInterviews}
              darkMode={darkMode}
            />
          )}

          {currentView === 'vault' && (
            <KnowledgeVaultView
              notes={state.wikiNotes || []}
              setNotes={setWikiNotes}
              categories={state.customResourceCategories}
              darkMode={darkMode}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              quickLinks={state.quickLinks}
              setQuickLinks={setQuickLinks}
              onResetWorkspace={handleResetWorkspace}
              onImportWorkspace={handleImportWorkspace}
              fullState={state}
              darkMode={darkMode}
              profileName={state.profileName}
              setProfileName={setProfileName}
              targetRole={state.targetRole}
              setTargetRole={setTargetRole}
              startDate={state.startDate}
              setStartDate={setStartDate}
              endDate={state.endDate}
              setEndDate={setEndDate}
            />
          )}
        </main>
      </div>
    </div>
  );
}
