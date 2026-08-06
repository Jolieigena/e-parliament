import { UserRound, Gavel, ScrollText, UserCog, Crown } from 'lucide-react';

export const ROLE_ICONS = {
  MP: UserRound,
  Speaker: Gavel,
  Clerk: ScrollText,
  Administrator: UserCog,
  Superuser: Crown,
};

// Custom roles created by a superuser fall back to a generic icon.
export const DEFAULT_ROLE_ICON = UserCog;

export const ROLE_TONE = {
  MP: 'info',
  Speaker: 'progress',
  Clerk: 'neutral',
  Administrator: 'success',
  Superuser: 'warning',
};
