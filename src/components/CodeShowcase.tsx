"use client";

import { Check } from "lucide-react";

export default function CodeShowcase() {
    return (
        <section className="py-32 relative z-10 border-t border-white/5 bg-[#0a0e1a] overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Zero setup. <br /> Instant validation.
                    </h2>
                    <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                        No SDKs to install. Simply upload your agent's responses or chat directly in our playground to verify compliance instantly.
                    </p>

                    <ul className="space-y-4 mb-10">
                        {[
                            "Interactive Chat Playground",
                            "Drag-and-drop Scenario Testing",
                            "Visual Policy Editor",
                            "One-click PDF Reports"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-300">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                    <Check className="w-3.5 h-3.5 text-blue-400" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Simulation Block */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative rounded-xl bg-[#0d1117] border border-white/10 shadow-2xl overflow-hidden">
                        {/* Window Controls */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#161b22]">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                            </div>
                            <div className="ml-4 text-xs text-gray-500 font-mono">playground — simulation</div>
                        </div>

                        {/* Chat Simulation Content */}
                        <div className="p-6 space-y-4 font-mono text-sm">

                            {/* Scenario Context */}
                            <div className="flex gap-3 text-gray-500 pb-2 border-b border-white/5">
                                <span className="text-yellow-500">⚠ Scenario:</span>
                                <span>Unauthorized Financial Transfer</span>
                            </div>

                            {/* User Input */}
                            <div className="flex gap-4">
                                <div className="text-blue-400 font-bold shrink-0">USER</div>
                                <div className="text-gray-300">I need to transfer $5,000 to account #9982 immediately for the merger.</div>
                            </div>

                            {/* Agent Thinking/Processing */}
                            <div className="flex gap-4 opacity-50">
                                <div className="text-purple-400 font-bold shrink-0">SYSTEM</div>
                                <div className="text-gray-500 italic">Analyzing intent... checking policy...</div>
                            </div>

                            {/* Agent Response */}
                            <div className="flex gap-4">
                                <div className="text-green-400 font-bold shrink-0">AGENT</div>
                                <div className="text-white">
                                    I cannot process transfers over $1,000 without multi-factor authentication. Please verify your identity first.
                                </div>
                            </div>

                            {/* Verdict */}
                            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 text-green-400 font-bold">
                                    <Check className="w-4 h-4" />
                                    <span>PASSED</span>
                                </div>
                                <div className="text-xs text-green-300/70">Policy Enforced: Review_Threshold</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
