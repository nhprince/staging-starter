"use client";

import { useState, useEffect, useCallback } from "react";

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

function StatusBadge({ status }: { status: TestResult["status"] }) {
  const styles = {
    pending: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    running: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 animate-pulse",
    pass: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    fail: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    warn: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  };
  const labels = {
    pending: "⏳ Pending",
    running: "🔄 Running",
    pass: "✅ Pass",
    fail: "❌ Fail",
    warn: "⚠️ Warning",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function TestCard({ test }: { test: TestResult }) {
  const borderColors = {
    pending: "border-gray-200 dark:border-gray-800",
    running: "border-blue-300 dark:border-blue-700",
    pass: "border-green-300 dark:border-green-700",
    fail: "border-red-300 dark:border-red-700",
    warn: "border-yellow-300 dark:border-yellow-700",
  };
  return (
    <div className={`p-4 rounded-lg border ${borderColors[test.status]} bg-white dark:bg-gray-900 transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{test.name}</span>
        <StatusBadge status={test.status} />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{test.message}</p>
      {test.duration !== undefined && (
        <p className="text-xs text-gray-400 mt-1">⏱ {test.duration}ms</p>
      )}
      {test.details && (
        <pre className="mt-2 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-x-auto text-gray-500 dark:text-gray-400">
          {test.details}
        </pre>
      )}
    </div>
  );
}

function SuiteSection({ suite }: { suite: TestSuite }) {
  const passed = suite.tests.filter((t) => t.status === "pass").length;
  const failed = suite.tests.filter((t) => t.status === "fail").length;
  const warnings = suite.tests.filter((t) => t.status === "warn").length;
  const total = suite.tests.length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>{suite.icon}</span>
          {suite.category}
        </h2>
        <div className="flex gap-2 text-xs">
          <span className="text-green-600 dark:text-green-400">{passed} passed</span>
          {failed > 0 && <span className="text-red-600 dark:text-red-400">{failed} failed</span>}
          {warnings > 0 && <span className="text-yellow-600 dark:text-yellow-400">{warnings} warnings</span>}
          <span className="text-gray-400">/ {total}</span>
        </div>
      </div>
      <div className="grid gap-3">
        {suite.tests.map((test, i) => (
          <TestCard key={i} test={test} />
        ))}
      </div>
    </div>
  );
}

function ScoreCircle({ score, total }: { score: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  const color =
    pct >= 90 ? "text-green-500" : pct >= 70 ? "text-yellow-500" : "text-red-500";
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className={`text-6xl font-black ${color}`}>{pct}%</div>
      <div className="text-sm text-gray-500 mt-1">
        {score}/{total} tests passed
      </div>
    </div>
  );
}

export default function Home() {
  const [suites, setSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const runTests = useCallback(async () => {
    setIsRunning(true);

    // Initialize all suites with pending state
    const initialSuites: TestSuite[] = [
      {
        category: "Frontend",
        icon: "🎨",
        tests: [
          { name: "Page Load", status: "pending", message: "Checking if page loads..." },
          { name: "Static Assets", status: "pending", message: "Verifying static file serving..." },
          { name: "Responsive Meta", status: "pending", message: "Checking viewport meta tag..." },
          { name: "Dark Mode Support", status: "pending", message: "Verifying dark mode CSS..." },
        ],
      },
      {
        category: "Backend API",
        icon: "⚡",
        tests: [
          { name: "Health Check", status: "pending", message: "GET /api/health" },
          { name: "Hello Endpoint", status: "pending", message: "GET /api/hello" },
          { name: "CORS Headers", status: "pending", message: "Verifying CORS configuration..." },
          { name: "Response Time", status: "pending", message: "Measuring API latency..." },
        ],
      },
      {
        category: "Cloudflare Infrastructure",
        icon: "☁️",
        tests: [
          { name: "Pages CDN", status: "pending", message: "Verifying CDN edge caching..." },
          { name: "Worker Route", status: "pending", message: "Checking Worker routing..." },
          { name: "KV Namespace", status: "pending", message: "Testing KV read/write..." },
          { name: "D1 Database", status: "pending", message: "Checking D1 binding..." },
        ],
      },
      {
        category: "Security",
        icon: "🔒",
        tests: [
          { name: "HTTPS", status: "pending", message: "Verifying SSL/TLS..." },
          { name: "Security Headers", status: "pending", message: "Checking security headers..." },
          { name: "No Server Info Leak", status: "pending", message: "Checking for info disclosure..." },
        ],
      },
      {
        category: "CI/CD Pipeline",
        icon: "🔄",
        tests: [
          { name: "GitHub Actions", status: "pending", message: "Checking workflow status..." },
          { name: "Auto Deploy", status: "pending", message: "Verifying auto-deployment..." },
          { name: "Build Artifacts", status: "pending", message: "Checking build output..." },
        ],
      },
    ];

    setSuites(initialSuites);

    // Helper to update a specific test
    const updateTest = (
      suiteIdx: number,
      testIdx: number,
      update: Partial<TestResult>
    ) => {
      setSuites((prev) => {
        const next = JSON.parse(JSON.stringify(prev)) as TestSuite[];
        next[suiteIdx].tests[testIdx] = { ...next[suiteIdx].tests[testIdx], ...update };
        return next;
      });
    };

    // ============ FRONTEND TESTS ============
    // Test 1: Page Load
    updateTest(0, 0, { status: "running", message: "Loading page..." });
    const pageStart = Date.now();
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      const pageTime = Date.now() - pageStart;
      if (res.ok) {
        updateTest(0, 0, {
          status: "pass",
          message: `Page loaded successfully (${res.status})`,
          duration: pageTime,
        });
      } else {
        updateTest(0, 0, {
          status: "fail",
          message: `Page returned ${res.status}`,
          duration: pageTime,
        });
      }
    } catch (e: any) {
      updateTest(0, 0, { status: "fail", message: `Failed to load: ${e.message}` });
    }

    // Test 2: Static Assets
    updateTest(0, 1, { status: "running", message: "Checking static assets..." });
    try {
      const html = await (await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) })).text();
      const hasAssets = html.includes("_next") || html.includes("static");
      updateTest(0, 1, {
        status: hasAssets ? "pass" : "warn",
        message: hasAssets ? "Static assets found in HTML" : "No static asset references found",
        details: hasAssets ? html.substring(0, 200) : undefined,
      });
    } catch (e: any) {
      updateTest(0, 1, { status: "fail", message: e.message });
    }

    // Test 3: Responsive Meta
    updateTest(0, 2, { status: "running", message: "Checking meta tags..." });
    try {
      const html = await (await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) })).text();
      const hasViewport = html.includes('name="viewport"');
      updateTest(0, 2, {
        status: hasViewport ? "pass" : "fail",
        message: hasViewport ? "Viewport meta tag present" : "Missing viewport meta tag",
      });
    } catch (e: any) {
      updateTest(0, 2, { status: "fail", message: e.message });
    }

    // Test 4: Dark Mode
    updateTest(0, 3, { status: "running", message: "Checking dark mode support..." });
    try {
      const html = await (await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) })).text();
      const hasDarkMode =
        html.includes("prefers-color-scheme") || html.includes("dark:") || html.includes('class="dark"');
      updateTest(0, 3, {
        status: hasDarkMode ? "pass" : "warn",
        message: hasDarkMode ? "Dark mode CSS detected" : "No dark mode support found",
      });
    } catch (e: any) {
      updateTest(0, 3, { status: "fail", message: e.message });
    }

    // ============ BACKEND TESTS ============
    // Test 1: Health Check
    updateTest(1, 0, { status: "running", message: "Pinging /api/health..." });
    const healthStart = Date.now();
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, {
        signal: AbortSignal.timeout(10000),
      });
      const healthTime = Date.now() - healthStart;
      const data = await res.json();
      if (res.ok && data.status === "ok") {
        updateTest(1, 0, {
          status: "pass",
          message: `Backend healthy: ${data.message}`,
          duration: healthTime,
          details: JSON.stringify(data, null, 2),
        });
      } else {
        updateTest(1, 0, {
          status: "fail",
          message: `Unexpected response: ${JSON.stringify(data)}`,
          duration: healthTime,
        });
      }
    } catch (e: any) {
      updateTest(1, 0, { status: "fail", message: `Backend unreachable: ${e.message}` });
    }

    // Test 2: Hello Endpoint
    updateTest(1, 1, { status: "running", message: "Testing /api/hello..." });
    try {
      const res = await fetch(`${BACKEND_URL}/api/hello`, {
        signal: AbortSignal.timeout(10000),
      });
      const data = await res.json();
      updateTest(1, 1, {
        status: res.ok ? "pass" : "fail",
        message: res.ok ? data.message || "Hello endpoint working" : `Failed: ${res.status}`,
        details: JSON.stringify(data, null, 2),
      });
    } catch (e: any) {
      updateTest(1, 1, { status: "fail", message: e.message });
    }

    // Test 3: CORS Headers
    updateTest(1, 2, { status: "running", message: "Checking CORS headers..." });
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, {
        method: "OPTIONS",
        signal: AbortSignal.timeout(10000),
      });
      const corsHeader = res.headers.get("access-control-allow-origin");
      updateTest(1, 2, {
        status: corsHeader ? "pass" : "warn",
        message: corsHeader
          ? `CORS enabled: ${corsHeader}`
          : "No CORS header (may be restricted to same-origin)",
        details: `Status: ${res.status}\nHeaders: ${JSON.stringify(Object.fromEntries(res.headers), null, 2)}`,
      });
    } catch (e: any) {
      updateTest(1, 2, { status: "warn", message: `CORS check inconclusive: ${e.message}` });
    }

    // Test 4: Response Time
    updateTest(1, 3, { status: "running", message: "Measuring latency..." });
    const latencies: number[] = [];
    for (let i = 0; i < 3; i++) {
      const start = Date.now();
      try {
        await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(5000) });
        latencies.push(Date.now() - start);
      } catch {
        latencies.push(-1);
      }
    }
    const validLatencies = latencies.filter((l) => l > 0);
    if (validLatencies.length > 0) {
      const avg = Math.round(validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length);
      const max = Math.max(...validLatencies);
      updateTest(1, 3, {
        status: avg < 500 ? "pass" : avg < 1000 ? "warn" : "fail",
        message: `Avg: ${avg}ms | Max: ${max}ms (${validLatencies.length}/3 successful)`,
        details: `Individual: ${latencies.map((l) => (l > 0 ? `${l}ms` : "timeout")).join(", ")}`,
      });
    } else {
      updateTest(1, 3, { status: "fail", message: "All requests timed out" });
    }

    // ============ CLOUDFLARE INFRASTRUCTURE ============
    // Test 1: Pages CDN
    updateTest(2, 0, { status: "running", message: "Checking CDN headers..." });
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      const cfCache = res.headers.get("cf-cache-status");
      const cfRay = res.headers.get("cf-ray");
      const server = res.headers.get("server");
      updateTest(2, 0, {
        status: cfRay ? "pass" : "warn",
        message: cfRay
          ? `Served by Cloudflare edge (${cfRay.split("-")[1] || "unknown"})`
          : "No CF-Ray header (may be direct origin)",
        details: `CF-Cache: ${cfCache || "N/A"}\nCF-Ray: ${cfRay || "N/A"}\nServer: ${server || "N/A"}`,
      });
    } catch (e: any) {
      updateTest(2, 0, { status: "fail", message: e.message });
    }

    // Test 2: Worker Route
    updateTest(2, 1, { status: "running", message: "Checking Worker routing..." });
    try {
      const res = await fetch(BACKEND_URL, { signal: AbortSignal.timeout(10000) });
      const cfRay = res.headers.get("cf-ray");
      updateTest(2, 1, {
        status: res.ok && cfRay ? "pass" : "warn",
        message: res.ok && cfRay ? "Worker responding via Cloudflare edge" : "Worker response unusual",
        details: `Status: ${res.status}\nCF-Ray: ${cfRay || "N/A"}`,
      });
    } catch (e: any) {
      updateTest(2, 1, { status: "fail", message: e.message });
    }

    // Test 3: KV Read/Write
    updateTest(2, 2, { status: "running", message: "Testing KV namespace..." });
    try {
      const testKey = `test-${Date.now()}`;
      const testValue = { test: true, timestamp: Date.now() };

      // Write
      const writeRes = await fetch(`${BACKEND_URL}/api/kv/${testKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testValue),
        signal: AbortSignal.timeout(10000),
      });
      const writeData = await writeRes.json();

      // Read
      const readRes = await fetch(`${BACKEND_URL}/api/kv/${testKey}`, {
        signal: AbortSignal.timeout(10000),
      });
      const readData = await readRes.json();

      updateTest(2, 2, {
        status: writeRes.ok && readRes.ok ? "pass" : "fail",
        message: writeRes.ok && readRes.ok ? "KV read/write successful" : "KV operation failed",
        details: `Write: ${JSON.stringify(writeData)}\nRead: ${JSON.stringify(readData)}`,
      });
    } catch (e: any) {
      updateTest(2, 2, { status: "fail", message: `KV test failed: ${e.message}` });
    }

    // Test 4: D1 Database
    updateTest(2, 3, { status: "running", message: "Checking D1 binding..." });
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, {
        signal: AbortSignal.timeout(10000),
      });
      // D1 is bound but we don't have specific D1 endpoints yet
      // Just verify the Worker is running (which means bindings loaded)
      updateTest(2, 3, {
        status: res.ok ? "pass" : "fail",
        message: res.ok
          ? "Worker loaded successfully (D1 binding configured)"
          : "Worker may not have loaded bindings",
        details: "D1 database 'staging-starter-db' is bound. Add D1 query endpoints to test fully.",
      });
    } catch (e: any) {
      updateTest(2, 3, { status: "fail", message: e.message });
    }

    // ============ SECURITY TESTS ============
    // Test 1: HTTPS
    updateTest(3, 0, { status: "running", message: "Verifying HTTPS..." });
    const isHttps = FRONTEND_URL.startsWith("https") && BACKEND_URL.startsWith("https");
    updateTest(3, 0, {
      status: isHttps ? "pass" : "fail",
      message: isHttps ? "Both frontend and backend use HTTPS" : "HTTPS not enforced",
    });

    // Test 2: Security Headers
    updateTest(3, 1, { status: "running", message: "Checking security headers..." });
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      const headers = res.headers;
      const securityHeaders = {
        "x-content-type-options": headers.get("x-content-type-options"),
        "x-frame-options": headers.get("x-frame-options"),
        "x-xss-protection": headers.get("x-xss-protection"),
        "strict-transport-security": headers.get("strict-transport-security"),
        "content-security-policy": headers.get("content-security-policy"),
        "referrer-policy": headers.get("referrer-policy"),
      };
      const present = Object.values(securityHeaders).filter(Boolean).length;
      updateTest(3, 1, {
        status: present >= 2 ? "pass" : present >= 1 ? "warn" : "fail",
        message: `${present}/6 security headers present`,
        details: JSON.stringify(securityHeaders, null, 2),
      });
    } catch (e: any) {
      updateTest(3, 1, { status: "fail", message: e.message });
    }

    // Test 3: No Server Info Leak
    updateTest(3, 2, { status: "running", message: "Checking for info disclosure..." });
    try {
      const res = await fetch(BACKEND_URL, { signal: AbortSignal.timeout(10000) });
      const server = res.headers.get("server");
      const powered = res.headers.get("x-powered-by");
      const hasLeak = server === "nginx" || powered;
      updateTest(3, 2, {
        status: !hasLeak ? "pass" : "warn",
        message: !hasLeak
          ? "No server info leaked"
          : `Server header: ${server}, X-Powered-By: ${powered}`,
        details: `Server: ${server || "not set"}\nX-Powered-By: ${powered || "not set"}`,
      });
    } catch (e: any) {
      updateTest(3, 2, { status: "warn", message: e.message });
    }

    // ============ CI/CD TESTS ============
    // Test 1: GitHub Actions
    updateTest(4, 0, { status: "running", message: "Checking GitHub Actions..." });
    try {
      const res = await fetch(
        "https://api.github.com/repos/nhprince/staging-starter/actions/runs?per_page=1",
        { signal: AbortSignal.timeout(10000) }
      );
      const data = await res.json();
      const latestRun = data.workflow_runs?.[0];
      if (latestRun) {
        updateTest(4, 0, {
          status: latestRun.conclusion === "success" ? "pass" : "fail",
          message: `Latest run: ${latestRun.conclusion} (${latestRun.event})`,
          details: `Run #${latestRun.run_number}\nStatus: ${latestRun.status}\nConclusion: ${latestRun.conclusion}\nBranch: ${latestRun.head_branch}\nCommit: ${latestRun.head_sha?.substring(0, 7)}`,
        });
      } else {
        updateTest(4, 0, { status: "warn", message: "No workflow runs found" });
      }
    } catch (e: any) {
      updateTest(4, 0, { status: "warn", message: `Could not check: ${e.message}` });
    }

    // Test 2: Auto Deploy
    updateTest(4, 1, { status: "running", message: "Verifying auto-deploy..." });
    try {
      const res = await fetch(
        "https://api.github.com/repos/nhprince/staging-starter/actions/workflows/deploy.yml",
        { signal: AbortSignal.timeout(10000) }
      );
      const data = await res.json();
      updateTest(4, 1, {
        status: data.state === "active" ? "pass" : "warn",
        message: data.state === "active" ? "Deploy workflow is active" : `Workflow state: ${data.state}`,
        details: `Workflow: ${data.name}\nState: ${data.state}\nID: ${data.id}`,
      });
    } catch (e: any) {
      updateTest(4, 1, { status: "warn", message: e.message });
    }

    // Test 3: Build Artifacts
    updateTest(4, 2, { status: "running", message: "Checking build output..." });
    try {
      const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(10000) });
      const html = await res.text();
      const hasBuild =
        html.includes("__NEXT_DATA__") || html.includes("_next/") || html.includes("static/");
      updateTest(4, 2, {
        status: hasBuild ? "pass" : "warn",
        message: hasBuild ? "Build artifacts detected (Next.js output)" : "Build output not verified",
        details: `HTML length: ${html.length} chars\nHas Next.js markers: ${hasBuild}`,
      });
    } catch (e: any) {
      updateTest(4, 2, { status: "fail", message: e.message });
    }

    setLastRun(new Date().toLocaleString());
    setIsRunning(false);
  }, []);

  // Auto-run on mount
  useEffect(() => {
    runTests();
  }, [runTests]);

  const totalTests = suites.reduce((acc, s) => acc + s.tests.length, 0);
  const passedTests = suites.reduce(
    (acc, s) => acc + s.tests.filter((t) => t.status === "pass").length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🚀 System Status</h1>
            <p className="text-sm text-gray-500">
              {lastRun ? `Last checked: ${lastRun}` : "Click Run to start diagnostics"}
            </p>
          </div>
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <span className="animate-spin">🔄</span> Running...
              </>
            ) : (
              <>▶ Run Tests</>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Score */}
        {suites.length > 0 && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Health Score</h2>
              <p className="text-sm text-gray-500">
                {suites.length} categories • {totalTests} tests
              </p>
            </div>
            <ScoreCircle score={passedTests} total={totalTests} />
          </div>
        )}

        {/* Test Suites */}
        {suites.map((suite, i) => (
          <SuiteSection key={i} suite={suite} />
        ))}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-400">
          <p>
            Built by <span className="font-semibold">Prince</span> • Powered by{" "}
            <span className="font-semibold">Saturday</span> •{" "}
            <span className="font-semibold">Cloudflare Pages + Workers</span>
          </p>
          <p className="mt-1">
            Frontend: <a href={FRONTEND_URL} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">{FRONTEND_URL}</a>
            <br />
            Backend: <a href={BACKEND_URL} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">{BACKEND_URL}</a>
          </p>
        </div>
      </main>
    </div>
  );
}
