"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  Globe,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  Users,
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { api, type GroupResponse } from "@/lib/api-client"
import { cn } from "@/lib/utils"

type DashboardUser = {
  username: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [groups, setGroups] = useState<GroupResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = window.localStorage.getItem("blacknode.token")
    const username = window.localStorage.getItem("blacknode.username")

    if (!token) {
      router.push("/")
      return
    }

    setUser({ username: username || "User" })
    void loadGroups()
  }, [router])

  const loadGroups = async () => {
    try {
      const data = await api.groups.list()
      setGroups(data)
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("blacknode.token")
    window.localStorage.removeItem("blacknode.username")
    router.push("/")
  }

  const joinedGroups = groups.filter((g) => g.joined)
  const publicGroups = groups.filter((g) => g.type === "PUBLIC")
  const privateGroups = groups.filter((g) => g.type === "PRIVATE")

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(248,250,252,0.18),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]" />
      
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-10 w-10 place-content-center rounded-2xl bg-emerald-400/20">
                <Shield className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-heading text-lg font-semibold">BlackNode Chat</p>
                <p className="text-xs text-slate-400">Welcome, {user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Welcome Section */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-semibold text-white">
                Welcome back, {user.username}
              </h1>
              <p className="mt-2 text-slate-400">
                Your secure messaging dashboard. Manage groups and chat securely.
              </p>
            </div>
            <Button
              className="rounded-full border border-emerald-400/30 bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              onClick={() => router.push("/groups")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Open Groups
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard
            label="Joined Groups"
            value={joinedGroups.length.toString()}
            icon={Users}
            tone="emerald"
          />
          <StatCard
            label="Public Groups"
            value={publicGroups.length.toString()}
            icon={Globe}
            tone="cyan"
          />
          <StatCard
            label="Private Groups"
            value={privateGroups.length.toString()}
            icon={Lock}
            tone="amber"
          />
          <StatCard
            label="Session Status"
            value="Active"
            icon={Shield}
            tone="emerald"
          />
        </div>

        {/* Quick Access */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Groups */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold">Your Groups</h2>
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                onClick={() => router.push("/groups")}
              >
                View All
              </Button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
              </div>
            ) : joinedGroups.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-8 text-center">
                <Users className="mx-auto mb-3 h-10 w-10 text-slate-500" />
                <p className="text-slate-400">No groups yet. Create or join one!</p>
                <Button
                  className="mt-4 rounded-full border border-emerald-400/30 bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  onClick={() => router.push("/groups")}
                >
                  Browse Groups
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {joinedGroups.slice(0, 3).map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "grid h-10 w-10 place-content-center rounded-xl",
                        group.type === "PUBLIC" ? "bg-cyan-400/10 text-cyan-400" : "bg-emerald-400/10 text-emerald-400"
                      )}>
                        {group.type === "PUBLIC" ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{group.name}</p>
                        <p className="text-xs text-slate-400">{group.memberCount} members</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="rounded-xl border border-emerald-400/30 bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                      onClick={() => router.push("/groups")}
                    >
                      Chat
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 font-heading text-xl font-semibold">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/groups")}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-left transition hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-content-center rounded-xl bg-emerald-400/10 text-emerald-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Create New Group</p>
                    <p className="text-xs text-slate-400">Start a new public or private group</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400" />
              </button>

              <button
                onClick={() => router.push("/groups")}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-left transition hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-content-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Join Public Group</p>
                    <p className="text-xs text-slate-400">Browse and join public groups</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400" />
              </button>

              <button
                onClick={() => router.push("/groups")}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-left transition hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-content-center rounded-xl bg-amber-400/10 text-amber-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Request Private Access</p>
                    <p className="text-xs text-slate-400">Request to join private groups</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-content-center rounded-2xl bg-emerald-400/20 text-emerald-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-white">Security Status</h3>
              <p className="text-sm text-slate-400">
                Your session is secured with AES-256 encryption. All messages are end-to-end encrypted.
              </p>
            </div>
            <div className="ml-auto">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                Protected
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: string
  icon: typeof Users
  tone: "emerald" | "cyan" | "amber"
}) {
  const toneClasses = {
    emerald: "bg-emerald-400/10 text-emerald-400",
    cyan: "bg-cyan-400/10 text-cyan-400",
    amber: "bg-amber-400/10 text-amber-400",
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <div className={cn("grid h-8 w-8 place-content-center rounded-lg", toneClasses[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="font-heading text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}
