import { Session, type SessionConfig } from './Session.js';

export class SessionManager {
  private sessions: Map<string, Session> = new Map();

  public createSession(config: SessionConfig): Session {
    if (this.sessions.has(config.sessionId)) {
      throw new Error(`Session '${config.sessionId}' already exists`);
    }
    const session = new Session(config);
    this.sessions.set(config.sessionId, session);
    return session;
  }

  public getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  public removeSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  public listSessions(): readonly Session[] {
    return Array.from(this.sessions.values());
  }
}
