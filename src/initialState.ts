import { TrackerState, Task, Skill, DSATopic, WebDevTopic, Resource, Project, InternshipOpportunity, QuickLink, WeeklyReview, DashboardWidget } from './types';

export const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: '1', type: 'todays_tasks', title: "Today's Tasks", visible: true, order: 0 },
  { id: '2', type: 'top_priority', title: 'Top Priority Tasks', visible: true, order: 1 },
  { id: '3', type: 'learning_hours', title: 'Hours & Stats Tracker', visible: true, order: 2 },
  { id: '4', type: 'skill_progress', title: 'Skills Roadmap', visible: true, order: 3 },
  { id: '5', type: 'weekly_review', title: 'Weekly Review Snippet', visible: true, order: 4 },
  { id: '6', type: 'quick_links', title: 'Quick Launch Links', visible: true, order: 5 },
];

export const DEFAULT_QUICK_LINKS: QuickLink[] = [
  { id: 'ql-1', label: 'LinkedIn', url: 'https://linkedin.com', isFavourite: true },
  { id: 'ql-2', label: 'GitHub', url: 'https://github.com', isFavourite: true },
  { id: 'ql-3', label: 'LeetCode', url: 'https://leetcode.com', isFavourite: true },
  { id: 'ql-4', label: 'Gmail', url: 'https://gmail.com', isFavourite: false },
  { id: 'ql-5', label: 'Google Calendar', url: 'https://calendar.google.com', isFavourite: false },
];

export const DEFAULT_SKILLS: Skill[] = [
  {
    id: 'sk-1',
    name: 'DSA',
    progress: 45,
    topics: [
      { id: 'skt-1-1', name: 'Time & Space Complexity', status: 'Completed', progress: 100 },
      { id: 'skt-1-2', name: 'Arrays & Hashing', status: 'Learning', progress: 80 },
      { id: 'skt-1-3', name: 'Trees & Graphs', status: 'Todo', progress: 10 },
      { id: 'skt-1-4', name: 'Dynamic Programming', status: 'Todo', progress: 0 }
    ],
    resources: 'LeetCode, Apna College Sheet, NeetCode',
    notes: 'Focus on mastering graph algorithms and standard DP pattern problems.',
    hoursSpent: 40,
    isFavourite: true
  },
  {
    id: 'sk-2',
    name: 'Web Development',
    progress: 60,
    topics: [
      { id: 'skt-2-1', name: 'HTML & CSS Layouts', status: 'Completed', progress: 100 },
      { id: 'skt-2-2', name: 'Modern JavaScript (ES6+)', status: 'Completed', progress: 100 },
      { id: 'skt-2-3', name: 'React Components & State', status: 'Learning', progress: 75 },
      { id: 'skt-2-4', name: 'Node.js & Express REST APIs', status: 'Todo', progress: 20 }
    ],
    resources: 'Apna College Web Dev Course, MDN Docs, Frontend Mentor',
    notes: 'Create full-stack applications to link backend logic and frontend clients.',
    hoursSpent: 75,
    isFavourite: true
  },
  {
    id: 'sk-3',
    name: 'Python',
    progress: 30,
    topics: [
      { id: 'skt-3-1', name: 'Basic Syntax & OOP', status: 'Completed', progress: 100 },
      { id: 'skt-3-2', name: 'File Handling & Regex', status: 'Todo', progress: 10 },
      { id: 'skt-3-3', name: 'FastAPI / Django', status: 'Todo', progress: 0 }
    ],
    resources: 'Python crash course, RealPython',
    notes: 'Excellent for utility scripting and backend development.',
    hoursSpent: 15,
    isFavourite: false
  },
  {
    id: 'sk-4',
    name: 'AI/Data Science',
    progress: 15,
    topics: [
      { id: 'skt-4-1', name: 'NumPy & Pandas', status: 'Learning', progress: 50 },
      { id: 'skt-4-2', name: 'Matplotlib & Seaborn', status: 'Todo', progress: 10 },
      { id: 'skt-4-3', name: 'Supervised Learning', status: 'Todo', progress: 0 }
    ],
    resources: 'Kaggle Courses, Andrew Ng ML Specialization',
    notes: 'Brush up on Linear Algebra and Probability beforehand.',
    hoursSpent: 12,
    isFavourite: false
  },
  {
    id: 'sk-5',
    name: 'CS Fundamentals',
    progress: 50,
    topics: [
      { id: 'skt-5-1', name: 'Operating Systems', status: 'Learning', progress: 40 },
      { id: 'skt-5-2', name: 'Database Management Systems', status: 'Completed', progress: 90 },
      { id: 'skt-5-3', name: 'Computer Networks', status: 'Todo', progress: 20 }
    ],
    resources: 'GateSmasher YouTube, Standard textbook notes',
    notes: 'Crucial for standard placement interviews.',
    hoursSpent: 25,
    isFavourite: false
  }
];

