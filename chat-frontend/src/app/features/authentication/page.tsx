import {
  Activity,
  Gauge,
  KeyRound,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react"

import {
  BlackNodeFeatureShell,
  FeaturePanel,
  StatusPill,
} from "@/components/ui/blacknode-feature-shell"

export default function AuthenticationFeaturePage() {
  return (
    <BlackNodeFeatureShell
      eyebrow="Protected login"
      title="Secure Authentication"
      highlight="JWT-Gated Access Flow"
      description="A dark cyber-auth interface for login and registration, with immediate feedback for password strength, active JWT sessions, rate limiting, and account lock status."
      chips={["Protected Login", "JWT Session Badge", "Rate Limit Telemetry"]}
      metrics={[
        { value: "08h", label: "Token Lifetime" },
        { value: "05", label: "Attempts Before Lock" },
        { value: "256", label: "Bit Signing Strength" },
      ]}
      sidePanel={
        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/75 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AuthFormCard
              title="Login"
              fields={["Email", "Password"]}
              footer="Protected Login"
            />
            <AuthFormCard
              title="Register"
              fields={["Name", "Email", "Password"]}
              footer="Identity Enrollment"
            />
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold text-white">Credential Strength</p>
              <StatusPill>Strong</StatusPill>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[82%] rounded-full bg-[linear-gradient(90deg,#22c55e_0%,#67e8f9_100%)] shadow-[0_0_22px_rgba(34,197,94,0.45)]" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">12+ chars</span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">Uppercase</span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">Symbol</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <TelemetryCard label="JWT Session" value="Active Session" tone="green" />
            <TelemetryCard label="Rate Limit" value="3 / 5 used" tone="amber" />
            <TelemetryCard label="Account Lock" value="Standby" tone="cyan" />
          </div>
        </div>
      }
    >
      <FeaturePanel
        title="Token-Based Authentication"
        description="Session visuals show signed JWT state, claim freshness, and secure issuance windows."
        icon={KeyRound}
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-slate-400">Session Claims</p>
              <StatusPill>Issued</StatusPill>
            </div>
            <p className="font-mono text-sm text-emerald-200">sub: michael@sample.com | scope: secure:chat</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
            The interface communicates backend token issuance, expiration windows, and claim trust without exposing raw secrets.
          </div>
        </div>
      </FeaturePanel>
      <FeaturePanel
        title="Rate Limiting + Lockout"
        description="Visual counters represent guarded endpoints, failed attempt thresholds, and timed unlock behavior."
        icon={TriangleAlert}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
            <span className="text-slate-200">Attempt Counter</span>
            <span className="text-amber-200">03 / 05</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
            <span className="text-slate-200">Temporary Lock Timer</span>
            <span className="text-cyan-300">15 min</span>
          </div>
        </div>
      </FeaturePanel>
    </BlackNodeFeatureShell>
  )
}

function AuthFormCard({
  title,
  fields,
  footer,
}: {
  title: string
  fields: string[]
  footer: string
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-semibold text-white">{title}</p>
        <StatusPill>{footer}</StatusPill>
      </div>
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">
            {field}
          </div>
        ))}
      </div>
    </div>
  )
}

function TelemetryCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "green" | "cyan" | "amber"
}) {
  const icons = {
    green: ShieldCheck,
    amber: Gauge,
    cyan: Activity,
  }
  const Icon = icons[tone]

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
