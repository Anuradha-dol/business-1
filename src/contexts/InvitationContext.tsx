import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, type Guest } from '../lib/supabase';

interface InvitationState {
  guest: Guest | null;
  loading: boolean;
  error: 'invalid' | 'inactive' | null;
  token: string | null;
}

const InvitationContext = createContext<InvitationState>({
  guest: null, loading: false, error: null, token: null,
});

export function InvitationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InvitationState>({
    guest: null, loading: false, error: null, token: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('invite');
    if (!token) return;                           // No token → default experience

    setState(s => ({ ...s, loading: true, token }));

    supabase
      .from('guests')
      .select('*')
      .eq('token', token)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setState({ guest: null, loading: false, error: 'invalid', token });
        } else if (!data.is_active) {
          setState({ guest: null, loading: false, error: 'inactive', token });
        } else {
          setState({ guest: data as Guest, loading: false, error: null, token });
        }
      });
  }, []);

  return (
    <InvitationContext.Provider value={state}>
      {children}
    </InvitationContext.Provider>
  );
}

export const useInvitation = () => useContext(InvitationContext);
