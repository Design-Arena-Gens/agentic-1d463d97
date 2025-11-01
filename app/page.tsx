'use client';

import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [videoCount, setVideoCount] = useState(3);

  const { data: statusData } = useSWR(
    isRunning ? '/api/status' : null,
    fetcher,
    { refreshInterval: 2000 }
  );

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runAgent = async () => {
    setIsRunning(true);
    setResults([]);
    setLogs([]);
    addLog('Starting automation agent...');

    try {
      const response = await fetch('/api/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: videoCount }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        addLog(`✓ Completed! Processed ${data.results.length} videos`);
      } else {
        addLog(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      addLog(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🤖 AI Video Automation Agent
          </h1>
          <p className="text-xl text-gray-300">
            Scan trending videos → Generate prompts → Create videos → Upload to YouTube
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Control Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Control Panel</h2>

            <div className="flex items-center gap-4 mb-4">
              <label className="text-white font-medium">Videos to Process:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={videoCount}
                onChange={(e) => setVideoCount(parseInt(e.target.value))}
                className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isRunning}
              />
            </div>

            <button
              onClick={runAgent}
              disabled={isRunning}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                isRunning
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
              } text-white shadow-lg`}
            >
              {isRunning ? '⏳ Running Agent...' : '🚀 Start Automation Agent'}
            </button>
          </div>

          {/* Status */}
          {isRunning && (
            <div className="bg-blue-500/20 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="text-white font-medium">Agent is running...</span>
              </div>
            </div>
          )}

          {/* Logs */}
          {logs.length > 0 && (
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Activity Logs</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="text-gray-300 font-mono text-sm">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Results</h3>
              <div className="space-y-4">
                {results.map((result, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border-2 ${
                      result.status === 'success'
                        ? 'bg-green-500/20 border-green-500/50'
                        : result.status === 'partial'
                        ? 'bg-yellow-500/20 border-yellow-500/50'
                        : 'bg-red-500/20 border-red-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-bold text-white">
                        {result.trendingVideo.title}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.status === 'success' ? 'bg-green-500' :
                        result.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {result.status}
                      </span>
                    </div>

                    <div className="text-gray-300 text-sm space-y-1">
                      <p>Category: {result.trendingVideo.category}</p>
                      <p>Views: {result.trendingVideo.views}</p>

                      {result.generatedPrompt?.title && (
                        <p className="mt-2 font-medium">
                          Generated: {result.generatedPrompt.title}
                        </p>
                      )}

                      {result.youtubeUrl && (
                        <a
                          href={result.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-blue-300 hover:text-blue-200 underline"
                        >
                          View on YouTube →
                        </a>
                      )}

                      {result.error && (
                        <p className="mt-2 text-red-300">Error: {result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">🔍 Step 1: Scan</h3>
              <p className="text-gray-300">
                Automatically scans the internet for trending and popular videos
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">📝 Step 2: Document</h3>
              <p className="text-gray-300">
                Logs trending videos and ideas to Google Docs for tracking
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">✨ Step 3: Generate Prompts</h3>
              <p className="text-gray-300">
                AI creates detailed video prompts based on trending content
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">🎬 Step 4: Create & Upload</h3>
              <p className="text-gray-300">
                Generates videos with AI and automatically uploads to YouTube
              </p>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="mt-12 bg-amber-500/20 backdrop-blur-lg rounded-2xl p-6 border border-amber-500/30">
            <h3 className="text-xl font-bold text-white mb-4">⚙️ Setup Required</h3>
            <div className="text-gray-200 space-y-2 text-sm">
              <p>To fully activate this agent, configure the following:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Google OAuth credentials (Client ID & Secret)</li>
                <li>OpenAI API key for prompt generation</li>
                <li>Video generation API (Veo3/Sora) when available</li>
                <li>YouTube Data API access</li>
              </ol>
              <p className="mt-3 text-xs text-gray-300">
                Currently running in demo mode with simulated data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
