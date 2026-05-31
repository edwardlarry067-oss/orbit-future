import React from "react";
import { Link } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Satellite, Zap, Globe, Shield } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 text-xs font-bold uppercase tracking-widest text-primary">
            <Satellite className="w-3.5 h-3.5" />
            Now Available Worldwide
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
            Internet<br />
            <span className="text-primary">Anywhere.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            High-speed satellite internet available anywhere on Earth. Starting at $90/mo. No contracts. 15-min setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plans">
              <Button size="lg" className="h-14 px-10 text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(0,212,255,0.2)]">
                <Zap className="w-5 h-5 mr-2" />
                View Plans
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-14 px-10 text-sm font-bold uppercase tracking-widest border-white/20 hover:border-white/40">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-4">
              Why OrbitFuture?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Low-Earth orbit satellites deliver speeds previously impossible from space.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Ultra-Fast Speeds", desc: "Up to 1 Gbps download speeds with low latency for gaming, streaming, and video calls." },
              { icon: Globe, title: "Global Coverage", desc: "Available in 100+ countries. Perfect for rural areas, maritime, and aviation." },
              { icon: Shield, title: "Always Reliable", desc: "99.9% uptime SLA with redundant satellite coverage ensures you stay connected." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-6">
            Ready to Connect?
          </h2>
          <p className="text-gray-400 mb-10">
            Join thousands of customers already connected worldwide.
          </p>
          <Link href="/plans">
            <Button size="lg" className="h-14 px-12 text-sm font-bold uppercase tracking-widest">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
