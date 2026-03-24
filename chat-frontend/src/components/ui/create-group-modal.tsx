"use client"

import { useState } from "react"
import { ChevronDown, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export type GroupFormInput = {
  name: string
  topic: string
  type: "PUBLIC" | "PRIVATE"
}

type CreateGroupModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (form: GroupFormInput) => Promise<void>
}

const initialForm: GroupFormInput = {
  name: "",
  topic: "",
  type: "PUBLIC",
}

export function CreateGroupModal({ open, onClose, onSubmit }: CreateGroupModalProps) {
  const [form, setForm] = useState<GroupFormInput>(initialForm)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!open) {
    return null
  }

  const updateField = <K extends keyof GroupFormInput>(key: K, value: GroupFormInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async () => {
    const name = form.name.trim()
    const topic = form.topic.trim()

    if (!name || !topic) {
      setError("Group name and topic are required")
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      await onSubmit({ ...form, name, topic })
      setForm(initialForm)
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create group")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-md">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.58)_0%,rgba(2,6,23,0.82)_100%)]" />
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.9)_0%,rgba(2,6,23,0.92)_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.72)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,232,249,0.1),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.14),transparent_28%)]" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              Group Orchestration
            </p>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-white">Create Group Modal</h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-slate-300">
              Name, topic, type, and policy validation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="rounded-full border border-emerald-300/20 bg-emerald-500 px-5 text-xs font-semibold tracking-[0.22em] text-slate-950 shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-emerald-400"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "CREATING" : "CREATE"}
            </Button>
            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className="grid h-11 w-11 place-content-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative mt-8 space-y-5">
          <FieldLabel label="Group name" />
          <Input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Group name"
            className="h-12 rounded-2xl border-white/10 bg-slate-950/70 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] placeholder:text-slate-500 focus-visible:border-emerald-400/30 focus-visible:ring-2 focus-visible:ring-emerald-400/30 focus-visible:ring-offset-0"
          />

          <FieldLabel label="Topic / mission" />
          <textarea
            value={form.topic}
            onChange={(event) => updateField("topic", event.target.value)}
            placeholder="Topic / mission"
            rows={4}
            className="flex w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] outline-none placeholder:text-slate-500 transition focus:border-emerald-400/30 focus:ring-2 focus:ring-emerald-400/30"
          />

          <FieldLabel label="Type: Public or Private" />
          <div className="relative">
            <select
              value={form.type}
              onChange={(event) => updateField("type", event.target.value as GroupFormInput["type"])}
              className="h-12 w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] outline-none transition focus:border-emerald-400/30 focus:ring-2 focus:ring-emerald-400/30"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {error ? <p className="text-sm text-amber-200">{error}</p> : null}
        </div>

        <div className="relative mt-8 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-white/10 bg-white/[0.03] px-5 text-slate-200 hover:bg-white/[0.07] hover:text-white"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-2xl border border-emerald-300/20 bg-emerald-500 px-5 text-slate-950 shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-emerald-400"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function FieldLabel({ label }: { label: string }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
      {label}
    </label>
  )
}
