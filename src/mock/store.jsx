import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { seedAccounts, seedBills, seedCommittees, seedMembers, seedSession, STAGES, IDEA_PETITION_THRESHOLD, seedRolePermissions, ROLE_PALETTE } from './entities';
import {
  seedInstitutions,
  seedGovUsers,
  seedGovAccounts,
  seedOversightRequests,
  seedCommitteeRequests,
  seedDocuments,
} from './govEntities';

const STORAGE_KEY = 'ep_internal_v1';

function petitionFromIdea(idea) {
  return {
    id: `pet-${idea.id}`,
    title: idea.title,
    desc: idea.description,
    goal: 0,
    base: idea.upvotes,
    signed: false,
    status: 'Submitted',
    submittedBy: 'Public',
    sourceIdeaId: idea.id,
    date: idea.date,
  };
}

// Ideas that reach the support threshold graduate into the petitions process.
// They appear in the Clerk's inbox as 'Submitted' for validation before going live.
function applyIdeaPromotions(ideas, petitions) {
  let nextPetitions = petitions;
  const toPromote = ideas.filter(
    (idea) => idea.upvotes >= IDEA_PETITION_THRESHOLD && !petitions.some((p) => p.sourceIdeaId === idea.id),
  );
  if (toPromote.length > 0) {
    nextPetitions = [...petitions, ...toPromote.map(petitionFromIdea)];
  }
  const promotedIds = new Set(toPromote.map((i) => i.id));
  const nextIdeas = promotedIds.size > 0
    ? ideas.map((i) => (promotedIds.has(i.id) ? { ...i, promoted: true } : i))
    : ideas;
  return { ideas: nextIdeas, petitions: nextPetitions };
}

const seedPublicIdeas = [
  {
    id: 'idea-1',
    title: 'Citizen budget consultation',
    category: 'Governance',
    description:
      'Publish the annual budget in plain language and open a public comment period before the final vote.',
    submittedBy: 'Public',
    date: '2026-07-02',
    upvotes: 214,
    voted: false,
  },
  {
    id: 'idea-2',
    title: 'Youth apprenticeship registry',
    category: 'Employment',
    description:
      'Create a public register of government apprenticeship programmes so young people can find openings by region.',
    submittedBy: 'Public',
    date: '2026-07-11',
    upvotes: 158,
    voted: false,
  },
  {
    id: 'idea-3',
    title: 'Regional committee sitting days',
    category: 'Accessibility',
    description:
      'Hold committee sittings in regional centres so citizens outside the capital can attend without travelling.',
    submittedBy: 'Public',
    date: '2026-07-19',
    upvotes: 97,
    voted: false,
  },
];

