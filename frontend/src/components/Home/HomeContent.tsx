import { Link } from "react-router-dom";
import { Terminal, Cpu, Users, Zap } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface HomeContentProps {
  data?: {
    user?: User;
  } | null;
}

const HomeContent = ({ data }: HomeContentProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-32 pb-20 px-4 max-[600px]:pt-20">
      
      {/* Hero Section */}
      <div className="text-center max-w-5xl mx-auto mb-24 relative z-10 glass-panel p-12 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]"></span>
          SYS.ONLINE — v1.0.0
        </div>
        
        <h1 className="text-7xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-[var(--text-primary)]">
          <span className="block text-[var(--text-secondary)] font-mono text-3xl md:text-4xl mb-4 font-normal tracking-normal">{"> "}INITIALIZE</span>
          YOUR BEST WORK <br/>
          <span className="gradient-text glow-shadow inline-block mt-2">TOGETHER.</span>
        </h1>

        <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          The ultimate real-time collaborative development environment. 
          Engineered for teams that demand absolute performance and zero latency.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to={data?.user ? "/start" : "/signin"}
            className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white 
                      bg-primary hover:bg-[var(--accent-hover)] hover-scale
                      rounded-xl shadow-lg shadow-[var(--hive-purple)]/30
                      transition-all duration-500 ease-out gap-3 w-full sm:w-auto"
          >
            Deploy Environment
            <Terminal className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </Link>
          <div className="font-mono text-sm text-[var(--text-secondary)] flex items-center gap-2 bg-[var(--surface)] px-6 py-4 rounded-xl border border-[var(--border)]">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-[var(--text-primary)] font-semibold">Latency:</span> 12ms ping
          </div>
        </div>
      </div>

      {/* Feature Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full z-10 relative">
        {/* Core Pillar 1 */}
        <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-500 group">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">Zero-Latency Sync</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed font-light">
            Operational telemetry synced in real-time. Keystroke-level updates utilizing an optimized WebSocket multiplexing architecture.
          </p>
        </div>

        {/* Core Pillar 2 */}
        <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-500 group">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Cpu className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">AI Augmented</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed font-light">
            Neural predictive completion integrated directly into the buffer. Your logic loop accelerated by advanced language models.
          </p>
        </div>

        {/* Core Pillar 3 */}
        <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-500 group">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">Hivemind Collab</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed font-light">
            Peer-to-peer workspace sharing. Cursor tracking and live voice channels embedded seamlessly in the editor matrix.
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default HomeContent;
