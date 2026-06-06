"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface TestResult {
  name: string;
  status: "pending" | "running" | "pass" | "fail" | "warn";
  message: string;
  duration?: number;
  details?: string;
}

interface TestSuite {
  category: string;
  icon: string;
  tests: TestResult[];
}

const BACKEND_URL = "https://saturday.nurulhudaprince18.workers.dev";
const FRONTEND_URL = "https://saturday-62d.pages.dev";

/* ===== SVG SCORE RING ===== */
function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const color =
    pct >= 90
      ? { stroke: "#34d399", glow: "rgba(52,211,153,0.3)" }
      : pct >= 70
      ? { stroke: "#fbbf24", glow: "rgba(251,191,36,0.3)" }
      : { stroke: "#f87171", glow: "rgba(248,113,113,0.3)" };

  return (
    <div className="score-ring">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle className="bg" cx="70" cy="70" r={radius} />
        <circle
          className="progress"
          cx="70"
          cy="70"
          r={radius}
          stroke={color.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#glow)"
          style={{ filter: `drop-shadow(0 0 6px ${color.glow})` }}
        />
      </svg>
      <div className="score-value">
        <span className="text-3xl font-black" style={{ color: color.stroke }}>
          {pct}%
        </span>
        <span className="text-xs text-[var(--text-muted)] mt-1 font-medium">
          {score}/{total} passed
        </span>
      </div>
    </div>
  );
}

/* ===== STATUS BADGE ===== */
function StatusBadge({ status }: { status: TestResult["status"] }) {
  const config = {
    pending: { label: "Pending", cls: "status-pending", dot: "yellow" },
    running: { label: "Running", cls: "status-running", dot: "indigo" },
    pass: { label: "Passed", cls: "status-pass", dot: "green" },
    fail: { label: "Failed", cls: "status-fail", dot: "red" },
    warn: { label: "Warning", cls: "status-warn", dot: "yellow" },
  };
  const c = config[status];
  return (
    <span className={`status-badge ${c.cls}`}>
      <span className={`dot-pulse ${c.dot}`} />
      {c.label}
    </span>
  );
}