const seedPetitions = [
  {
    id: 'pet-1',
    title: 'Extend free public transit to students under 18',
    desc: 'Calls on the Assembly to expand the existing transit subsidy to all secondary school students nationwide.',
    goal: 50000,
    base: 38210,
    signed: false,
    status: 'Open',
    submittedBy: 'Public',
    date: '2026-06-10',
  },
  {
    id: 'pet-2',
    title: 'Require published environmental impact reports for all coastal permits',
    desc: 'Asks committees to make environmental assessments public before approving coastal development.',
    goal: 50000,
    base: 12480,
    signed: false,
    status: 'Open',
    submittedBy: 'Public',
    date: '2026-06-21',
  },
  {
    id: 'pet-3',
    title: 'Faster appeals process for Freedom of Information refusals',
    desc: 'Requests a statutory 30-day limit on appeals when an information request is refused.',
    goal: 10000,
    base: 9120,
    signed: false,
    status: 'Open',
    submittedBy: 'Public',
    date: '2026-07-02',
  },
  {
    id: 'pet-4',
    title: 'Guarantee a minimum number of rural broadband installers',
    desc: 'Asks that the Digital Infrastructure rollout guarantee installer capacity in low-density regions, not just funding.',
    goal: 10000,
    base: 6710,
    signed: false,
    status: 'Open',
    submittedBy: 'Public',
    date: '2026-07-08',
  },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Cached state may predate a seed array gaining new entries (e.g. a newly
// added government-sponsored bill) or new fields on existing entries (e.g.
// the `party` field added to members) — a blind spread would let stale
// cached records hide new bills or silently drop new fields forever, so
// merge by id and backfill any fields the seed has that the cached record
// doesn't, rather than overwriting.
function mergeById(seedArr, loadedArr) {
  if (!loadedArr) return seedArr;
  const seedById = new Map(seedArr.map((x) => [x.id, x]));
  const merged = loadedArr.map((x) => ({ ...seedById.get(x.id), ...x }));
  const loadedIds = new Set(loadedArr.map((x) => x.id));
  return [...merged, ...seedArr.filter((x) => !loadedIds.has(x.id))];
}

function initialState() {
  const loaded = loadState();
  const state = {
    currentUserId: null,
    accounts: seedAccounts,
    roles: seedRolePermissions,
    committees: seedCommittees,
    session: seedSession,
    currentGovUserId: null,
    govUsers: seedGovUsers,
    govAccounts: seedGovAccounts,
    institutions: seedInstitutions,
    oversightRequests: seedOversightRequests,
    committeeRequests: seedCommitteeRequests,
    documents: seedDocuments,
    publicIdeas: seedPublicIdeas,
    petitions: seedPetitions,
    ...loaded,
    members: mergeById(seedMembers, loaded?.members),
    bills: mergeById(seedBills, loaded?.bills),
  };
  // Cached accounts may predate a newly seeded account — backfill any seed
  // account that is missing so new demo accounts (e.g. the superuser) work
  // without clearing localStorage. Prepend so the newest demo accounts lead.
  seedAccounts.forEach((seed) => {
    if (!state.accounts.some((a) => a.memberId === seed.memberId)) {
      state.accounts = [seed, ...state.accounts];
    }
  });
  // Accounts created before account status existed default to active.
  state.accounts = state.accounts.map((a) => ({ active: true, ...a }));
  // Cached state may predate the roles/permissions feature — seed any built-in
  // role that is missing so customised roles survive reloads while new roles
  // are still available. Existing role definitions (incl. edited permissions)
  // are never overwritten.
  seedRolePermissions.forEach((seed) => {
    if (!state.roles.some((r) => r.name === seed.name)) {
      state.roles.push({ name: seed.name, color: ROLE_PALETTE[state.roles.length % ROLE_PALETTE.length], ...seed });
    }
  });
  const promoted = applyIdeaPromotions(state.publicIdeas, state.petitions);
  return { ...state, publicIdeas: promoted.ideas, petitions: promoted.petitions };
}

function nextStageOf(stage) {
  const idx = STAGES.indexOf(stage);
  if (idx === -1 || idx === STAGES.length - 1) return null;
  return STAGES[idx + 1];
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUserId: action.memberId };
    case 'LOGOUT':
      return { ...state, currentUserId: null };
    case 'ADD_USER': {
      const { name, email, role } = action;
      const memberId = `m-${Date.now()}`;
      const newMember = {
        id: memberId,
        name,
        roles: [role],
        constituency: role === 'MP' ? 'Unassigned constituency' : null,
        committees: [],
      };
      const newAccount = { email: email.toLowerCase(), memberId, active: true };
      return {
        ...state,
        members: [...state.members, newMember],
        accounts: [...state.accounts, newAccount],
      };
    }
    case 'UPDATE_USER_ROLE': {
      const { memberId, role } = action;
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === memberId ? { ...m, roles: [role] } : m,
        ),
      };
    }
    case 'TOGGLE_ACCOUNT_STATUS': {
      const { memberId } = action;
      return {
        ...state,
        accounts: state.accounts.map((a) =>
          a.memberId === memberId ? { ...a, active: !(a.active ?? true) } : a,
        ),
      };
    }
    case 'CREATE_ROLE': {
      const { name } = action;
      const role = {
        name,
        color: ROLE_PALETTE[state.roles.length % ROLE_PALETTE.length],
        permissions: [],
      };
      return { ...state, roles: [...state.roles, role] };
    }
    case 'SET_ROLE_PERMISSIONS': {
      const { role, permissions } = action;
      return {
        ...state,
        roles: state.roles.map((r) =>
          r.name === role ? { ...r, permissions } : r,
        ),
      };
    }
    case 'DELETE_ROLE': {
      const { role } = action;
      return { ...state, roles: state.roles.filter((r) => r.name !== role) };
    }
    case 'ADVANCE_STAGE': {
      const { billId, stage, note } = action;
      return {
        ...state,
        bills: state.bills.map((b) => {
          if (b.id !== billId) return b;
          return {
            ...b,
            stage,
            history: [
              ...b.history,
              { stage, date: new Date().toISOString().slice(0, 10), note: note || 'Stage updated.' },
            ],
          };
        }),
      };
    }
    case 'REFER_TO_COMMITTEE': {
      const { billId, committee } = action;
      return {
        ...state,
        bills: state.bills.map((b) => {
          if (b.id !== billId) return b;
          return {
            ...b,
            committee,
            stage: 'Committee Review',
            history: [
              ...b.history,
              {
                stage: 'Committee Review',
                date: new Date().toISOString().slice(0, 10),
                note: `Referred to the ${committee}.`,
              },
            ],
          };
        }),
      };
    }
    case 'CAST_VOTE': {
      const { billId, voterId, choice } = action;
      return {
        ...state,
        bills: state.bills.map((b) => {
          if (b.id !== billId || b.stage !== 'Voting' || b.voters[voterId]) return b;
          return {
            ...b,
            votes: { ...b.votes, [choice]: b.votes[choice] + 1 },
            voters: { ...b.voters, [voterId]: choice },
          };
        }),
      };
    }
    case 'LOG_MEETING_MINUTES': {
      const { committeeId, meetingId, note } = action;
      return {
        ...state,
        committees: state.committees.map((c) => {
          if (c.id !== committeeId) return c;
          return {
            ...c,
            meetings: c.meetings.map((m) =>
              m.id === meetingId ? { ...m, status: 'Held', note } : m,
            ),
          };
        }),
      };
    }
    case 'ADVANCE_ORDER_PAPER': {
      const maxIdx = state.session.orderPaper.length - 1;
      const nextIdx = Math.min(state.session.currentItemIndex + 1, maxIdx);
      return { ...state, session: { ...state.session, currentItemIndex: nextIdx } };
    }
    case 'SET_SESSION_LIVE':
      return { ...state, session: { ...state.session, live: action.live } };
    case 'GOV_LOGIN':
      return { ...state, currentGovUserId: action.govUserId };
    case 'GOV_LOGOUT':
      return { ...state, currentGovUserId: null };
    case 'SUBMIT_GOVERNMENT_BILL': {
      const { title, category, summary, institutionId } = action;
      const institution = state.institutions.find((i) => i.id === institutionId);
      const newBill = {
        id: `bill-${Date.now()}`,
        title,
        category,
        sponsorId: null,
        sponsorType: 'Government',
        institutionId,
        committee: null,
        stage: 'Draft',
        summary,
        history: [
          {
            stage: 'Draft',
            date: new Date().toISOString().slice(0, 10),
            note: `Submitted by the ${institution?.name || 'sponsoring institution'} for parliamentary consideration.`,
          },
        ],
        amendments: [],
        votes: { aye: 0, nay: 0, abstain: 0 },
        voters: {},
      };
      return { ...state, bills: [...state.bills, newBill] };
    }
    case 'RESPOND_TO_OVERSIGHT': {
      const { requestId, response } = action;
      return {
        ...state,
        oversightRequests: state.oversightRequests.map((r) =>
          r.id === requestId
            ? { ...r, status: 'Responded', response, responseDate: new Date().toISOString().slice(0, 10) }
            : r,
        ),
      };
    }
    case 'RESPOND_TO_COMMITTEE_REQUEST': {
      const { requestId, responseNote } = action;
      return {
        ...state,
        committeeRequests: state.committeeRequests.map((r) =>
          r.id === requestId ? { ...r, status: 'Responded', responseNote } : r,
        ),
      };
    }
    case 'CALL_DIVISION': {
      const { billId, results } = action;
      return {
        ...state,
        bills: state.bills.map((b) => {
          if (b.id !== billId || b.stage !== 'Voting') return b;
          const voters = { ...b.voters };
          const votes = { ...b.votes };
          results.forEach(({ voterId, choice }) => {
            if (voters[voterId]) return;
            voters[voterId] = choice;
            votes[choice] += 1;
          });
          return { ...b, voters, votes };
        }),
      };
    }
    case 'SUBMIT_DOCUMENT': {
      const { institutionId, subject } = action;
      const newDoc = {
        id: `doc-${Date.now()}`,
        institutionId,
        direction: 'outbound',
        subject,
        date: new Date().toISOString().slice(0, 10),
        status: 'Sent',
      };
      return { ...state, documents: [...state.documents, newDoc] };
    }
    case 'CREATE_OVERSIGHT_REQUEST': {
      const { institutionId, subject, body, dueDate } = action;
      const newReq = {
        id: `ov-${Date.now()}`,
        institutionId,
        subject,
        body,
        dueDate,
        status: 'Pending',
      };
      return { ...state, oversightRequests: [newReq, ...state.oversightRequests] };
    }
    case 'PROPOSE_AMENDMENT': {
      const { billId, title, clause, originalText, proposedText, proposerId } = action;
      const newAmendment = {
        id: `am-${Date.now()}`,
        title,
        clause,
        originalText,
        proposedText,
        proposerId,
        status: 'Pending',
        date: new Date().toISOString().slice(0, 10),
      };
      return {
        ...state,
        bills: state.bills.map((b) =>
          b.id === billId ? { ...b, amendments: [...b.amendments, newAmendment] } : b
        ),
      };
    }
    case 'SUBMIT_IDEA': {
      const { title, category, description } = action;
      const newIdea = {
        id: `idea-${Date.now()}`,
        title,
        category,
        description,
        submittedBy: 'Public',
        date: new Date().toISOString().slice(0, 10),
        upvotes: 1,
        voted: true,
      };
      return { ...state, publicIdeas: [newIdea, ...state.publicIdeas] };
    }
    case 'UPVOTE_IDEA': {
      const { ideaId } = action;
      let publicIdeas = state.publicIdeas.map((i) => {
        if (i.id !== ideaId || i.voted) return i;
        return { ...i, upvotes: i.upvotes + 1, voted: true };
      });
      let petitions = state.petitions;
      const idea = publicIdeas.find((i) => i.id === ideaId);
      if (
        idea &&
        idea.upvotes >= IDEA_PETITION_THRESHOLD &&
        !idea.promoted &&
        !petitions.some((p) => p.sourceIdeaId === idea.id)
      ) {
        publicIdeas = publicIdeas.map((i) => (i.id === ideaId ? { ...i, promoted: true } : i));
        petitions = [...petitions, petitionFromIdea(idea)];
      }
      return { ...state, publicIdeas, petitions };
    }
    case 'SUBMIT_PETITION': {
      const { title, desc } = action;
      const newPetition = {
        id: `pet-${Date.now()}`,
        title,
        desc,
        goal: 0,
        base: 0,
        signed: false,
        status: 'Submitted',
        submittedBy: 'Public',
        date: new Date().toISOString().slice(0, 10),
      };
      return { ...state, petitions: [newPetition, ...state.petitions] };
    }
    case 'CREATE_PETITION': {
      const { title, desc, goal } = action;
      const newPetition = {
        id: `pet-${Date.now()}`,
        title,
        desc,
        goal: goal || 10000,
        base: 0,
        signed: false,
        status: 'Open',
        submittedBy: 'Clerk',
        date: new Date().toISOString().slice(0, 10),
      };
      return { ...state, petitions: [newPetition, ...state.petitions] };
    }
    case 'OPEN_PETITION': {
      const { petitionId, goal } = action;
      return {
        ...state,
        petitions: state.petitions.map((p) =>
          p.id === petitionId
            ? { ...p, status: 'Open', goal: goal || p.goal || 10000, openedBy: 'Clerk' }
            : p,
        ),
      };
    }
    case 'REJECT_PETITION': {
      const { petitionId, reason } = action;
      return {
        ...state,
        petitions: state.petitions.map((p) =>
          p.id === petitionId ? { ...p, status: 'Rejected', reason } : p,
        ),
      };
    }
    case 'SIGN_PETITION': {
      const { petitionId } = action;
      return {
        ...state,
        petitions: state.petitions.map((p) => {
          if (p.id !== petitionId || p.status !== 'Open' || p.signed) return p;
          return { ...p, base: p.base + 1, signed: true };
        }),
      };
    }
    case 'RESPOND_TO_PETITION': {
      const { petitionId, response } = action;
      return {
        ...state,
        petitions: state.petitions.map((p) =>
          p.id === petitionId
            ? { ...p, status: 'Responded', response, responseDate: new Date().toISOString().slice(0, 10) }
            : p,
        ),
      };
    }
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentUser = state.members.find((m) => m.id === state.currentUserId) || null;
  const currentGovUser = state.govUsers.find((u) => u.id === state.currentGovUserId) || null;

  const value = useMemo(
    () => ({
      currentUser,
      members: state.members,
      accounts: state.accounts,
      roles: state.roles,
      bills: state.bills,
      committees: state.committees,
      session: state.session,
      login: (memberId) => dispatch({ type: 'LOGIN', memberId }),
      logout: () => dispatch({ type: 'LOGOUT' }),
      addUser: (name, email, role) => dispatch({ type: 'ADD_USER', name, email, role }),
      updateUserRole: (memberId, role) => dispatch({ type: 'UPDATE_USER_ROLE', memberId, role }),
      toggleAccountStatus: (memberId) => dispatch({ type: 'TOGGLE_ACCOUNT_STATUS', memberId }),
      createRole: (name) => dispatch({ type: 'CREATE_ROLE', name }),
      setRolePermissions: (role, permissions) => dispatch({ type: 'SET_ROLE_PERMISSIONS', role, permissions }),
      deleteRole: (role) => dispatch({ type: 'DELETE_ROLE', role }),
      advanceStage: (billId, stage, note) => dispatch({ type: 'ADVANCE_STAGE', billId, stage, note }),
      referToCommittee: (billId, committee) => dispatch({ type: 'REFER_TO_COMMITTEE', billId, committee }),
      nextStageOf,
      castVote: (billId, choice) =>
        dispatch({ type: 'CAST_VOTE', billId, voterId: state.currentUserId, choice }),
      advanceOrderPaper: () => dispatch({ type: 'ADVANCE_ORDER_PAPER' }),
      setSessionLive: (live) => dispatch({ type: 'SET_SESSION_LIVE', live }),
      logMeetingMinutes: (committeeId, meetingId, note) =>
        dispatch({ type: 'LOG_MEETING_MINUTES', committeeId, meetingId, note }),

      currentGovUser,
      govUsers: state.govUsers,
      govAccounts: state.govAccounts,
      institutions: state.institutions,
      oversightRequests: state.oversightRequests,
      committeeRequests: state.committeeRequests,
      documents: state.documents,
      publicIdeas: state.publicIdeas,
      govLogin: (govUserId) => dispatch({ type: 'GOV_LOGIN', govUserId }),
      govLogout: () => dispatch({ type: 'GOV_LOGOUT' }),
      submitGovernmentBill: (title, category, summary, institutionId) =>
        dispatch({ type: 'SUBMIT_GOVERNMENT_BILL', title, category, summary, institutionId }),
      respondToOversight: (requestId, response) =>
        dispatch({ type: 'RESPOND_TO_OVERSIGHT', requestId, response }),
      respondToCommitteeRequest: (requestId, responseNote) =>
        dispatch({ type: 'RESPOND_TO_COMMITTEE_REQUEST', requestId, responseNote }),
      submitDocument: (institutionId, subject) =>
        dispatch({ type: 'SUBMIT_DOCUMENT', institutionId, subject }),
      createOversightRequest: (institutionId, subject, body, dueDate) =>
        dispatch({ type: 'CREATE_OVERSIGHT_REQUEST', institutionId, subject, body, dueDate }),
      proposeAmendment: (billId, title, clause, originalText, proposedText, proposerId) =>
        dispatch({ type: 'PROPOSE_AMENDMENT', billId, title, clause, originalText, proposedText, proposerId }),
      submitIdea: (title, category, description) =>
        dispatch({ type: 'SUBMIT_IDEA', title, category, description }),
      upvoteIdea: (ideaId) => dispatch({ type: 'UPVOTE_IDEA', ideaId }),
      petitions: state.petitions,
      submitPetition: (title, desc) => dispatch({ type: 'SUBMIT_PETITION', title, desc }),
      createPetition: (title, desc, goal) => dispatch({ type: 'CREATE_PETITION', title, desc, goal }),
      openPetition: (petitionId, goal) => dispatch({ type: 'OPEN_PETITION', petitionId, goal }),
      rejectPetition: (petitionId, reason) =>
        dispatch({ type: 'REJECT_PETITION', petitionId, reason }),
      signPetition: (petitionId) => dispatch({ type: 'SIGN_PETITION', petitionId }),
      respondToPetition: (petitionId, response) =>
        dispatch({ type: 'RESPOND_TO_PETITION', petitionId, response }),
      callDivision: (billId, results) => dispatch({ type: 'CALL_DIVISION', billId, results }),
    }),
    [state, currentUser, currentGovUser],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
