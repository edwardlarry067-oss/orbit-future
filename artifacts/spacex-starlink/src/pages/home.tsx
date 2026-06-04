import React, { useState } from "react";
import { Link } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Satellite, Zap, Globe, Shield, Lock, HeadphonesIcon, CheckCircle2, Star, ChevronDown, ChevronUp, ArrowRight, Package, Wifi, Award, Clock, Users } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Marcus O.",
    location: "Lagos, Nigeria",
    plan: "Starlink Business",
    rating: 5,
    text: "We run a trading company with 40 staff. Since switching to ORBITFUTURE, our video calls never drop and we process transactions instantly. The ROI has been incredible.",
    avatar: "MO",
  },
  {
    name: "Sarah K.",
    location: "Nairobi, Kenya",
    plan: "Starlink Standard Plus",
    rating: 5,
    text: "I work remotely from a rural area that had zero reliable internet. Setup took 20 minutes. Now I stream 4K and have video meetings all day without issues. Life-changing.",
    avatar: "SK",
  },
  {
    name: "Captain James T.",
    location: "Gulf of Guinea",
    plan: "Starlink Maritime",
    rating: 5,
    text: "We operate a cargo vessel on long routes. ORBITFUTURE keeps our crew connected for crew welfare and our operations team connected for safety communications. Exceptional.",
    avatar: "JT",
  },
  {
    name: "Dr. Amara N.",
    location: "Accra, Ghana",
    plan: "Starlink Standard",
    rating: 5,
    text: "Our clinic is 60km from the city. ORBITFUTURE lets us do telemedicine, send lab results digitally, and keep patient records in the cloud. It has improved patient outcomes.",
    avatar: "AN",
  },
  {
    name: "Felix W.",
    location: "Cape Town, South Africa",
    plan: "Starlink Roam",
    rating: 5,
    text: "I'm a travel content creator. ORBITFUTURE Roam goes everywhere I do. I've uploaded 4K footage from the middle of the Kalahari. Nothing else comes close.",
    avatar: "FW",
  },
  {
    name: "Emma & Tom L.",
    location: "Rural Yorkshire, UK",
    plan: "Starlink Standard",
    rating: 5,
    text: "We tried every rural ISP for years. ORBITFUTURE is the first that actually delivers what's promised. 200Mbps consistently. Our kids can finally game and study online.",
    avatar: "ET",
  },
];

const HOME_FAQS = [
  {
    q: "How quickly can I get connected?",
    a: "Most customers are online within 20 minutes of unboxing. The dish self-aligns automatically — just position it with a clear sky view, plug it in, and you're connected.",
  },
  {
    q: "Is there a long-term contract?",
    a: "No contracts, ever. All plans are month-to-month. Cancel anytime with zero cancellation fees.",
  },
  {
    q: "What speeds can I realistically expect?",
    a: "Residential plans deliver 50–300 Mbps download with 20–40ms latency. Business plans reach 500 Mbps+. Enterprise plans support 1 Gbps+.",
  },
  {
    q: "Do I need a technician to install it?",
    a: "No. The kit is fully plug-and-play with step-by-step instructions. 95% of customers self-install in under 30 minutes.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Visa, Mastercard, Amex via Stripe. Also Orbit Wallet tokens (pre-loaded via Stripe or Flutterwave). No crypto.",
  },
  {
    q: "Is my payment secure?",
    a: "Yes. All payments are processed by Stripe, a PCI-DSS Level 1 certified processor. Your card details are never stored on our servers.",
  },
];