export const DEFAULT_DSA_TOPICS: DSATopic[] = [
  {
    id: 'dsa-1',
    name: 'Arrays',
    isFavourite: true,
    notes: 'Important for base techniques like sliding window and two pointers.',
    problems: [
      { id: 'dsap-1-1', name: 'Two Sum', link: 'https://leetcode.com/problems/two-sum/', status: 'Completed', notes: 'Solved using a HashMap for O(n) runtime.' },
      { id: 'dsap-1-2', name: 'Best Time to Buy and Sell Stock', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', status: 'Completed', notes: 'One pass keeping track of minimum price.' },
      { id: 'dsap-1-3', name: 'Product of Array Except Self', link: 'https://leetcode.com/problems/product-of-array-except-self/', status: 'Todo', notes: 'Need prefix and suffix products.' }
    ]
  },
  {
    id: 'dsa-2',
    name: 'Strings',
    isFavourite: false,
    notes: 'Key algorithms: KMP, Rabin-Karp, sliding window palindromes.',
    problems: [
      { id: 'dsap-2-1', name: 'Valid Anagram', link: 'https://leetcode.com/problems/valid-anagram/', status: 'Completed', notes: 'Count letter frequencies using an array.' },
      { id: 'dsap-2-2', name: 'Valid Palindrome', link: 'https://leetcode.com/problems/valid-palindrome/', status: 'Completed', notes: 'Two pointers, skipping non-alphanumeric characters.' }
    ]
  },
  {
    id: 'dsa-3',
    name: 'Recursion',
    isFavourite: false,
    notes: 'Base of Trees, Backtracking, and Dynamic Programming.',
    problems: [
      { id: 'dsap-3-1', name: 'Subsets', link: 'https://leetcode.com/problems/subsets/', status: 'Solving', notes: 'Backtracking approach. Visualizing the recursion tree helps.' }
    ]
  },
  {
    id: 'dsa-4',
    name: 'Linked List',
    isFavourite: false,
    notes: 'Be careful with null pointer checks and temp reference manipulation.',
    problems: [
      { id: 'dsap-4-1', name: 'Reverse Linked List', link: 'https://leetcode.com/problems/reverse-linked-list/', status: 'Completed', notes: 'Iterative approach with prev, curr, next pointers.' },
      { id: 'dsap-4-2', name: 'Linked List Cycle', link: 'https://leetcode.com/problems/linked-list-cycle/', status: 'Todo', notes: 'Use Floyds Tortoise and Hare algorithm.' }
    ]
  },
  {
    id: 'dsa-5',
    name: 'Trees',
    isFavourite: true,
    notes: 'Master DFS and BFS traversals (Pre, In, Post order).',
    problems: [
      { id: 'dsap-5-1', name: 'Invert Binary Tree', link: 'https://leetcode.com/problems/invert-binary-tree/', status: 'Completed', notes: 'Swap left and right recursively.' },
      { id: 'dsap-5-2', name: 'Maximum Depth of Binary Tree', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', status: 'Completed', notes: 'Recursion depth calculation.' }
    ]
  },
  {
    id: 'dsa-6',
    name: 'Graphs',
    isFavourite: false,
    notes: 'Review BFS, DFS, Dijkstra, Prim, Kruskal, and Disjoint Set Union.',
    problems: [
      { id: 'dsap-6-1', name: 'Number of Islands', link: 'https://leetcode.com/problems/number-of-islands/', status: 'Todo', notes: 'Standard flood-fill BFS/DFS.' }
    ]
  },
  {
    id: 'dsa-7',
    name: 'DP',
    isFavourite: true,
    notes: 'Start with 1D DP before moving to 2D DP matrices like grid traveler or knapsack.',
    problems: [
      { id: 'dsap-7-1', name: 'Climbing Stairs', link: 'https://leetcode.com/problems/climbing-stairs/', status: 'Completed', notes: 'Fibonacci sequence pattern with memoization.' },
      { id: 'dsap-7-2', name: 'Coin Change', link: 'https://leetcode.com/problems/coin-change/', status: 'Solving', notes: 'Bottom-up DP calculating minimum coins for each sub-amount.' }
    ]
  }
];

export const DEFAULT_WEB_DEV_TOPICS: WebDevTopic[] = [
  { id: 'wd-1', name: 'HTML', status: 'Completed', notes: 'Semantic markup, accessibility (a11y), forms, SEO basics', isFavourite: false },
  { id: 'wd-2', name: 'CSS', status: 'Completed', notes: 'Flexbox, Grid, Custom Properties, Responsive layouts, Tailwind CSS utilities', isFavourite: true },
  { id: 'wd-3', name: 'JavaScript', status: 'In Progress', notes: 'ES6+ features, Async/Await, Fetch API, Event Loop, Closures', isFavourite: true },
  { id: 'wd-4', name: 'React', status: 'In Progress', notes: 'Hooks (useState, useEffect, useMemo), Props, Context API, React-Router', isFavourite: true },
  { id: 'wd-5', name: 'Backend', status: 'Todo', notes: 'Express.js servers, RESTful design patterns, SQL/NoSQL databases, Authentication', isFavourite: false },
  { id: 'wd-6', name: 'Projects', status: 'Todo', notes: 'Build modular full-stack projects to highlight personal development roadmap', isFavourite: false }
];

export const DEFAULT_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    name: 'NeetCode Roadmap',
    link: 'https://neetcode.io/roadmap',
    category: 'DSA',
    description: 'An interactive, visual roadmap charting the dependencies of popular DSA topics.',
    status: 'In Progress',
    notes: 'Super useful reference when learning topics sequentially.',
    isFavourite: true
  },
  {
    id: 'res-2',
    name: 'MDN Web Docs',
    link: 'https://developer.mozilla.org',
    category: 'Web',
    description: 'The definitive documentation resource for CSS, HTML, and browser Javascript APIs.',
    status: 'In Progress',
    notes: 'Excellent deep dives on flexbox, promises, and grid APIs.',
    isFavourite: true
  },
  {
    id: 'res-3',
    name: 'Official Python Tutorial',
    link: 'https://docs.python.org/3/tutorial/',
    category: 'Python',
    description: 'Comprehensive introduction to Python language constructs and standard libraries.',
    status: 'To Read',
    notes: 'Good to read for advanced data types like generators and context managers.',
    isFavourite: false
  },
  {
    id: 'res-4',
    name: 'Kaggle Machine Learning Course',
    link: 'https://www.kaggle.com/learn',
    category: 'AI/Data',
    description: 'Fast-paced, hands-on tutorials for pandas, deep learning, and feature engineering.',
    status: 'To Read',
    notes: 'Includes interactive code cells that run in-browser.',
    isFavourite: false
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Developer Portfolio',
    description: 'A responsive personal portfolio built using React and Tailwind CSS highlighting my roadmap and achievements.',
    techStack: 'React, Tailwind CSS, Lucide Icons, Motion',
    githubLink: 'https://github.com/octocat/portfolio',
    demoLink: 'https://developer-portfolio-demo.vercel.app',
    status: 'Building',
    isFavourite: true
  },
  {
    id: 'proj-2',
    name: 'Task Flow CLI',
    description: 'A Node.js command-line productivity manager supporting tasks, custom schedules, and status tracking.',
    techStack: 'Node.js, Commander.js, Chalk',
    githubLink: 'https://github.com/octocat/task-flow-cli',
    demoLink: '',
    status: 'Completed',
    isFavourite: false
  }
];

