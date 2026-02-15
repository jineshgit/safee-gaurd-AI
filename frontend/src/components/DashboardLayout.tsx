"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FlaskConical,
    FileText,
    Bot,
    ClipboardList,
    Users,
    Settings,
    LogOut,
    Home,
} from "lucide-react";
import { UserButton, SignedIn, SignOutButton } from "@clerk/nextjs";
import { Logo } from "./Logo";

const navItems = [
    {
        label: "PLATFORM", items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Playground", href: "/dashboard/playground", icon: FlaskConical },
            { name: "Results", href: "/dashboard/results", icon: FileText },
        ]
    },
    {
        label: "CONFIGURATION", items: [
            { name: "Agents", href: "/dashboard/agents", icon: Bot },
            { name: "Scenarios", href: "/dashboard/scenarios", icon: ClipboardList },
            { name: "Personas", href: "/dashboard/personas", icon: Users },
        ]
    },
    {
        label: "SYSTEM", items: [
            { name: "Settings", href: "/dashboard/settings", icon: Settings },
        ]
    },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-[#fafafa] text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
                    <Logo className="w-8 h-8 text-blue-600" />
                    <div>
                        <div className="font-bold text-sm text-gray-900">Safeguard AI</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest">Enterprise</div>
                    </div>
                </div>

                {/* Nav Groups */}
                <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
                    {navItems.map((group) => (
                        <div key={group.label}>
                            <div className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {group.label}
                            </div>
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                                ? "bg-amber-50 text-amber-700 border-l-2 border-amber-500"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? "text-amber-600" : "text-gray-400"}`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <SignedIn>
                        <div className="flex items-center gap-3">
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-9 h-9"
                                    }
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">Account</div>
                                <div className="text-xs text-gray-400">Manage</div>
                            </div>
                        </div>
                    </SignedIn>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
