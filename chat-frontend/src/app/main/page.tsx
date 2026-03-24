import Link from "next/link"
import {
  ArrowRight,
  FileText,
  Lock,
  Play,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  Users,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Secure Authentication",
    description: "Protected login, JWT session state, and guarded access workflows built with visible trust signals.",
    cta: "Open Auth",
    icon: ShieldCheck,
    href: "/features/authentication",
  },
  {
    title: "Group Control Center",
    description: "Manage public and private rooms with role-aware controls, membership validation, and secure moderation.",
    cta: "View Groups",
    icon: Lock,
    href: "/features/groups",
  },
  {
    title: "End-to-End Encrypted Chat",
    description: "Follow the full secure messaging pipeline with locked messages, file sharing previews, and client-side decryption cues.",
    cta: "Open Chat",
    icon: Zap,
    href: "/features/messaging",
  },
]

const stats = [
  { value: "10,000+", label: "Active Users" },
  { value: "5,000+", label: "Groups Created" },
  { value: "1M+", label: "Messages Secured" },
  { value: "99.9%", label: "Uptime Guarantee" },
]

const securityItems = [
  "End-to-End Encryption",
  "Secure Socket (SSL)",
  "Data Privacy",
]

export default function MainPage() {
  return (
    <main className="dark relative min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,197,94,0.16),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(14,165,233,0.12),transparent_26%),linear-gradient(180deg,#020617_0%,#04111f_60%,#020617_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-[linear-gradient(90deg,transparent_0,rgba(34,197,94,0.08)_1px,transparent_1px)] bg-[length:130px_130px] opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[length:100%_130px] opacity-15" />
        <div className="absolute left-[10%] top-[18%] h-2 w-2 rounded-full bg-emerald-400/60 blur-[1px]" />
        <div className="absolute right-[18%] top-[28%] h-2 w-2 rounded-full bg-cyan-400/50 blur-[1px]" />
        <div className="absolute bottom-[22%] left-[24%] h-2 w-2 rounded-full bg-emerald-300/50 blur-[1px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-8">
        <header className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative grid h-12 w-12 place-content-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_30px_rgba(34,197,94,0.18)]">
                <Shield className="h-6 w-6 text-emerald-400" />
                <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 blur-xl" />
              </div>
              <div>
                <p className="font-heading text-xl font-semibold text-white">BlackNode Chat</p>
                <p className="text-sm text-slate-400">Encrypted Group Messaging</p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-5 text-sm text-slate-300">
              <Link href="#home" className="transition hover:text-white">Home</Link>
              <Link href="#features" className="transition hover:text-white">Features</Link>
              <Link href="#groups" className="transition hover:text-white">Groups</Link>
              <Link href="#security" className="transition hover:text-white">Security</Link>
              <Link href="/groups" className="transition hover:text-white">My Groups</Link>
              <Link href="#about" className="transition hover:text-white">About</Link>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="rounded-full border border-emerald-300/20 bg-emerald-500 px-5 text-slate-950 shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-emerald-400"
              >
                <Link href="/features">Get Started</Link>
              </Button>
            </div>
          </div>
        </header>

        <section
          id="home"
          className="grid items-center gap-10 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-16"
        >
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Futuristic secure messaging
            </div>

            <h1 className="font-heading text-5xl font-semibold leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
              BlackNode Chat
              <span className="mt-3 block bg-[linear-gradient(90deg,#ffffff_0%,#86efac_55%,#67e8f9_100%)] bg-clip-text text-transparent">
                Secure. Private. Untraceable.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Connect securely in public and private groups with real-time messaging and advanced encryption.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {["AES-256 Encryption", "Private Groups", "Real-Time Chat"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 backdrop-blur"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full border border-emerald-300/20 bg-emerald-500 px-8 text-base text-slate-950 shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-emerald-400"
              >
                <Link href="/features">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/15 bg-transparent px-8 text-base text-slate-100 hover:bg-white/5 hover:text-white"
              >
                <Link href="#groups">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            <p className="mt-8 text-sm tracking-wide text-slate-400">
              100% Secure • No Data Leaks • Open Source
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-[2.5rem] bg-emerald-400/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_80px_rgba(2,6,23,0.65)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3">
                <div>
                  <p className="font-semibold text-white">Cyber Security 🔐</p>
                  <p className="text-sm text-slate-400">12 members online</p>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  Encrypted
                </div>
              </div>

              <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/75 p-4">
                <ChatBubble
                  name="Ava"
                  time="09:14"
                  text="Threat report uploaded. Sharing the latest network audit summary now."
                  received
                />
                <ChatBubble
                  name="BlackNode"
                  time="09:15"
                  text="Received. Routing to the private response room with full lock status."
                />

                <div className="ml-auto max-w-sm rounded-3xl border border-emerald-400/15 bg-emerald-400/10 p-4 shadow-[0_0_24px_rgba(34,197,94,0.10)]">
                  <div className="mb-3 flex items-center justify-between text-sm text-emerald-200">
                    <span className="inline-flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Incident-Brief.pdf
                    </span>
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-4 text-sm text-slate-300">
                    PDF attachment preview with secure delivery label.
                  </div>
                  <div className="mt-3 text-right text-xs text-slate-400">09:16</div>
                </div>

                <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="grid h-10 w-10 place-content-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-white">Session is end-to-end encrypted</p>
                      <p className="text-xs text-slate-400">SSL active • Data privacy protected</p>
                    </div>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(34,197,94,0.8)]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.86fr]">
          <div id="features" className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article
                  key={feature.title}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
                >
                  <div className="mb-5 grid h-12 w-12 place-content-center rounded-2xl bg-emerald-400/10 text-emerald-300 shadow-[0_0_20px_rgba(34,197,94,0.12)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-heading text-2xl font-semibold text-white">{feature.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
                  <Link
                    href={feature.href}
                    className="mt-6 inline-flex items-center text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
                  >
                    {feature.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </article>
              )
            })}
          </div>

          <aside
            id="security"
            className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-12 w-12 place-content-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold text-white">Security Status</p>
                <p className="text-sm text-slate-400">Live trust and infrastructure indicators</p>
              </div>
            </div>

            <div className="space-y-4">
              {securityItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4"
                >
                  <span className="text-slate-200">{item}</span>
                  <span className="inline-flex items-center gap-2 text-sm text-emerald-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                    Active
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section
          id="groups"
          className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6"
              >
                <p className="font-heading text-4xl font-semibold text-white">{stat.value}</p>
                <p className="mt-3 text-sm uppercase tracking-[0.24em] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <footer
          id="about"
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-center text-sm text-slate-400 md:flex-row md:text-left"
        >
          <p>Built with love for Privacy &amp; Security</p>
          <p>© 2025 BlackNode Chat</p>
        </footer>
      </div>
    </main>
  )
}

function ChatBubble({
  name,
  text,
  time,
  received = false,
}: {
  name: string
  text: string
  time: string
  received?: boolean
}) {
  return (
    <div className={`flex items-end gap-3 ${received ? "" : "justify-end"}`}>
      {received ? (
        <div className="grid h-10 w-10 shrink-0 place-content-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          <UserCircle2 className="h-5 w-5" />
        </div>
      ) : null}
      <div
        className={`max-w-sm rounded-3xl border p-4 ${
          received
            ? "border-white/10 bg-white/[0.05]"
            : "border-emerald-400/15 bg-emerald-400/10 shadow-[0_0_24px_rgba(34,197,94,0.10)]"
        }`}
      >
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-slate-200">{name}</span>
          <span>{time}</span>
          <Lock className="ml-auto h-3.5 w-3.5 text-emerald-300" />
        </div>
        <p className="text-sm leading-7 text-slate-100">{text}</p>
      </div>
      {!received ? (
        <div className="grid h-10 w-10 shrink-0 place-content-center rounded-2xl bg-emerald-400/10 text-emerald-300">
          <Users className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  )
}