export const DEFAULT_INTERNSHIPS: InternshipOpportunity[] = [
  {
    id: 'int-1',
    company: 'Google',
    role: 'Software Engineering Intern',
    link: 'https://careers.google.com',
    deadline: '2026-10-15',
    status: 'Saved',
    notes: 'Requires strong algorithms and system fundamentals. Perfect match for Developer Tracker.',
    isFavourite: true
  },
  {
    id: 'int-2',
    company: 'Microsoft',
    role: 'Explore Program Intern',
    link: 'https://careers.microsoft.com',
    deadline: '2026-09-01',
    status: 'Saved',
    notes: 'Rotational product development and software engineering tasks.',
    isFavourite: false
  }
];

export const DEFAULT_WEEKLY_REVIEWS: WeeklyReview[] = [
  {
    id: 'wr-1',
    date: '2026-07-12',
    achievements: "Launched the Big Tech Journey Tracker starting exactly on Day 1 (12 July 2026). Aligned foundation goals for DSA and Web Dev.",
    problemsFaced: 'Initial configuration of git token settings and repository sync structures.',
    lessonsLearned: 'Consistency over intensity on day 1 sets a stable, manageable baseline for the months ahead.',
    nextWeekGoals: "Complete 15 array problems (including Kadane's and Prefix Sum), finish Python data structures/file handling, and master CSS basics.",
    isFavourite: true
  }
];

