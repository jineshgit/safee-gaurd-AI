"use client";

import { Box, Code, Cpu, Globe, Layers, Server } from "lucide-react";

const logos = [
    { name: "Vercel", Icon: Server },
    { name: "OpenAI", Icon: Cpu },
    { name: "LangChain", Icon: Layers },
    { name: "Anthropic", Icon: Box },
    { name: "Supabase", Icon: DatabaseIcon },
];

function DatabaseIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
    )
}

export default function LogoTicker() {
    return (
        <div className="w-full py-10 border-b border-white/5 bg-[#030014] overflow-hidden">
            <div className="flex animate-scroll whitespace-nowrap">
                {/* Double the logos for seamless loop */}
                {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
                    <div key={index} className="mx-8 flex items-center gap-2 group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                        <logo.Icon className="w-6 h-6 text-white" />
                        <span className="text-lg font-bold text-white tracking-tight">{logo.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
