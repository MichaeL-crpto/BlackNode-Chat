const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export interface AuthResponse {
  token: string;
  username: string;
  hasPublicKey: boolean;
}

export interface UserResponse {
  id: number;
  username: string;
  hasPublicKey: boolean;
  createdAt: string;
}

export interface GroupResponse {
  id: number;
  name: string;
  topic: string;
  type: "PUBLIC" | "PRIVATE";
  ownerUsername: string;
  memberCount: number;
  joined: boolean;
  role: string;
  createdAt: string;
}

export interface JoinRequestResponse {
  id: number;
  groupId: number;
  groupName: string;
  username: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface GroupMessageResponse {
  id: number;
  groupId: number;
  senderUsername: string;
  cipherText: string;
  initializationVector: string;
  senderEncryptedAesKey: string;
  algorithm: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("blacknode.token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      } catch {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("HTTP")) {
      throw error;
    }
    throw new Error(`Network error: Unable to connect to ${API_BASE_URL}. Is the backend running?`);
  }
}

export const api = {
  auth: {
    register: (username: string, password: string) =>
      request<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),

    login: (username: string, password: string) =>
      request<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
  },

  users: {
    me: () => request<UserResponse>("/api/users/me"),
    list: () => request<UserResponse[]>("/api/users"),
    uploadPublicKey: (publicKey: string) =>
      request<UserResponse>("/api/users/me/public-key", {
        method: "PUT",
        body: JSON.stringify({ publicKey }),
      }),
  },

  groups: {
    list: () => request<GroupResponse[]>("/api/groups"),
    create: (name: string, topic: string, type: "PUBLIC" | "PRIVATE") =>
      request<GroupResponse>("/api/groups", {
        method: "POST",
        body: JSON.stringify({ name, topic, type }),
      }),
    join: (groupId: number) =>
      request<GroupResponse>(`/api/groups/${groupId}/join`, { method: "POST" }),
    leave: (groupId: number) =>
      request<GroupResponse>(`/api/groups/${groupId}/leave`, { method: "POST" }),
    requestJoin: (groupId: number) =>
      request<JoinRequestResponse>(`/api/groups/${groupId}/request-join`, { method: "POST" }),
    getPendingRequests: (groupId: number) =>
      request<JoinRequestResponse[]>(`/api/groups/${groupId}/requests`),
    getMyRequests: () =>
      request<JoinRequestResponse[]>("/api/groups/my-requests"),
    approveRequest: (requestId: number) =>
      request<JoinRequestResponse>(`/api/groups/requests/${requestId}/approve`, { method: "PUT" }),
    rejectRequest: (requestId: number) =>
      request<JoinRequestResponse>(`/api/groups/requests/${requestId}/reject`, { method: "PUT" }),
  },

  messages: {
    send: (groupId: number, content: string) =>
      request<GroupMessageResponse>(`/api/groups/${groupId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
    list: (groupId: number) =>
      request<GroupMessageResponse[]>(`/api/groups/${groupId}/messages`),
  },
};
