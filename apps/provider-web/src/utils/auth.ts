import { RoleCard, ROLES_DATA } from '../data/rolesData';

export interface AuthSession {
  role: RoleCard;
  email: string;
  token: string;
  loginAt: number;
}

const AUTH_STORAGE_KEY = 'green_hospital_auth_session';

/**
 * Retrieves the currently authenticated session from localStorage.
 * Validates that the session data is intact and corresponds to an active role.
 */
export const getAuthSession = (): AuthSession | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (!session || !session.role || !session.token) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    // Sync with the master role definitions
    const matched = ROLES_DATA.find((r) => r.id === session.role.id);
    if (!matched) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return {
      ...session,
      role: matched,
    };
  } catch (err) {
    console.error('Error reading auth session:', err);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

/**
 * Saves an authenticated session to localStorage.
 */
export const saveAuthSession = (
  role: RoleCard,
  email?: string,
  token?: string
): AuthSession => {
  const session: AuthSession = {
    role,
    email: email || role.email || `${role.id}@hospital.local`,
    token:
      token ||
      `ghb_auth_${role.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    loginAt: Date.now(),
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
};

/**
 * Clears the active authentication session from localStorage.
 */
export const clearAuthSession = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

/**
 * Returns whether a valid user session is currently authenticated.
 */
export const isAuthenticated = (): boolean => {
  return getAuthSession() !== null;
};

