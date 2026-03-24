import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Siren,
  TimerReset,
  Waypoints,
} from "lucide-react"

import {
  BlackNodeFeatureShell,
  FeaturePanel,
  StatusPill,
} from "@/components/ui/blacknode-feature-shell"

const alerts = [
  { event: "Repeated login failures from 10.24.8.12", severity: "High" },
  { event: "Rate limit threshold nearing on /api/auth/login", severity: "Medium" },
  { event: "Suspicious token refresh pattern blocked", severity: "Critical" },
]

export default function SecurityFeaturePage() {
  return (
    <BlackNodeFeatureShell
      eyebrow="Threat visibility"
      title="Security Dashboard"
      highlight="Logging, Rate Limits, Threat Signals"
      description="A monitoring surface for backend activity logs, suspicious behavior, and rate limiting rules, rendered in the same deep navy and neon-secure design system."
      chips={["Activity Logs", "Threat Detection", "Login Attempt Tracker"]}
      metrics={[
        { value: "24/7", label: "Monitoring" },
        { value: "99.9%", label: "Alert Delivery" },
        { value: "04", label: "Active Threats" },
      ]}
      sidePanel={
        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/75 p-4">
          <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <div>
              <p className="font-semibold text-white">Threat Detection Grid</p>
              <p className="text-sm text-slate-400">Live defensive posture across auth and messaging endpoints.</p>
            </div>
            <StatusPill tone="amber">Elevated</StatusPill>
          </div>
          {alerts.map((alert) => (
            <div key={alert.event} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-white">{alert.event}</p>
                <StatusPill tone={alert.severity === "Critical" ? "amber" : "cyan"}>{alert.severity}</StatusPill>
              </div>
              <p className="text-sm text-slate-400">Threat analytics, source correlation, and automated containment suggestions.</p>
            </div>
          ))}
          <div className="grid gap-4 md:grid-cols-3">
            <MonitorCard label="Rate limiting" value="Active" icon={TimerReset} />
            <MonitorCard label="Audit logs" value="Streaming" icon={Activity} />
            <MonitorCard label="Response mode" value="Hardened" icon={ShieldCheck} />
          </div>
        </div>
      }
    >
      <FeaturePanel
        title="Activity Logs"
        description="Structured logging cards surface auth flow events, policy enforcement, and secure audit trail metadata."
        icon={Waypoints}
      >
        <div className="space-y-3">
          <LogRow time="09:14:02" event="JWT issued for verified user session" />
          <LogRow time="09:15:18" event="Private group membership updated" />
          <LogRow time="09:17:44" event="Encrypted file upload checksum validated" />
        </div>
      </FeaturePanel>
      <FeaturePanel
        title="Login Attempt Tracker"
        description="Failed attempt counts and threat escalation are expressed as guarded operational telemetry."
        icon={ShieldAlert}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <TrackerCard title="Attempt Budget" value="2 remaining" />
          <TrackerCard title="Suspicious Activity" value="Escalated" />
        </div>
      </FeaturePanel>
    </BlackNodeFeatureShell>
  )
}

function MonitorCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof Activity
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <Icon className="h-4 w-4 text-emerald-300" />
      </div>
      <p className="font-semibold text-white">{value}</p>
    </div>
  )
}

function LogRow({ time, event }: { time: string; event: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
      <div className="grid h-10 w-10 place-content-center rounded-2xl bg-emerald-400/10 text-emerald-300">
        <Siren className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm text-slate-400">{time}</p>
        <p className="text-slate-200">{event}</p>
      </div>
    </div>
  )
}

function TrackerCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  )
}
