export const SESSION_ID_KEY = 'sessionId';
export const SESSION_ID_EVENT = 'sessionIdChange';

export const storeSessionId = (id) => {
  if (id) localStorage.setItem(SESSION_ID_KEY, id);
  else localStorage.removeItem(SESSION_ID_KEY);
  window.dispatchEvent(new CustomEvent(SESSION_ID_EVENT, { detail: id }));
};

export const getStoredSessionId = () => localStorage.getItem(SESSION_ID_KEY);
