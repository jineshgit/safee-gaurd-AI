import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";
import { Logo } from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-[#030014] border-t border-white/5 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-10 mb-16">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <Logo className="w-8 h-8" color="text-blue-500" />
                        <span className="font-bold text-white">Safeguard AI</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        The complete compliance platform for autonomous agents. Test, monitor, and secure your AI workforce.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Product</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Features</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Integrations</Link></li>
                    </ul>
                </div>



                <div>
                    <h4 className="font-bold text-white mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Security</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-gray-600 text-sm">
                    © 2024 Safeguard AI Inc. All rights reserved.
                </div>
                <div className="flex gap-6">
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></Link>
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
                </div>
            </div>
        </footer>
    );
}
