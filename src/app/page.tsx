"use client";

import { useEffect, useRef, useState, type ReactNode, type ChangeEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Mail, ArrowUpRight, Volume2, VolumeX, Download } from "lucide-react";
import FlyingPhoto from "@/components/FlyingPhoto";

const Hero3D = dynamic(() => import("@/components/Hero3D"), { ssr: false });

const NAV_ITEMS = [
  { id: "sobre", label: "Sobre", n: "01" },
  { id: "stack", label: "Stack", n: "02" },
  { id: "projetos", label: "Projetos", n: "03" },
  { id: "trajetoria", label: "Trajetória", n: "04" },
  { id: "contato", label: "Contato", n: "05" },
];

const projects = [
  {
    name: "oreforge",
    desc: "Plataforma gamificada de gestão e investimentos com mecânicas de RPG desenvolvida com TypeScript e React.",
    tags: ["React", "TypeScript", "Gamification"],
    link: "https://github.com/Paulorgdc/oreforge",
  },
  {
    name: "tripway",
    desc: "Aplicação web progressiva (PWA) de alto desempenho focada no planejamento inteligente e otimização de itinerários.",
    tags: ["PWA", "Mobile-first", "APIs"],
    link: "https://github.com/Paulorgdc/tripway",
  },
  {
    name: "uniforms",
    desc: "Sistema web corporativo para catálogo, dimensionamento e gestão de demandas de vestuário e personalização empresarial.",
    tags: ["Web App", "Catálogo", "Enterprise"],
    link: "https://github.com/Paulorgdc/uniforms",
  },
  {
    name: "wall-e",
    desc: "Solução de automação inteligente voltada para otimização de processos e rotinas de hardware e software.",
    tags: ["Automação", "Python", "Robotics"],
    link: "https://github.com/Paulorgdc/wall-e",
  },
  {
    name: "relivro",
    desc: "Marketplace digital full-stack voltado para circulação e transação de livros acadêmicos e literários.",
    tags: ["Full Stack", "Marketplace", "SQL"],
    link: "https://github.com/Paulorgdc/relivro",
  },
];

const stack = [
  { group: "Frontend", items: ["TypeScript", "React", "Next.js", "Tailwind CSS"] },
  { group: "Backend", items: ["Node.js", "PostgreSQL", "REST APIs"] },
  { group: "IA & Automação", items: ["Python", "LLMs / APIs", "Machine Learning"] },
  { group: "Infra & Cloud", items: ["Supabase", "Cloudflare", "Docker"] },
];

const experience = [
  {
    period: "2025 — 2026",
    role: "Estagiário de Desenvolvimento de Software",
    place: "Ministério Público do Estado de Mato Grosso (MPMT)",
    bullets: [
      "Sustentação, atualização contínua e otimização de portais e sistemas web institucionais.",
      "Consultas estruturadas e rotinas de integridade em bancos de dados relacionais.",
      "Identificação de gargalos de desempenho e suporte na infraestrutura web interna.",
    ],
  },
  {
    period: "2023 — 2025",
    role: "Analista de Suporte e Infraestrutura de TI",
    place: "AI Soluções Tecnológicas",
    bullets: [
      "Gerenciamento e sustentação de ambientes corporativos (Windows e Linux).",
      "Elaboração de documentações técnicas de sistemas, fluxos e manuais operacionais.",
      "Monitoramento e garantia de disponibilidade contínua dos serviços.",
    ],
  },
  {
    period: "Graduação • Previsão 2027",
    role: "Bacharelado em Engenharia de Software",
    place: "UNIVAG — Centro Universitário",
    bullets: [],
  },
];

