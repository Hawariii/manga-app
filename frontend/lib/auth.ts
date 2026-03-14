export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}
