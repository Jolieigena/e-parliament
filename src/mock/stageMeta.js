import { FileEdit, FileInput, Users2, MessagesSquare, Vote, Stamp, BadgeCheck, XCircle } from 'lucide-react';

export const STAGE_META = {
  Draft: { tone: 'neutral', icon: FileEdit },
  Introduced: { tone: 'info', icon: FileInput },
  'Committee Review': { tone: 'info', icon: Users2 },
  Debate: { tone: 'progress', icon: MessagesSquare },
  Voting: { tone: 'warning', icon: Vote },
  Assent: { tone: 'progress', icon: Stamp },
  Enacted: { tone: 'success', icon: BadgeCheck },
  Rejected: { tone: 'error', icon: XCircle },
  Withdrawn: { tone: 'error', icon: XCircle },
};