export default function Home() {
  const [active, setActive] = useState("sobre");
  const [revealed, setRevealed] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const audioRef = useRef<HTMLAudioElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroPhotoSlotRef = useRef<HTMLDivElement>(null);
  const aboutPhotoSlotRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
    } else {
      audio.volume = volume;
      audio.play().catch(() => {});
      setMusicOn(true);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next;
  };

  useEffect(() => {
    const el = heroSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRevealed(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-brand selection:text-black">
      <audio ref={audioRef} src="/audio/lofi.mp3" loop preload="none" />
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <a href="#topo" className="flex items-center gap-2.5 text-sm font-bold tracking-tight">
          <span className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
            <Image src="/logo.png" alt="" fill sizes="32px" className="object-contain" />
          </span>
          paulorgdc<span className="text-brand">.dev</span>
        </a>
        <ul className="hidden md:flex items-center gap-7 text-xs font-mono text-neutral-400">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setActive(item.id)}
                className={`transition hover:text-white ${
                  active === item.id ? "text-white" : ""
                }`}
              >
                <span className="text-brand">{item.n}</span> {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMusic}
              aria-label={musicOn ? "Desligar música" : "Ligar música"}
              aria-pressed={musicOn}
              className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-neutral-300 hover:text-brand hover:border-white/30 transition shrink-0"
            >
              {musicOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Volume da música"
              className={`volume-slider cursor-pointer transition-all duration-300 ${
                musicOn ? "w-16 opacity-100" : "w-0 opacity-0 pointer-events-none"
              }`}
              style={{
                background: `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${
                  volume * 100
                }%, #52525b ${volume * 100}%, #52525b 100%)`,
              }}
            />
          </div>
          <a
            href="#contato"
            className="text-xs font-semibold bg-white text-black px-4 py-2 rounded-full hover:bg-brand transition"
          >
            Contato
          </a>
        </div>
      </nav>

      <Hero3D onExplore={scrollToContent} />

      <FlyingPhoto
        src="/paulo-2.png"
        alt="Paulo Roberto"
        heroSlotRef={heroPhotoSlotRef}
        aboutSlotRef={aboutPhotoSlotRef}
      />

      <div ref={contentRef}>
      {/* Hero */}
      <section
        ref={heroSectionRef}
        id="topo"
        className="relative overflow-hidden min-h-[640px] md:min-h-[92vh] flex flex-col justify-center pt-16"
      >
        <div ref={heroPhotoSlotRef} className="hidden md:block absolute inset-y-0 right-0 w-[46%] lg:w-[42%]" />

        <div className="max-w-5xl mx-auto px-6 md:px-10 w-full relative z-10 py-16 md:py-0">
          <div className="md:max-w-xl">
            <span
              className={`inline-block text-xs font-mono text-brand uppercase tracking-widest transition-all duration-700 ${
                revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Software Engineer
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mt-4 mb-8">
              <RevealWord visible={revealed} delay={100}>Não</RevealWord>{" "}
              <RevealWord visible={revealed} delay={140}>é</RevealWord>{" "}
              <RevealWord visible={revealed} delay={180}>só</RevealWord>{" "}
              <RevealWord visible={revealed} delay={220}>código</RevealWord>{" "}
              <RevealWord visible={revealed} delay={260}>
                <em className="italic text-neutral-500">funcionando</em>.
              </RevealWord>
              <br />
              <RevealWord visible={revealed} delay={340}>É</RevealWord>{" "}
              <RevealWord visible={revealed} delay={380}>sistema</RevealWord>{" "}
              <RevealWord visible={revealed} delay={420}>que</RevealWord>{" "}
              <RevealWord visible={revealed} delay={460}>aguenta</RevealWord>{" "}
              <RevealWord visible={revealed} delay={500}>escala,</RevealWord>{" "}
              <RevealWord visible={revealed} delay={540}>prazo</RevealWord>{" "}
              <RevealWord visible={revealed} delay={580}>e</RevealWord>{" "}
              <RevealWord visible={revealed} delay={620}>produção.</RevealWord>
            </h1>
            <p
              className={`text-neutral-400 text-base md:text-lg leading-relaxed max-w-xl mb-10 transition-all duration-700 ${
                revealed ? "opacity-100 blur-none translate-y-0" : "opacity-0 blur-sm translate-y-6"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              Paulo Roberto, engenheiro de software em formação. Construo produtos full-stack,
              automações com IA e arquiteturas pensadas pra durar — sem enrolação, sem gambiarra.
            </p>
            <div
              className={`flex items-center gap-3 flex-wrap transition-all duration-700 ${
                revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "820ms" }}
            >
              <a
                href="mailto:paulorgdc2005@gmail.com"
                className="inline-flex items-center gap-2 bg-white text-black font-semibold text-sm px-6 py-3 rounded-xl hover:bg-brand transition"
              >
                <Mail className="w-4 h-4" /> Falar comigo
              </a>
              <a
                href="/cv/Curriculo_Paulo_Campos.pdf"
                download
                className="inline-flex items-center gap-2 border border-brand/40 text-brand text-sm px-5 py-3 rounded-xl hover:bg-brand hover:text-black transition"
              >
                <Download className="w-4 h-4" /> Download CV
              </a>
              <a
                href="https://github.com/Paulorgdc"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-white/15 text-neutral-200 text-sm px-5 py-3 rounded-xl hover:border-white/40 transition"
              >
                <GithubIcon className="w-4 h-4" /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/paulo-roberto-griggi-de-campos"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-white/15 text-neutral-200 text-sm px-5 py-3 rounded-xl hover:border-white/40 transition"
              >
                <LinkedinIcon className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="md:hidden relative w-full h-[360px] mt-10">
          <Image
            src="/paulo-2.png"
            alt="Paulo Roberto"
            width={900}
            height={1010}
            priority
            className="absolute inset-0 h-full w-full object-cover object-top select-none pointer-events-none grayscale contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="border-t border-white/10">
        <Reveal className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
          {(visible) => (
            <>
              <SectionHeading n="01" title="Sobre" visible={visible} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <p
                  className={`md:col-span-2 text-neutral-300 text-lg leading-relaxed transition-all duration-700 ${
                    visible ? "opacity-100 blur-none translate-y-0" : "opacity-0 blur-sm translate-y-4"
                  }`}
                  style={{ transitionDelay: "150ms" }}
                >
                  Comecei mexendo em código por curiosidade e transformei isso em profissão.
                  Hoje atuo na sustentação de sistemas institucionais, mas o que mais me move é
                  construir do zero: modelar o banco certo, escrever a API certa e entregar uma
                  interface que não atrapalha quem usa. Gosto de resolver problema de verdade,
                  não só empilhar tecnologia.
                </p>
                <div
                  className={`flex flex-col gap-4 transition-all duration-700 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: "280ms" }}
                >
                  <div
                    ref={aboutPhotoSlotRef}
                    className="hidden md:block w-full aspect-[3/4] rounded-3xl bg-neutral-900/40 border border-white/10"
                  />
                  <div className="md:hidden relative w-full aspect-[3/4] rounded-3xl overflow-hidden border border-white/10">
                    <Image
                      src="/paulo-2.png"
                      alt="Paulo Roberto"
                      fill
                      sizes="100vw"
                      className="object-cover object-top grayscale contrast-125 brightness-90"
                    />
                  </div>
                  <div className="flex flex-col gap-4 text-sm font-mono text-neutral-400">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span>Localização</span>
                      <span className="text-white">Mato Grosso, BR</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span>Foco</span>
                      <span className="text-white">Full-stack & IA</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span>Disponibilidade</span>
                      <span className="text-brand">Aberto a projetos</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Reveal>
      </section>

      {/* Stack */}
      <section id="stack" className="border-t border-white/10">
        <Reveal className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
          {(visible) => (
            <>
              <SectionHeading n="02" title="Stack" visible={visible} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stack.map((group, i) => (
                  <div
                    key={group.group}
                    className={`border border-white/10 rounded-2xl p-6 hover:border-white/25 transition-all duration-700 ease-out origin-left ${
                      visible ? "opacity-100 translate-x-0 rotate-0" : "opacity-0 -translate-x-10 -rotate-2"
                    }`}
                    style={{ transitionDelay: `${150 + i * 90}ms` }}
                  >
                    <h3 className="text-sm font-mono text-brand uppercase tracking-wider mb-4">
                      {group.group}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2.5 py-1 border border-white/15 rounded-md text-neutral-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Reveal>
      </section>

      {/* Projetos */}
      <section id="projetos" className="border-t border-white/10">
        <Reveal className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
          {(visible) => (
            <>
              <SectionHeading n="03" title="Projetos" visible={visible} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((p, i) => (
                  <a
                    key={p.name}
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`group border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-brand/40 hover:-translate-y-1 transition-all duration-500 ease-out ${
                      visible ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 rotate-2"
                    }`}
                    style={{ transitionDelay: `${150 + i * 80}ms` }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-lg group-hover:text-brand transition">
                          {p.name}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                      </div>
                      <p className="text-sm text-neutral-400 leading-relaxed mb-6">{p.desc}</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-mono px-2 py-0.5 border border-white/10 rounded text-neutral-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
                <a
                  href="https://github.com/Paulorgdc?tab=repositories"
                  target="_blank"
                  rel="noreferrer"
                  className={`border border-dashed border-white/15 rounded-2xl p-6 flex flex-col justify-between hover:border-white/30 transition-all duration-500 ease-out ${
                    visible ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 rotate-2"
                  }`}
                  style={{ transitionDelay: `${150 + projects.length * 80}ms` }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-lg">+ Todos os repositórios</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-500" />
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                      Outros experimentos de código, documentações e utilitários no GitHub.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">Acessar perfil completo →</span>
                </a>
              </div>
            </>
          )}
        </Reveal>
      </section>

      {/* Trajetória */}
      <section id="trajetoria" className="border-t border-white/10">
        <Reveal className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
          {(visible) => (
            <>
              <SectionHeading n="04" title="Trajetória" visible={visible} />
              <div className="relative border-l border-white/10 pl-8 space-y-10">
                {experience.map((e, i) => (
                  <div
                    key={e.role}
                    className={`relative transition-all duration-700 ease-out ${
                      visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                    }`}
                    style={{ transitionDelay: `${150 + i * 110}ms` }}
                  >
                    <span
                      className={`absolute -left-[calc(2rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-brand transition-transform duration-500 ${
                        visible ? "scale-100" : "scale-0"
                      }`}
                      style={{
                        transitionDelay: `${150 + i * 110 + 150}ms`,
                        transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)",
                      }}
                    />
                    <div className="text-xs font-mono text-brand mb-1">{e.period}</div>
                    <h3 className="text-lg font-semibold">{e.role}</h3>
                    <div className="text-sm text-neutral-400 mb-3">{e.place}</div>
                    {e.bullets.length > 0 && (
                      <ul className="text-sm text-neutral-400 space-y-1.5 list-disc list-inside">
                        {e.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </Reveal>
      </section>

      {/* Contato */}
      <section id="contato" className="border-t border-white/10">
        <Reveal className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24 text-center">
          {(visible) => (
            <>
              <SectionHeading n="05" title="Contato" center visible={visible} />
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 max-w-2xl mx-auto">
                <RevealWord visible={visible} delay={80}>Tem</RevealWord>{" "}
                <RevealWord visible={visible} delay={130}>um</RevealWord>{" "}
                <RevealWord visible={visible} delay={180}>projeto</RevealWord>{" "}
                <RevealWord visible={visible} delay={230}>ou</RevealWord>{" "}
                <RevealWord visible={visible} delay={280}>vaga</RevealWord>{" "}
                <RevealWord visible={visible} delay={330}>em</RevealWord>{" "}
                <RevealWord visible={visible} delay={380}>mente?</RevealWord>
              </h2>
              <p
                className={`text-neutral-400 max-w-md mx-auto mb-10 text-sm leading-relaxed transition-all duration-500 ${
                  visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                style={{ transitionDelay: "460ms", transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)" }}
              >
                Me chama por e-mail ou LinkedIn. Respondo rápido.
              </p>
              <div
                className={`flex items-center justify-center gap-3 flex-wrap transition-all duration-500 ${
                  visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                style={{ transitionDelay: "540ms", transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)" }}
              >
                <a
                  href="mailto:paulorgdc2005@gmail.com"
                  className="inline-flex items-center gap-2 bg-white text-black font-semibold text-sm px-8 py-3.5 rounded-xl hover:bg-brand transition"
                >
                  <Mail className="w-4 h-4" /> paulorgdc2005@gmail.com
                </a>
              </div>
            </>
          )}
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>Paulo Roberto Griggi de Campos &copy; 2026</div>
          <div className="flex gap-4">
            <a href="https://github.com/Paulorgdc" target="_blank" rel="noreferrer" className="hover:text-neutral-300 transition">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/paulo-roberto-griggi-de-campos" target="_blank" rel="noreferrer" className="hover:text-neutral-300 transition">
              LinkedIn
            </a>
            <a href="mailto:paulorgdc2005@gmail.com" className="hover:text-neutral-300 transition">
              E-mail
            </a>
          </div>
        </div>
      </footer>
      </div>
    </main>
  );
}

function RevealWord({
  children,
  visible,
  delay = 0,
}: {
  children: ReactNode;
  visible: boolean;
  delay?: number;
}) {
  return (
    <span className="inline-block overflow-hidden pb-1 -mb-1 align-bottom">
      <span
        className="inline-block transition-transform duration-700"
        style={{
          transitionDelay: `${delay}ms`,
          transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
          transform: visible ? "translateY(0%)" : "translateY(115%)",
        }}
      >
        {children}
      </span>
    </span>
  );
}

function Reveal({
  children,
  className = "",
}: {
  children: (visible: boolean) => ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children(visible)}
    </div>
  );
}

function SectionHeading({
  n,
  title,
  center,
  visible,
}: {
  n: string;
  title: string;
  center?: boolean;
  visible: boolean;
}) {
  const ease = "cubic-bezier(.16,1,.3,1)";
  return (
    <div className={`mb-10 flex items-baseline gap-3 ${center ? "justify-center" : ""}`}>
      <span className="overflow-hidden">
        <span
          className={`block text-sm font-mono text-brand transition-transform duration-700 ${
            visible ? "translate-y-0" : "translate-y-[120%]"
          }`}
          style={{ transitionTimingFunction: ease }}
        >
          {n}
        </span>
      </span>
      <h2 className="text-3xl font-bold tracking-tight overflow-hidden">
        <span
          className={`block transition-transform duration-700 ${
            visible ? "translate-y-0" : "translate-y-[120%]"
          }`}
          style={{ transitionTimingFunction: ease, transitionDelay: "70ms" }}
        >
          {title}
        </span>
      </h2>
    </div>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}
