import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Link from "next/link";
import { ShieldCheck, Zap, BarChart3, Target, ArrowRight, Check, X } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import LogoTicker from "../components/LogoTicker";
import CodeShowcase from "../components/CodeShowcase";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030014] landing-dark selection:bg-blue-500/30">
      <Navbar />
      <HeroSection />
      <LogoTicker />

      {/* Problem vs Solution Section */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Stop Trusting. <span className="text-blue-500">Start Verifying.</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Manual testing doesn't scale. See why leading AI teams are switching to automated governance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* The Old Way */}
            <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <X className="w-24 h-24 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                <X className="w-5 h-5" /> Manual Audits
              </h3>
              <ul className="space-y-4">
                {[
                  "Slow, sporadic testing cycles",
                  "Subjective human reviews",
                  "Missed edge cases & hallucinations",
                  "Compliance bottlenecks deployment",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400">
                    <X className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The Safeguard Way */}
            <div className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10 relative overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Check className="w-24 h-24 text-blue-500" />
              </div>
              <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
              <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2 relative z-10">
                <Check className="w-5 h-5" /> Automated Governance
              </h3>
              <ul className="space-y-4 relative z-10">
                {[
                  "Instant feedback on every commit",
                  "Standardized, objective scoring",
                  "100% coverage of known attack vectors",
                  "Deploy with confidence, daily",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white">
                    <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section id="features" className="py-32 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-bold text-purple-300 mb-6">
              POWERFUL FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Everything you need to <br /> ship safe agents.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Feature 1: Policy Compliance (Large) */}
            <SpotlightCard className="md:col-span-2 glass-card rounded-3xl p-10 relative overflow-hidden group border border-white/10 bg-[#0a0e1a]">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-64 h-64 text-blue-500" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Policy Compliance Engine</h3>
                  <p className="text-gray-400 leading-relaxed max-w-md text-lg">
                    Define strict operational boundaries. Our engine detects unauthorized promises, missed escalations, and regulatory violations in real-time.
                  </p>
                </div>
                <div className="flex gap-2 mt-6">
                  {["GDPR", "HIPAA", "SOC2"].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono font-bold hover:bg-blue-500/20 transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>

            {/* Feature 2: Scenario Testing */}
            <SpotlightCard className="glass-card rounded-3xl p-8 relative overflow-hidden group border border-white/10 bg-[#0a0e1a]">
              <div className="absolute -bottom-4 -right-4 p-4 opacity-5 group-hover:opacity-15 transition-opacity">
                <Target className="w-48 h-48 text-amber-500" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-6 border border-amber-500/30">
                <Target className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Scenario Injection</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Test against adversarial attacks and edge cases using our library of 50+ pre-built scenarios.
              </p>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-3/4 animate-pulse" />
              </div>
            </SpotlightCard>

            {/* Feature 3: Real-Time Metrics */}
            <SpotlightCard className="md:col-span-3 glass-card rounded-3xl p-8 relative overflow-hidden group border border-white/10 bg-[#0a0e1a]">
              <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-15 transition-opacity">
                <BarChart3 className="w-64 h-64 text-green-500" />
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-6 border border-green-500/30">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Live Telemetry</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Instant feedback loops. Monitor hallucination rates, tone consistency, and resolution time across your entire agent fleet.
                  </p>
                </div>
                <div className="flex-1 w-full h-32 flex items-end gap-1 opacity-50">
                  {[40, 70, 50, 90, 60, 80, 40, 60, 75, 45, 85, 55, 65, 35, 95, 25, 55, 75, 60, 40].map((h, i) => (
                    <div key={i} className="flex-1 bg-green-500 rounded-t-sm hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </SpotlightCard>


          </div>
        </div>
      </section>

      <CodeShowcase />

      {/* How It Works */}
      <section id="how-it-works" className="py-32 relative z-10 border-t border-white/5 bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">How It Works</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Three simple steps to evaluate your AI agent.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Select a Scenario", desc: "Choose from pre-built test cases covering authority, policy, and escalation risks." },
              { step: "02", title: "Input Agent Response", desc: "Paste your AI agent's response to the scenario's user message." },
              { step: "03", title: "Get Instant Results", desc: "View pass/fail verdicts with detailed reasoning across multiple compliance dimensions." },
            ].map((item, i) => (
              <div key={item.step} className="relative glass-card p-8 rounded-2xl border-t border-white/10 bg-white/[0.02]">
                <div className="absolute -top-6 -left-4 text-8xl font-black text-white/5 select-none z-0">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="mb-4 inline-flex px-3 py-1 rounded border border-white/10 bg-white/5 text-xs font-mono text-gray-400">
                    Step {i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] to-[#000] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
            Ready to ship <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">safer agents?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
            Start testing your agent's compliance in seconds. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="h-14 px-8 rounded-full bg-white text-black font-bold text-base flex items-center justify-center hover:bg-gray-200 transition-all transform hover:scale-105 shadow-xl"
            >
              Start Evaluating Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
