"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FadeDown,
  ScaleUp,
  StaggerContainer,
  StaggerItem,
  HoverGlow,
  MorphBackground,
  PageTransition,
  MagneticButton,
  LoadingSpinner,
  transitions,
} from "@/components/animations";

/* ═══════════════════════════════════════════════════════════════
   SATURDAY DASHBOARD — PREMIUM ANIMATED
   ═══════════════════════════════════════════════════════════════ */

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchHealth(): Promise<{ status: string; message: string; timestamp: string } | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function fetchProjectsFromApi(): Promise<Project[]> {
  if (!API_URL) return SAMPLE_PROJECTS;
  try {
    const res = await fetch(`${API_URL}/api/projects`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return SAMPLE_PROJECTS;
    const data = await res.json();
    if (!data.projects?.length) return SAMPLE_PROJECTS;
    return data.projects.map((p: any, i: number) => ({
      id: p.id || String(i + 1), name: p.name || "Untitled", type: p.type || "Project",
      status: "healthy" as const, frontendUrl: p.frontendUrl || "#", backendUrl: p.backendUrl || "#",
      githubUrl: p.githubUrl || "#", lastDeploy: p.lastDeploy || "Unknown", testsPassed: 0, testsTotal: 0,
    }));
  } catch { return SAMPLE_PROJECTS; }
}

const SAMPLE_PROJECTS: Project[] = [{
  id: "1", name: "saturday", type: "Framework", status: "healthy",
  frontendUrl: "https://saturday-62d.pages.dev", backendUrl: "https://saturday.nurulhudaprince18.workers.dev",
  githubUrl: "https://github.com/nhprince/saturday", lastDeploy: "2 hours ago", testsPassed: 47, testsTotal: 47,
}];

/* ─── SCORE RING ───────────────────────────────────────────────── */

function ScoreRing({ score, total, size = 100 }: { score: number; total: number; size?: number }) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 90 ? "#34d399" : pct >= 70 ? "#fbbf24" : "#f87171";

  return (
    <motion.div
      className="score-ring"
      style={{ width: size, height: size }}
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ ...transitions.springBouncy, delay: 0.3 }}
    >
      <svg width={size} height={size} viewBox="0 0 140 140">
        <circle className="bg" cx="70" cy="70" r={radius} />
        <motion.circle
          className="progress" cx="70" cy="70" r={radius}
          stroke={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}4D)` }}
        />
      </svg>
      <motion.div
        className="score-value"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <span className="text-xl md:text-3xl font-black" style={{ color }}>{pct}%</span>
        <span className="text-[10px] md:text-xs text-[var(--text-muted)] mt-0.5 md:mt-1 font-medium">{score}/{total}</span>
      </motion.div>
    </motion.div>
  );
}

/* ─── PROJECT CARD ─────────────────────────────────────────────── */

function ProjectCard({ project, index, onRunTests }: { project: Project; index: number; onRunTests: (p: Project) => void }) {
  const statusColors: Record<string, string> = {
    healthy: "var(--accent-green)", warning: "var(--accent-yellow)", error: "var(--accent-red)", unknown: "var(--text-muted)",
  };

  return (
    <motion.div
      className="glass-card p-4 md:p-5"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ ...transitions.smooth, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: transitions.spring }}
    >
      <div className="flex items-start justify-between gap-3 mb-3 md:mb-4">
        <motion.div className="flex items-center gap-2 md:gap-3 min-w-0" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 + 0.2 }}>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[var(--gradient-main)] flex items-center justify-center text-white text-xs md:text-sm font-bold flex-shrink-0">
            {project.name[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm md:text-base truncate">{project.name}</h3>
            <p className="text-[10px] md:text-xs text-[var(--text-muted)]">{project.type} · {project.lastDeploy}</p>
          </div>
        </motion.div>
        <motion.div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 + 0.3 }}>
          <motion.span
            className="dot-pulse"
            style={{ background: statusColors[project.status] }}
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] md:text-xs font-medium capitalize" style={{ color: statusColors[project.status] }}>
            {project.status}
          </span>
        </motion.div>
      </div>

      <motion.div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 + 0.4 }}>
        {[
          { val: project.testsPassed, label: "Tests Passed", color: "var(--accent-green)" },
          { val: project.testsTotal, label: "Total Tests", color: "var(--accent-indigo)" },
          { val: `${Math.round((project.testsPassed / project.testsTotal) * 100)}%`, label: "Health", color: "var(--accent-purple)" },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="text-center p-2 md:p-3 rounded-lg bg-white/5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.5 + i * 0.1 }}
          >
            <div className="text-base md:text-lg font-bold" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[9px] md:text-[10px] text-[var(--text-muted)]">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="project-card-actions" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 + 0.7 }}>
        <MagneticButton onClick={() => onRunTests(project)} className="btn-primary text-[10px] md:text-xs flex-1 px-3 md:px-4 py-2 md:py-2.5">
          ▶ Run Tests
        </MagneticButton>
        <motion.a href={project.frontendUrl} target="_blank" rel="noreferrer" className="btn-primary text-[10px] md:text-xs px-2.5 md:px-3 py-2 md:py-2.5" aria-label="View frontend" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={transitions.spring}>
          🌐
        </motion.a>
        <motion.a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-primary text-[10px] md:text-xs px-2.5 md:px-3 py-2 md:py-2.5" aria-label="View GitHub" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={transitions.spring}>
          📦
        </motion.a>
      </motion.div>
    </motion.div>
  );
}

/* ─── TEST MODAL ───────────────────────────────────────────────── */

function TestModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const runTests = useCallback(async () => {
    setRunning(true);
    const initial: TestResult[] = [
      { name: "Backend Health", status: "pending", message: "Checking..." },
      { name: "API Response", status: "pending", message: "Checking..." },
      { name: "CORS Headers", status: "pending", message: "Checking..." },
      { name: "Root Endpoint", status: "pending", message: "Checking..." },
      { name: "KV Read/Write", status: "pending", message: "Checking..." },
    ];
    setTests(initial);
    const backendUrl = project.backendUrl || API_URL;

    for (let i = 0; i < initial.length; i++) {
      setTests(prev => prev.map((t, idx) => idx === i ? { ...t, status: "running" } : t));
      await new Promise(r => setTimeout(r, 300));
      let result: { status: "pass" | "warn" | "fail"; message: string; duration: number };
      const start = Date.now();
      try {
        if (i === 0) {
          const res = await fetch(`${backendUrl}/api/health`, { signal: AbortSignal.timeout(5000) });
          const data = await res.json().catch(() => null);
          result = res.ok && data?.status === "ok"
            ? { status: "pass", message: `Healthy — ${data.message}`, duration: Date.now() - start }
            : { status: "warn", message: `Unexpected: ${res.status}`, duration: Date.now() - start };
        } else if (i === 1) {
          const res = await fetch(`${backendUrl}/api/hello`, { signal: AbortSignal.timeout(5000) });
          const data = await res.json().catch(() => null);
          result = res.ok && data?.message
            ? { status: "pass", message: data.message, duration: Date.now() - start }
            : { status: "warn", message: "No JSON response", duration: Date.now() - start };
        } else if (i === 2) {
          const res = await fetch(`${backendUrl}/api/health`, { method: "OPTIONS", signal: AbortSignal.timeout(5000) });
          const corsHeader = res.headers.get("access-control-allow-origin");
          result = corsHeader
            ? { status: "pass", message: `CORS enabled: ${corsHeader}`, duration: Date.now() - start }
            : { status: "warn", message: "CORS headers missing", duration: Date.now() - start };
        } else if (i === 3) {
          const res = await fetch(`${backendUrl}/`, { signal: AbortSignal.timeout(5000) });
          const data = await res.json().catch(() => null);
          result = res.ok && data?.service
            ? { status: "pass", message: `Service: ${data.service} v${data.version}`, duration: Date.now() - start }
            : { status: "warn", message: "Root endpoint issue", duration: Date.now() - start };
        } else {
          const testKey = `test-${Date.now()}`;
          const writeRes = await fetch(`${backendUrl}/api/kv/${testKey}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ test: true, ts: Date.now() }), signal: AbortSignal.timeout(5000),
          });
          if (writeRes.ok) {
            const readRes = await fetch(`${backendUrl}/api/kv/${testKey}`, { signal: AbortSignal.timeout(5000) });
            const readData = await readRes.json().catch(() => null);
            result = readData?.value
              ? { status: "pass", message: "KV read/write working", duration: Date.now() - start }
              : { status: "warn", message: "KV write OK but read failed", duration: Date.now() - start };
          } else {
            result = { status: "warn", message: "KV write failed", duration: Date.now() - start };
          }
        }
      } catch (err: any) {
        result = { status: "fail", message: err.name === "TimeoutError" ? "Connection timed out" : err.message || "Failed", duration: Date.now() - start };
      }
      setTests(prev => prev.map((t, idx) => idx === i ? { ...t, ...result } : t));
    }
    setRunning(false);
  }, [project.backendUrl]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card p-4 md:p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={transitions.spring}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-base md:text-lg font-bold">Tests: {project.name}</h2>
          <MagneticButton onClick={onClose} className="text-[var(--text-muted)] hover:text-white text-lg md:text-xl p-1" aria-label="Close">✕</MagneticButton>
        </div>

        {tests.length === 0 ? (
          <motion.div className="text-center py-6 md:py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] mb-3 md:mb-4">Click to run diagnostics</p>
            <MagneticButton onClick={runTests} className="btn-primary text-xs md:text-sm" disabled={running}>
              {running ? <LoadingSpinner /> : "▶ Run Tests"}
            </MagneticButton>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {tests.map((test, i) => (
                <motion.div
                  key={i}
                  className={`test-card status-${test.status}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs md:text-sm">{test.name}</span>
                    <span className={`status-badge status-${test.status} text-[9px] md:text-[10px]`}>
                      {test.status === "pass" ? "✓" : test.status === "fail" ? "✕" : test.status === "warn" ? "⚠" : "●"}
                      {" "}{test.status}
                    </span>
                  </div>
                  <p className="text-[10px] md:text-xs text-[var(--text-secondary)] mt-1">{test.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            <MagneticButton onClick={runTests} className="btn-primary text-[10px] md:text-xs mt-2" disabled={running}>
              {running ? <LoadingSpinner /> : "↻ Re-run Tests"}
            </MagneticButton>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────────────────── */

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [testingProject, setTestingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"projects" | "tests">("projects");
  const [backendHealth, setBackendHealth] = useState<{ status: string; message: string; timestamp: string } | null>(null);

  useEffect(() => {
    fetchProjectsFromApi().then(setProjects);
    fetchHealth().then(setBackendHealth);
  }, []);

  const totalPassed = projects.reduce((s, p) => s + p.testsPassed, 0);
  const totalTests = projects.reduce((s, p) => s + p.testsTotal, 0);

  return (
    <PageTransition>
      <div className="min-h-screen relative">
        <MorphBackground />

        <div className="relative z-10">
          {/* Header */}
          <motion.header
            className="dashboard-header"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={transitions.smooth}
          >
            <div className="dashboard-container">
              <div className="dashboard-header-inner">
                <FadeDown className="flex items-center gap-2 md:gap-3 min-w-0">
                  <motion.div
                    className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-[var(--gradient-main)] flex items-center justify-center text-white text-xs md:text-sm font-bold shadow-lg shadow-indigo-500/20 flex-shrink-0"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={transitions.spring}
                  >
                    ✦
                  </motion.div>
                  <div className="min-w-0">
                    <h1 className="text-sm md:text-base lg:text-lg font-bold tracking-tight truncate">Project Dashboard</h1>
                    <p className="text-[10px] md:text-[11px] text-[var(--text-muted)]">
                      {projects.length} projects
                      {backendHealth ? (
                        <span className="ml-1.5 md:ml-2 inline-flex items-center gap-1">
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full bg-green-400"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="hidden sm:inline">Backend online</span>
                        </span>
                      ) : API_URL ? (
                        <span className="ml-1.5 md:ml-2 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                          <span className="hidden sm:inline">Backend unreachable</span>
                        </span>
                      ) : null}
                    </p>
                  </div>
                </FadeDown>

                <FadeDown delay={0.1} className="flex gap-1.5 md:gap-2 flex-shrink-0">
                  {(["projects", "tests"] as const).map(tab => (
                    <MagneticButton
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[10px] md:text-xs px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg transition-colors capitalize ${activeTab === tab ? "bg-[var(--accent-indigo)] text-white" : "bg-white/5 text-[var(--text-secondary)] hover:bg-white/10"}`}
                    >
                      {tab}
                    </MagneticButton>
                  ))}
                </FadeDown>
              </div>
            </div>
          </motion.header>

          {/* Main */}
          <main className="dashboard-container py-4 md:py-6 lg:py-8">
            <AnimatePresence mode="wait">
              {activeTab === "projects" ? (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={transitions.smooth}
                >
                  {/* Stats */}
                  <StaggerContainer className="stats-grid mb-4 md:mb-6" staggerChildren={0.1}>
                    {[
                      { val: projects.filter(p => p.status === "healthy").length, label: "Healthy", color: "var(--accent-green)" },
                      { val: projects.filter(p => p.status === "warning").length, label: "Warnings", color: "var(--accent-yellow)" },
                      { val: projects.filter(p => p.status === "error").length, label: "Errors", color: "var(--accent-red)" },
                    ].map((s, i) => (
                      <StaggerItem key={i} variant="scaleUp">
                        <HoverGlow className="glass-card p-3 md:p-4 text-center cursor-default">
                          <motion.div
                            className="text-xl md:text-2xl font-bold"
                            style={{ color: s.color }}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ ...transitions.springBouncy, delay: 0.3 + i * 0.1 }}
                          >
                            {s.val}
                          </motion.div>
                          <div className="text-[10px] md:text-xs text-[var(--text-muted)]">{s.label}</div>
                        </HoverGlow>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  {/* Projects */}
                  <div className="flex flex-col gap-3 md:gap-4">
                    {projects.map((project, i) => (
                      <ProjectCard key={project.id} project={project} index={i} onRunTests={setTestingProject} />
                    ))}
                  </div>

                  {/* Empty State */}
                  <motion.div
                    className="glass-card p-6 md:p-8 text-center mt-3 md:mt-4 border-dashed border-2 border-[var(--border-subtle)]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="text-3xl md:text-4xl mb-2 md:mb-3"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      🚀
                    </motion.div>
                    <h3 className="font-bold text-sm md:text-base mb-1">Create Your First Project</h3>
                    <p className="text-xs md:text-sm text-[var(--text-secondary)] mb-3 md:mb-4">
                      Tell Saturday: &quot;Build me a blog&quot; or &quot;Create a SaaS&quot;
                    </p>
                    <code className="code-block text-[10px] md:text-xs inline-block">
                      python3 scripts/new-project.py --type blog --name my-blog
                    </code>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="tests"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={transitions.smooth}
                  className="flex flex-col items-center pt-4 md:pt-8"
                >
                  <ScoreRing score={totalPassed} total={totalTests} />
                  <motion.p
                    className="text-xs md:text-sm text-[var(--text-secondary)] mt-3 md:mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {totalPassed} of {totalTests} tests passing across all projects
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer */}
          <motion.footer
            className="mt-6 md:mt-10 pt-4 md:pt-6 border-t border-[var(--border-subtle)] text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[10px] md:text-xs text-[var(--text-muted)]">
              Built by <span className="font-semibold text-[var(--text-secondary)]">Prince</span> · Powered by{" "}
              <span className="font-semibold text-[var(--text-secondary)]">Saturday</span> ·{" "}
              <span className="font-semibold text-[var(--accent-indigo)]">Saturday Framework</span>
            </p>
          </motion.footer>
        </div>

        <AnimatePresence>
          {testingProject && <TestModal project={testingProject} onClose={() => setTestingProject(null)} />}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
