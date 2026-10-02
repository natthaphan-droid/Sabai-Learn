import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
const UserContext = createContext();
export function UserProvider({ children }) {
  const [user, setUser] = useState(null), [ready, setReady] = useState(false), [data, setData] = useState(null), [error, setError] = useState(''), [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    let live = true;
    api('/auth/me').then(result => { if (live) setUser(result.user); }).catch(() => {}).finally(() => { if (live) setReady(true); });
    const clear = () => { setUser(null); setData(null); };
    window.addEventListener('sabai:unauthorized', clear);
    return () => { live = false; window.removeEventListener('sabai:unauthorized', clear); };
  }, []);
  const reload = useCallback(async () => {
    if (!user || user.mustChange) return;
    setRefreshing(true);
    try { setData(await api(user.role === 'admin' ? '/admin/overview' : '/overview')); setError(''); }
    catch (failure) { setError(failure.message); }
    finally { setRefreshing(false); }
  }, [user]);
  useEffect(() => { reload(); }, [reload]);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') reload(); };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => { window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [reload]);
  async function login(username, password) { const result = await api('/auth/login', { method: 'POST', body: { username, password } }); setData(null); setUser(result.user); setReady(true); return result.user; }
  async function logout() { try { await api('/auth/logout', { method: 'POST' }); } finally { setUser(null); setData(null); } }
  const endSession = () => { setUser(null); setData(null); };
  return <UserContext.Provider value={{ user, ready, data, error, refreshing, reload, login, logout, endSession }}>{children}</UserContext.Provider>;
}
export const useUser = () => useContext(UserContext);
