import {
  FileText,
  KeyRound,
  Lock,
  MessageSquareLock,
  ShieldCheck,
  Upload,
} from "lucide-react"

import {
  BlackNodeFeatureShell,
  FeaturePanel,
  StatusPill,
} from "@/components/ui/blacknode-feature-shell"

export default function MessagingFeaturePage() {
  return (
    <BlackNodeFeatureShell
      eyebrow="Encrypted exchange"
      title="End-to-End Encrypted Chat"
      highlight="AES Messages. RSA Handshake."
      description="A secure messaging screen with glassmorphism conversation panels, lock states, file previews, and visible encryption lifecycle indicators."
      chips={["AES Message Encryption", "RSA Key Exchange", "Client-Side Decryption"]}
      metrics={[
        { value: "AES-256", label: "Payload Cipher" },
        { value: "RSA", label: "Key Exchange" },
        { value: "12ms", label: "Decrypt Latency" },
      ]}
      sidePanel={
        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/75 p-4">
          <div className="mb-2 flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div>
              <p className="font-semibold text-white">Zero Trust War Room</p>
              <p className="text-sm text-slate-400">14 members online</p>
            </div>
            <StatusPill>Encrypted</StatusPill>
          </div>
          <ChatBubble name="Ava" text="RSA exchange complete. Session keys rotated successfully." time="09:18" received />
          <ChatBubble name="BlackNode" text="AES payload sealed. Sending evidence package to the private channel now." time="09:19" />
          <div className="ml-auto max-w-sm rounded-3xl border border-emerald-400/15 bg-emerald-400/10 p-4 shadow-[0_0_24px_rgba(34,197,94,0.10)]">
            <div className="mb-3 flex items-center justify-between text-sm text-emerald-200">
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Forensics-Pack.zip
              </span>
              <Upload className="h-4 w-4" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-4 text-sm text-slate-300">
              Secure file preview with checksum, delivery status, and signed transport metadata.
            </div>
            <div className="mt-3 text-right text-xs text-slate-400">09:20</div>
          </div>
          <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div>
              <p className="text-white">Client-side decryption confirmed</p>
              <p className="text-xs text-slate-400">Private key loaded in isolated browser context</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
          </div>
        </div>
      }
    >
      <FeaturePanel
        title="Encryption Pipeline"
        description="The interface visualizes message lifecycle from public key negotiation to symmetric payload sealing."
        icon={KeyRound}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <PipelineStep title="RSA Exchange" detail="Ephemeral public key handshake" />
          <PipelineStep title="AES Seal" detail="Per-message encryption envelope" />
          <PipelineStep title="Local Decrypt" detail="Client-side plaintext restore" />
        </div>
      </FeaturePanel>
      <FeaturePanel
        title="Secure Message States"
        description="Each message card carries explicit lock indicators and tamper-resistant delivery cues."
        icon={MessageSquareLock}
      >
        <div className="space-y-3">
          <StateRow label="Message integrity" value="Verified" />
          <StateRow label="Key freshness" value="Rotated" />
          <StateRow label="Attachment checksum" value="Matched" />
        </div>
      </FeaturePanel>
    </BlackNodeFeatureShell>
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
    </div>
  )
}

function PipelineStep({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-300">{detail}</p>
    </div>
  )
}

function StateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
      <span className="text-slate-200">{label}</span>
      <StatusPill>{value}</StatusPill>
    </div>
  )
}
