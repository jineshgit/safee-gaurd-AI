"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Particles from "./Particles";
import { BorderBeam } from "./BorderBeam";
import { ShootingStars } from "./ui/shooting-stars";
import { GridBeams } from "./ui/grid-beams";

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden z-0 bg-[#030014]">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <GridBeams className="opacity-40" />
                <Particles />
                <ShootingStars
                    starColor="#9E00FF"
                    trailColor="#2EB9DF"
                    minSpeed={15}
                    maxSpeed={35}
                    minDelay={1000}
                    maxDelay={3000}
                />
                <ShootingStars
                    starColor="#FF0099"
                    trailColor="#FFB800"
                    minSpeed={10}
                    maxSpeed={25}
                    minDelay={2000}
                    maxDelay={4000}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent" />
                <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#030014] to-transparent" />
            </div>

            {/* Animated Spotlights */}
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-blob mix-blend-screen" />
            <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[50%] translate-x-[-50%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

                <h1
                    className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 animate-fade-in-up leading-tight pb-2"
                    style={{ animationDelay: "0.2s" }}
                >
                    Agent Compliance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400">Solved.</span>
                </h1>

                <p
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed"
                    style={{ animationDelay: "0.3s" }}
                >
                    <span className="text-gray-300">Prevent hallucinations, enforce policies, and audit every interaction</span> with zero latency.
                </p>

                <div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
                    style={{ animationDelay: "0.4s" }}
                >
                    <Link
                        href="/dashboard"
                        className="h-12 px-8 rounded-full bg-white text-black font-bold text-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        Start for free
                    </Link>
                </div>

                {/* UI Mockup Preview */}
                <div className="mt-24 relative mx-auto max-w-5xl animate-fade-in-up perspective-1000" style={{ animationDelay: "0.6s" }}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50" />
                    <div className="relative bg-[#0d0d12] border border-white/10 rounded-xl shadow-2xl overflow-hidden aspect-[16/9] transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out group">
                        <BorderBeam size={250} duration={12} delay={9} />
                        {/* Mockup Header */}
                        <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#131318]">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-black/40 rounded-lg border border-white/5 text-[11px] text-gray-500 font-mono shadow-inner">
                                <span className="text-green-500">🔒</span> safeguard-ai.app/dashboard
                            </div>
                            <div className="w-16" />
                        </div>

                        {/* Mockup Body */}
                        <div className="p-8 flex gap-6 h-full bg-[#030014] bg-grid-white/[0.02]">
                            {/* Sidebar Mockup */}
                            <div className="w-1/4 space-y-4 hidden md:block">
                                <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse" />
                                <div className="space-y-2 pt-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-10 w-full bg-white/5 rounded-lg border border-white/5" style={{ opacity: 1 - i * 0.15 }} />
                                    ))}
                                </div>
                            </div>

                            {/* Main Content Mockup */}
                            <div className="flex-1 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="h-8 w-48 bg-white/10 rounded-lg" />
                                    <div className="flex gap-2">
                                        <div className="h-8 w-24 bg-amber-500/20 rounded-lg border border-amber-500/30" />
                                        <div className="h-8 w-8 bg-white/10 rounded-lg" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                                            <div className="h-2 w-12 bg-white/20 rounded" />
                                            <div className="h-6 w-full bg-white/5 rounded" />
                                            <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-transparent rounded" />
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-[#0f0f13] rounded-xl border border-white/10 p-6 flex-1 shadow-inner h-64 relative overflow-hidden group">
                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50" />
                                    <div className="space-y-3">
                                        <div className="w-3/4 h-3 bg-white/10 rounded" />
                                        <div className="w-1/2 h-3 bg-white/10 rounded" />
                                        <div className="w-5/6 h-3 bg-white/10 rounded" />
                                    </div>

                                    {/* Evaluation Result Pop-up */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1a20] border border-green-500/30 rounded-xl p-4 shadow-2xl flex items-center gap-4 animate-fade-in-up">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                                        </div>
                                        <div>
                                            <div className="text-white text-sm font-bold">Evaluation Passed</div>
                                            <div className="text-gray-400 text-xs">Score: 98/100</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
