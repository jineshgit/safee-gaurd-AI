"use client";

import { useState, useEffect, useCallback } from "react";
import { EvaluationResult } from "@/types";
import Link from "next/link";
import {
    Download, Eye, X, Search, BarChart3, CheckCircle, XCircle,
    Activity, Trash2, ArrowRight, ClipboardList, MessageSquare,
    Shield, User
} from "lucide-react";

interface EnhancedResult extends EvaluationResult {
    compliance_score?: number;
    keyword_coverage?: number;
    sentiment_score?: number;
    readability_score?: number;
}

export default function ResultsPage() {
    const [results, setResults] = useState<EnhancedResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterResult, setFilterResult] = useState("");
    const [selectedResult, setSelectedResult] = useState<EnhancedResult | null>(null);

    const loadResults = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/evaluations").catch(() => null);
            if (res?.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setResults(data);
                    setLoading(false);
                    return;
                }
            }
        } catch { }

        try {
            const saved = localStorage.getItem("evaluation_history");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setResults(parsed);
            }
        } catch { }
        setLoading(false);
    }, []);

    useEffect(() => { loadResults(); }, [loadResults]);

    const filtered = results.filter(r => {
        if (filterResult && r.overall !== filterResult) return false;
        if (search) {
            const s = search.toLowerCase();
            return (
                r.agent_name?.toLowerCase().includes(s) ||
                r.scenario_name?.toLowerCase().includes(s) ||
                r.scenario_id?.toLowerCase().includes(s) ||
                r.overall?.toLowerCase().includes(s)
            );
        }
        return true;
    });

    const totalEvals = filtered.length;
    const passCount = filtered.filter(r => r.overall === "PASS").length;
    const failCount = totalEvals - passCount;
    const passRate = totalEvals > 0 ? Math.round((passCount / totalEvals) * 100) : 0;

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `evaluation-history-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        if (confirm("Clear all evaluation history? This cannot be undone.")) {
            localStorage.removeItem("evaluation_history");
            setResults([]);
        }
    };

    // Calculate score color
    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-500";
        if (score >= 70) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Evaluation History</h1>
                    <p className="text-gray-500 mt-1">Analyze your agent's performance and compliance over time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleClear}
                        disabled={results.length === 0}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Clear History
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={filtered.length === 0}
                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-200"
                    >
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BarChart3 className="w-24 h-24 text-blue-600" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Total Evaluations</div>
                        <div className="text-4xl font-black text-gray-900">{loading ? "—" : totalEvals}</div>
                        <div className="text-xs text-gray-500 mt-1">All time records</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CheckCircle className="w-24 h-24 text-green-600" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2">Passed</div>
                        <div className="text-4xl font-black text-gray-900">{loading ? "—" : passCount}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {totalEvals > 0 ? `${passRate}% success rate` : "No data yet"}
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100 p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <XCircle className="w-24 h-24 text-red-600" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-sm font-bold text-red-600 uppercase tracking-wider mb-2">Failed</div>
                        <div className="text-4xl font-black text-gray-900">{loading ? "—" : failCount}</div>
                        <div className="text-xs text-gray-500 mt-1">Requires attention</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] z-0" />
                    <div className="relative z-10 text-center">
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Health Score</div>
                        <div className={`text-5xl font-black ${getScoreColor(passRate)}`}>
                            {loading ? "—" : passRate}<span className="text-2xl text-gray-300">%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex gap-4">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Search by agent, scenario..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:border-blue-500 outline-none"
                    value={filterResult}
                    onChange={(e) => setFilterResult(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="PASS">Passed Checks</option>
                    <option value="FAIL">Failed Checks</option>
                </select>
            </div>

            {/* Results Table */}
            {loading ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center shadow-sm">
                    <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading evaluation history...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ClipboardList className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {results.length === 0 ? "No evaluations found" : "No matching results"}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        {results.length === 0 ? "Your evaluation history is empty. Run a test in the Playground to generate results." : "Try adjusting your search criteria."}
                    </p>
                    {results.length === 0 && (
                        <Link
                            href="/dashboard/playground"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            Go to Playground <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Agent</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Scenario</th>
                                <th className="text-center px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((r, idx) => (
                                <tr key={r.id || idx} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedResult(r)}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-xs ring-2 ring-white shadow-sm">
                                                {r.agent_name?.[0] || "A"}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{r.agent_name || "Unknown Agent"}</div>
                                                <div className="text-xs text-gray-400">{r.team_org || "Default Org"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-700">{r.scenario_name || r.scenario_id}</span>
                                            <span className="text-xs text-gray-400 font-mono">{r.scenario_id}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${r.overall === "PASS" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${r.overall === "PASS" ? "bg-green-500" : "bg-red-500"}`} />
                                            {r.overall}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-gray-500 tabular-nums">
                                        {r.timestamp ? new Date(r.timestamp).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Enhanced Detail Modal */}
            {selectedResult && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedResult(null)}>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up" onClick={(e) => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Evaluation Report</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <span>{selectedResult.timestamp ? new Date(selectedResult.timestamp).toLocaleString() : ""}</span>
                                    <span>•</span>
                                    <span className="font-mono">{selectedResult.id?.slice(0, 8)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => window.print()} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors" title="Print / Save as PDF">
                                    <Download className="w-5 h-5" />
                                </button>
                                <button onClick={() => setSelectedResult(null)} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto bg-gray-50/50 p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Score & Metrics */}
                                <div className="lg:col-span-1 space-y-6">
                                    {/* Overall Score Card */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center relative overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-full h-1 ${selectedResult.overall === "PASS" ? "bg-green-500" : "bg-red-500"}`} />
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Overall Verdict</h4>

                                        {/* Score Gauge (CSS only for now) */}
                                        <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="64" cy="64" r="60" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                                                <circle
                                                    cx="64" cy="64" r="60" fill="none"
                                                    stroke={selectedResult.overall === "PASS" ? "#22c55e" : "#ef4444"}
                                                    strokeWidth="8"
                                                    strokeDasharray={377}
                                                    strokeDashoffset={selectedResult.overall === "PASS" ? 0 : 100} // Mock value based on pass/fail
                                                    className="transition-all duration-1000 ease-out"
                                                />
                                            </svg>
                                            <div className={`absolute inset-0 flex items-center justify-center text-2xl font-black ${selectedResult.overall === "PASS" ? "text-green-600" : "text-red-500"}`}>
                                                {selectedResult.overall}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Metrics */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Compliance Checks</h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: "Intent Match", value: selectedResult.intent, icon: CheckCircle },
                                                { label: "Policy Check", value: selectedResult.policy, icon: Shield },
                                                { label: "Tone Check", value: selectedResult.tone, icon: User },
                                                { label: "Escalation", value: selectedResult.escalation, icon: Activity },
                                            ].map((m, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <m.icon className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-700">{m.label}</span>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${m.value === "PASS" || m.value === "OK" || m.value === "YES"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {m.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Chat & Analysis */}
                                <div className="lg:col-span-2 space-y-6">

                                    {/* Reasoning Box */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-5 bg-blue-500 rounded-full" />
                                            <h4 className="text-sm font-bold text-gray-900">Analysis & Reasoning</h4>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                                            {selectedResult.reasoning}
                                        </p>
                                    </div>

                                    {/* Chat Preview (Raw Response) */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-2 mb-4">
                                            <MessageSquare className="w-4 h-4 text-gray-400" />
                                            <h4 className="text-sm font-bold text-gray-900">Transcript Snapshot</h4>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Simulated User Message (Scenario) */}
                                            <div className="flex gap-4 max-w-[90%]">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-sm text-gray-800">
                                                    <div className="text-xs font-bold text-gray-400 mb-1">User (Scenario Input)</div>
                                                    {/* We assume scenario details usually contain the input, but here we might not have the raw input stored. 
                                                        Ideally, we should store `user_input` in EvaluationResult. For now, we show a placeholder or try to infer.
                                                        Since we don't store plain user input in `EvaluationResult`, we can't show it accurately yet. 
                                                        We'll mock it or hide it if unavailable. */}
                                                    <p className="italic text-gray-400">User input not recorded for this session.</p>
                                                </div>
                                            </div>

                                            {/* Agent Response */}
                                            <div className="flex gap-4 max-w-[90%] ml-auto flex-row-reverse">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-bold text-blue-600">AI</span>
                                                </div>
                                                <div className="bg-blue-600 rounded-2xl rounded-tr-none p-4 text-sm text-white shadow-md">
                                                    <div className="text-xs font-bold text-blue-200 mb-1 text-right">Agent Response</div>
                                                    <p className="whitespace-pre-wrap">{selectedResult.raw_response}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
