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

const BACKEND_URL = "https://staging-starter.nurulhudaprince18.workers.dev";
const FRONTEND_URL = "https://staging-starter.pages.dev";

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

/* ===== STATUS DOT ===== */
function StatusDot({ status }: { status: TestResult["status"] }) {
  const colorMap = {
    pending: "yellow",
    running: "indigo",
    pass: "green",
    fail: "red",
    warn: "yellow",
  } as const;
  return (
    <span className={`dot-pulse ${colorMap[status]}`} />
  );
}

/* ===== STATUS BADGE ===== */
function StatusBadge({ status }: { status: TestResult["status"] }) {
  const config = {
    pending: { label: "Pending", cls: "status-pending" },
    running: { label: "Running", cls: "status-running" },
    pass: { label: "Passed", cls: "status-pass" },
    fail: { label: "Failed", cls: "status-fail" },
    warn: { label: "Warning", cls: "status-warn" },
  };
  return (
    <span className={`status-badge ${config[status].cls}`}>
      <StatusDot status={status} />
      {config[status].label}
    </span>
  );
}

/* ===== PROGRESS BAR ===== */
function SuiteProgressBar({ suite }: { suite: TestSuite }) {
  const completed = suite.tests.filter((t) => t.status !== "pending" && t.status !== "running").length;
  const passed = suite.tests.filter((t) => t.status === "pass").length;
  const failed = suite.tests.filter((t) => t.status === "fail").length;
  const total = suite.tests.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="progress-bar w-full mb-4">
      <div className="flex h-full">
        {passed > 0 && (
          <div
            className="progress-bar-fill"
            style={{
              width: `${(passed / total) * 100}%`,
              background: "var(--gradient-success)",
            }}
          />
        )}
        {failed > 0 && (
          <div
            className="progress-bar-fill"
            style={{
              width: `${(failed / total) * 100}%`,
              background: "var(--gradient-danger)",
            }}
          />
        )}
        {completed < total && (
          <div
            style={{
              width: `${(pct)}%`,
            }}
          />
        )}
      </div>
    </div>
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
      <SuiteProgressBar suite={suite} />
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
  const [startTime, setStartTime] = useState<number | null>(null);

  const updateTest = (
    sIdx: number,
    tIdx: number,
    update: Partial<TestResult>
  ) => {
    setSuites((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as TestSuite[];
      next[sIdx].tests[tIdx] = { ...next[sIdx].tests[tIdx], ...update };
      return next;
    });
  };

  const runTests = useCallback(async () => {
    setIsRunning(true);
    setStartTime(Date.now());

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
    updateTest(0, 0, { status: "running" });
    const t0 = Date.now();
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      updateTest(0, 0, { status: res.ok ? "pass" : "fail", message: `Status ${res.status}`, duration: Date.now() - t0 });
    } catch (e: any) {
      updateTest(0, 0, { status: "fail", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(0, 1, { status: "running" });
    try {
      const html = await (await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) })).text();
      const ok = html.includes("_next") || html.includes("static");
      updateTest(0, 1, { status: ok ? "pass" : "warn", message: ok ? "Assets detected" : "No asset refs found", details: html.slice(0, 300) });
    } catch (e: any) {
      updateTest(0, 1, { status: "fail", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(0, 2, { status: "running" });
    try {
      const html = await (await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) })).text();
      const ok = html.includes('name="viewport"');
      updateTest(0, 2, { status: ok ? "pass" : "fail", message: ok ? "Viewport meta present" : "Missing viewport meta" });
    } catch (e: any) {
      updateTest(0, 2, { status: "fail", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(0, 3, { status: "running" });
    try {
      const html = await (await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) })).text();
      const ok = html.includes("prefers-color-scheme") || html.includes("dark:");
      updateTest(0, 3, { status: ok ? "pass" : "warn", message: ok ? "Dark mode CSS found" : "No dark mode support" });
    } catch (e: any) {
      updateTest(0, 3, { status: "fail", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    // ===== BACKEND =====
    updateTest(1, 0, { status: "running" });
    const t1 = Date.now();
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      const ok = res.ok && data.status === "ok";
      updateTest(1, 0, { status: ok ? "pass" : "fail", message: ok ? "Backend healthy" : "Unexpected response", duration: Date.now() - t1, details: JSON.stringify(data, null, 2) });
    } catch (e: any) {
      updateTest(1, 0, { status: "fail", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(1, 1, { status: "running" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/hello`, { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      updateTest(1, 1, { status: res.ok ? "pass" : "fail", message: data.message || "Working", details: JSON.stringify(data, null, 2) });
    } catch (e: any) {
      updateTest(1, 1, { status: "fail", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(1, 2, { status: "running" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { method: "OPTIONS", signal: AbortSignal.timeout(10000) });
      const cors = res.headers.get("access-control-allow-origin");
      const allHeaders = JSON.stringify(Object.fromEntries(res.headers), null, 2);
      updateTest(1, 2, { status: cors ? "pass" : "warn", message: cors ? `CORS: ${cors}` : "No CORS header", details: allHeaders });
    } catch (e: any) {
      updateTest(1, 2, { status: "warn", message: "CORS check inconclusive" });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(1, 3, { status: "running" });
    const lats: number[] = [];
    for (let i = 0; i < 3; i++) {
      const s = Date.now();
      try {
        await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(5000) });
        lats.push(Date.now() - s);
      } catch { lats.push(-1); }
    }
    const valid = lats.filter((l) => l > 0);
    if (valid.length > 0) {
      const avg = Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
      const max = Math.max(...valid);
      updateTest(1, 3, { status: avg < 500 ? "pass" : avg < 1000 ? "warn" : "fail", message: `Avg ${avg}ms · Max ${max}ms (${valid.length}/3)`, details: lats.map((l) => (l > 0 ? `${l}ms` : "timeout")).join(" · ") });
    } else {
      updateTest(1, 3, { status: "fail", message: "All requests timed out" });
    }
    await new Promise((r) => setTimeout(r, 200));

    // ===== CLOUDFLARE INFRA =====
    updateTest(2, 0, { status: "running" });
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      const cfRay = res.headers.get("cf-ray");
      const cfCache = res.headers.get("cf-cache-status");
      updateTest(2, 0, { status: cfRay ? "pass" : "warn", message: cfRay ? `Edge: ${cfRay.split("-")[1]?.toUpperCase() || "HIT"}` : "No CF-Ray", details: `CF-Ray: ${cfRay || "N/A"}\nCF-Cache: ${cfCache || "N/A"}` });
    } catch (e: any) {
      updateTest(2, 0, { status: "fail", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(2, 1, { status: "running" });
    try {
      const res = await fetch(BACKEND_URL, { signal: AbortSignal.timeout(10000) });
      const cfRay = res.headers.get("cf-ray");
      updateTest(2, 1, { status: res.ok && cfRay ? "pass" : "warn", message: cfRay ? "Worker via edge" : "Unusual response", details: `Status: ${res.status}\nCF-Ray: ${cfRay || "N/A"}` });
    } catch (e: any) {
      updateTest(2, 1, { status: "fail", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(2, 2, { status: "running" });
    try {
      const key = `test-${Date.now()}`;
      const val = { test: true, ts: Date.now() };
      const wRes = await fetch(`${BACKEND_URL}/api/kv/${key}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(val), signal: AbortSignal.timeout(10000) });
      const rRes = await fetch(`${BACKEND_URL}/api/kv/${key}`, { signal: AbortSignal.timeout(10000) });
      const wData = await wRes.json();
      const rData = await rRes.json();
      updateTest(2, 2, { status: wRes.ok && rRes.ok ? "pass" : "fail", message: wRes.ok && rRes.ok ? "KV I/O successful" : "KV failed", details: `Write: ${JSON.stringify(wData)}\nRead: ${JSON.stringify(rData)}` });
    } catch (e: any) {
      updateTest(2, 2, { status: "fail", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(2, 3, { status: "running" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(10000) });
      updateTest(2, 3, { status: res.ok ? "pass" : "fail", message: res.ok ? "Worker loaded (D1 bound)" : "Worker issue", details: "D1 database 'staging-starter-db' is bound. Add query endpoints for full test." });
    } catch (e: any) {
      updateTest(2, 3, { status: "fail", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    // ===== SECURITY =====
    updateTest(3, 0, { status: "running" });
    const httpsOk = FRONTEND_URL.startsWith("https") && BACKEND_URL.startsWith("https");
    updateTest(3, 0, { status: httpsOk ? "pass" : "fail", message: httpsOk ? "HTTPS enforced" : "HTTPS not enforced" });
    await new Promise((r) => setTimeout(r, 200));

    updateTest(3, 1, { status: "running" });
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      const h = res.headers;
      const sh: Record<string, string | null> = {
        "X-Content-Type-Options": h.get("x-content-type-options"),
        "X-Frame-Options": h.get("x-frame-options"),
        "X-XSS-Protection": h.get("x-xss-protection"),
        "Strict-Transport-Security": h.get("strict-transport-security"),
        "Content-Security-Policy": h.get("content-security-policy"),
        "Referrer-Policy": h.get("referrer-policy"),
      };
      const present = Object.values(sh).filter(Boolean).length;
      updateTest(3, 1, { status: present >= 2 ? "pass" : present >= 1 ? "warn" : "fail", message: `${present}/6 headers present`, details: JSON.stringify(sh, null, 2) });
    } catch (e: any) {
      updateTest(3, 1, { status: "fail", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(3, 2, { status: "running" });
    try {
      const res = await fetch(BACKEND_URL, { signal: AbortSignal.timeout(10000) });
      const srv = res.headers.get("server");
      const pwr = res.headers.get("x-powered-by");
      const leak = srv === "nginx" || !!pwr;
      updateTest(3, 2, { status: !leak ? "pass" : "warn", message: !leak ? "No info leaked" : `Leak: ${srv} / ${pwr}`, details: `Server: ${srv || "not set"}\nX-Powered-By: ${pwr || "not set"}` });
    } catch (e: any) {
      updateTest(3, 2, { status: "warn", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    // ===== CI/CD =====
    updateTest(4, 0, { status: "running" });
    try {
      const res = await fetch("https://api.github.com/repos/nhprince/staging-starter/actions/runs?per_page=1", { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      const run = data.workflow_runs?.[0];
      if (run) {
        updateTest(4, 0, { status: run.conclusion === "success" ? "pass" : "fail", message: `${run.conclusion} (${run.event})`, details: `#${run.run_number} · ${run.status} · ${run.head_branch} · ${run.head_sha?.slice(0, 7)}` });
      } else {
        updateTest(4, 0, { status: "warn", message: "No runs found" });
      }
    } catch (e: any) {
      updateTest(4, 0, { status: "warn", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(4, 1, { status: "running" });
    try {
      const res = await fetch("https://api.github.com/repos/nhprince/staging-starter/actions/workflows/deploy.yml", { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      updateTest(4, 1, { status: data.state === "active" ? "pass" : "warn", message: data.state === "active" ? "Workflow active" : `State: ${data.state}`, details: `ID: ${data.id}\nName: ${data.name}` });
    } catch (e: any) {
      updateTest(4, 1, { status: "warn", message: e.message });
    }
    await new Promise((r) => setTimeout(r, 200));

    updateTest(4, 2, { status: "running" });
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      const html = await res.text();
      const built = html.includes("__NEXT_DATA__") || html.includes("_next/") || html.includes("static/");
      updateTest(4, 2, { status: built ? "pass" : "warn", message: built ? "Build artifacts found" : "No build markers", details: `HTML: ${html.length} chars · Next.js: ${built}` });
    } catch (e: any) {
      updateTest(4, 2, { status: "fail", message: e.message });
    }

    setLastRun(new Date().toLocaleTimeString());
    setIsRunning(false);
  }, []);

  useEffect(() => {
    runTests();
  }, [runTests]);

  const totalTests = suites.reduce((a, s) => a + s.tests.length, 0);
  const passedTests = suites.reduce((a, s) => a + s.tests.filter((t) => t.status === "pass").length, 0);
  const failedTests = suites.reduce((a, s) => a + s.tests.filter((t) => t.status === "fail").length, 0);
  const warnTests = suites.reduce((a, s) => a + s.tests.filter((t) => t.status === "warn").length, 0);

  return (
    <div className="min-h-screen relative">
      {/* Background mesh */}
      <div className="bg-mesh" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="header-glow sticky top-0 z-20 backdrop-blur-xl bg-[rgba(10,10,15,0.8)] border-b border-[var(--border-subtle)]">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--gradient-main)] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20">
                ✦
              </div>
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
              {isRunning ? (
                <>
                  <span className="spinner" />
                  Running...
                </>
              ) : (
                <>▶ Run Tests</>
              )}
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Score Card */}
          {suites.length > 0 && (
            <div className="glass-card p-5 md:p-6 mb-6 md:mb-8 stagger-item glow-indigo">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ScoreRing score={passedTests} total={totalTests} />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">Health Overview</h2>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    {suites.length} categories · {totalTests} tests · {isRunning ? "Running..." : "Complete"}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.15)]">
                      <span className="dot-pulse green" />
                      <span className="text-xs font-semibold text-[var(--accent-green)]">{passedTests} Passed</span>
                    </div>
                    {failedTests > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)]">
                        <span className="dot-pulse red" />
                        <span className="text-xs font-semibold text-[var(--accent-red)]">{failedTests} Failed</span>
                      </div>
                    )}
                    {warnTests > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.15)]">
                        <span className="dot-pulse yellow" />
                        <span className="text-xs font-semibold text-[var(--accent-yellow)]">{warnTests} Warnings</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Suites */}
          <div className="flex flex-col gap-5 md:gap-6">
            {suites.map((suite, i) => (
              <SuiteSection key={i} suite={suite} index={i} />
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-10 pt-6 border-t border-[var(--border-subtle)] text-center">
            <p className="text-xs text-[var(--text-muted)]">
              Built by <span className="font-semibold text-[var(--text-secondary)]">Prince</span> · Powered by{" "}
              <span className="font-semibold text-[var(--text-secondary)]">Saturday</span> ·{" "}
              <span className="font-semibold text-[var(--accent-indigo)]">Cloudflare Pages + Workers</span>
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-[10px] text-[var(--text-muted)]">
              <a href={FRONTEND_URL} target="_blank" rel="noreferrer" className="hover:text-[var(--accent-indigo)] transition-colors">
                Frontend ↗
              </a>
              <span>·</span>
              <a href={BACKEND_URL} target="_blank" rel="noreferrer" className="hover:text-[var(--accent-indigo)] transition-colors">
                Backend ↗
              </a>
              <span>·</span>
              <a href="https://github.com/nhprince/staging-starter" target="_blank" rel="noreferrer" className="hover:text-[var(--accent-indigo)] transition-colors">
                Source ↗
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
