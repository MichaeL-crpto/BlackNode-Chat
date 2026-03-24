import {
  BlackNodeFeatureShell,
  StatusPill,
} from "@/components/ui/blacknode-feature-shell"
import { GroupControlCenter } from "@/components/ui/group-control-center"

export default function GroupsFeaturePage() {
  return (
    <BlackNodeFeatureShell
      eyebrow="Access orchestration"
      title="Group Control Center"
      highlight="Public And Private Coordination"
      description="Group creation, joining, moderation, and secure membership validation rendered with the same landing-page cyber-glass layout."
      chips={["Admin/User Badges", "Secure Group Validation", "Member Lifecycle"]}
      metrics={[
        { value: "210", label: "Managed Rooms" },
        { value: "Admin", label: "Role Scope" },
        { value: "TLS", label: "Validated Transport" },
      ]}
      sidePanel={
        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/75 p-4">
          <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <div>
              <p className="font-semibold text-white">Create Group Modal</p>
              <p className="text-sm text-slate-400">Name, topic, type, and policy validation.</p>
            </div>
            <StatusPill>Create</StatusPill>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300">
            The create-group modal below uses the same glassmorphism shell, neon secure states, and validation feedback as the BlackNode landing page.
          </div>
        </div>
      }
    >
      <GroupControlCenter />
    </BlackNodeFeatureShell>
  )
}
