"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Globe,
  Lock,
  LogOut,
  MessageSquare,
  Plus,
  Send,
  Settings,
  Shield,
  Users,
  ArrowLeft,
  Check,
  X,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api, type GroupResponse, type GroupMessageResponse, type JoinRequestResponse } from "@/lib/api-client"
import { cn } from "@/lib/utils"

type Tab = "groups" | "chat" | "settings"

export default function GroupsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("groups")
  const [groups, setGroups] = useState<GroupResponse[]>([])
  const [selectedGroup, setSelectedGroup] = useState<GroupResponse | null>(null)
  const [messages, setMessages] = useState<GroupMessageResponse[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupTopic, setNewGroupTopic] = useState("")
  const [newGroupType, setNewGroupType] = useState<"PUBLIC" | "PRIVATE">("PUBLIC")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [pendingRequests, setPendingRequests] = useState<JoinRequestResponse[]>([])
  const [myRequests, setMyRequests] = useState<JoinRequestResponse[]>([])

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
      setLoading(true)
      const data = await api.groups.list()
      setGroups(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load groups")
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (groupId: number) => {
    try {
      const data = await api.messages.list(groupId)
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages")
    }
  }

  const loadRequests = async (groupId: number) => {
    try {
      const requests = await api.groups.getPendingRequests(groupId)
      setPendingRequests(requests)
    } catch {
      setPendingRequests([])
    }
  }

  const loadMyRequests = async () => {
    try {
      const requests = await api.groups.getMyRequests()
      setMyRequests(requests)
    } catch {
      setMyRequests([])
    }
  }

  const handleSelectGroup = async (group: GroupResponse) => {
    setSelectedGroup(group)
    setActiveTab("chat")
    await loadMessages(group.id)
    if (group.role === "Admin") {
      await loadRequests(group.id)
    }
    await loadMyRequests()
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroup || !newMessage.trim() || sending) return

    setSending(true)
    setError("")
    try {
      const message = await api.messages.send(selectedGroup.id, newMessage.trim())
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim() || !newGroupTopic.trim()) return

    setCreating(true)
    setError("")
    try {
      const newGroup = await api.groups.create(newGroupName.trim(), newGroupTopic.trim(), newGroupType)
      setGroups((prev) => [newGroup, ...prev])
      setNewGroupName("")
      setNewGroupTopic("")
      setSuccess("Group created successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group")
    } finally {
      setCreating(false)
    }
  }

  const handleJoinGroup = async (groupId: number) => {
    try {
      await api.groups.join(groupId)
      await loadGroups()
      setSuccess("Joined group successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join group")
    }
  }

  const handleLeaveGroup = async (groupId: number) => {
    try {
      await api.groups.leave(groupId)
      await loadGroups()
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null)
        setActiveTab("groups")
      }
      setSuccess("Left group successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to leave group")
    }
  }

  const handleRequestJoin = async (groupId: number) => {
    try {
      await api.groups.requestJoin(groupId)
      await loadGroups()
      await loadMyRequests()
      setSuccess("Join request sent! Waiting for admin approval.")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send join request")
    }
  }

  const handleApproveRequest = async (requestId: number) => {
    try {
      await api.groups.approveRequest(requestId)
      await loadRequests(requestId)
      await loadGroups()
      setSuccess("Request approved!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve request")
    }
  }

  const handleRejectRequest = async (requestId: number) => {
    try {
      await api.groups.rejectRequest(requestId)
      await loadRequests(requestId)
      setSuccess("Request rejected")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject request")
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("blacknode.token")
    window.localStorage.removeItem("blacknode.username")
    router.push("/")
  }

  const joinedGroups = groups.filter((g) => g.joined)
  const availableGroups = groups.filter((g) => !g.joined)

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

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("groups")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition",
                activeTab === "groups"
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-slate-400 hover:text-white"
              )}
            >
              <Users className="h-4 w-4" />
              Groups
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              disabled={!selectedGroup}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition",
                activeTab === "chat"
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-slate-400 hover:text-white",
                !selectedGroup && "cursor-not-allowed opacity-50"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              Chat {selectedGroup ? `- ${selectedGroup.name}` : ""}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition",
                activeTab === "settings"
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-slate-400 hover:text-white"
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        {/* Alerts */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
            {success}
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === "groups" && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Create Group */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
                <Plus className="h-5 w-5 text-emerald-400" />
                Create Group
              </h2>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <Input
                    placeholder="Group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Topic / Description"
                    value={newGroupTopic}
                    onChange={(e) => setNewGroupTopic(e.target.value)}
                    className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewGroupType("PUBLIC")}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-2 text-sm transition",
                      newGroupType === "PUBLIC"
                        ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-slate-400"
                    )}
                  >
                    <Globe className="mx-auto mb-1 h-4 w-4" />
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewGroupType("PRIVATE")}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-2 text-sm transition",
                      newGroupType === "PRIVATE"
                        ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 bg-white/5 text-slate-400"
                    )}
                  >
                    <Lock className="mx-auto mb-1 h-4 w-4" />
                    Private
                  </button>
                </div>
                <Button
                  type="submit"
                  disabled={creating || !newGroupName.trim() || !newGroupTopic.trim()}
                  className="w-full rounded-xl border border-emerald-400/30 bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                >
                  {creating ? "Creating..." : "Create Group"}
                </Button>
              </form>
            </div>

            {/* My Groups */}
            <div className="lg:col-span-2">
              <h2 className="mb-4 font-heading text-lg font-semibold">My Groups ({joinedGroups.length})</h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                </div>
              ) : joinedGroups.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <Users className="mx-auto mb-3 h-10 w-10 text-slate-500" />
                  <p className="text-slate-400">You haven't joined any groups yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {joinedGroups.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "grid h-10 w-10 place-content-center rounded-xl",
                            group.type === "PUBLIC" ? "bg-cyan-400/10 text-cyan-400" : "bg-emerald-400/10 text-emerald-400"
                          )}>
                            {group.type === "PUBLIC" ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-white">{group.name}</p>
                              <span className={cn(
                                "rounded-full border px-2 py-0.5 text-xs",
                                group.role === "Admin"
                                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                  : "border-white/10 bg-white/5 text-slate-400"
                              )}>
                                {group.role}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-400">{group.topic}</p>
                            <p className="mt-2 text-xs text-slate-500">
                              {group.memberCount} members • {group.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="rounded-xl border border-emerald-400/30 bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                            onClick={() => handleSelectGroup(group)}
                          >
                            <MessageSquare className="mr-1 h-4 w-4" />
                            Chat
                          </Button>
                          {group.role !== "Admin" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                              onClick={() => handleLeaveGroup(group.id)}
                            >
                              Leave
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Available Groups */}
              <h2 className="mb-4 mt-8 font-heading text-lg font-semibold">Available Groups ({availableGroups.length})</h2>
              {availableGroups.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <p className="text-slate-400">No more groups available to join.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableGroups.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "grid h-10 w-10 place-content-center rounded-xl",
                            group.type === "PUBLIC" ? "bg-cyan-400/10 text-cyan-400" : "bg-emerald-400/10 text-emerald-400"
                          )}>
                            {group.type === "PUBLIC" ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{group.name}</p>
                            <p className="mt-1 text-sm text-slate-400">{group.topic}</p>
                            <p className="mt-2 text-xs text-slate-500">
                              {group.memberCount} members • {group.type} • Owner: {group.ownerUsername}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {group.type === "PUBLIC" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-xl border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                              onClick={() => handleJoinGroup(group.id)}
                            >
                              Join
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-xl border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                              onClick={() => handleRequestJoin(group.id)}
                            >
                              Request
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* Chat Area */}
            <div className="rounded-3xl border border-white/10 bg-white/5">
              {selectedGroup ? (
                <>
                  <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab("groups")}
                        className="rounded-lg p-2 hover:bg-white/10"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <div>
                        <p className="font-semibold text-white">{selectedGroup.name}</p>
                        <p className="text-xs text-slate-400">
                          {selectedGroup.memberCount} members • {selectedGroup.type}
                        </p>
                      </div>
                    </div>
                    <Shield className="h-5 w-5 text-emerald-400" />
                  </div>

                  {/* Messages */}
                  <div className="h-[400px] overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-slate-400">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "rounded-2xl border p-3",
                            msg.senderUsername === user.username
                              ? "ml-auto max-w-[80%] border-emerald-400/20 bg-emerald-400/5"
                              : "max-w-[80%] border-white/10 bg-white/5"
                          )}
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-medium text-emerald-300">{msg.senderUsername}</span>
                            <span className="text-xs text-slate-500">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-100">{msg.cipherText}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-white/10 p-4">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                    />
                    <Button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="rounded-xl border border-emerald-400/30 bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex h-full items-center justify-center p-8">
                  <p className="text-slate-400">Select a group to start chatting</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Pending Requests (for admins) */}
              {selectedGroup?.role === "Admin" && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-300">
                    <Clock className="h-4 w-4" />
                    Pending Requests ({pendingRequests.length})
                  </h3>
                  {pendingRequests.length === 0 ? (
                    <p className="text-sm text-slate-400">No pending requests</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                          <div>
                            <p className="text-sm font-medium">{request.username}</p>
                            <p className="text-xs text-slate-400">wants to join</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              className="rounded-lg p-2 text-emerald-400 hover:bg-emerald-400/10"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              className="rounded-lg p-2 text-red-400 hover:bg-red-400/10"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* My Requests */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-cyan-300">
                  <Clock className="h-4 w-4" />
                  My Requests ({myRequests.length})
                </h3>
                {myRequests.length === 0 ? (
                  <p className="text-sm text-slate-400">No pending requests</p>
                ) : (
                  <div className="space-y-2">
                    {myRequests.map((request) => (
                      <div key={request.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-sm font-medium">{request.groupName}</p>
                        <p className="text-xs text-amber-400">Waiting for approval</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Group Info */}
              {selectedGroup && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 font-semibold">Group Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name</span>
                      <span className="text-white">{selectedGroup.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className={selectedGroup.type === "PUBLIC" ? "text-cyan-300" : "text-emerald-300"}>
                        {selectedGroup.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Members</span>
                      <span className="text-white">{selectedGroup.memberCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Your Role</span>
                      <span className="text-emerald-300">{selectedGroup.role}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 font-heading text-xl font-semibold">Account Settings</h2>
              <div className="space-y-4">
                <SettingRow label="Username" value={user.username} />
                <SettingRow label="Auth Status" value="Verified" />
                <SettingRow label="Session Status" value="Active" />
                <SettingRow label="Encryption" value="Available (AES-256 + RSA)" />
                <SettingRow label="Token Expiry" value="24 hours" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-slate-300">{label}</span>
      <span className="font-medium text-emerald-300">{value}</span>
    </div>
  )
}
