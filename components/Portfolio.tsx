 "use client";

import {
  ArrowDown,
  ArrowRight,
  Check,
  Code2,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Send,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useState } from "react";
import { projects, skillGroups, learning, socials } from "@/lib/data";
import { useTheme } from "./ThemeProvider";

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 leading-7 light-copy">{text}</p>}
    </div>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { theme, toggle } = useTheme();

  const nav = [
    ["About", "#about"],
    ["Skills", "#skills"],
    ["Projects", "#projects"],
    ["Resume", "#resume"],
    ["Contact", "#contact"],
  ];

  const submitContact = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:ganavi0608@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="container pt-4">
          <nav className="glass flex items-center justify-between rounded-2xl px-4 py-3 shadow-lg shadow-black/5">
            <a href="#home" className="flex items-center gap-2 font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300 text-slate-950">G</span>
              <span>Ganavi<span className="text-cyan-300">.</span></span>
            </a>

            <div className="hidden items-center gap-7 md:flex">
              {nav.map(([label, href]) => (
                <a key={href} href={href} className="text-sm light-copy transition hover:text-[var(--foreground)]">
                  {label}
                </a>
              ))}
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="light-copy transition hover:text-[var(--foreground)]"
              >
                <Github size={18} />
              </a>
              <button onClick={toggle} aria-label="Toggle theme" className="rounded-lg p-2 light-copy hover:text-[var(--foreground)]">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button onClick={toggle} aria-label="Toggle theme" className="rounded-lg p-2 light-copy">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Open menu"
                className="rounded-lg p-2 light-copy"
              >
                {menuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </nav>

          {menuOpen && (
            <div className="glass mt-2 rounded-2xl p-3 md:hidden">
              {nav.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm hover:bg-white/5"
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative grid-bg min-h-[720px] scroll-mt-0">
        <div className="hero-orb left-[-100px] top-[170px] bg-cyan-300" />
        <div className="hero-orb right-[-100px] top-[250px] bg-violet-400" />

        <div className="container relative flex min-h-[720px] items-center py-32">
          <div className="grid w-full gap-12 lg:grid-cols-[1.3fr_.7fr] lg:items-center">
            <div className="reveal">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-sm text-cyan-200">
                <Sparkles size={15} />
                Open to opportunities
              </div>

              <p className="mb-4 text-lg light-copy">Hi, I&apos;m Ganavi.</p>

              <h1 className="max-w-4xl text-5xl font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                I build <span className="text-gradient">practical digital experiences.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 light-copy">
                Computer Science student and full-stack developer focused on building responsive,
                useful web applications with modern frontend and backend technologies.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  View projects <ArrowRight size={17} />
                </a>
                <a
                  href="#contact"
                  className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition hover:-translate-y-0.5"
                >
                  Let&apos;s connect <Mail size={17} />
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm light-copy">
                <a className="inline-flex items-center gap-2 hover:text-[var(--foreground)]" href={socials.github} target="_blank" rel="noreferrer">
                  <Github size={17} /> GitHub
                </a>
                <a className="inline-flex items-center gap-2 hover:text-[var(--foreground)]" href={socials.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={17} /> LinkedIn
                </a>
                <a className="inline-flex items-center gap-2 hover:text-[var(--foreground)]" href={socials.email}>
                  <Mail size={17} /> Email
                </a>
              </div>
            </div>

            <div className="float hidden lg:block">
              <div className="glass mx-auto max-w-sm rounded-[2rem] p-6 shadow-2xl shadow-cyan-950/10">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-6">
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <p className="text-sm light-copy">Developer profile</p>
                      <p className="mt-1 font-semibold">Ganavi</p>
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-400 text-lg font-black text-slate-950">
                      G
                    </div>
                  </div>
                  <div className="space-y-3">
                    {["Frontend", "Backend", "Database", "UI / UX"].map((item, i) => (
                      <div key={item} className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3">
                        <span className="text-sm">{item}</span>
                        <span className="text-xs text-cyan-300">{["React / Next.js", "Node / Express", "Mongo / Supabase", "Figma"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a href="#about" className="absolute bottom-7 left-1/2 -translate-x-1/2 light-copy" aria-label="Scroll to about">
          <ArrowDown className="animate-bounce" size={20} />
        </a>
      </section>

      {/* About */}
      <section id="about" className="section">
        <div className="container">
          <SectionHeading
            eyebrow="About"
            title="A developer who likes turning ideas into usable products."
            text="I enjoy working across the stack—from designing interfaces and building React components to creating APIs, connecting databases and debugging real application workflows."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="glass card-hover rounded-3xl p-7 lg:col-span-2">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                  <Code2 size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Computer Science & Engineering</h3>
                  <p className="mt-2 leading-7 light-copy">
                    I&apos;m building a strong foundation in software development while exploring full-stack
                    engineering, data science, machine learning and product-oriented design.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Build", "Responsive web applications"],
                  ["Learn", "Modern development workflows"],
                  ["Improve", "UX, architecture & problem solving"],
                ].map(([a, b]) => (
                  <div key={a} className="rounded-2xl border border-[var(--border)] p-4">
                    <p className="font-semibold text-cyan-300">{a}</p>
                    <p className="mt-1 text-sm leading-6 light-copy">{b}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass card-hover rounded-3xl p-7">
              <p className="text-sm uppercase tracking-widest text-violet-300">Currently learning</p>
              <ul className="mt-5 space-y-4">
                {learning.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-300/10 text-cyan-300">
                      <Check size={13} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section border-y border-[var(--border)] bg-black/[0.04]">
        <div className="container">
          <SectionHeading
            eyebrow="Skills"
            title="Tools I use to build from idea to deployment."
            text="A practical stack covering frontend interfaces, backend APIs, databases and the tools that keep development organized."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.title} className="glass card-hover rounded-3xl p-7">
                <h3 className="text-lg font-bold">{group.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full border border-[var(--border)] bg-white/[0.03] px-3 py-1.5 text-sm light-copy">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Selected work"
            title="Projects that show how I solve problems."
            text="A mix of full-stack applications, real-time workflows and practical product ideas."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className={`glass card-hover rounded-3xl p-7 ${index === 0 ? "lg:col-span-2" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    {project.featured && (
                      <span className="mb-3 inline-flex rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        Featured project
                      </span>
                    )}
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                    <p className="mt-1 text-sm text-violet-300">{project.type}</p>
                  </div>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title} on GitHub`}
                    className="rounded-xl border border-[var(--border)] p-2.5 light-copy hover:text-[var(--foreground)]"
                  >
                    <Github size={18} />
                  </a>
                </div>

                <p className="mt-5 max-w-3xl leading-7 light-copy">{project.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span key={tech} className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs light-copy">
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300"
                >
                  View repository <ExternalLink size={15} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Resume */}
      <section id="resume" className="section border-y border-[var(--border)] bg-black/[0.04]">
        <div className="container">
          <SectionHeading
            eyebrow="Resume"
            title="A quick snapshot of my professional profile."
            text="Use the resume alongside this portfolio for a concise view of my education, technical skills and projects."
          />

          <div className="glass rounded-3xl p-7 sm:p-9">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-2xl font-bold">Ganavi</p>
                <p className="mt-2 light-copy">Computer Science & Engineering · Full-Stack Development</p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm light-copy">
                  <span>React / Next.js</span>
                  <span>Node.js / Express</span>
                  <span>MongoDB / Supabase</span>
                  <span>Git / GitHub</span>
                </div>
              </div>
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950"
              >
                Download resume <Download size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <SectionHeading
                eyebrow="Contact"
                title="Have an idea or an opportunity?"
                text="I&apos;d be happy to connect about internships, projects, collaboration or development opportunities."
              />
              <div className="space-y-4">
                <a href={socials.email} className="glass flex items-center gap-4 rounded-2xl p-4 hover:border-cyan-300/30">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300"><Mail size={20} /></span>
                  <div><p className="text-sm light-copy">Email</p><p className="font-medium">ganavi0608@gmail.com</p></div>
                </a>
                <a href={socials.github} target="_blank" rel="noreferrer" className="glass flex items-center gap-4 rounded-2xl p-4 hover:border-cyan-300/30">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300"><Github size={20} /></span>
                  <div><p className="text-sm light-copy">GitHub</p><p className="font-medium">Ganavi0608</p></div>
                </a>
                <a href={socials.linkedin} target="_blank" rel="noreferrer" className="glass flex items-center gap-4 rounded-2xl p-4 hover:border-cyan-300/30">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300"><Linkedin size={20} /></span>
                  <div><p className="text-sm light-copy">LinkedIn</p><p className="font-medium">Connect with me</p></div>
                </a>
              </div>
            </div>

            <form onSubmit={submitContact} className="glass rounded-3xl p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-2 block light-copy">Name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl px-4 py-3"
                    placeholder="Your name"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-2 block light-copy">Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl px-4 py-3"
                    placeholder="you@example.com"
                  />
                </label>
              </div>
              <label className="mt-5 block text-sm">
                <span className="mb-2 block light-copy">Message</span>
                <textarea
                  required
                  rows={7}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full resize-y rounded-xl px-4 py-3"
                  placeholder="Tell me about the opportunity or project..."
                />
              </label>
              <button
                type="submit"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950"
              >
                Send message <Send size={17} />
              </button>
              <p className="mt-3 text-center text-xs light-copy">
                The form opens your default email app with the message prepared.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="container flex flex-col gap-4 text-sm light-copy sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Ganavi. Built with Next.js & React.</p>
          <div className="flex items-center gap-5">
            <a href="#home" className="hover:text-[var(--foreground)]">Back to top</a>
            <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
            <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}