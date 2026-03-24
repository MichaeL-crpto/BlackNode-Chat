import Link from "next/link"
import {
  ArrowRight,
  Lock,
  MessageSquareLock,
  ShieldCheck,
  Users,
  UserCog,
} from "lucide-react"

import {
  BlackNodeFeatureShell,
  FeaturePanel,
  StatusPill,
} from "@/components/ui/blacknode-feature-shell"

const pages = [
  {
    title: "Secure Authentication",
    href: "/features/authentication",
    icon: Lock,
    description: "Protected login, JWT session state, and lockout telemetry rendered in the same cyber-glass interface.",
  },
  {
    title: "Group Control Center",
    href: "/features/groups",
    icon: Users,
    description: "Manage public and private groups, secure validation rules, and role-based access controls.",
  },
  {
    title: "End-to-End Encrypted Chat",
    href: "/features/messaging",
    icon: MessageSquareLock,
    description: "Visualize encrypted conversations, file exchange, and client-side decryption states.",
  },
  {
    title: "Security Dashboard",
    href: "/features/security",
    icon: ShieldCheck,
    description: "Threat alerts, logging systems, rate limiting, and suspicious activity timelines in one view.",
  },
  {
    title: "User Settings & Privacy",
    href: "/features/settings",
    icon: UserCog,
    description: "Profile controls, encryption key fingerprints, session devices, and privacy toggles.",
  },
]

export default function FeaturesIndexPage() {
  return (
    <BlackNodeFeatureShell
      eyebrow="Feature matrix"
      title="BlackNode Modules"
      highlight="Five Screens. One Design System."
      description="Every feature route maintains identical design system, spacing, colors, and UI components as the main landing page while exposing its backend security concepts directly in the UI."
      chips={["Glassmorphism Layout", "Neon Secure States", "Cyber Network Backdrop"]}
      metrics={[
        { value: "05", label: "Feature Pages" },
        { value: "JWT", label: "Session Model" },
        { value: "AES + RSA", label: "Crypto Stack" },
      ]}
      sidePanel={
        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/75 p-4">
          <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <div>
              <p className="font-semibold text-white">System Blueprint</p>
              <p className="text-sm text-slate-400">All feature pages inherit the landing page visual language.</p>
            </div>
            <StatusPill>Synced</StatusPill>
          </div>
          {pages.map((page, index) => {
            const Icon = page.icon
            return (
              <Link
                key={page.href}
                href={page.href}
                className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-4 transition hover:border-emerald-400/30 hover:bg-emerald-400/10"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-content-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Module {index + 1}</p>
                    <p className="text-white">{page.title}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-300" />
              </Link>
            )
          })}
        </div>
      }
    >
      {pages.map((page) => (
        <FeaturePanel
          key={page.href}
          title={page.title}
          description={page.description}
          icon={page.icon}
        >
          <Link
            href={page.href}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
          >
            Open module
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FeaturePanel>
      ))}
    </BlackNodeFeatureShell>
  )
}
