"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BadgeCheck, Globe, Lock, Shield, Users } from "lucide-react"

import {
  FeaturePanel,
  StatusPill,
} from "@/components/ui/blacknode-feature-shell"
import { Button } from "@/components/ui/button"
import {
  CreateGroupModal,
  type GroupFormInput,
} from "@/components/ui/create-group-modal"
import { api, type GroupResponse, type JoinRequestResponse } from "@/lib/api-client"

type GroupItem = {
  id: number
  name: string
  topic: string
  type: "PUBLIC" | "PRIVATE"
  ownerUsername: string
  memberCount: number
  joined: boolean
  role: string
}

const demoGroups: GroupItem[] = [
  {
    id: 1,
    name: "Threat Intel",
    topic: "Public threat indicators and incident notice exchange.",
    type: "PUBLIC",
    ownerUsername: "ops-admin",
    memberCount: 892,
    joined: true,
    role: "Admin",
  },
  {
    id: 2,
    name: "Incident Response",
    topic: "Coordinated response workflows for sensitive production incidents.",
    type: "PRIVATE",
    ownerUsername: "blacknode",
    memberCount: 32,
    joined: true,
    role: "User",
  },
  {
    id: 3,
    name: "Red Team Signals",
    topic: "Private simulation traffic, findings, and hardening notes.",
    type: "PRIVATE",
    ownerUsername: "sec-lead",
    memberCount: 11,
    joined: false,
    role: "User",
  },
]

const tokenStorageKey = "blacknode.token"

