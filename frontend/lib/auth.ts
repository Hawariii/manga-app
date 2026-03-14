export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function notifyAuthChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('auth:change'));
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
  notifyAuthChange();
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  notifyAuthChange();
}