export const DEFAULT_TASKS: Task[] = [
  // Day 1 Tasks (12 July 2026)
  {
    id: 'tsk-day1-dsa1',
    title: 'DSA: Understand Big O notation (Time Complexity)',
    description: 'Study Big O notation, worst/average/best case complexities, and analyze nested loop patterns.',
    category: 'DSA',
    priority: 'Important',
    deadline: '2026-07-12',
    timeEstimate: 1.5,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Morning (1.5 hr) - DSA foundation part 1.',
    isFavourite: true
  },
  {
    id: 'tsk-day1-dsa2',
    title: 'DSA: Learn Array operations & memory layout',
    description: 'Learn dynamic array resizing, lookups, search, insertions, and deletion times.',
    category: 'DSA',
    priority: 'Important',
    deadline: '2026-07-12',
    timeEstimate: 1,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Morning (1.5 hr) - DSA foundation part 2.',
    isFavourite: true
  },
  {
    id: 'tsk-day1-dsa3',
    title: 'DSA Problems: Two Sum, Find Max, Remove Duplicates',
    description: 'Solve "Two Sum", "Find Maximum Element", and "Remove Duplicates from Sorted Array" on LeetCode.',
    category: 'DSA',
    priority: 'Urgent',
    deadline: '2026-07-12',
    timeEstimate: 2,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Morning (1.5 hr) - Solve problems.',
    isFavourite: true
  },
  {
    id: 'tsk-day1-dsa4',
    title: 'DSA Output: Write array approach notes',
    description: 'Compose study note: "How I approach array problems" and save to Knowledge Vault.',
    category: 'DSA',
    priority: 'Normal',
    deadline: '2026-07-12',
    timeEstimate: 0.5,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Morning output goal.',
    isFavourite: false
  },
  {
    id: 'tsk-day1-py1',
    title: 'Python Foundation: Variables, Data types, Loops, Functions',
    description: 'Review Variables, Data types, Conditions, Loops, and Functions.',
    category: 'Python',
    priority: 'Important',
    deadline: '2026-07-12',
    timeEstimate: 2,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Afternoon (2 hr) - Revision.',
    isFavourite: true
  },
  {
    id: 'tsk-day1-py2',
    title: 'Python Practice: Build Calculator & Guessing Game',
    description: 'Write simple clean terminal-based Calculator and a Number guessing game.',
    category: 'Python',
    priority: 'Important',
    deadline: '2026-07-12',
    timeEstimate: 1.5,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Afternoon (2 hr) - Coding.',
    isFavourite: false
  },
  {
    id: 'tsk-day1-web1',
    title: 'Web Dev: Learn HTML Basics (structure, tags, heads)',
    description: 'Learn standard HTML structures, headings, paragraphs, links, images, lists, and metadata tags.',
    category: 'Web',
    priority: 'Normal',
    deadline: '2026-07-12',
    timeEstimate: 2,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Evening (2 hr) - HTML Day 1 study.',
    isFavourite: true
  },
  {
    id: 'tsk-day1-web2',
    title: 'Web Dev Task: Create "My First Portfolio Page"',
    description: 'Build a basic personal page using standard HTML semantic tags.',
    category: 'Web',
    priority: 'Normal',
    deadline: '2026-07-12',
    timeEstimate: 1.5,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Evening (2 hr) - Portfolio build.',
    isFavourite: false
  },
  {
    id: 'tsk-day1-iitm1',
    title: 'IITM BS: Watch lecture, plan weekly assignment deadlines',
    description: 'Check pending assignments, watch one lecture, write core notes, and map deadlines.',
    category: 'IITM BS',
    priority: 'Urgent',
    deadline: '2026-07-12',
    timeEstimate: 1.5,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Night (1 hr) - Academic tracking.',
    isFavourite: true
  },
  {
    id: 'tsk-day1-health1',
    title: 'Daily: Exercise & Outdoor Activity',
    description: 'Complete 30-45 minutes of physical activity or stretch and log reflection.',
    category: 'Health',
    priority: 'Normal',
    deadline: '2026-07-12',
    timeEstimate: 0.75,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Habit building.',
    isFavourite: false
  },

  // Week 1 Tasks (13 - 18 July 2026)
  {
    id: 'tsk-w1-dsa-kadane',
    title: "DSA: Solve Kadane's Algorithm (Max Subarray)",
    description: "Solve maximum subarray sum using O(n) Kadane's algorithm.",
    category: 'DSA',
    priority: 'Important',
    deadline: '2026-07-14',
    timeEstimate: 1.5,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Week 1 Arrays Goal.',
    isFavourite: false
  },
  {
    id: 'tsk-w1-dsa-prefix',
    title: 'DSA: Solve Prefix Sum & Sliding Window basics',
    description: 'Practice static prefix sum arrays and initial sliding window problems (goal: 15 total solved).',
    category: 'DSA',
    priority: 'Important',
    deadline: '2026-07-16',
    timeEstimate: 2,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Week 1 Arrays Goal.',
    isFavourite: true
  },
  {
    id: 'tsk-w1-py-advanced',
    title: 'Python: Lists, Dictionaries, and File handling',
    description: 'Learn list manipulation methods, key-value dictionary operations, and reading/writing files.',
    category: 'Python',
    priority: 'Normal',
    deadline: '2026-07-15',
    timeEstimate: 2.5,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Week 1 Python target.',
    isFavourite: false
  },
  {
    id: 'tsk-w1-web-css',
    title: 'Web Dev: Learn CSS basics & responsive grids',
    description: 'Study box model, selectors, flexbox layout, and basic media queries.',
    category: 'Web',
    priority: 'Important',
    deadline: '2026-07-17',
    timeEstimate: 3,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Week 1 Web Development target.',
    isFavourite: true
  },
  {
    id: 'tsk-w1-iitm-bs',
    title: 'IITM BS: Complete Week 1 Assignments (No pending work)',
    description: 'Submit all week 1 homework assignments on time to maintain a solid CGPA.',
    category: 'IITM BS',
    priority: 'Urgent',
    deadline: '2026-07-18',
    timeEstimate: 4,
    actualTimeSpent: 0,
    status: 'Todo',
    notes: 'Keep academic records spotless.',
    isFavourite: true
  }
];

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
    username: "octocat",
    repo: "developer-growth-tracker",
    commitsCount: 24,
    lastSynced: "2026-07-12",
    commits: [
      { hash: "8f7c2b5", message: "feat: Add Knowledge Vault & AI Coach features", date: "2026-07-12", author: "Developer", url: "https://github.com" },
      { hash: "d3e4f5a", message: "refactor: Optimize local state synchronization", date: "2026-07-11", author: "Developer", url: "https://github.com" },
      { hash: "1a2b3c4", message: "feat: Setup Apna College DSA progress view", date: "2026-07-09", author: "Developer", url: "https://github.com" },
      { hash: "9e8d7c6", message: "docs: Create comprehensive learning path overview", date: "2026-07-08", author: "Developer", url: "https://github.com" }
    ]
  },
  leetcodeIntegration: {
    username: "dev_coder",
    solvedCount: 154,
    easyCount: 82,
    mediumCount: 61,
    hardCount: 11,
    lastSynced: "2026-07-12"
  },
  customIntegrations: [
    {
      id: "cust-1",
      platformName: "HackerRank",
      username: "dev_hackerrank",
      profileUrl: "https://hackerrank.com/dev_hackerrank",
      solvedCount: 45,
      lastSynced: "2026-07-12",
      customMetricLabel: "Gold Badges",
      customMetricValue: "3 (Problem Solving, Python, SQL)"
    },
    {
      id: "cust-2",
      platformName: "Codeforces",
      username: "dev_codeforces",
      profileUrl: "https://codeforces.com/profile/dev_codeforces",
      rating: 1210,
      lastSynced: "2026-07-12",
      customMetricLabel: "Division Rank",
      customMetricValue: "Pupil (Max 1210)"
    }
  ],
  calendarEvents: [
    { id: "cal-1", title: "Complete Sliding Window on LeetCode", date: "2026-07-13", time: "14:00", type: "task", synced: true },
    { id: "cal-2", title: "Apna College Web Development - React hooks", date: "2026-07-14", time: "16:30", type: "study", synced: true },
    { id: "cal-3", title: "SWE Internship Application Deadline", date: "2026-07-18", time: "23:59", type: "exam", synced: false }
  ],
  interviews: [
    {
      id: "int-log-1",
      company: "Google",
      role: "Software Engineering Intern",
      date: "2026-07-08",
      round: "Technical Interview 1 (Screening)",
      status: "Completed",
      questions: ["Design a rate limiter for APIs", "Find the length of the longest subarray with at most K distinct elements"],
      mistakes: "Initially over-complicated the rate limiter with a sliding window database model rather than a simple token bucket. Flipped the index boundary on sliding window on first dry run.",
      improvements: "Practice drafting the algorithm outline before writing code. Review rate limiting token bucket algorithms.",
      notes: "Interviewer was very friendly. Follow-up came within 2 days to schedule Round 2!"
    }
  ],
  wikiNotes: [
    {
      id: "note-1",
      title: "Sliding Window Algorithm Pattern",
      content: "### Dynamic Window Template\n\n```typescript\nfunction slidingWindow(arr: number[], k: number) {\n  let left = 0;\n  let maxVal = 0;\n  let windowSum = 0;\n  for (let right = 0; right < arr.length; right++) {\n    windowSum += arr[right];\n    // Shrink window if conditions are met\n    while (right - left + 1 > k) {\n      windowSum -= arr[left];\n      left++;\n    }\n    maxVal = Math.max(maxVal, windowSum);\n  }\n  return maxVal;\n}\n```\n\n#### Key LeetCode Problems\n1. Minimum Window Substring (Hard)\n2. Longest Substring Without Repeating Characters (Medium)\n3. Sliding Window Maximum (Hard)",
      category: "DSA",
      lastModified: "2026-07-12",
      links: ["DSA"]
    },
    {
      id: "note-2",
      title: "React useEffect Best Practices",
      content: "### Avoiding infinite render loops in useEffect\n\n1. **Declare primitive dependencies**: Avoid specifying arrays or objects in dependency arrays directly since they fail reference comparisons.\n2. **Cleanup functions**: Always clean up subscriptions, interval timers, and fetch states.\n3. **Use useMemo / useCallback**: Memoize functions or arrays created within the component before passing them as hook dependencies.\n\n```typescript\nuseEffect(() => {\n  const timer = setTimeout(() => {\n    console.log('Fires safely!');\n  }, 1000);\n  return () => clearTimeout(timer);\n}, []);\n```",
      category: "Web",
      lastModified: "2026-07-11",
      links: ["Web Development"]
    }
  ]
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
