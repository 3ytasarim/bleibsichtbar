import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Users, CalendarDays, Target, ImageIcon } from "lucide-react";

/* ─── Galaxy background ─── */
function GalaxyCanvas() {
  const starsRef = useRef<HTMLCanvasElement>(null);
  const mwRef    = useRef<HTMLCanvasElement>(null);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const sc = starsRef.current;
    const mc = mwRef.current;
    if (!sc || !mc) return;
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth, H = window.innerHeight;
    sc.width = W*dpr; sc.height = H*dpr;
    mc.width = W*dpr; mc.height = H*dpr;
    sc.style.width = `${W}px`; sc.style.height = `${H}px`;
    mc.style.width = `${W}px`; mc.style.height = `${H}px`;
    const ctx = sc.getContext("2d")!;
    const ctxMw = mc.getContext("2d")!;
    ctx.scale(dpr,dpr); ctxMw.scale(dpr,dpr);
    const sNumber=600,sSize=0.3,sSizeR=0.6,sAlphaR=0.5;
    const shootingStarDensity=0.009,shootingStarBaseXspeed=8,shootingStarBaseYspeed=5;
    const shootingStarBaseLifespan=90;
    const shootingStarsColors=["#a1ffba","#a1d2ff","#fffaa1","#ffa1a1"];
    const mwStarCount=80000;
    const randomArrayLength=1000,hueArrayLength=1000;
    const randomArray: number[]=Array.from({length:randomArrayLength},()=>Math.random());
    const hueArray: number[]=Array.from({length:hueArrayLength},()=>{let h=Math.floor(Math.random()*160);if(h>60)h+=110;return h;});
    let randomArrayIterator=0;
    class Star {
      x:number;y:number;size:number;alpha:number;baseHue:number;baseHueProportion:number;
      randomIndexa:number;randomIndexh:number;randomValue:number;color="";
      constructor(x:number,y:number,size:number){this.x=x;this.y=y;this.size=size;this.alpha=size/(sSize+sSizeR);this.baseHue=hueArray[Math.floor(Math.random()*hueArrayLength)];this.baseHueProportion=Math.random();this.randomIndexa=Math.floor(Math.random()*randomArrayLength);this.randomIndexh=this.randomIndexa;this.randomValue=randomArray[this.randomIndexa];}
      draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2,false);const rAlpha=Math.min(1,Math.max(0,this.alpha+(this.randomValue-0.5)*sAlphaR));const rHue=randomArray[this.randomIndexh]>this.baseHueProportion?hueArray[this.randomIndexa]:this.baseHue;this.color=`hsla(${rHue},100%,85%,${rAlpha})`;ctx.fillStyle=this.color;ctx.fill();}
      update(){this.randomIndexh=this.randomIndexa;this.randomIndexa=this.randomIndexa>=999?0:this.randomIndexa+1;this.randomValue=randomArray[this.randomIndexa];this.draw();}
    }
    class ShootingStar {
      x:number;y:number;speedX:number;speedY:number;framesLeft:number;color:string;
      constructor(x:number,y:number,speedX:number,speedY:number,color:string){this.x=x;this.y=y;this.speedX=speedX;this.speedY=speedY;this.framesLeft=shootingStarBaseLifespan+Math.random()*60;this.color=color;}
      goingOut(){return this.framesLeft<=0||this.x<0||this.x>W||this.y>H;}
      update(){this.framesLeft--;const len=12*(this.framesLeft/shootingStarBaseLifespan);ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x-this.speedX*len/4,this.y-this.speedY*len/4);ctx.strokeStyle=this.color;ctx.lineWidth=0.8;ctx.globalAlpha=this.framesLeft/shootingStarBaseLifespan;ctx.stroke();ctx.globalAlpha=1;this.x+=this.speedX;this.y+=this.speedY;}
    }
    const StarsArray:Star[]=[];
    for(let i=0;i<sNumber;i++)StarsArray.push(new Star(Math.random()*W,Math.random()*H,sSize+Math.random()*sSizeR));
    const ShootingStarsArray:ShootingStar[]=[];
    const mwCX=W*0.5,mwCY=H*0.6;
    ctxMw.save();ctxMw.translate(mwCX,mwCY);ctxMw.rotate(0.6);
    for(let i=0;i<mwStarCount;i++){const rx=(Math.random()-0.5)*W*2.5,ry=(Math.random()-0.5)*H*0.4;const hue=hueArray[Math.floor(Math.random()*hueArrayLength)];const isW=Math.random()<0.58;ctxMw.beginPath();ctxMw.arc(rx,ry,Math.random()*0.5,0,Math.PI*2);ctxMw.fillStyle=isW?`rgba(255,255,255,${Math.random()*0.4})`:`hsla(${hue},80%,80%,${Math.random()*0.3})`;ctxMw.fill();}
    ctxMw.restore();
    let running=true;
    function animate(){if(!running)return;rafRef.current=requestAnimationFrame(animate);ctx.clearRect(0,0,W,H);for(const s of StarsArray)s.update();if(randomArray[randomArrayIterator]<shootingStarDensity){const px=Math.floor(Math.random()*W),py=Math.floor(Math.random()*H*0.4),sx=(Math.random()-0.5)*shootingStarBaseXspeed,sy=Math.random()*shootingStarBaseYspeed+1,cl=shootingStarsColors[Math.floor(Math.random()*shootingStarsColors.length)];ShootingStarsArray.push(new ShootingStar(px,py,sx,sy,cl));}for(let i=ShootingStarsArray.length-1;i>=0;i--){if(ShootingStarsArray[i].goingOut())ShootingStarsArray.splice(i,1);else ShootingStarsArray[i].update();}randomArrayIterator=(randomArrayIterator+1)%randomArrayLength;}
    animate();
    return ()=>{running=false;cancelAnimationFrame(rafRef.current);};
  }, []);

  return (
    <div style={{position:"fixed",inset:0,zIndex:0,background:"radial-gradient(ellipse at 50% 55%, #100826 0%, #060212 100%)"}}>
      <canvas ref={mwRef}    style={{position:"absolute",top:0,left:0,zIndex:1}} />
      <canvas ref={starsRef} style={{position:"absolute",top:0,left:0,zIndex:2}} />
    </div>
  );
}

