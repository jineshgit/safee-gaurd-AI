"use client";

import Link from "next/link";
import { Logo } from "./Logo";

export default function Navbar() {
    return (
        <nav className="fixed top-6 left-0 right-0 z-50 transition-all duration-300">
            <div className="max-w-5xl mx-auto px-6">
                <div className="bg-[#0a0e1a]/80 backdrop-blur-md border border-white/10 rounded-full h-14 flex items-center justify-between px-6 shadow-lg shadow-black/20">
                    <div className="flex items-center gap-3">
                        <Logo className="w-6 h-6" color="text-blue-500" />
                        <span className="font-bold text-lg tracking-tight text-white">Safeguard AI</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                        <Link href="#testimonials" className="hover:text-white transition-colors">Customers</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/sign-in" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">
                            Sign In
                        </Link>
                        <Link
                            href="/dashboard"
                            className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-all transform hover:scale-105"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
