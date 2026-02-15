"use client";

import { useState, useEffect } from "react";
import { Users, MessageSquare, Volume2 } from "lucide-react";

interface Persona {
    id: number;
    name: string;
    description: string;
    communication_style: string;
    tone: string;
}

const BUILT_IN_PERSONAS: Persona[] = [
    {
        id: 1,
        name: "Frustrated Customer",
        description: "A long-time customer who has had repeated issues and is losing patience. They expect immediate resolution and may use strong language.",
        communication_style: "Direct",
        tone: "Angry",
    },
    {
        id: 2,
        name: "Confused Elderly User",
        description: "An older customer unfamiliar with technology. They need clear, step-by-step guidance without jargon or assumptions about technical knowledge.",
        communication_style: "Verbose",
        tone: "Uncertain",
    },
    {
        id: 3,
        name: "Tech-Savvy Professional",
        description: "A technically knowledgeable user who prefers concise, accurate answers. They dislike over-explanation and value efficiency.",
        communication_style: "Concise",
        tone: "Neutral",
    },
    {
        id: 4,
        name: "First-Time Buyer",
        description: "A new customer exploring the product for the first time. They have many questions and need reassurance about their purchase decision.",
        communication_style: "Inquisitive",
        tone: "Friendly",
    },
    {
        id: 5,
        name: "Enterprise Decision Maker",
        description: "A senior executive evaluating the product for their organization. They focus on ROI, compliance, and scalability rather than technical details.",
        communication_style: "Formal",
        tone: "Professional",
    },
    {
        id: 6,
        name: "Anxious Account Holder",
        description: "A customer worried about a potential security issue or billing discrepancy. They need calm reassurance and clear next steps.",
        communication_style: "Detailed",
        tone: "Worried",
    },
];

export default function PersonasPage() {
    const [personas, setPersonas] = useState<Persona[]>(BUILT_IN_PERSONAS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/personas");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setPersonas(data);
                    }
                }
            } catch (e) {
                console.error("Failed to load personas from API, using defaults:", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Personas</h1>
                    <p className="text-sm text-gray-500 mt-1">Customer personas used for contextual agent evaluation.</p>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                    {personas.length} personas
                </span>
            </div>

            {loading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-400">Loading personas...</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {personas.map((p) => (
                        <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-gray-300 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Persona #{p.id}</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed mb-5">{p.description}</p>

                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
                                    <MessageSquare className="w-3 h-3" />
                                    {p.communication_style}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
                                    <Volume2 className="w-3 h-3" />
                                    {p.tone}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
