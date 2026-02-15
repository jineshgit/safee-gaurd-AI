"use client";

import { useState, useEffect } from "react";
import { Bot, Globe, Server, Plus, Search, ArrowRight, X, Loader2 } from "lucide-react";

interface Agent {
    id: number;
    name: string;
    endpoint: string;
    description: string;
    status: "active" | "inactive";
    model: string;
    last_tested: string | null;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAgent, setNewAgent] = useState({ name: "", endpoint: "", description: "", model: "GPT-4o" });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchAgents();
    }, []);

    async function fetchAgents() {
        try {
            const res = await fetch("/api/agents");
            if (res.ok) {
                const data = await res.json();
                setAgents(data);
            }
        } catch (error) {
            console.error("Failed to fetch agents:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateAgent(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch("/api/agents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAgent),
            });

            if (res.ok) {
                const created = await res.json();
                setAgents([created, ...agents]);
                setIsModalOpen(false);
                setNewAgent({ name: "", endpoint: "", description: "", model: "GPT-4o" });
            }
        } catch (error) {
            console.error("Failed to create agent:", error);
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage AI agent endpoints for automated testing.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Connect Agent
                </button>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search agents..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                />
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Loading agents...</p>
                </div>
            ) : agents.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                    <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No agents connected</h3>
                    <p className="text-sm text-gray-500 mb-6">Connect your first AI agent to start testing.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Connect Agent
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {agents.map((agent) => (
                        <div key={agent.id} className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-blue-500/30 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">

                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                            </div>

                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${agent.status === "active" ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-gray-50 border-gray-100 text-gray-400"
                                        }`}>
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${agent.status === "active"
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : "bg-gray-50 text-gray-500 border-gray-200"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                                                {agent.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-2xl">{agent.description || "No description provided."}</p>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                                <Globe className="w-3 h-3 text-gray-400" />
                                                {agent.endpoint}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Server className="w-3 h-3 text-gray-400" />
                                                {agent.model || "Unknown Model"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right shrink-0 mt-1">
                                    <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-1">Last Tested</div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {agent.last_tested ? new Date(agent.last_tested).toLocaleDateString() : "Never"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Connect New Agent</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateAgent} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Agent Name</label>
                                <input
                                    required
                                    value={newAgent.name}
                                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="e.g. Customer Support Bot"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Endpoint URL</label>
                                <input
                                    required
                                    value={newAgent.endpoint}
                                    onChange={(e) => setNewAgent({ ...newAgent, endpoint: e.target.value })}
                                    type="url"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="https://api.myapp.com/agent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Model / Version</label>
                                <input
                                    value={newAgent.model}
                                    onChange={(e) => setNewAgent({ ...newAgent, model: e.target.value })}
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="e.g. GPT-4o, Claude 3"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newAgent.description}
                                    onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    placeholder="What does this agent do?"
                                />
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {creating && <Loader2 className="w-3 h-3 animate-spin" />}
                                    Connect Agent
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
