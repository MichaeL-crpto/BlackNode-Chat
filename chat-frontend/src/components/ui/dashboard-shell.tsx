"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  ChevronRight,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquareText,
  Settings,
  Shield,
  UserCircle2,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SampleUser } from "@/lib/sample-auth"

type DashboardShellProps = {
  user: SampleUser
}

const groups = [
  {
    name: "North Gate Team",
    topic: "Entry checkpoint updates",
    members: 8,
    type: "Private",
    unread: 3,
    encrypted: true,
  },
  {
    name: "Control Room",
    topic: "Live incident coordination",
    members: 5,
    type: "Private",
    unread: 1,
    encrypted: true,
  },
  {
    name: "Site Broadcast",
    topic: "Public notices and daily briefings",
    members: 23,
    type: "Public",
    unread: 0,
    encrypted: false,
  },
]

const messages = [
  {
    sender: "Shift Lead",
    text: "Checkpoint B has been verified. Resume normal access flow.",
    time: "2 min ago",
    status: "Delivered",
  },
  {
    sender: "Michael Security Services",
    text: "Night patrol briefing is uploaded for all active team members.",
    time: "9 min ago",
    status: "Read",
  },
  {
    sender: "Dispatch",
    text: "Reminder: sanitize visitor notes and avoid posting sensitive data in public groups.",
    time: "18 min ago",
    status: "Sent",
  },
]

const settings = [
  { label: "Allow group invites", value: "Enabled" },
  { label: "Online status", value: "Visible" },
  { label: "Session expiry", value: "8 hours" },
  { label: "Message rate limit", value: "Protected" },
]

export function DashboardShell({ user }: DashboardShellProps) {
  const router = useRouter()
  const [activePanel, setActivePanel] = useState<"dashboard" | "groupchat" | "settings">("dashboard")
  const userName = useMemo(() => user?.name || user?.email || "Verified User", [user])

  const handleLogout = async () => {
    await fetch("/api/sample-logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="dark min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(248,250,252,0.18),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]" />
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 md:px-8">
        <aside className="hidden w-72 shrink-0 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur lg:block">
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="grid size-11 place-content-center rounded-2xl bg-emerald-400/20 text-emerald-300">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold text-white">Michael Security</p>
              <p className="text-xs text-slate-400">Verified access only</p>
            </div>
          </div>

          <nav className="space-y-2">
            <DashboardNavButton
              active={activePanel === "dashboard"}
              icon={LayoutDashboard}
              label="Dashboard"
              onClick={() => setActivePanel("dashboard")}
            />
            <DashboardNavButton
              active={activePanel === "groupchat"}
              icon={MessageSquareText}
              label="GroupChat"
              onClick={() => setActivePanel("groupchat")}
            />
            <DashboardNavButton
              active={activePanel === "settings"}
              icon={Settings}
              label="Settings"
              onClick={() => setActivePanel("settings")}
            />
          </nav>

          <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
              Security Indicator
            </p>
            <p className="text-sm text-slate-200">
              Public groups show a warning when full encryption is not active.
            </p>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
                Verified Session
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold text-white">
                Welcome, {userName}
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Access granted through the sample demo account.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
              >
                <Bell className="mr-2 h-4 w-4" />
                Alerts
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard label="Joined Groups" value="3" hint="2 private, 1 public" icon={Users} />
                <StatCard label="Unread Alerts" value="4" hint="Mentions and new messages" icon={Bell} />
                <StatCard label="Message Security" value="Protected" hint="XSS-safe input and limits" icon={Lock} />
              </div>

              {activePanel === "dashboard" && (
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                        Overview
                      </p>
                      <h2 className="mt-2 font-heading text-2xl font-semibold text-white">
                        Operations Dashboard
                      </h2>
                    </div>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                      Session active
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {groups.map((group) => (
                      <div
                        key={group.name}
                        className="rounded-3xl border border-white/10 bg-slate-950/50 p-5"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="font-semibold text-white">{group.name}</p>
                          <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-slate-300">
                            {group.type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">{group.topic}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                          <span>{group.members} members</span>
                          <span className={cn(group.encrypted ? "text-emerald-300" : "text-amber-300")}>
                            {group.encrypted ? "Encrypted" : "Not fully encrypted"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === "groupchat" && (
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                        Group Messaging
                      </p>
                      <h2 className="mt-2 font-heading text-2xl font-semibold text-white">
                        GroupChat
                      </h2>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      Rate limiting enabled
                    </span>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-3">
                      {groups.map((group) => (
                        <button
                          key={group.name}
                          type="button"
                          className="w-full rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-left transition hover:bg-white/10"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-white">{group.name}</p>
                            {group.unread > 0 && (
                              <span className="rounded-full bg-emerald-300/20 px-2 py-1 text-[11px] text-emerald-200">
                                {group.unread} new
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-slate-300">{group.topic}</p>
                          <p className="mt-3 text-xs text-slate-400">
                            {group.type === "Private"
                              ? "Private group: end-to-end protected"
                              : "Public group: messages are not fully encrypted"}
                          </p>
                        </button>
                      ))}
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">Secure Conversation</p>
                          <p className="text-xs text-emerald-300">Input sanitized and length-limited</p>
                        </div>
                        <Shield className="h-4 w-4 text-emerald-300" />
                      </div>
                      <div className="space-y-3">
                        {messages.map((message) => (
                          <div
                            key={`${message.sender}-${message.time}`}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>{message.sender}</span>
                              <span>{message.time}</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-100">{message.text}</p>
                            <p className="mt-3 text-xs text-emerald-300">{message.status}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === "settings" && (
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                      Account Controls
                    </p>
                    <h2 className="mt-2 font-heading text-2xl font-semibold text-white">
                      Settings
                    </h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {settings.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-3xl border border-white/10 bg-slate-950/50 p-5"
                      >
                        <p className="text-sm text-slate-400">{item.label}</p>
                        <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-4 flex items-center gap-3">
                  <UserCircle2 className="h-10 w-10 text-slate-300" />
                  <div>
                    <p className="font-semibold text-white">{userName}</p>
                    <p className="text-sm text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                    <span>Sample login</span>
                    <span className="text-emerald-300">Confirmed</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                    <span>Last active</span>
                    <span>Just now</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-heading text-xl font-semibold text-white">Next steps</p>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                    Create or join a secure group.
                  </li>
                  <li className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                    Check encryption status before sending sensitive details.
                  </li>
                  <li className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                    Use Settings to control invites, privacy, and session behavior.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardNavButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean
  icon: typeof LayoutDashboard
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition",
        active
          ? "bg-emerald-300/15 text-white"
          : "text-slate-300 hover:bg-white/10 hover:text-white",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint: string
  icon: typeof Users
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-slate-300">{label}</span>
        <Icon className="h-4 w-4 text-emerald-300" />
      </div>
      <p className="font-heading text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{hint}</p>
    </div>
  )
}
