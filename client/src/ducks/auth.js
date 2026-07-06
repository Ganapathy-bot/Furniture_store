const AUTH_SET = 'auth/SET';
const AUTH_CLEAR = 'auth/CLEAR';
const AUTH_LOADING = 'auth/LOADING';
const AUTH_ERROR = 'auth/ERROR';
const AUTH_HYDRATE = 'auth/HYDRATE';

const STORAGE_KEY = 'furnistore_auth';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function saveToStorage({ user, accessToken, refreshToken }) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, accessToken, refreshToken })
    );
  } catch {
    // ignore
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function loadAuthFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function auth(state = initialState, action = {}) {
  switch (action.type) {
    case AUTH_HYDRATE:
      if (!action.payload) return state;
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
      };
    case AUTH_SET:
      saveToStorage(action.payload);
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_CLEAR:
      clearStorage();
      return { ...initialState };
    case AUTH_LOADING:
      return { ...state, isLoading: true, error: null };
    case AUTH_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export function setAuth(payload) {
  return { type: AUTH_SET, payload };
}

export function clearAuth() {
  return { type: AUTH_CLEAR };
}

export function setAuthLoading() {
  return { type: AUTH_LOADING };
}

export function setAuthError(message) {
  return { type: AUTH_ERROR, payload: message };
}

export function hydrateAuth() {
  return { type: AUTH_HYDRATE, payload: loadAuthFromStorage() };
}

export function getUser(state) {
  return state.auth.user;
}

export function isAuthenticated(state) {
  return state.auth.isAuthenticated;
}

export function isAdmin(state) {
  return state.auth.user?.role === 'admin';
}

export function getAccessToken(state) {
  return state.auth.accessToken;
}

export function getRefreshToken(state) {
  return state.auth.refreshToken;
}

export function getAuthError(state) {
  return state.auth.error;
}

export function isAuthLoading(state) {
  return state.auth.isLoading;
}