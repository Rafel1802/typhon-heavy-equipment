import { useEffect, useState } from "react";
import logo from "@/assets/typhon-logo.png";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 14 + 6;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(onDone, 350); }
      setProgress(p);
    }, 90);
    return () => clearInterval(iv);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center overflow-hidden"
         style={{ background: "radial-gradient(1200px 800px at 50% 20%, #0b2a6b 0%, #050a18 55%, #000 100%)" }}>
      {/* animated grid */}
      <div className="absolute inset-0 opacity-20"
           style={{ backgroundImage: "linear-gradient(rgba(10,132,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(10,132,255,.35) 1px,transparent 1px)", backgroundSize: "40px 40px", maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 75%)" }} />
      {/* pulsing halo */}
      <div className="absolute h-[520px] w-[520px] rounded-full blur-3xl animate-pulse"
           style={{ background: "radial-gradient(circle, rgba(10,132,255,.45), transparent 70%)" }} />
      <div className="relative flex flex-col items-center gap-6 px-8 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl blur-2xl bg-primary/60" />
          <img src={logo} width={160} height={160} alt="TYPHON"
               className="relative h-40 w-40 drop-shadow-[0_0_30px_rgba(10,132,255,0.65)] animate-[splash-in_.9s_ease-out]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-white font-black text-4xl tracking-[0.25em]">TYPHON</h1>
          <p className="text-white/60 text-[11px] font-bold tracking-[0.35em] uppercase">
            Heavy Machinery · Built To Last
          </p>
        </div>
        <div className="mt-4 w-56 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-cyan-300 rounded-full transition-all"
               style={{ width: `${progress}%` }} />
        </div>
        <p className="text-white/40 text-[10px] font-mono tracking-widest">
          {progress < 40 ? "INITIALIZING ENGINE…" : progress < 80 ? "LOADING CATALOG…" : "READY"}
        </p>
      </div>
      <div className="absolute bottom-6 text-white/40 text-[10px] tracking-[0.3em] font-bold">
        © TYPHON MACHINERY · DALLAS, TX
      </div>
      <style>{`@keyframes splash-in{0%{transform:scale(.6) rotate(-8deg);opacity:0}60%{transform:scale(1.06) rotate(2deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}`}</style>
    </div>
  );
}
