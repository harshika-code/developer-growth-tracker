import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Get Gemini AI instance (optionally using a client-provided override key)
function getAi(customKey?: string): GoogleGenAI {
  const key = customKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is required. Please set it in Settings > Secrets or paste it directly in the App Settings.");
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 2. API: AI Career Coach - generate weekly progress advice
app.post("/api/ai-coach", async (req, res) => {
  try {
    const { state, customPrompt } = req.body;
    if (!state) {
      res.status(400).json({ error: "Missing tracking state data" });
      return;
    }

    const userApiKey = (req.headers["x-gemini-api-key"] as string) || "";
    const effectiveApiKey = userApiKey || process.env.GEMINI_API_KEY || "";
    const hasApiKey = !!effectiveApiKey;

    if (!hasApiKey) {
      // Dynamic fallback compilation
      const pendingTasks = state.tasks?.filter((t: any) => t.status !== "Completed" && t.status !== "done") || [];
      const pendingCount = pendingTasks.length;
      const topSkills = state.skills?.slice(0, 3).map((s: any) => `${s.name} (${s.progress}%)`).join(", ") || "General Study Plan";
      const projectCount = state.projects?.length || 0;
      const dsaSolved = state.leetcodeStats?.solvedCount || 0;

      const advice = `⚠️ **No Gemini API Key Detected**: To activate customized, real-time AI suggestions from Google Gemini models, please configure your \`GEMINI_API_KEY\` under the **Settings > Secrets** panel in AI Studio.

In the meantime, here is a highly tailored evaluation generated directly from your active progress tracking statistics:

### 📈 Weekly Progress Analysis
* You are currently pursuing **${state.skills?.length || 0} core competencies** with active study in: **${topSkills}**.
* You have logged **${projectCount} developer project${projectCount === 1 ? '' : 's'}** in your portfolio.
* Your current task board contains **${pendingCount} active study items** awaiting completion.
* You have solved **${dsaSolved} coding problems** on your integrated LeetCode progress panel.

### 🎯 Key Strength & Focus Area
* **Key Strength**: Exceptional structural discipline! Your modular logging of skills progression, project repositories, and structured Knowledge Vault note creation indicates highly systematic study habits.
* **Focus Area**: Algorithmic Velocity. Ensure you are pushing hard on DSA topics (such as Recursion or Dynamic Programming) to elevate your problem-solving frequency on LeetCode.

### 🛠️ Next Actions & Recommendation
1. **Clear Pending Backlog**: Focus on resolving the oldest pending tasks from your active task board.
2. **Commit Code Daily**: Push incremental updates for active repositories to maintain green contribution streaks.
3. **Consolidate Cheat Sheets**: Draft at least 1 comprehensive study note inside the Knowledge Vault summarizing recent problem patterns.

### 📚 Curated Guidance / Resource Suggestion
* Spend **30 minutes** checking optimization techniques (such as fast-and-slow pointers) in your Knowledge Vault.
* Review your active project tech stack to ensure your architectural modularity matches standard software engineering practices.`;

      res.json({ advice });
      return;
    }

    const ai = getAi(effectiveApiKey);
    
    // Construct progress context summary
    const tasksSummary = state.tasks?.map((t: any) => `- [${t.status}] ${t.title} (Priority: ${t.priority})`).join("\n") || "No tasks listed.";
    const skillsSummary = state.skills?.map((s: any) => `- ${s.name}: ${s.progress}% progress. Notes: ${s.notes}`).join("\n") || "No skills being tracked.";
    const projectsSummary = state.projects?.map((p: any) => `- ${p.name} (${p.status}): ${p.description}. Stack: ${p.techStack}`).join("\n") || "No active projects.";
    const weeklyReviewsSummary = state.weeklyReviews?.map((r: any) => `Week ${r.date}: Achievements: ${r.achievements}. Problems: ${r.problemsFaced}`).join("\n") || "No weekly reviews registered.";
    
    const githubStats = state.githubStats ? `GitHub: ${state.githubStats.repo || "No repo synced"}. Commits fetched: ${state.githubStats.commitsCount || 0}` : "GitHub integration not fully synced.";
    const leetcodeStats = state.leetcodeStats ? `LeetCode: Solved ${state.leetcodeStats.solvedCount || 0} problems (Easy: ${state.leetcodeStats.easyCount || 0}, Medium: ${state.leetcodeStats.mediumCount || 0}, Hard: ${state.leetcodeStats.hardCount || 0})` : "LeetCode not fully synced.";

    const systemInstruction = `You are a Personal AI Career Coach, an encouraging, professional, and strategic tech career advisor. 
Analyze the developer's progress and formulate highly actionable weekly advice. 
Keep your response professional, visually beautiful, structured in clean Markdown, and focused on tech industry relevance (Software Engineering, Web Development, DSA, etc.).
Structure the output into:
1. 📈 **Weekly Progress Analysis**: A brief, warm assessment of how they are tracking based on logged data.
2. 🎯 **Key Strength & Focus Area**: One clear technical skill/area they are doing well in, and one that requires attention.
3. 🛠️ **Next Actions & Recommendation**: Concrete, actionable goals for next week based on outstanding Todo tasks.
4. 📚 **Curated Guidance / Resource Suggestion**: Recommend what type of resource, problem, or project enhancement they should focus on next.`;

    let contents = `Here is my current progress tracker state:
    
--- RECENT TASKS ---
${tasksSummary}

--- SKILL PROGRESSION ---
${skillsSummary}

--- COMPLETED & ACTIVE PROJECTS ---
${projectsSummary}

--- WEEKLY HISTORICAL PERFORMANCE ---
${weeklyReviewsSummary}

--- INTEGRATED STATS ---
${githubStats}
${leetcodeStats}

Please analyze this and provide my weekly career advice. Make sure to tailor it directly to the metrics above and speak directly to the developer.`;

    if (customPrompt) {
      contents += `\n\nAdditionally, please address this specific topic/question in your advice: ${customPrompt}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error("AI Coach error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI advice" });
  }
});

// 3. API: AI Resume Optimizer - tailor resume bullet points based on a target role
app.post("/api/ai-resume", async (req, res) => {
  try {
    const { targetRole, projects, skills } = req.body;
    if (!targetRole) {
      res.status(400).json({ error: "Missing targetRole for the resume tailoring" });
      return;
    }

    const userApiKey = (req.headers["x-gemini-api-key"] as string) || "";
    const effectiveApiKey = userApiKey || process.env.GEMINI_API_KEY || "";
    const hasApiKey = !!effectiveApiKey;

    if (!hasApiKey) {
      // Dynamic resume compilation fallback
      const skillsText = skills?.map((s: any) => s.name) || ["React", "TypeScript", "Node.js", "Tailwind CSS"];
      const projectsList = projects?.slice(0, 3) || [];
      const tailoredProjects = projectsList.map((p: any) => {
        return {
          name: p.name,
          bullets: [
            `Engineered modular and reusable features for ${p.name} using ${p.techStack || 'React, Tailwind CSS'}, reducing render delay and enhancing user workflows.`,
            `Designed structured client-side schemas and local state persistency mechanics, ensuring 100% offline data integrity across sessions.`,
            `Implemented fluid page motion transitions and accessible typography elements resulting in an intuitive, fully responsive interface.`
          ]
        };
      });

      if (tailoredProjects.length === 0) {
        tailoredProjects.push({
          name: "Developer Growth Tracker App",
          bullets: [
            "Architected and deployed a responsive personal career dashboard tracker in React and Tailwind CSS for students.",
            "Created modular client-side view controllers and state engines managing DSA metrics, task trackers, and a custom Knowledge Vault.",
            "Formulated local storage backup protocols and state preservation to minimize external dependencies and lower initial load latencies."
          ]
        });
      }

      res.json({
        summary: `Highly committed computer science student and aspiring ${targetRole}. Proficient in leveraging modern React architectures, TypeScript structures, and Tailwind utility systems to construct clean, result-oriented front-end layouts. Backed by solid knowledge in Data Structures & Algorithms, responsive engineering, and reliable state workflows.`,
        tailoredProjects,
        suggestedSkills: [
          ...skillsText.slice(0, 5),
          "RESTful Integration",
          "Responsive Design",
          "Data Structures & Algorithms",
          "Git Version Control"
        ]
      });
      return;
    }

    const ai = getAi(effectiveApiKey);

    const skillsText = skills?.map((s: any) => s.name).join(", ") || "General Programming";
    const projectsText = projects?.map((p: any) => `Project: ${p.name}\nDescription: ${p.description}\nTech Stack: ${p.techStack}`).join("\n\n") || "No projects added.";

    const systemInstruction = `You are an expert resume builder and HR specialist for top tech companies (FAANG, high-growth startups). 
Your task is to take a developer's projects and skills and auto-generate professional, high-impact resume content tailored for a specific target role.
Format your output as structured JSON matching this schema exactly:
{
  "summary": "Professional summary paragraph tailored to the role (about 3 sentences, active voice, result-driven).",
  "tailoredProjects": [
    {
      "name": "Project Name",
      "bullets": [
        "Action-oriented bullet point 1 using the STAR method (Situation, Task, Action, Result) with metrics where possible.",
        "Action-oriented bullet point 2.",
        "Action-oriented bullet point 3."
      ]
    }
  ],
  "suggestedSkills": ["Skill Tag 1", "Skill Tag 2", "Skill Tag 3", "Skill Tag 4"]
}`;

    const prompt = `Target Role: ${targetRole}
    
Current Skills:
${skillsText}

Current Projects:
${projectsText}

Please generate the professional resume summary, optimized action-oriented bullets for each project (3 bullets per project), and additional key skills/keywords they should include to pass ATS checkers for this role.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const jsonText = response.text || "{}";
    res.json(JSON.parse(jsonText));
  } catch (error: any) {
    console.error("AI Resume optimizer error:", error);
    res.status(500).json({ error: error.message || "Failed to optimize resume with AI" });
  }
});

// Serve static assets / Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
