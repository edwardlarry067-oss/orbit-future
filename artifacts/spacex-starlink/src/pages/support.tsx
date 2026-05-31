import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Clock, Phone, BookOpen, Zap, Shield, Wifi } from "lucide-react";

const WHATSAPP_NUMBER = "16206123994";

const TOPICS = [
  { icon: Zap, title: "Getting Started", desc: "Setup guides, unboxing, and first-time configuration.", href: "/faq" },
  { icon: Wifi, title: "Connection Issues", desc: "Troubleshoot slow speeds, disconnections, or hardware problems.", href: "/faq" },
  { icon: Shield, title: "Billing & Payments", desc: "Invoices, payment methods, refunds, and subscription changes.", href: "/faq" },
  { icon: BookOpen, title: "Account & Dashboard", desc: "Login issues, profile updates, and subscription management.", href: "/faq" },
];

export default function Support() {
  return (
    <MainLayout>
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-white mb-4">
              Support <span className="text-primary">Center</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              We're here 24/7. Choose how you'd like to reach us.
            </p>
          </div>

          {/* Contact channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I need support with my OrbitFuture service.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border rounded-2xl p-8 hover:border-[#25D366]/40 transition-colors group text-center"
            >
              <MessageCircle className="w-10 h-10 text-[#25D366] mx-auto mb-4" />
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">WhatsApp</h3>
              <p className="text-gray-500 text-xs mb-4">Fastest response — typically under 5 minutes</p>
              <span className="text-[#25D366] text-xs font-bold uppercase tracking-widest group-hover:underline">Start Chat →</span>
            </a>

            <a
              href="mailto:managementstarlinkhq@gmail.com?subject=OrbitFuture%20Support"
              className="bg-card border border-border rounded-2xl p-8 hover:border-primary/40 transition-colors group text-center"
            >
              <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Email</h3>
              <p className="text-gray-500 text-xs mb-4">Detailed inquiries — reply within 2 hours</p>
              <span className="text-primary text-xs font-bold uppercase tracking-widest group-hover:underline">Send Email →</span>
            </a>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <Clock className="w-10 h-10 text-gray-500 mx-auto mb-4" />
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Support Hours</h3>
              <p className="text-gray-500 text-xs mb-1">WhatsApp: 24 / 7</p>
              <p className="text-gray-500 text-xs mb-1">Email: 24 / 7</p>
              <p className="text-gray-500 text-xs">Average response: &lt; 5 min</p>
            </div>
          </div>

          {/* Help topics */}
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {TOPICS.map(({ icon: Icon, title, desc, href }) => (
              <Link key={title} href={href}>
                <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors flex items-start gap-4 cursor-pointer">
                  <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center bg-card border border-border rounded-2xl p-10">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2">Can't find what you need?</h3>
            <p className="text-gray-400 text-sm mb-6">Use our contact form and we'll get back to you right away.</p>
            <Link href="/contact">
              <Button className="h-11 px-8 text-xs font-bold uppercase tracking-widest">Open Contact Form</Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
