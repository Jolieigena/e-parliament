import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { seedAccounts, seedBills, seedCommittees, seedMembers, seedSession, STAGES } from './entities';
import {
  seedInstitutions,
  seedGovUsers,
  seedGovAccounts,
  seedOversightRequests,
  seedCommitteeRequests,
  seedDocuments,
} from './govEntities';

const STORAGE_KEY = 'ep_internal_v1';

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
  return {
    currentUserId: null,
    accounts: seedAccounts,
    committees: seedCommittees,
    session: seedSession,
    currentGovUserId: null,
    govUsers: seedGovUsers,
    govAccounts: seedGovAccounts,
    institutions: seedInstitutions,
    oversightRequests: seedOversightRequests,
    committeeRequests: seedCommitteeRequests,
    documents: seedDocuments,
    ...loaded,
    members: mergeById(seedMembers, loaded?.members),
    bills: mergeById(seedBills, loaded?.bills),
  };
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
      const newAccount = { email: email.toLowerCase(), memberId };
      return {
        ...state,
        members: [...state.members, newMember],
        accounts: [...state.accounts, newAccount],
      };
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
      bills: state.bills,
      committees: state.committees,
      session: state.session,
      login: (memberId) => dispatch({ type: 'LOGIN', memberId }),
      logout: () => dispatch({ type: 'LOGOUT' }),
      addUser: (name, email, role) => dispatch({ type: 'ADD_USER', name, email, role }),
      advanceStage: (billId, stage, note) => dispatch({ type: 'ADVANCE_STAGE', billId, stage, note }),
      referToCommittee: (billId, committee) => dispatch({ type: 'REFER_TO_COMMITTEE', billId, committee }),
      nextStageOf,
      castVote: (billId, choice) =>
        dispatch({ type: 'CAST_VOTE', billId, voterId: state.currentUserId, choice }),
      advanceOrderPaper: () => dispatch({ type: 'ADVANCE_ORDER_PAPER' }),
      logMeetingMinutes: (committeeId, meetingId, note) =>
        dispatch({ type: 'LOG_MEETING_MINUTES', committeeId, meetingId, note }),

      currentGovUser,
      govUsers: state.govUsers,
      govAccounts: state.govAccounts,
      institutions: state.institutions,
      oversightRequests: state.oversightRequests,
      committeeRequests: state.committeeRequests,
      documents: state.documents,
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
