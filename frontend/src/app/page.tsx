"use client";

import { useState, useEffect, useCallback } from "react";

/* ===== TYPES ===== */
interface Project {
  id: string;
  name: string;
  type: string;
  status: "healthy" | "warning" | "error" | "unknown";
  frontendUrl: string;
  backendUrl: string;
  githubUrl: string;
  lastDeploy: string;
  testsPassed: number;
  testsTotal: number;
}

interface TestResult {
  name: string;
  status: "pending" | "running" | "pass" | "fail" | "warn";
  message: string;
  duration?: number;
}

/* ===== SAMPLE PROJECTS ===== */
const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    name: "staging-starter",
    type: "Framework",
    status: "healthy",
    frontendUrl: "https://staging-starter.pages.dev",
    backendUrl: "https://staging-starter.nurulhudaprince18.workers.dev",
    githubUrl: "https://github.com/nhprince/staging-starter",
    lastDeploy: "2 hours ago",
    testsPassed: 19,
    testsTotal: 19,
  },
];

/* ===== SVG SCORE RING ===== */
function ScoreRing({ score, total, size = 140 }: { score: number; total: number; size?: number }) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 90 ? "#34d399" : pct >= 70 ? "#fbbf24" : "#f87171";

  return (
    <div className="score-ring">
      <svg width={size} height={size} viewBox="0 0 140 140">
        <circle className="bg" cx="70" cy="70" r={radius} />
        <circle
          className="progress" cx="70" cy="70" r={radius}
          stroke={color} strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${color}4D)` }}
        />
      </svg>
      <div className="score-value">
        <span className="text-3xl font-black" style={{ color }}>{pct}%</span>
        <span className="text-xs text-[var(--text-muted)] mt-1 font-medium">{score}/{total}</span>
      </div>
    </div>
  );
}

/* ===== PROJECT CARD ===== */
function ProjectCard({ project, onRunTests }: { project: Project; onRunTests: (p: Project) => void }) {
  const statusColors: Record<string, string> = {
    healthy: "var(--accent-green)",
    warning: "var(--accent-yellow)",
    error: "var(--accent-red)",
    unknown: "var(--text-muted)",
  };

  return (
    <div className="glass-card p-5 md:p-6 stagger-item">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--gradient-main)] flex items-center justify-center text-white text-sm font-bold">
            {project.name[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-base">{project.name}</h3>
            <p className="text-xs text-[var(--text-muted)]">{project.type} · {project.lastDeploy}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="dot-pulse" style={{ background: statusColors[project.status] }} />
          <span className="text-xs font-medium capitalize" style={{ color: statusColors[project.status] }}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-lg font-bold text-[var(--accent-green)]">{project.testsPassed}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Tests Passed</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-lg font-bold text-[var(--accent-indigo)]">{project.testsTotal}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Total Tests</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-lg font-bold text-[var(--accent-purple)]">
            {Math.round((project.testsPassed / project.testsTotal) * 100)}%
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">Health</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onRunTests(project)} className="btn-primary text-xs flex-1">
          ▶ Run Tests
        </button>
        <a href={project.frontendUrl} target="_blank" rel="noreferrer" className="btn-primary text-xs px-3">
          🌐
        </a>
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-primary text-xs px-3">
          📦
        </a>
      </div>
    </div>
  );
}

/* ===== TEST RESULTS MODAL ===== */
function TestModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const runTests = useCallback(async () => {
    setRunning(true);
    const initial: TestResult[] = [
      { name: "Frontend Load", status: "pending", message: "Checking..." },
      { name: "Backend Health", status: "pending", message: "Checking..." },
      { name: "API Response", status: "pending", message: "Checking..." },
      { name: "CORS Headers", status: "pending", message: "Checking..." },
      { name: "Security Headers", status: "pending", message: "Checking..." },
    ];
    setTests(initial);

    // Simulate running tests
    for (let i = 0; i < initial.length; i++) {
      setTests(prev => prev.map((t, idx) => idx === i ? { ...t, status: "running" } : t));
      await new Promise(r => setTimeout(r, 500));
      const passed = Math.random() > 0.2;
      setTests(prev => prev.map((t, idx) => idx === i ? {
        ...t,
        status: passed ? "pass" : "warn",
        message: passed ? "OK" : "Warning",
        duration: Math.floor(Math.random() * 200) + 50,
      } : t));
    }
    setRunning(false);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Tests: {project.name}</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white text-xl">✕</button>
        </div>

        {tests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[var(--text-secondary)] mb-4">Click to run diagnostics</p>
            <button onClick={runTests} className="btn-primary" disabled={running}>
              {running ? <span className="spinner" /> : "▶ Run Tests"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {tests.map((test, i) => (
              <div key={i} className={`test-card status-${test.status}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{test.name}</span>
                  <span className={`status-badge status-${test.status}`}>
                    {test.status === "pass" ? "✓" : test.status === "fail" ? "✕" : test.status === "warn" ? "⚠" : "●"}
                    {" "}{test.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{test.message}</p>
              </div>
            ))}
            <button onClick={runTests} className="btn-primary text-xs mt-2" disabled={running}>
              {running ? <span className="spinner" /> : "↻ Re-run Tests"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== MAIN PAGE ===== */
export default function Home() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [testingProject, setTestingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"projects" | "tests">("projects");

  const totalPassed = projects.reduce((s, p) => s + p.testsPassed, 0);
  const totalTests = projects.reduce((s, p) => s + p.testsTotal, 0);

  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="relative z-10">
        {/* Header */}
        <header className="header-glow sticky top-0 z-20 backdrop-blur-xl bg-[rgba(10,10,15,0.8)] border-b border-[var(--border-subtle)]">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--gradient-main)] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20">✦</div>
              <div>
                <h1 className="text-base md:text-lg font-bold tracking-tight">Project Dashboard</h1>
                <p className="text-[11px] text-[var(--text-muted)]">{projects.length} projects · {totalPassed}/{totalTests} tests passing</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("projects")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${activeTab === "projects" ? "bg-[var(--accent-indigo)] text-white" : "bg-white/5 text-[var(--text-secondary)] hover:bg-white/10"}`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${activeTab === "tests" ? "bg-[var(--accent-indigo)] text-white" : "bg-white/5 text-[var(--text-secondary)] hover:bg-white/10"}`}
              >
                Health Check
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {activeTab === "projects" ? (
            <>
              {/* Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--accent-green)]">{projects.filter(p => p.status === "healthy").length}</div>
                  <div className="text-xs text-[var(--text-muted)]">Healthy</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--accent-yellow)]">{projects.filter(p => p.status === "warning").length}</div>
                  <div className="text-xs text-[var(--text-muted)]">Warnings</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--accent-red)]">{projects.filter(p => p.status === "error").length}</div>
                  <div className="text-xs text-[var(--text-muted)]">Errors</div>
                </div>
              </div>

              {/* Project List */}
              <div className="flex flex-col gap-4">
                {projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} onRunTests={setTestingProject} />
                ))}
              </div>

              {/* Empty state for new projects */}
              <div className="glass-card p-8 text-center mt-4 border-dashed border-2 border-[var(--border-subtle)]">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-bold mb-1">Create Your First Project</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Tell Saturday: &quot;Build me a blog&quot; or &quot;Create a SaaS&quot;
                </p>
                <code className="code-block text-xs inline-block">
                  python3 scripts/new-project.py --type blog --name my-blog
                </code>
              </div>
            </>
          ) : (
            /* Health Check Tab */
            <div className="flex flex-col items-center">
              <ScoreRing score={totalPassed} total={totalTests} />
              <p className="text-sm text-[var(--text-secondary)] mt-4">
                {totalPassed} of {totalTests} tests passing across all projects
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-[var(--border-subtle)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Built by <span className="font-semibold text-[var(--text-secondary)]">Prince</span> · Powered by{" "}
            <span className="font-semibold text-[var(--text-secondary)]">Saturday</span> ·{" "}
            <span className="font-semibold text-[var(--accent-indigo)]">Staging Starter Framework</span>
          </p>
        </footer>
      </div>

      {/* Test Modal */}
      {testingProject && (
        <TestModal project={testingProject} onClose={() => setTestingProject(null)} />
      )}
    </div>
  );
}
