"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
    { name: "Sarah Jenkins", role: "CTO at TechFlow", text: "Safeguard AI caught a critical compliance issue in our agent before deployment. It saved us from a potential lawsuit." },
    { name: "Michael Chen", role: "Product Lead at BuildBetter", text: "The integration was profound. We plugged it into our LangChain pipeline and had results in minutes." },
    { name: "Elena Rodriguez", role: "Head of AI at Nexus", text: "Finally, a way to unit test our prompt engineering. Our hallucination rate dropped by 40%." },
    { name: "David Kim", role: "DevOps Engineer", text: "The CI/CD integration is flawless. No agent goes to production without a green light from Safeguard." },
    { name: "Jessica Wei", role: "Founder of ChatGenius", text: "Our enterprise clients demanded SOC2 compliance. Safeguard AI's reports made the audit a breeze." },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-[#0a0e1a] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Trusted by AI Teams</h2>
                <p className="text-gray-400">Join 500+ engineering teams build safer agents.</p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-6">
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className="w-[400px] bg-white/5 border border-white/10 rounded-2xl p-6 whitespace-normal flex-shrink-0 hover:bg-white/10 transition-colors">
                            <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                                <div>
                                    <div className="text-white font-bold text-sm">{t.name}</div>
                                    <div className="text-gray-500 text-xs">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Second duplicate for smooth loop if needed, though simple map doubling works well for CSS marquee */}
            </div>
        </section>
    );
}
