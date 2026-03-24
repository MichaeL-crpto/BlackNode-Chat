import Link from "next/link"
import { ArrowRight, Shield } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type NavItem = {
  href: string
  label: string
}

type Metric = {
  value: string
  label: string
}

type ShellProps = {
  eyebrow: string
  title: string
  highlight: string
  description: string
  chips: string[]
  metrics: Metric[]
  navItems?: NavItem[]
  children: React.ReactNode
  sidePanel: React.ReactNode
}

const defaultNavItems: NavItem[] = [
  { href: "/main", label: "Home" },
  { href: "/features/authentication", label: "Authentication" },
  { href: "/features/groups", label: "Groups" },
  { href: "/features/messaging", label: "Messaging" },
  { href: "/features/security", label: "Security" },
  { href: "/features/settings", label: "Settings" },
]

export function BlackNodeFeatureShell({
  eyebrow,
  title,
  highlight,
  description,
  chips,
  metrics,
  navItems = defaultNavItems,
  children,
  sidePanel,
}: ShellProps) {
  return (
    <main className="dark relative min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <CyberBackdrop />

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
                <p className="text-sm text-slate-400">Cybersecurity Operations Interface</p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-5 text-sm text-slate-300">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/15 bg-transparent px-5 text-slate-100 hover:bg-white/5 hover:text-white"
              >
                <Link href="/features">Feature Index</Link>
              </Button>
              <Button
                asChild
                className="rounded-full border border-emerald-300/20 bg-emerald-500 px-5 text-slate-950 shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-emerald-400"
              >
                <Link href="/dashboard">
                  Open Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="grid items-center gap-10 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              {eyebrow}
            </div>

            <h1 className="font-heading text-5xl font-semibold leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {title}
              <span className="mt-3 block bg-[linear-gradient(90deg,#ffffff_0%,#86efac_55%,#67e8f9_100%)] bg-clip-text text-transparent">
                {highlight}
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">{description}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 backdrop-blur"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl"
                >
                  <p className="font-heading text-3xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-[2.5rem] bg-emerald-400/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_80px_rgba(2,6,23,0.65)] backdrop-blur-2xl">
              {sidePanel}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">{children}</section>
      </div>
    </main>
  )
}

export function FeaturePanel({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string
  description: string
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-content-center rounded-2xl bg-emerald-400/10 text-emerald-300 shadow-[0_0_20px_rgba(34,197,94,0.12)]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">{description}</p>
        </div>
      </div>
      {children}
    </article>
  )
}

export function StatusPill({
  children,
  tone = "green",
}: {
  children: React.ReactNode
  tone?: "green" | "cyan" | "amber" | "slate"
}) {
  const toneClasses = {
    green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    amber: "border-amber-300/20 bg-amber-300/10 text-amber-200",
    slate: "border-white/10 bg-white/[0.05] text-slate-200",
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${toneClasses[tone]}`}
    >
      <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_14px_currentColor]" />
      {children}
    </span>
  )
}

function CyberBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,197,94,0.16),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(14,165,233,0.12),transparent_26%),linear-gradient(180deg,#020617_0%,#04111f_60%,#020617_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[linear-gradient(90deg,transparent_0,rgba(34,197,94,0.08)_1px,transparent_1px)] bg-[length:130px_130px] opacity-20" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[length:100%_130px] opacity-15" />
      <div className="absolute left-[10%] top-[18%] h-2 w-2 rounded-full bg-emerald-400/60 blur-[1px]" />
      <div className="absolute right-[18%] top-[28%] h-2 w-2 rounded-full bg-cyan-400/50 blur-[1px]" />
      <div className="absolute bottom-[22%] left-[24%] h-2 w-2 rounded-full bg-emerald-300/50 blur-[1px]" />
      <div className="absolute bottom-[14%] right-[12%] h-24 w-24 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute left-[18%] top-[30%] h-20 w-20 rounded-full bg-cyan-400/10 blur-3xl" />
    </div>
  )
}
