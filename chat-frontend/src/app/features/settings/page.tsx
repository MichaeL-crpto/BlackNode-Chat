import {
  Fingerprint,
  KeySquare,
  MonitorSmartphone,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import {
  BlackNodeFeatureShell,
  FeaturePanel,
  StatusPill,
} from "@/components/ui/blacknode-feature-shell"

export default function SettingsFeaturePage() {
  return (
    <BlackNodeFeatureShell
      eyebrow="Privacy controls"
      title="User Settings & Privacy"
      highlight="Identity, Keys, Sessions"
      description="A privacy-focused control surface with profile management, online visibility toggles, session controls, and encryption fingerprint display using the same landing-page styling."
      chips={["Key Management", "Secure Password Update", "Session Control"]}
      metrics={[
        { value: "03", label: "Active Devices" },
        { value: "SHA-256", label: "Key Fingerprint" },
        { value: "2FA", label: "Optional Layer" },
      ]}
      sidePanel={
        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/75 p-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-content-center rounded-3xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-[0_0_30px_rgba(34,197,94,0.18)]">
                <UserRound className="h-7 w-7" />
              </div>
              <div>
                <p className="font-heading text-2xl text-white">Michael</p>
                <p className="text-sm text-slate-400">@blacknode-admin</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusPill>Online</StatusPill>
              <StatusPill tone="cyan">Private Mode</StatusPill>
            </div>
          </div>
          <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <ToggleRow label="Show online status" enabled />
            <ToggleRow label="Restrict profile visibility" enabled />
            <ToggleRow label="Allow trusted device sessions" enabled={false} />
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-white">Encryption fingerprint</p>
              <Fingerprint className="h-5 w-5 text-emerald-300" />
            </div>
            <p className="font-mono text-sm leading-7 text-emerald-200">
              BN-4F2A-91C7-77D1-EE04-2A9D-9C33-74B1
            </p>
          </div>
        </div>
      }
    >
      <FeaturePanel
        title="Key Management System"
        description="Surface key rotation status, recovery workflows, and signed identity material in a readable privacy panel."
        icon={KeySquare}
      >
        <div className="space-y-3">
          <SettingsRow label="Primary encryption key" value="Healthy" />
          <SettingsRow label="Recovery key escrow" value="Offline vault" />
          <SettingsRow label="Rotation schedule" value="Every 30 days" />
        </div>
      </FeaturePanel>
      <FeaturePanel
        title="Session Control"
        description="Secure device sessions, password update flows, and revocation controls are grouped into a single operator view."
        icon={MonitorSmartphone}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <SessionCard device="ThinkPad X1" location="Kolkata" active />
          <SessionCard device="iPhone Secure App" location="Remote" active={false} />
        </div>
      </FeaturePanel>
    </BlackNodeFeatureShell>
  )
}

function ToggleRow({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <span className="text-slate-200">{label}</span>
      <div
        className={`flex h-7 w-12 items-center rounded-full border px-1 transition ${
          enabled
            ? "border-emerald-400/20 bg-emerald-400/20 justify-end"
            : "border-white/10 bg-white/[0.05] justify-start"
        }`}
      >
        <span className="h-5 w-5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.35)]" />
      </div>
    </div>
  )
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
      <span className="text-slate-200">{label}</span>
      <StatusPill>{value}</StatusPill>
    </div>
  )
}

function SessionCard({
  device,
  location,
  active,
}: {
  device: string
  location: string
  active: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <ShieldCheck className="h-5 w-5 text-emerald-300" />
        <StatusPill tone={active ? "green" : "slate"}>{active ? "Active" : "Idle"}</StatusPill>
      </div>
      <p className="font-semibold text-white">{device}</p>
      <p className="mt-2 text-sm text-slate-400">{location}</p>
    </div>
  )
}
