import { AnonymousSession } from "@/types";

const SESSION_KEY = "mindbridge_anonymous_session";

export function getAnonymousSession(): AnonymousSession {
  const stored = localStorage.getItem(SESSION_KEY);
  
  if (stored) {
    try {
      const session = JSON.parse(stored);
      return {
        ...session,
        createdAt: new Date(session.createdAt)
      };
    } catch {
      // If parsing fails, create a new session
    }
  }
  
  return createAnonymousSession();
}

export function createAnonymousSession(): AnonymousSession {
  const session: AnonymousSession = {
    id: generateSessionId(),
    anonymousId: generateAnonymousId(),
    createdAt: new Date()
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateAnonymousId(): string {
  return (Math.floor(Math.random() * 9999) + 1000).toString();
}

export function clearAnonymousSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