export function GroupControlCenter() {
  const router = useRouter()
  const [groups, setGroups] = useState<GroupItem[]>(demoGroups)
  const [pendingRequests, setPendingRequests] = useState<JoinRequestResponse[]>([])
  const [myRequests, setMyRequests] = useState<JoinRequestResponse[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [feedback, setFeedback] = useState("Demo mode active. Login to connect to the backend.")
  const [busyGroupId, setBusyGroupId] = useState<number | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<GroupItem | null>(null)

  useEffect(() => {
    void loadGroups()
  }, [])

  const loadGroups = async () => {
    const token = readToken()
    if (!token) {
      return
    }

    try {
      const data = await api.groups.list()
      const mappedGroups = data.map((g: GroupResponse) => ({
        id: g.id,
        name: g.name,
        topic: g.topic,
        type: g.type,
        ownerUsername: g.ownerUsername,
        memberCount: g.memberCount,
        joined: g.joined,
        role: g.role,
      }))
      setGroups(mappedGroups)
      setFeedback("Connected to backend. Group data loaded.")

      const adminGroup = mappedGroups.find(g => g.role === "Admin" && g.joined)
      if (adminGroup) {
        const requests = await api.groups.getPendingRequests(adminGroup.id)
        setPendingRequests(requests)
      }

      const myReqs = await api.groups.getMyRequests()
      setMyRequests(myReqs)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to load groups")
    }
  }

  const handleCreate = async (form: GroupFormInput) => {
    const token = readToken()
    if (!token) {
      setGroups((current) => [
        {
          id: Date.now(),
          name: form.name,
          topic: form.topic,
          type: form.type,
          ownerUsername: "local-demo",
          memberCount: 1,
          joined: true,
          role: "Admin",
        },
        ...current,
      ])
      setFeedback("Created locally. Login to save to backend.")
      return
    }

    try {
      const newGroup = await api.groups.create(form.name, form.topic, form.type)
      setGroups((current) => [{
        id: newGroup.id,
        name: newGroup.name,
        topic: newGroup.topic,
        type: newGroup.type,
        ownerUsername: newGroup.ownerUsername,
        memberCount: newGroup.memberCount,
        joined: newGroup.joined,
        role: newGroup.role,
      }, ...current])
      setFeedback("Group created successfully!")
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Failed to create group")
    }
  }

  const handleMembershipAction = async (group: GroupItem) => {
    const token = readToken()
    if (!token) {
      if (group.type === "PRIVATE" && !group.joined) {
        setFeedback("Private groups require a join request. Please login first.")
        return
      }

      setGroups((current) =>
        current.map((item) =>
          item.id === group.id
            ? {
                ...item,
                joined: !item.joined,
                memberCount: item.joined ? Math.max(0, item.memberCount - 1) : item.memberCount + 1,
              }
            : item,
        ),
      )
      setFeedback(`Demo mode action completed.`)
      return
    }

    setBusyGroupId(group.id)
    try {
      if (group.type === "PRIVATE" && !group.joined) {
        const request = await api.groups.requestJoin(group.id)
        setMyRequests((current) => [...current, request])
        setFeedback("Join request submitted! Waiting for admin approval.")
      } else if (group.joined) {
        await api.groups.leave(group.id)
        setGroups((current) =>
          current.map((item) =>
            item.id === group.id
              ? { ...item, joined: false, memberCount: Math.max(0, item.memberCount - 1), role: "User" }
              : item,
          ),
        )
        setFeedback("Left the group successfully.")
      } else {
        const updated = await api.groups.join(group.id)
        setGroups((current) =>
          current.map((item) =>
            item.id === group.id
              ? { ...item, joined: true, memberCount: updated.memberCount }
              : item,
          ),
        )
        setFeedback("Joined the group successfully!")
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Action failed")
    } finally {
      setBusyGroupId(null)
    }
  }

  const handleApproveRequest = async (requestId: number) => {
    try {
      await api.groups.approveRequest(requestId)
      setPendingRequests((current) => current.filter((r) => r.id !== requestId))
      void loadGroups()
      setFeedback("Join request approved!")
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Failed to approve request")
    }
  }

  const handleRejectRequest = async (requestId: number) => {
    try {
      await api.groups.rejectRequest(requestId)
      setPendingRequests((current) => current.filter((r) => r.id !== requestId))
      setFeedback("Join request rejected.")
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Failed to reject request")
    }
  }

  return (
    <>
      <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/75 p-4">
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4">
          <div>
            <p className="font-semibold text-white">Group Control Center</p>
            <p className="text-sm text-slate-400">Create and manage your discussion groups.</p>
          </div>
          <Button
            type="button"
            className="rounded-full border border-emerald-300/20 bg-emerald-500 px-5 text-xs font-semibold tracking-[0.22em] text-slate-950 shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-emerald-400"
            onClick={() => setIsModalOpen(true)}
          >
            CREATE
          </Button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300">
          {feedback}
        </div>

        {pendingRequests.length > 0 && (
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-4">
            <p className="mb-3 font-semibold text-amber-300">Pending Join Requests</p>
            <div className="space-y-2">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <p className="text-white">{request.username}</p>
                    <p className="text-xs text-slate-400">wants to join {request.groupName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="rounded-full border border-emerald-400/30 bg-emerald-500 px-3 text-xs text-slate-950 hover:bg-emerald-400"
                      onClick={() => void handleApproveRequest(request.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-white/10 bg-white/5 px-3 text-xs text-white hover:bg-white/10"
                      onClick={() => void handleRejectRequest(request.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {myRequests.length > 0 && (
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-4">
            <p className="mb-3 font-semibold text-cyan-300">My Pending Requests</p>
            <div className="space-y-2">
              {myRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <p className="text-white">{request.groupName}</p>
                    <p className="text-xs text-slate-400">Waiting for approval</p>
                  </div>
                  <StatusPill tone="amber">Pending</StatusPill>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-content-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                  {group.type === "PUBLIC" ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-white">{group.name}</p>
                    <StatusPill tone={group.type === "PUBLIC" ? "cyan" : "green"}>
                      {group.type}
                    </StatusPill>
                    <StatusPill tone={group.role === "Admin" ? "green" : "slate"}>{group.role}</StatusPill>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{group.topic}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Owner: {group.ownerUsername} | {group.memberCount} members
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {group.joined && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/5 px-3 text-xs text-white hover:bg-white/10"
                    onClick={() => {
                      window.localStorage.setItem("blacknode.selectedGroupId", group.id.toString())
                      router.push("/dashboard")
                    }}
                  >
                    Chat
                  </Button>
                )}
                <Button
                  type="button"
                  variant={group.joined ? "outline" : "default"}
                  className={
                    group.joined
                      ? "rounded-2xl border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08] hover:text-white"
                      : "rounded-2xl border border-emerald-300/20 bg-emerald-500 text-slate-950 shadow-[0_0_24px_rgba(34,197,94,0.28)] hover:bg-emerald-400"
                  }
                  onClick={() => void handleMembershipAction(group)}
                  disabled={busyGroupId === group.id}
                >
                  {busyGroupId === group.id ? "Working..." : group.joined ? "Leave" : group.type === "PRIVATE" ? "Request" : "Join"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FeaturePanel
        title="Role-Based Access"
        description="Admin and user badges clearly separate moderation capability from standard participation privileges."
        icon={BadgeCheck}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <RoleCard role="Admin" detail="Approve join requests, manage members, set group policies." tone="green" />
          <RoleCard role="User" detail="Join public groups or request access to private groups." tone="cyan" />
        </div>
      </FeaturePanel>
      <FeaturePanel
        title="Member Management System"
        description="Backend membership state, join validation, and leave flows are represented as secure workflow cards."
        icon={Users}
      >
        <div className="space-y-3">
          <ActionRow label="Join request for private groups" action="Request" />
          <ActionRow label="Leave group confirmation" action="Confirm" />
          <ActionRow label="Admin approves/rejects requests" action="Process" />
        </div>
      </FeaturePanel>

      <CreateGroupModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </>
  )
}

function RoleCard({
  role,
  detail,
  tone,
}: {
  role: string
  detail: string
  tone: "green" | "cyan"
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold text-white">{role}</p>
        <StatusPill tone={tone}>{role}</StatusPill>
      </div>
      <p className="text-sm leading-7 text-slate-300">{detail}</p>
    </div>
  )
}

function ActionRow({ label, action }: { label: string; action: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-content-center rounded-2xl bg-emerald-400/10 text-emerald-300">
          <Shield className="h-4 w-4" />
        </div>
        <span className="text-slate-200">{label}</span>
      </div>
      <StatusPill tone="cyan">{action}</StatusPill>
    </div>
  )
}

function readToken() {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage.getItem(tokenStorageKey)
}
