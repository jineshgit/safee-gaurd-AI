"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Key, Database, Globe, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
    const [geminiKey, setGeminiKey] = useState("");
    const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "error">("checking");
    const [historyCount, setHistoryCount] = useState(0);

    useEffect(() => {
        // Check Gemini key from localStorage
        const key = localStorage.getItem("gemini_api_key") || "";
        setGeminiKey(key);

        // Check evaluation history count
        try {
            const history = JSON.parse(localStorage.getItem("evaluation_history") || "[]");
            setHistoryCount(Array.isArray(history) ? history.length : 0);
        } catch { }

        // Check database connectivity
        fetch("/api/analytics")
            .then(res => {
                setDbStatus(res.ok ? "connected" : "error");
            })
            .catch(() => setDbStatus("error"));
    }, []);

    const handleSaveKey = () => {
        localStorage.setItem("gemini_api_key", geminiKey);
    };

    const handleClearKey = () => {
        localStorage.removeItem("gemini_api_key");
        setGeminiKey("");
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Application configuration and preferences.</p>
            </div>

            <div className="space-y-6 max-w-2xl">
                {/* General */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">General</h3>
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-900">Application Name</div>
                                <div className="text-xs text-gray-400 mt-0.5">Displayed in the sidebar and page titles</div>
                            </div>
                            <span className="text-sm text-gray-700 font-medium">Safeguard AI</span>
                        </div>
                        <div className="border-t border-gray-100" />
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-900">Version</div>
                                <div className="text-xs text-gray-400 mt-0.5">Current application version</div>
                            </div>
                            <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md font-mono">v2.0.0</span>
                        </div>
                        <div className="border-t border-gray-100" />
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-900">Local History</div>
                                <div className="text-xs text-gray-400 mt-0.5">Evaluations saved in browser storage</div>
                            </div>
                            <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md font-mono">{historyCount} records</span>
                        </div>
                    </div>
                </div>

                {/* API Key */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Gemini API Key</h3>
                    <p className="text-xs text-gray-500 mb-4">Required for AI-powered evaluations. Get your key at <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-amber-600 hover:text-amber-700 underline">AI Studio</a>.</p>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="password"
                                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono focus:border-amber-400 outline-none"
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                                placeholder="AIzaSy..."
                            />
                        </div>
                        <button
                            onClick={handleSaveKey}
                            disabled={!geminiKey}
                            className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            Save
                        </button>
                        {geminiKey && (
                            <button
                                onClick={handleClearKey}
                                className="px-4 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        {geminiKey ? (
                            <>
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">API key configured</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-xs text-amber-600 font-medium">No API key — pattern-based evaluation will be used</span>
                            </>
                        )}
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Database className="w-4 h-4 text-gray-400" />
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Database</div>
                                    <div className="text-xs text-gray-400">Supabase (PostgreSQL)</div>
                                </div>
                            </div>
                            {dbStatus === "checking" ? (
                                <span className="text-xs text-gray-400 flex items-center gap-1.5"><span className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin" /> Checking...</span>
                            ) : dbStatus === "connected" ? (
                                <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium"><CheckCircle className="w-3.5 h-3.5" /> Connected</span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium"><AlertTriangle className="w-3.5 h-3.5" /> Unavailable (using localStorage)</span>
                            )}
                        </div>
                        <div className="border-t border-gray-100" />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Next.js Server</div>
                                    <div className="text-xs text-gray-400">Application runtime</div>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium"><CheckCircle className="w-3.5 h-3.5" /> Running</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
