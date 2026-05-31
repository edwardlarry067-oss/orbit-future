import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Satellite, Shield, Zap, Users, Award } from "lucide-react";

export default function About() {
  return (
    <MainLayout>
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.06)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 text-xs font-bold uppercase tracking-widest text-primary">
              <Satellite className="w-3.5 h-3.5" />
              About OrbitFuture
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
              Connecting the<br /><span className="text-primary">Unconnected</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              OrbitFuture is a global satellite internet provider delivering high-speed connectivity to homes, businesses, vessels, and aircraft anywhere on Earth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { icon: Users, stat: "4M+", label: "Active Subscribers" },
              { icon: Globe, stat: "100+", label: "Countries Served" },
              { icon: Zap, stat: "99.9%", label: "Uptime SLA" },
            ].map(({ icon: Icon, stat, label }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/30 transition-colors">
                <Icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <div className="text-4xl font-black text-white mb-2">{stat}</div>
                <div className="text-gray-400 text-sm uppercase tracking-widest font-bold">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-6">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We believe high-speed internet is a basic utility — not a luxury. Our low-Earth orbit satellite constellation delivers broadband internet to places where traditional infrastructure cannot reach.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Whether you're in a rural area, on a vessel crossing oceans, or flying at 35,000 feet, OrbitFuture keeps you connected with speeds up to 1 Gbps and latency as low as 20ms.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-6">Why Choose Us</h2>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "Ultra-fast speeds up to 1 Gbps with low latency" },
                  { icon: Globe, text: "Available in 100+ countries with no coverage gaps" },
                  { icon: Shield, text: "Enterprise-grade security and 99.9% uptime SLA" },
                  { icon: Award, text: "No contracts — cancel anytime, no questions asked" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center bg-card border border-border rounded-2xl p-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Ready to Get Connected?</h2>
            <p className="text-gray-400 mb-8">Join millions of customers worldwide. Setup takes just 15 minutes.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/plans">
                <Button size="lg" className="h-12 px-8 text-sm font-bold uppercase tracking-widest">
                  Order Starlink Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-12 px-8 text-sm font-bold uppercase tracking-widest border-white/20">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