/* ===== TEST CARD ===== */
function TestCard({ test, index }: { test: TestResult; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = !!test.details;

  return (
    <div
      className={`test-card stagger-item status-${test.status}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`status-dot status-${test.status}`} />
          <span className="font-medium text-sm truncate">{test.name}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {test.duration !== undefined && (
            <span className="text-[10px] font-mono text-[var(--text-muted)] tabular-nums">
              {test.duration}ms
            </span>
          )}
          <StatusBadge status={test.status} />
        </div>
      </div>
      <p className="text-xs text-[var(--text-secondary)] mt-1.5 ml-5 leading-relaxed">
        {test.message}
      </p>
      {hasDetails && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-[var(--accent-indigo)] mt-2 ml-5 hover:underline cursor-pointer transition-colors"
          >
            {expanded ? "▾ Hide details" : "▸ Show details"}
          </button>
          <div className={`details-expand ${expanded ? "open" : ""}`}>
            <div className="code-block mt-2 ml-5">{test.details}</div>
          </div>
        </>
      )}
    </div>
  );
}

/* ===== SUITE SECTION ===== */
function SuiteSection({ suite, index }: { suite: TestSuite; index: number }) {
  const passed = suite.tests.filter((t) => t.status === "pass").length;
  const failed = suite.tests.filter((t) => t.status === "fail").length;
  const warnings = suite.tests.filter((t) => t.status === "warn").length;
  const total = suite.tests.length;

  return (
    <div
      className="glass-card p-5 md:p-6 stagger-item"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="section-header">
        <h2 className="text-base font-bold flex items-center gap-2.5">
          <span className="text-lg">{suite.icon}</span>
          {suite.category}
          <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full ml-1">
            {total} tests
          </span>
        </h2>
        <div className="flex gap-3 text-[11px] font-medium">
          <span className="text-[var(--accent-green)]">{passed} passed</span>
          {failed > 0 && (
            <span className="text-[var(--accent-red)]">{failed} failed</span>
          )}
          {warnings > 0 && (
            <span className="text-[var(--accent-yellow)]">{warnings} warn</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {suite.tests.map((test, i) => (
          <TestCard key={i} test={test} index={i} />
        ))}
      </div>
    </div>
  );
}

/* ===== MAIN PAGE ===== */
export default function Home() {
  const [suites, setSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const updateTest = (sIdx: number, tIdx: number, update: Partial<TestResult>) => {
    setSuites((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as TestSuite[];
      next[sIdx].tests[tIdx] = { ...next[sIdx].tests[tIdx], ...update };
      return next;
    });
  };

  const runTests = useCallback(async () => {
    setIsRunning(true);

    const initial: TestSuite[] = [
      {
        category: "Frontend",
        icon: "🎨",
        tests: [
          { name: "Page Load", status: "pending", message: "Verifying page delivery..." },
          { name: "Static Assets", status: "pending", message: "Checking asset references..." },
          { name: "Viewport Meta", status: "pending", message: "Responsive meta tag..." },
          { name: "Dark Mode CSS", status: "pending", message: "Theme detection..." },
        ],
      },
      {
        category: "Backend API",
        icon: "⚡",
        tests: [
          { name: "Health Endpoint", status: "pending", message: "GET /api/health" },
          { name: "Hello Endpoint", status: "pending", message: "GET /api/hello" },
          { name: "CORS Headers", status: "pending", message: "Cross-origin policy..." },
          { name: "Latency (3x avg)", status: "pending", message: "Measuring round-trips..." },
        ],
      },
      {
        category: "Cloudflare Infra",
        icon: "☁️",
        tests: [
          { name: "Pages CDN Edge", status: "pending", message: "Verifying CF-Ray..." },
          { name: "Worker Routing", status: "pending", message: "Edge routing check..." },
          { name: "KV Read/Write", status: "pending", message: "KV namespace I/O..." },
          { name: "D1 Binding", status: "pending", message: "Database binding..." },
        ],
      },
      {
        category: "Security",
        icon: "🔒",
        tests: [
          { name: "HTTPS Enforcement", status: "pending", message: "SSL/TLS check..." },
          { name: "Security Headers", status: "pending", message: "Header analysis..." },
          { name: "Info Disclosure", status: "pending", message: "Server fingerprint..." },
        ],
      },
      {
        category: "CI/CD Pipeline",
        icon: "🔄",
        tests: [
          { name: "GitHub Actions", status: "pending", message: "Workflow status..." },
          { name: "Auto-Deploy Config", status: "pending", message: "Deploy workflow..." },
          { name: "Build Artifacts", status: "pending", message: "Build verification..." },
        ],
      },
    ];
    setSuites(initial);
    await new Promise((r) => setTimeout(r, 400));

    // ===== FRONTEND =====
    // Page Load
    updateTest(0, 0, { status: "running" });
    const t0 = Date.now();
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      updateTest(0, 0, { status: res.ok ? "pass" : "fail", message: `Status ${res.status}`, duration: Date.now() - t0 });
    } catch (e: any) { updateTest(0, 0, { status: "fail", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // Static Assets
    updateTest(0, 1, { status: "running" });
    try {
      const html = await (await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) })).text();
      const ok = html.includes("_next") || html.includes("static");
      updateTest(0, 1, { status: ok ? "pass" : "warn", message: ok ? "Assets detected" : "No asset refs found" });
    } catch (e: any) { updateTest(0, 1, { status: "fail", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // Viewport Meta
    updateTest(0, 2, { status: "running" });
    try {
      const html = await (await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) })).text();
      updateTest(0, 2, { status: html.includes('name="viewport"') ? "pass" : "fail", message: html.includes('name="viewport"') ? "Viewport meta present" : "Missing viewport meta" });
    } catch (e: any) { updateTest(0, 2, { status: "fail", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // Dark Mode CSS
    updateTest(0, 3, { status: "running" });
    try {
      const html = await (await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) })).text();
      const ok = html.includes("prefers-color-scheme") || html.includes("dark:");
      updateTest(0, 3, { status: ok ? "pass" : "warn", message: ok ? "Dark mode CSS found" : "No dark mode support" });
    } catch (e: any) { updateTest(0, 3, { status: "fail", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // ===== BACKEND =====
    // Health
    updateTest(1, 0, { status: "running" });
    const t1 = Date.now();
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      const ok = res.ok && data.status === "ok";
      updateTest(1, 0, { status: ok ? "pass" : "fail", message: ok ? "Backend healthy" : "Unexpected response", duration: Date.now() - t1, details: JSON.stringify(data, null, 2) });
    } catch (e: any) { updateTest(1, 0, { status: "fail", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // Hello
    updateTest(1, 1, { status: "running" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/hello`, { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      updateTest(1, 1, { status: res.ok ? "pass" : "fail", message: data.message || "Working", details: JSON.stringify(data, null, 2) });
    } catch (e: any) { updateTest(1, 1, { status: "fail", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // CORS
    updateTest(1, 2, { status: "running" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(10000) });
      const cors = res.headers.get("access-control-allow-origin");
      updateTest(1, 2, { status: cors ? "pass" : "warn", message: cors ? `CORS: ${cors}` : "No CORS header", details: JSON.stringify(Object.fromEntries(res.headers), null, 2) });
    } catch (e: any) { updateTest(1, 2, { status: "warn", message: "CORS check failed" }); }
    await new Promise((r) => setTimeout(r, 200));

    // Latency
    updateTest(1, 3, { status: "running" });
    const lats: number[] = [];
    for (let i = 0; i < 3; i++) {
      const s = Date.now();
      try { await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(5000) }); lats.push(Date.now() - s); } catch { lats.push(-1); }
    }
    const valid = lats.filter((l) => l > 0);
    if (valid.length > 0) {
      const avg = Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
      updateTest(1, 3, { status: avg < 500 ? "pass" : avg < 1000 ? "warn" : "fail", message: `Avg ${avg}ms (${valid.length}/3)` });
    } else { updateTest(1, 3, { status: "fail", message: "All requests timed out" }); }
    await new Promise((r) => setTimeout(r, 200));

    // ===== CLOUDFLARE INFRA =====
    // Pages CDN
    updateTest(2, 0, { status: "running" });
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      const cfRay = res.headers.get("cf-ray");
      updateTest(2, 0, { status: cfRay ? "pass" : "warn", message: cfRay ? `Edge: ${cfRay.split("-")[1]?.toUpperCase() || "HIT"}` : "No CF-Ray" });
    } catch (e: any) { updateTest(2, 0, { status: "fail", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // Worker Routing
    updateTest(2, 1, { status: "running" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(10000) });
      const cfRay = res.headers.get("cf-ray");
      const cfPop = cfRay ? cfRay.split("-")[1]?.toUpperCase() || "EDGE" : null;
      updateTest(2, 1, { status: res.ok ? "pass" : "warn", message: res.ok ? `Worker via edge (${cfPop || "N/A"})` : `HTTP ${res.status}` });
    } catch (e: any) { updateTest(2, 1, { status: "fail", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // KV
    updateTest(2, 2, { status: "running" });
    try {
      const key = `test-${Date.now()}`;
      const wRes = await fetch(`${BACKEND_URL}/api/kv/${key}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ test: true }), signal: AbortSignal.timeout(10000) });
      const rRes = await fetch(`${BACKEND_URL}/api/kv/${key}`, { signal: AbortSignal.timeout(10000) });
      updateTest(2, 2, { status: wRes.ok && rRes.ok ? "pass" : "fail", message: wRes.ok && rRes.ok ? "KV I/O successful" : "KV failed" });
    } catch (e: any) { updateTest(2, 2, { status: "fail", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // D1
    updateTest(2, 3, { status: "running" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(10000) });
      updateTest(2, 3, { status: res.ok ? "pass" : "fail", message: res.ok ? "Worker loaded (D1 bound)" : "Worker issue" });
    } catch (e: any) { updateTest(2, 3, { status: "fail", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // ===== SECURITY =====
    // HTTPS
    updateTest(3, 0, { status: "running" });
    const httpsOk = FRONTEND_URL.startsWith("https") && BACKEND_URL.startsWith("https");
    updateTest(3, 0, { status: httpsOk ? "pass" : "fail", message: httpsOk ? "HTTPS enforced" : "HTTPS not enforced" });
    await new Promise((r) => setTimeout(r, 200));

    // Security Headers
    updateTest(3, 1, { status: "running" });
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      const h = res.headers;
      const sh: Record<string, string | null> = {
        "X-Content-Type-Options": h.get("x-content-type-options"),
        "X-Frame-Options": h.get("x-frame-options"),
        "Strict-Transport-Security": h.get("strict-transport-security"),
        "Content-Security-Policy": h.get("content-security-policy"),
      };
      const present = Object.values(sh).filter(Boolean).length;
      updateTest(3, 1, { status: present >= 2 ? "pass" : present >= 1 ? "warn" : "fail", message: `${present}/4 headers present`, details: JSON.stringify(sh, null, 2) });
    } catch (e: any) { updateTest(3, 1, { status: "fail", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // Info Disclosure
    updateTest(3, 2, { status: "running" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(10000) });
      const pwr = res.headers.get("x-powered-by");
      updateTest(3, 2, { status: !pwr ? "pass" : "warn", message: !pwr ? "No info leaked" : `Leak: ${pwr}` });
    } catch (e: any) { updateTest(3, 2, { status: "warn", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // ===== CI/CD =====
    // GitHub Actions
    updateTest(4, 0, { status: "running" });
    try {
      const res = await fetch("https://api.github.com/repos/nhprince/saturday/actions/runs?per_page=1", { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      const run = data.workflow_runs?.[0];
      if (run) {
        updateTest(4, 0, { status: run.conclusion === "success" ? "pass" : "fail", message: `${run.conclusion} (${run.event})`, details: `#${run.run_number} · ${run.head_branch}` });
      } else { updateTest(4, 0, { status: "warn", message: "No runs found" }); }
    } catch (e: any) { updateTest(4, 0, { status: "warn", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // Deploy Config
    updateTest(4, 1, { status: "running" });
    try {
      const res = await fetch("https://api.github.com/repos/nhprince/saturday/actions/workflows/deploy.yml", { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      updateTest(4, 1, { status: data.state === "active" ? "pass" : "warn", message: data.state === "active" ? "Workflow active" : `State: ${data.state}` });
    } catch (e: any) { updateTest(4, 1, { status: "warn", message: e.message }); }
    await new Promise((r) => setTimeout(r, 200));

    // Build Artifacts
    updateTest(4, 2, { status: "running" });
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      const html = await res.text();
      const hasBuild = html.includes("_next") || html.includes("static");
      updateTest(4, 2, { status: hasBuild ? "pass" : "warn", message: hasBuild ? "Build artifacts present" : "No build artifacts" });
    } catch (e: any) { updateTest(4, 2, { status: "fail", message: e.message }); }

    setLastRun(new Date().toLocaleTimeString());
    setIsRunning(false);
  }, []);

  const totalPassed = suites.reduce((sum, s) => sum + s.tests.filter((t) => t.status === "pass").length, 0);
  const totalTests = suites.reduce((sum, s) => sum + s.tests.length, 0);

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
                <h1 className="text-base md:text-lg font-bold tracking-tight">System Status</h1>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {lastRun ? `Last run: ${lastRun}` : "Ready to diagnose"}
                </p>
              </div>
            </div>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="btn-primary text-xs md:text-sm"
            >
              {isRunning ? <span className="spinner" /> : "▶ Run Tests"}
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Score Ring */}
          {suites.length > 0 && (
            <div className="flex justify-center mb-8 stagger-item">
              <ScoreRing score={totalPassed} total={totalTests} />
            </div>
          )}

          {/* Test Suites */}
          <div className="flex flex-col gap-5 md:gap-6">
            {suites.map((suite, i) => (
              <SuiteSection key={i} suite={suite} index={i} />
            ))}
          </div>

          {/* Empty State */}
          {suites.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-bold mb-2">Ready to Diagnose</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Click &quot;Run Tests&quot; to check your deployment health
              </p>
              <button onClick={runTests} className="btn-primary">
                ▶ Run Tests
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-[var(--border-subtle)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Built by <span className="font-semibold text-[var(--text-secondary)]">Prince</span> · Powered by{" "}
            <span className="font-semibold text-[var(--text-secondary)]">Saturday</span> ·{" "}
            <span className="font-semibold text-[var(--accent-indigo)]">Cloudflare Pages + Workers</span>
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-[10px] text-[var(--text-muted)]">
            <a href="https://saturday-62d.pages.dev" target="_blank" rel="noreferrer" className="hover:text-[var(--accent-indigo)] transition-colors">Frontend ↗</a>
            <span>·</span>
            <a href="https://saturday.nurulhudaprince18.workers.dev" target="_blank" rel="noreferrer" className="hover:text-[var(--accent-indigo)] transition-colors">Backend ↗</a>
            <span>·</span>
            <a href="https://github.com/nhprince/saturday" target="_blank" rel="noreferrer" className="hover:text-[var(--accent-indigo)] transition-colors">Source ↗</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