const INCLUDED = [
  { icon: Package, title: "Hardware Kit", desc: "Dish, router, cables, and mounting hardware — everything you need." },
  { icon: Zap, title: "Express Setup Guide", desc: "Step-by-step installation guide with video support." },
  { icon: HeadphonesIcon, title: "Installation Support", desc: "Free call with our team to walk you through setup." },
  { icon: Shield, title: "12-Month Warranty", desc: "Full hardware replacement warranty on all equipment." },
  { icon: Clock, title: "Account Activation", desc: "We activate your service remotely — no waiting." },
  { icon: Award, title: "Priority Support", desc: "24/7 WhatsApp and email support for all subscribers." },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <MainLayout>
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(0,212,255,0.04)_0%,transparent_50%)]" />
        <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 text-xs font-bold uppercase tracking-widest text-primary">
            <Satellite className="w-3.5 h-3.5" />
            Now Available Worldwide · 100+ Countries
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
            Internet<br />
            <span className="text-primary">Anywhere.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Fast satellite internet powered by cutting-edge LEO technology. Professional installation support, secure checkout, and global coverage from a single provider.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/plans">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(0,212,255,0.2)]">
                <Zap className="w-5 h-5 mr-2" />
                Order Starlink Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-sm font-bold uppercase tracking-widest border-white/20 hover:border-white/40">
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {[
              { icon: Shield, label: "Secure Payments" },
              { icon: Lock, label: "SSL Protected" },
              { icon: HeadphonesIcon, label: "24/7 Support" },
              { icon: Globe, label: "Global Coverage" },
              { icon: CheckCircle2, label: "Verified Checkout" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 bg-black border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: "4M+", label: "Subscribers Worldwide" },
              { stat: "100+", label: "Countries Covered" },
              { stat: "1 Gbps", label: "Max Speed" },
              { stat: "99.9%", label: "Uptime SLA" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat}</div>
                <div className="text-gray-500 text-[11px] uppercase tracking-widest font-bold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ORBITFUTURE ── */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 text-xs font-bold uppercase tracking-widest text-primary">
              <Award className="w-3.5 h-3.5" />
              Why Choose ORBITFUTURE
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
              Built for Real Customers.
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              We don't just sell internet. We ensure you get connected, stay connected, and have expert support at every step.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Zap, title: "Ultra-Fast Speeds", desc: "Up to 1 Gbps download with 20–40ms latency. Perfect for gaming, 4K streaming, VoIP, and remote work." },
              { icon: Globe, title: "Truly Global", desc: "Available in 100+ countries across 6 continents. Rural, maritime, aviation — wherever you need connectivity." },
              { icon: Shield, title: "Always Reliable", desc: "99.9% uptime SLA with redundant satellite coverage and automatic failover. When you need it most." },
              { icon: Package, title: "Complete Hardware", desc: "Premium dish, Wi-Fi router, mount, and all cables included. No surprise hardware costs or third-party sourcing." },
              { icon: HeadphonesIcon, title: "Expert Support", desc: "Our team guides you from order to being live online. WhatsApp and email support available 24/7, 365 days." },
              { icon: Clock, title: "15-Minute Setup", desc: "The dish self-aligns. No drilling. No professional installer needed. Most customers are online in under 20 minutes." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.05)]">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-bold uppercase tracking-widest text-white mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-20 md:py-24 bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
              Everything <span className="text-primary">Included.</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Every ORBITFUTURE order comes with hardware, support, and setup assistance. No hidden extras.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INCLUDED.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/plans">
              <Button className="h-12 px-10 text-xs font-bold uppercase tracking-widest">
                <ArrowRight className="w-4 h-4 mr-2" />
                View All Plans & Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 text-xs font-bold uppercase tracking-widest text-primary">
              <Star className="w-3.5 h-3.5" />
              Customer Stories
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From remote homesteads to cargo vessels — real customers, real results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-6 flex flex-col hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-xs font-black text-primary shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">{t.name}</p>
                    <p className="text-gray-600 text-[10px]">{t.location}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-1">{t.plan.replace("Starlink ", "")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COVERAGE SECTION ── */}
      <section className="py-16 bg-black border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 text-xs font-bold uppercase tracking-widest text-primary">
                <Globe className="w-3.5 h-3.5" />
                Global Coverage
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-6">
                If you can see the sky,<br />
                <span className="text-primary">you can connect.</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Our low-Earth orbit satellite network covers 100+ countries. Rural, remote, maritime, or airborne — ORBITFUTURE reaches where fibre and cable cannot.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "North America & Canada",
                  "Europe (all 44 countries)",
                  "Africa (40+ countries)",
                  "Asia-Pacific",
                  "Latin America",
                  "Middle East",
                ].map((region) => (
                  <div key={region} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-gray-300 text-sm">{region}</span>
                  </div>
                ))}
              </div>
              <Link href="/coverage">
                <Button variant="outline" className="h-11 px-8 text-xs font-bold uppercase tracking-widest border-white/20 hover:border-white/40">
                  Check Coverage Map →
                </Button>
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { label: "Countries Served", value: "100+", icon: Globe },
                { label: "Satellites in Orbit", value: "5,000+", icon: Satellite },
                { label: "Avg Latency", value: "25ms", icon: Zap },
                { label: "Uptime SLA", value: "99.9%", icon: Shield },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-card border border-border rounded-xl p-5 text-center hover:border-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-black text-white mb-1">{value}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ PREVIEW ── */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-4">
              Common Questions
            </h2>
            <p className="text-gray-400">Quick answers to what most customers want to know.</p>
          </div>
          <div className="space-y-3 mb-10">
            {HOME_FAQS.map((faq, i) => (
              <div key={i} className="border border-white/8 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/3 transition-colors"
                >
                  <span className="text-white text-sm font-bold pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/faq">
              <Button variant="outline" className="h-11 px-8 text-xs font-bold uppercase tracking-widest border-white/20 hover:border-white/40">
                View All FAQs →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 md:py-24 bg-black">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="bg-card border border-primary/20 rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.06)_0%,transparent_70%)]" />
            <div className="relative z-10">
              <Satellite className="w-10 h-10 text-primary mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">
                Ready to Connect?
              </h2>
              <p className="text-gray-400 mb-10 max-w-md mx-auto">
                Join 4 million+ customers connected worldwide. Setup takes just 15 minutes. No contracts. Cancel anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/plans">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-12 text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(0,212,255,0.2)]">
                    <Zap className="w-5 h-5 mr-2" />
                    Order Now — Starting $90/mo
                  </Button>
                </Link>
                <Link href="/support">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-12 text-sm font-bold uppercase tracking-widest border-white/20">
                    <HeadphonesIcon className="w-5 h-5 mr-2" />
                    Talk to Support
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                {["No Contracts", "Cancel Anytime", "24/7 Support", "Secure Checkout"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-gray-500 font-bold">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
