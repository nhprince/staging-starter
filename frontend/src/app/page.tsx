export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight">
          🚀 Staging Starter
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Full-stack template with dual deployment
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-2">☁️ Cloudflare</h2>
            <p className="text-sm text-gray-500">
              Pages + Workers + D1 + KV + R2
            </p>
            <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              Default
            </span>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-2">🖥️ VPS</h2>
            <p className="text-sm text-gray-500">
              nginx + PM2 + MariaDB + PHP
            </p>
            <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              Fallback
            </span>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-400">
            Built by <span className="font-semibold">Prince</span> • Powered by{" "}
            <span className="font-semibold">Saturday</span>
          </p>
        </div>
      </div>
    </main>
  );
}