/* ─── Reusable form components ─── */
function OptionBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClick}
      className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl border text-left text-sm font-medium transition-all duration-200 ${
        active ? "bg-white/10 border-white/40 text-white" : "bg-transparent border-white/15 text-white/70 hover:border-white/28 hover:bg-white/5"
      }`}>
      <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${active ? "border-white/80" : "border-white/30"}`}>
        {active && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
      </span>
      <span>{label}</span>
    </motion.button>
  );
}

function OptionGrid({ options, selected, onChange, multi }: {
  options: string[]; selected: string | string[]; onChange: (v: string) => void; multi?: boolean;
}) {
  const isSelected = (opt: string) => multi ? (selected as string[]).includes(opt) : selected === opt;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map(opt => (
        <OptionBtn key={opt} label={opt} active={isSelected(opt)} onClick={() => onChange(opt)} />
      ))}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, required, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string;
}) {
  const handleInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    if (el.validity.valueMissing) {
      el.setCustomValidity("Dieses Feld ist erforderlich.");
    } else if (el.validity.typeMismatch) {
      el.setCustomValidity("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    } else {
      el.setCustomValidity("Bitte füllen Sie dieses Feld korrekt aus.");
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity("");
    onChange(e.target.value);
  };
  return (
    <input type={type} value={value} required={required}
      onChange={handleChange} onInvalid={handleInvalid} placeholder={placeholder}
      className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/35 focus:bg-white/8 transition-all duration-200"
    />
  );
}

function QLabel({ n, text, required }: { n: number; text: string; required?: boolean }) {
  return (
    <div className="flex items-start gap-2 mb-3">
      <span className="text-white/30 text-xs font-bold mt-0.5 w-5 flex-shrink-0">{n}.</span>
      <p className="text-white/85 text-sm font-semibold leading-snug">
        {text}{required && <span className="text-orange-400 ml-1">*</span>}
      </p>
    </div>
  );
}

function Section({ icon: Icon, color, title, subtitle, children }: {
  icon: React.ElementType; color: string; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      className="border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md"
      style={{ background: "rgba(8,18,38,0.82)" }}>
      <div className="flex items-center gap-3 mb-7">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
          <p className="text-white/40 text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-7">{children}</div>
    </motion.div>
  );
}

/* ─── Main component ─── */
export default function OnboardingSocialMedia() {
  const NUR_REELS = "Nur Reels, Anzahl angeben:";

  const [f, setF] = useState({
    email: "",
    companyName: "",
    agenturErfahrung: "",
    inhalte: [] as string[],
    inhalteReelsAnzahl: "",
    ziele: [] as string[],
    material: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string, v: unknown) => setF(p => ({ ...p, [k]: v }));
  const toggleMulti = (k: string, v: string) => {
    const arr = (f as Record<string, string[]>)[k];
    set(k, arr.includes(v) ? arr.filter((x: string) => x !== v) : [...arr, v]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: f.companyName || "Unbekannt",
          ansprechpartner: f.email || null,
          data: { ...f, formType: "Social Media Bedarfsanalyse" },
        }),
      });
    } catch (_) {}
    setTimeout(() => { videoRef.current?.play(); }, 1200);
  };

  const agenturOptions = ["Ja", "Nein"];

  const inhalteOptions = [
    "1–2 Beiträge & 1–2 Reels",
    "3–4 Beiträge & 3–4 Reels",
    NUR_REELS,
    "1–4 Storys",
    "4–7 Storys",
  ];

  const zieleOptions = [
    "Mehr Reichweite",
    "Mehr Kundenanfragen",
    "Mehr Reservierungen / Besuche",
    "Professioneller Auftritt",
    "Mitarbeiter gewinnen",
  ];

  const materialOptions = [
    "Ja, ausreichend vorhanden",
    "Teilweise vorhanden",
    "Nein, müsste erstellt werden",
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GalaxyCanvas />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-orange-400 text-sm font-semibold tracking-wide">📱 BleibSichtbar – Social Media Bedarfsanalyse</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Social Media<br /><span className="text-orange-400">Bedarfsanalyse</span>
          </h1>
          <div className="inline-block rounded-2xl px-6 py-3" style={{ background: "rgba(6,13,31,0.65)", backdropFilter: "blur(8px)" }}>
            <p className="text-white/80 text-base max-w-xl mx-auto leading-relaxed">
              In wenigen Minuten finden wir heraus, wie wir Ihre Social-Media-Präsenz am besten aufbauen können.
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit} className="space-y-6">

              {/* E-Mail */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md"
                style={{ background: "rgba(8,18,38,0.82)" }}>
                <p className="text-white/85 text-sm font-semibold leading-snug mb-3">
                  E-Mail-Adresse<span className="text-orange-400 ml-1">*</span>
                </p>
                <TextInput value={f.email} onChange={v => set("email", v)} placeholder="ihre@email.de" required type="email" />
              </motion.div>

              {/* Unternehmensname */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md"
                style={{ background: "rgba(8,18,38,0.82)" }}>
                <p className="text-white/85 text-sm font-semibold leading-snug mb-3">
                  Unternehmensname<span className="text-orange-400 ml-1">*</span>
                </p>
                <TextInput value={f.companyName} onChange={v => set("companyName", v)} placeholder="Ihr Unternehmensname ..." required />
              </motion.div>

              {/* Agentur-Erfahrung */}
              <Section icon={Users} color="bg-purple-500/20 text-purple-300" title="Erfahrung" subtitle="Bisherige Social-Media-Betreuung">
                <div>
                  <QLabel n={1} text="Haben Sie bereits mit einer Social-Media-Agentur zusammengearbeitet?" required />
                  <OptionGrid options={agenturOptions} selected={f.agenturErfahrung} onChange={v => set("agenturErfahrung", v === f.agenturErfahrung ? "" : v)} />
                </div>
              </Section>

              {/* Inhalte */}
              <Section icon={CalendarDays} color="bg-blue-500/20 text-blue-300" title="Inhalte" subtitle="Gewünschtes Posting-Volumen pro Woche">
                <div>
                  <QLabel n={2} text="Welche Inhalte wünschen Sie sich pro Woche?" required />
                  <OptionGrid options={inhalteOptions} selected={f.inhalte} onChange={v => toggleMulti("inhalte", v)} multi />
                  {f.inhalte.includes(NUR_REELS) && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 overflow-hidden">
                      <TextInput
                        value={f.inhalteReelsAnzahl}
                        onChange={v => set("inhalteReelsAnzahl", v)}
                        placeholder="z. B. 5 Reels pro Woche ..."
                      />
                    </motion.div>
                  )}
                </div>
              </Section>

              {/* Ziele */}
              <Section icon={Target} color="bg-orange-500/20 text-orange-300" title="Ziele" subtitle="Was soll Social Media für Sie erreichen?">
                <div>
                  <QLabel n={3} text="Was ist Ihr Hauptziel mit Social Media?" required />
                  <OptionGrid options={zieleOptions} selected={f.ziele} onChange={v => toggleMulti("ziele", v)} multi />
                </div>
              </Section>

              {/* Material */}
              <Section icon={ImageIcon} color="bg-green-500/20 text-green-300" title="Material" subtitle="Vorhandenes Bild- und Videomaterial">
                <div>
                  <QLabel n={4} text="Gibt es bereits vorhandenes Bild- oder Videomaterial?" required />
                  <OptionGrid options={materialOptions} selected={f.material} onChange={v => set("material", v === f.material ? "" : v)} />
                </div>
              </Section>

              {/* Submit */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center pt-4">
                <p className="text-white/35 text-sm mb-6">
                  Mit dem Absenden stimmen Sie unserer{" "}
                  <a href="/datenschutz" className="text-orange-400 hover:underline" target="_blank">Datenschutzerklärung</a> zu.
                </p>
                <motion.button type="submit"
                  whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(255,107,53,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden px-14 py-4 rounded-full font-bold text-white text-lg"
                  style={{ background: "linear-gradient(135deg, #ff6b35 0%, #e8522a 100%)" }}>
                  <motion.span className="absolute inset-0 -translate-x-full skew-x-12"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.4 }}
                  />
                  <span className="relative">Analyse absenden</span>
                </motion.button>
              </motion.div>

            </motion.form>
          ) : (
            /* Success */
            <motion.div key="thanks" initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }} className="text-center py-12">
              <div className="relative inline-flex items-center justify-center mb-8">
                {[0, 0.6].map(d => (
                  <motion.div key={d} className="absolute w-32 h-32 rounded-full border-2 border-green-400/30"
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: d }} />
                ))}
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </motion.div>
              </div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Vielen Dank!
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                className="text-xl text-white/70 mb-3 max-w-lg mx-auto leading-relaxed">
                Ihre Social-Media-Analyse wurde erfolgreich übermittelt.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="text-white/55 text-base max-w-xl mx-auto leading-relaxed">
                Wir melden uns in Kürze bei Ihnen, um Ihre Social-Media-Strategie gemeinsam zu planen.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
