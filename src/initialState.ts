import { TrackerState, Task, Skill, DSATopic, WebDevTopic, Resource, Project, InternshipOpportunity, QuickLink, WeeklyReview, DashboardWidget } from './types';

export const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: '1', type: 'todays_tasks', title: "Today's Tasks", visible: true, order: 0 },
  { id: '2', type: 'top_priority', title: 'Top Priority Tasks', visible: true, order: 1 },
  { id: '3', type: 'learning_hours', title: 'Hours & Stats Tracker', visible: true, order: 2 },
  { id: '4', type: 'skill_progress', title: 'Skills Roadmap', visible: true, order: 3 },
  { id: '5', type: 'weekly_review', title: 'Weekly Review Snippet', visible: true, order: 4 },
  { id: '6', type: 'quick_links', title: 'Quick Launch Links', visible: true, order: 5 },
];

export const DEFAULT_QUICK_LINKS: QuickLink[] = [];

export const DEFAULT_SKILLS: Skill[] = [
  {
    id: 'sk-1',
    name: 'DSA',
    progress: 0,
    topics: [],
    resources: '',
    notes: '',
    hoursSpent: 0,
    isFavourite: false
  },
  {
    id: 'sk-2',
    name: 'Web Development',
    progress: 0,
    topics: [],
    resources: '',
    notes: '',
    hoursSpent: 0,
    isFavourite: false
  },
  {
    id: 'sk-3',
    name: 'Python',
    progress: 0,
    topics: [],
    resources: '',
    notes: '',
    hoursSpent: 0,
    isFavourite: false
  },
  {
    id: 'sk-4',
    name: 'AI/Data Science',
    progress: 0,
    topics: [],
    resources: '',
    notes: '',
    hoursSpent: 0,
    isFavourite: false
  },
  {
    id: 'sk-5',
    name: 'CS Fundamentals',
    progress: 0,
    topics: [],
    resources: '',
    notes: '',
    hoursSpent: 0,
    isFavourite: false
  }
];

export const DEFAULT_DSA_TOPICS: DSATopic[] = [
  {
    id: 'dsa-1',
    name: 'Arrays',
    isFavourite: false,
    notes: '',
    problems: []
  },
  {
    id: 'dsa-2',
    name: 'Strings',
    isFavourite: false,
    notes: '',
    problems: []
  },
  {
    id: 'dsa-3',
    name: 'Recursion',
    isFavourite: false,
    notes: '',
    problems: []
  },
  {
    id: 'dsa-4',
    name: 'Linked List',
    isFavourite: false,
    notes: '',
    problems: []
  },
  {
    id: 'dsa-5',
    name: 'Trees',
    isFavourite: false,
    notes: '',
    problems: []
  },
  {
    id: 'dsa-6',
    name: 'Graphs',
    isFavourite: false,
    notes: '',
    problems: []
  },
  {
    id: 'dsa-7',
    name: 'DP',
    isFavourite: false,
    notes: '',
    problems: []
  }
];

export const DEFAULT_WEB_DEV_TOPICS: WebDevTopic[] = [
  { id: 'wd-1', name: 'HTML', status: 'Todo', notes: '', isFavourite: false },
  { id: 'wd-2', name: 'CSS', status: 'Todo', notes: '', isFavourite: false },
  { id: 'wd-3', name: 'JavaScript', status: 'Todo', notes: '', isFavourite: false },
  { id: 'wd-4', name: 'React', status: 'Todo', notes: '', isFavourite: false },
  { id: 'wd-5', name: 'Backend', status: 'Todo', notes: '', isFavourite: false },
  { id: 'wd-6', name: 'Projects', status: 'Todo', notes: '', isFavourite: false }
];

export const DEFAULT_RESOURCES: Resource[] = [];

export const DEFAULT_PROJECTS: Project[] = [];

export const DEFAULT_INTERNSHIPS: InternshipOpportunity[] = [];

export const DEFAULT_WEEKLY_REVIEWS: WeeklyReview[] = [];

export const DEFAULT_TASKS: Task[] = [];

export const DEFAULT_STATE: TrackerState = {
  tasks: DEFAULT_TASKS,
  skills: DEFAULT_SKILLS,
  dsaTopics: DEFAULT_DSA_TOPICS,
  webDevTopics: DEFAULT_WEB_DEV_TOPICS,
  resources: DEFAULT_RESOURCES,
  projects: DEFAULT_PROJECTS,
  internships: DEFAULT_INTERNSHIPS,
  quickLinks: DEFAULT_QUICK_LINKS,
  weeklyReviews: DEFAULT_WEEKLY_REVIEWS,
  widgets: DEFAULT_WIDGETS,
  customResourceCategories: ['DSA', 'Web', 'Python', 'AI/Data', 'CS', 'General'],
  
  profileName: 'Developer',
  targetRole: 'Big Tech Software Engineer',
  startDate: '2026-07-12',
  endDate: '2027-06-30',
  
  githubIntegration: {
    username: "",
    repo: "",
    commitsCount: 0,
    lastSynced: "",
    commits: []
  },
  leetcodeIntegration: {
    username: "",
    solvedCount: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    lastSynced: ""
  },
  customIntegrations: [],
  calendarEvents: [],
  interviews: [],
  wikiNotes: []
};

const STORAGE_KEY = 'dev_growth_tracker_state';

export function loadTrackerState(): TrackerState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      // Ensure any new arrays or options are present
      return {
        ...DEFAULT_STATE,
        ...parsed,
        // Make sure fields are merged correctly and customized data is preserved
        tasks: parsed.tasks || DEFAULT_STATE.tasks,
        skills: parsed.skills || DEFAULT_STATE.skills,
        dsaTopics: parsed.dsaTopics || DEFAULT_STATE.dsaTopics,
        webDevTopics: parsed.webDevTopics || DEFAULT_STATE.webDevTopics,
        resources: parsed.resources || DEFAULT_STATE.resources,
        projects: parsed.projects || DEFAULT_STATE.projects,
        internships: parsed.internships || DEFAULT_STATE.internships,
        quickLinks: parsed.quickLinks || DEFAULT_STATE.quickLinks,
        weeklyReviews: parsed.weeklyReviews || DEFAULT_STATE.weeklyReviews,
        widgets: parsed.widgets || DEFAULT_WIDGETS,
        customResourceCategories: parsed.customResourceCategories || DEFAULT_STATE.customResourceCategories,
        // Sync new integrations fallback safely
        githubIntegration: parsed.githubIntegration || DEFAULT_STATE.githubIntegration,
        leetcodeIntegration: parsed.leetcodeIntegration || DEFAULT_STATE.leetcodeIntegration,
        customIntegrations: parsed.customIntegrations || DEFAULT_STATE.customIntegrations,
        calendarEvents: parsed.calendarEvents || DEFAULT_STATE.calendarEvents,
        interviews: parsed.interviews || DEFAULT_STATE.interviews,
        wikiNotes: parsed.wikiNotes || DEFAULT_STATE.wikiNotes,
        profileName: parsed.profileName !== undefined ? parsed.profileName : DEFAULT_STATE.profileName,
        targetRole: parsed.targetRole !== undefined ? parsed.targetRole : DEFAULT_STATE.targetRole,
        startDate: parsed.startDate !== undefined ? parsed.startDate : DEFAULT_STATE.startDate,
        endDate: parsed.endDate !== undefined ? parsed.endDate : DEFAULT_STATE.endDate,
      };
    }
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
  }
  return DEFAULT_STATE;
}

export function saveTrackerState(state: TrackerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state to localStorage:', e);
  }
}
