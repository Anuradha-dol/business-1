import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Types ──────────────────────────────────────────────────────
export type InvitationType = 'individual' | 'couple' | 'family' | 'custom';

export interface Guest {
  id: string;
  name: string;
  title: string | null;
  invitation_type: InvitationType;
  partner_name: string | null;
  max_guests: number;
  contact: string | null;
  custom_greeting: string | null;
  token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Rsvp {
  id: string;
  guest_id: string;
  status: 'accepted' | 'declined';
  confirmed_guests: number;
  message: string | null;
  responded_at: string;
}

export interface GuestWithRsvp extends Guest {
  rsvp: Rsvp | null;
}

/** Format the Dear [Name] greeting based on invitation type */
export function formatGreeting(guest: Pick<Guest, 'name' | 'title' | 'invitation_type' | 'partner_name'>): string {
  const { name, title, invitation_type, partner_name } = guest;
  const displayName = title ? `${title} ${name}` : name;

  switch (invitation_type) {
    case 'individual': return `Dear ${displayName}`;
    case 'couple':     return `Dear ${name} & ${partner_name ?? 'Partner'}`;
    case 'family':     return `Dear ${name} & Family`;
    case 'custom':     return `Dear ${displayName}${partner_name ? ` & ${partner_name}` : ''} & Family`;
    default:           return `Dear ${displayName}`;
  }
}
