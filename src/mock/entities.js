export const STAGES = ['Draft', 'Introduced', 'Committee Review', 'Debate', 'Voting', 'Assent', 'Enacted'];
export const TERMINAL_EXITS = ['Withdrawn', 'Rejected'];
export const ROLES = ['MP', 'Speaker', 'Clerk', 'Administrator', 'Superuser'];
export const IDEA_PETITION_THRESHOLD = 100;

// Capability catalogue — every action a role can be granted in the system.
export const PERMISSIONS = [
  { id: 'view_overview', label: 'View overview dashboard', desc: 'See the role-specific overview page.' },
  { id: 'manage_bills', label: 'Manage bills & stages', desc: 'Advance bills through the legislative stages.' },
  { id: 'manage_committees', label: 'Manage committees & meetings', desc: 'Schedule committee meetings and log minutes.' },
  { id: 'manage_sitting', label: 'Run plenary sitting', desc: 'Open/adjourn sittings and steer the order paper.' },
  { id: 'manage_petitions', label: 'Validate & respond to petitions', desc: 'Approve, open, reject, or respond to petitions.' },
  { id: 'manage_users', label: 'Manage user accounts', desc: 'Create accounts and change member roles.' },
  { id: 'manage_roles', label: 'Manage roles & permissions', desc: 'Create roles and assign permissions.' },
  { id: 'view_records', label: 'View voting records', desc: 'Browse recorded divisions and outcomes.' },
  { id: 'view_reports', label: 'View reports', desc: 'Read chamber and committee reports.' },
  { id: 'manage_documents', label: 'Manage official documents', desc: 'Submit and organise official documents.' },
];

export const ROLE_COLORS = {
  MP: '#3B6E8F',
  Speaker: '#B8862E',
  Clerk: '#7A5AA6',
  Administrator: '#4C7A3A',
  Superuser: '#B8433E',
};

// Palette drawn from when a superuser creates a brand-new role.
export const ROLE_PALETTE = ['#3B6E8F', '#B8862E', '#7A5AA6', '#4C7A3A', '#2F6B5F', '#8A4B6E', '#8A6D2F', '#5A5FA0'];

// Default permission grants per built-in role. Superuser holds every capability.
export const seedRolePermissions = [
  { name: 'MP', permissions: ['view_overview', 'manage_bills', 'view_records'] },
  { name: 'Speaker', permissions: ['view_overview', 'manage_bills', 'manage_sitting', 'view_records', 'view_reports'] },
  { name: 'Clerk', permissions: ['view_overview', 'manage_bills', 'manage_petitions', 'manage_documents', 'view_records', 'view_reports'] },
  { name: 'Administrator', permissions: ['view_overview', 'manage_users', 'view_records', 'view_reports', 'manage_documents'] },
  { name: 'Superuser', permissions: PERMISSIONS.map((p) => p.id) },
];

export const PARTIES = [
  { id: 'party-progressive', name: 'Progressive Alliance', color: '#3B6E8F' },
  { id: 'party-unity', name: 'National Unity Party', color: '#4C7A3A' },
  { id: 'party-reform', name: 'Reform Alliance', color: '#B8862E' },
];

export const seedMembers = [
  {
    id: 'm-mensah',
    name: 'Hon. A. Mensah',
    roles: ['MP'],
    party: 'party-progressive',
    constituency: 'Accra Central',
    committees: [{ name: 'Judiciary Committee', role: 'Member' }],
  },
  {
    id: 'm-okafor',
    name: 'Hon. R. Okafor',
    roles: ['MP'],
    party: 'party-unity',
    constituency: 'Enugu North',
    committees: [{ name: 'Health Committee', role: 'Chair' }],
  },
  {
    id: 'm-adeyemi',
    name: 'Hon. T. Adeyemi',
    roles: ['MP'],
    party: 'party-reform',
    constituency: 'Lagos West',
    committees: [{ name: 'Finance Committee', role: 'Member' }],
  },
  {
    id: 'm-nabwire',
    name: 'Hon. P. Nabwire',
    roles: ['MP'],
    party: 'party-reform',
    constituency: 'Kampala Central',
    committees: [{ name: 'Judiciary Committee', role: 'Chair' }],
  },
  {
    id: 'm-kariuki',
    name: 'Hon. F. Kariuki',
    roles: ['MP'],
    party: 'party-unity',
    constituency: 'Mombasa South',
    committees: [{ name: 'Finance Committee', role: 'Chair' }],
  },
  {
    id: 'm-kamau',
    name: 'Hon. S. Kamau',
    roles: ['Speaker'],
    party: null,
    constituency: 'Nairobi East',
    committees: [],
  },
  {
    id: 'm-owusu',
    name: 'Ms. L. Owusu',
    roles: ['Clerk'],
    party: null,
    constituency: null,
    committees: [{ name: 'Health Committee', role: 'Secretary' }],
  },
  {
    id: 'm-bahati',
    name: 'Mr. D. Bahati',
    roles: ['Administrator'],
    party: null,
    constituency: null,
    committees: [],
  },
  {
    id: 'm-super',
    name: 'Mr. K. Odhiambo',
    roles: ['Superuser'],
    party: null,
    constituency: null,
    committees: [],
  },
  {
    id: 'm-achebe',
    name: 'Hon. J. Achebe',
    roles: ['MP'],
    party: 'party-progressive',
    constituency: 'Ibadan North',
    committees: [
      { name: 'Judiciary Committee', role: 'Member' },
      { name: 'Education Committee', role: 'Member' },
    ],
  },
  {
    id: 'm-chikwava',
    name: 'Hon. W. Chikwava',
    roles: ['MP'],
    party: 'party-reform',
    constituency: 'Bulawayo South',
    committees: [{ name: 'Finance Committee', role: 'Member' }],
  },
  {
    id: 'm-muthoni',
    name: 'Hon. E. Muthoni',
    roles: ['MP'],
    party: 'party-progressive',
    constituency: 'Nyeri Central',
    committees: [{ name: 'Health Committee', role: 'Member' }],
  },
  {
    id: 'm-osafo',
    name: 'Hon. D. Osafo',
    roles: ['MP'],
    party: 'party-unity',
    constituency: 'Kumasi South',
    committees: [{ name: 'Education Committee', role: 'Chair' }],
  },
];

// Backbench MPs — no committee seats or sponsored bills (realistic; most real
// MPs don't sit on every committee), added purely so the chamber has a
// full-size 120-seat body for the Hemicycle to render as an actual dome
// instead of a sparse handful of dots. Names/constituencies are generated
// deterministically (not random) so the seed data is stable across reloads.
const FILLER_FIRST_NAMES = [
  'Kwame', 'Amara', 'Tunde', 'Zola', 'Kofi', 'Aisha', 'Emeka', 'Fatima', 'Chidi', 'Naledi',
  'Femi', 'Abena', 'Ola', 'Nia', 'Sipho', 'Yaa', 'Ade', 'Thandiwe', 'Kojo', 'Zainab',
  'Chike', 'Amina', 'Kwabena', 'Wanjiru', 'Sekou', 'Adaeze', 'Bongani', 'Efua', 'Malik', 'Nkechi',
];
const FILLER_LAST_NAMES = [
  'Boateng', 'Nkosi', 'Adebayo', 'Mwangi', 'Osei', 'Chukwu', 'Diallo', 'Mensah', 'Odhiambo', 'Sarpong',
  'Nwachukwu', 'Kamara', 'Abara', 'Otieno', 'Asante', 'Mutua', 'Eze', 'Banda', 'Appiah', 'Kariba',
];
const FILLER_CONSTITUENCIES = [
  'Accra Central', 'Enugu North', 'Lagos West', 'Kampala Central', 'Mombasa South', 'Nairobi East',
  'Ibadan North', 'Bulawayo South', 'Nyeri Central', 'Kumasi South', 'Freetown East', 'Harare West',
  'Kigali South', 'Lusaka North', 'Kaduna Central', 'Kisumu East', 'Tema West', 'Abuja South',
  'Dar es Salaam North', 'Kano Central',
];

function buildFillerMPs(count) {
  const partyIds = PARTIES.map((p) => p.id);
  const mps = [];
  for (let i = 0; i < count; i++) {
    const first = FILLER_FIRST_NAMES[i % FILLER_FIRST_NAMES.length];
    const last = FILLER_LAST_NAMES[(i * 7 + 3) % FILLER_LAST_NAMES.length];
    const constituencyBase = FILLER_CONSTITUENCIES[i % FILLER_CONSTITUENCIES.length];
    const cycle = Math.floor(i / FILLER_CONSTITUENCIES.length) + 2;
    mps.push({
      id: `m-fill-${i}`,
      name: `Hon. ${first[0]}. ${last}`,
      roles: ['MP'],
      party: partyIds[i % partyIds.length],
      constituency: `${constituencyBase} ${cycle}`,
      committees: [],
    });
  }
  return mps;
}

seedMembers.push(...buildFillerMPs(111));

export const seedBills = [
  {
    id: 'bill-judicial',
    title: 'Judicial Procedures Amendment Act',
    category: 'Judiciary',
    sponsorId: 'm-mensah',
    committee: 'Judiciary Committee',
    stage: 'Committee Review',
    summary:
      'Revises Section 4 of the Judicial Procedures Act to streamline appellate review timelines and reduce case backlog.',
    history: [
      { stage: 'Draft', date: '2026-05-04', note: 'Drafted by sponsor with Legislative Services.' },
      { stage: 'Introduced', date: '2026-05-19', note: 'First reading completed on the floor.' },
      { stage: 'Committee Review', date: '2026-06-02', note: 'Referred to the Judiciary Committee for review.' },
    ],
    amendments: [],
    votes: { aye: 0, nay: 0, abstain: 0 },
    voters: {},
  },
  {
    id: 'bill-health',
    title: 'Universal Health Coverage Act',
    category: 'Public Health',
    sponsorId: 'm-okafor',
    committee: null,
    stage: 'Draft',
    summary:
      'Expands universal coverage eligibility and modernizes reimbursement rules for public hospitals.',
    history: [{ stage: 'Draft', date: '2026-07-10', note: 'Drafted by sponsor with Legislative Services.' }],
    amendments: [],
    votes: { aye: 0, nay: 0, abstain: 0 },
    voters: {},
  },
  {
    id: 'bill-infra',
    title: 'Infrastructure Budget 2026',
    category: 'Budget',
    sponsorId: 'm-adeyemi',
    committee: 'Finance Committee',
    stage: 'Debate',
    summary:
      'Allocates national budget funds for road, rail, and broadband infrastructure projects through 2026.',
    history: [
      { stage: 'Draft', date: '2026-04-02', note: 'Drafted by sponsor with Legislative Services.' },
      { stage: 'Introduced', date: '2026-04-20', note: 'First reading completed on the floor.' },
      { stage: 'Committee Review', date: '2026-05-05', note: 'Reviewed by the Finance Committee.' },
      { stage: 'Debate', date: '2026-07-28', note: 'Second reading debate opened in Sitting 104.' },
    ],
    amendments: [
      { id: 'am-1', title: 'Increase rural broadband allocation by 12%', proposerId: 'm-mensah', status: 'Pending' },
      { id: 'am-2', title: 'Add coastal road maintenance clause', proposerId: 'm-okafor', status: 'Pending' },
    ],
    votes: { aye: 28, nay: 9, abstain: 5 },
    voters: {},
  },
  {
    id: 'bill-education',
    title: 'Digital Education Bill',
    category: 'Education',
    sponsorId: 'm-mensah',
    committee: null,
    stage: 'Introduced',
    summary: 'Establishes funding and standards for digital learning infrastructure in public schools.',
    history: [
      { stage: 'Draft', date: '2026-06-15', note: 'Drafted by sponsor with Legislative Services.' },
      { stage: 'Introduced', date: '2026-07-14', note: 'First reading completed on the floor.' },
    ],
    amendments: [],
    votes: { aye: 0, nay: 0, abstain: 0 },
    voters: {},
  },
  {
    id: 'bill-energy',
    title: 'Energy Act 2026',
    category: 'Energy',
    sponsorId: 'm-adeyemi',
    committee: 'Finance Committee',
    stage: 'Enacted',
    summary: 'National energy policy covering renewable subsidies and grid modernization.',
    history: [
      { stage: 'Draft', date: '2026-01-08', note: 'Drafted by sponsor with Legislative Services.' },
      { stage: 'Introduced', date: '2026-01-22', note: 'First reading completed on the floor.' },
      { stage: 'Committee Review', date: '2026-02-10', note: 'Reviewed by the Finance Committee.' },
      { stage: 'Debate', date: '2026-03-01', note: 'Second reading debate concluded.' },
      { stage: 'Voting', date: '2026-03-08', note: 'Passed third reading, 51 Aye / 8 Nay / 2 Abstain.' },
      { stage: 'Assent', date: '2026-03-22', note: 'Assented to by the Head of State.' },
      { stage: 'Enacted', date: '2026-04-01', note: 'Gazetted and entered into force.' },
    ],
    amendments: [],
    votes: { aye: 51, nay: 8, abstain: 2 },
    voters: {},
  },
  {
    id: 'bill-digitalid',
    title: 'National Digital Identity Bill',
    category: 'Judiciary',
    sponsorId: null,
    sponsorType: 'Government',
    institutionId: 'inst-justice',
    committee: null,
    stage: 'Draft',
    summary: 'Establishes a national digital identity framework and legal recognition standards administered by the Ministry of Justice.',
    history: [
      { stage: 'Draft', date: '2026-07-20', note: 'Submitted by the Ministry of Justice for parliamentary consideration.' },
    ],
    amendments: [],
    votes: { aye: 0, nay: 0, abstain: 0 },
    voters: {},
  },
  {
    id: 'bill-schoolfeeding',
    title: 'School Feeding Programme Act',
    category: 'Education',
    sponsorId: 'm-osafo',
    committee: 'Education Committee',
    stage: 'Committee Review',
    summary: 'Establishes a national school feeding programme for public primary schools, funded through a dedicated education levy.',
    history: [
      { stage: 'Draft', date: '2026-05-18', note: 'Drafted by sponsor with Legislative Services.' },
      { stage: 'Introduced', date: '2026-06-01', note: 'First reading completed on the floor.' },
      { stage: 'Committee Review', date: '2026-06-20', note: 'Referred to the Education Committee for review.' },
    ],
    amendments: [],
    votes: { aye: 0, nay: 0, abstain: 0 },
    voters: {},
  },
  {
    id: 'bill-teacherwelfare',
    title: 'Teacher Welfare and Housing Bill',
    category: 'Education',
    sponsorId: 'm-osafo',
    committee: null,
    stage: 'Introduced',
    summary: 'Establishes housing and welfare allowances for teachers posted to rural and underserved districts.',
    history: [
      { stage: 'Draft', date: '2026-06-25', note: 'Drafted by sponsor with Legislative Services.' },
      { stage: 'Introduced', date: '2026-07-16', note: 'First reading completed on the floor.' },
    ],
    amendments: [],
    votes: { aye: 0, nay: 0, abstain: 0 },
    voters: {},
  },
  {
    id: 'bill-anticorruption',
    title: 'Anti-Corruption Enforcement Amendment Act',
    category: 'Judiciary',
    sponsorId: 'm-achebe',
    committee: 'Judiciary Committee',
    stage: 'Debate',
    summary: 'Strengthens investigative powers and asset-recovery mechanisms for the anti-corruption enforcement agency.',
    history: [
      { stage: 'Draft', date: '2026-03-10', note: 'Drafted by sponsor with Legislative Services.' },
      { stage: 'Introduced', date: '2026-03-28', note: 'First reading completed on the floor.' },
      { stage: 'Committee Review', date: '2026-04-22', note: 'Reviewed by the Judiciary Committee.' },
      { stage: 'Debate', date: '2026-07-22', note: 'Second reading debate opened.' },
    ],
    amendments: [
      { id: 'am-3', title: 'Extend asset-recovery lookback period to 10 years', proposerId: 'm-nabwire', status: 'Pending' },
    ],
    votes: { aye: 0, nay: 0, abstain: 0 },
    voters: {},
  },
  {
    id: 'bill-pension',
    title: 'Public Sector Pension Reform Bill',
    category: 'Budget',
    sponsorId: 'm-chikwava',
    committee: 'Finance Committee',
    stage: 'Voting',
    summary: 'Reforms the public sector pension scheme to a contributory model, phased in over five years.',
    history: [
      { stage: 'Draft', date: '2026-02-14', note: 'Drafted by sponsor with Legislative Services.' },
      { stage: 'Introduced', date: '2026-03-02', note: 'First reading completed on the floor.' },
      { stage: 'Committee Review', date: '2026-04-01', note: 'Reviewed by the Finance Committee.' },
      { stage: 'Debate', date: '2026-06-10', note: 'Second reading debate concluded.' },
      { stage: 'Voting', date: '2026-07-29', note: 'Third reading vote opened in Sitting 104.' },
    ],
    amendments: [],
    votes: { aye: 19, nay: 14, abstain: 3 },
    voters: {},
  },
  {
    id: 'bill-renewable',
    title: 'Renewable Energy Incentives Act',
    category: 'Energy',
    sponsorId: null,
    sponsorType: 'Government',
    institutionId: 'inst-finance',
    committee: null,
    stage: 'Introduced',
    summary: 'Introduces tax incentives and grid-connection subsidies for private renewable energy generation projects.',
    history: [
      { stage: 'Draft', date: '2026-06-05', note: 'Submitted by the Ministry of Finance for parliamentary consideration.' },
      { stage: 'Introduced', date: '2026-06-24', note: 'First reading completed on the floor.' },
    ],
    amendments: [],
    votes: { aye: 0, nay: 0, abstain: 0 },
    voters: {},
  },
  {
    id: 'bill-electionreform',
    title: 'Electoral Reform Act',
    category: 'Judiciary',
    sponsorId: null,
    sponsorType: 'Government',
    institutionId: 'inst-electoral',
    committee: null,
    stage: 'Draft',
    summary: 'Updates constituency boundary review procedures and introduces biometric voter verification standards.',
    history: [
      { stage: 'Draft', date: '2026-07-12', note: 'Submitted by the Electoral Commission for parliamentary consideration.' },
    ],
    amendments: [],
    votes: { aye: 0, nay: 0, abstain: 0 },
    voters: {},
  },
  {
    id: 'bill-mentalhealth',
    title: 'Mental Health Services Bill',
    category: 'Public Health',
    sponsorId: 'm-muthoni',
    committee: 'Health Committee',
    stage: 'Rejected',
    summary: 'Establishes community-based mental health service centres and insurance coverage requirements.',
    history: [
      { stage: 'Draft', date: '2025-11-04', note: 'Drafted by sponsor with Legislative Services.' },
      { stage: 'Introduced', date: '2025-11-20', note: 'First reading completed on the floor.' },
      { stage: 'Committee Review', date: '2025-12-15', note: 'Reviewed by the Health Committee.' },
      { stage: 'Debate', date: '2026-01-20', note: 'Second reading debate concluded.' },
      { stage: 'Voting', date: '2026-02-03', note: 'Failed third reading, 22 Aye / 39 Nay / 4 Abstain.' },
      { stage: 'Rejected', date: '2026-02-03', note: 'Bill rejected at third reading; did not proceed to assent.' },
    ],
    amendments: [],
    votes: { aye: 22, nay: 39, abstain: 4 },
    voters: {},
  },
  {
    id: 'bill-landreform',
    title: 'Land Tenure Reform Bill',
    category: 'Judiciary',
    sponsorId: 'm-kariuki',
    committee: null,
    stage: 'Withdrawn',
    summary: 'Proposed reforms to customary land tenure registration and dispute resolution procedures.',
    history: [
      { stage: 'Draft', date: '2026-01-15', note: 'Drafted by sponsor with Legislative Services.' },
      { stage: 'Introduced', date: '2026-02-02', note: 'First reading completed on the floor.' },
      { stage: 'Withdrawn', date: '2026-03-01', note: 'Withdrawn by sponsor pending further consultation with traditional authorities.' },
    ],
    amendments: [],
    votes: { aye: 0, nay: 0, abstain: 0 },
    voters: {},
  },
];

export const seedAccounts = [
  { email: 'superuser@parliament.gov', memberId: 'm-super' },
  { email: 'mensah@parliament.gov', memberId: 'm-mensah' },
  { email: 'okafor@parliament.gov', memberId: 'm-okafor' },
  { email: 'adeyemi@parliament.gov', memberId: 'm-adeyemi' },
  { email: 'kamau@parliament.gov', memberId: 'm-kamau' },
  { email: 'owusu@parliament.gov', memberId: 'm-owusu' },
  { email: 'bahati@parliament.gov', memberId: 'm-bahati' },
  { email: 'nabwire@parliament.gov', memberId: 'm-nabwire' },
  { email: 'kariuki@parliament.gov', memberId: 'm-kariuki' },
  { email: 'achebe@parliament.gov', memberId: 'm-achebe' },
  { email: 'chikwava@parliament.gov', memberId: 'm-chikwava' },
  { email: 'muthoni@parliament.gov', memberId: 'm-muthoni' },
  { email: 'osafo@parliament.gov', memberId: 'm-osafo' },
];

export const seedCommittees = [
  {
    id: 'committee-judiciary',
    name: 'Judiciary Committee',
    type: 'Standing',
    mandate:
      'Reviews legislation and matters relating to the judiciary, courts, legal procedure, and reform of the justice system.',
    meetings: [
      {
        id: 'jm-1',
        date: '2026-06-02',
        agenda: 'Review of the Judicial Procedures Amendment Act',
        status: 'Held',
        note: 'Committee heard evidence from the Chief Registrar and recommended the bill proceed to debate with minor drafting amendments.',
      },
      {
        id: 'jm-2',
        date: '2026-04-22',
        agenda: 'Review of the Anti-Corruption Enforcement Amendment Act',
        status: 'Held',
        note: 'Committee heard evidence from the anti-corruption enforcement agency and recommended the bill proceed to debate.',
      },
      {
        id: 'jm-3',
        date: '2026-08-11',
        agenda: 'Follow-up hearing on appellate case backlog',
        status: 'Scheduled',
        note: '',
      },
    ],
  },
  {
    id: 'committee-health',
    name: 'Health Committee',
    type: 'Standing',
    mandate:
      'Oversees public health policy, healthcare financing, hospital administration, and health-sector legislation.',
    meetings: [
      {
        id: 'hm-1',
        date: '2026-07-15',
        agenda: 'Briefing on the Universal Health Coverage Act',
        status: 'Held',
        note: 'Ministry of Health presented cost projections. Committee requested a revised financing model before further review.',
      },
      {
        id: 'hm-2',
        date: '2025-12-15',
        agenda: 'Review of the Mental Health Services Bill',
        status: 'Held',
        note: 'Committee raised concerns over insurance coverage funding and recommended amendments before third reading.',
      },
      {
        id: 'hm-3',
        date: '2026-08-05',
        agenda: 'Reconvene on Universal Health Coverage Act financing model',
        status: 'Scheduled',
        note: '',
      },
    ],
  },
  {
    id: 'committee-finance',
    name: 'Finance Committee',
    type: 'Standing',
    mandate:
      'Reviews budget bills, public expenditure, taxation, and financial legislation before they reach the floor.',
    meetings: [
      {
        id: 'fm-1',
        date: '2026-05-05',
        agenda: 'Review of Infrastructure Budget 2026 allocations',
        status: 'Held',
        note: 'Committee approved the allocation framework and referred the bill for second reading debate.',
      },
      {
        id: 'fm-2',
        date: '2026-02-10',
        agenda: 'Review of Energy Act 2026 subsidy structure',
        status: 'Held',
        note: 'Committee recommended the subsidy cap be reviewed annually; recommendation adopted.',
      },
      {
        id: 'fm-3',
        date: '2026-04-01',
        agenda: 'Review of Public Sector Pension Reform Bill',
        status: 'Held',
        note: 'Committee requested an independent actuarial review before the bill proceeds to debate.',
      },
      {
        id: 'fm-4',
        date: '2026-08-14',
        agenda: 'Hearing on Renewable Energy Incentives Act',
        status: 'Scheduled',
        note: '',
      },
    ],
  },
  {
    id: 'committee-education',
    name: 'Education Committee',
    type: 'Standing',
    mandate:
      'Reviews education policy, school funding formulas, curriculum standards, and education-sector legislation.',
    meetings: [
      {
        id: 'em-1',
        date: '2026-06-20',
        agenda: 'Review of the School Feeding Programme Act',
        status: 'Held',
        note: 'Ministry of Education presented rollout cost estimates. Committee recommended the bill proceed to debate.',
      },
      {
        id: 'em-2',
        date: '2026-08-18',
        agenda: 'Hearing on Teacher Welfare and Housing Bill',
        status: 'Scheduled',
        note: '',
      },
    ],
  },
];

export const seedSession = {
  id: 'sitting-104',
  name: 'Sitting 104',
  date: '2026-08-05',
  live: true,
  orderPaper: [
    { billId: 'bill-infra', item: 'Second Reading Debate & Vote' },
    { billId: 'bill-pension', item: 'Third Reading Vote' },
    { billId: 'bill-anticorruption', item: 'Second Reading Debate' },
    { billId: 'bill-judicial', item: 'Committee Report Tabling' },
  ],
  currentItemIndex: 0,
};

// Mock live-sitting data — a transcript feed and speaking queue for the
// video/hearing view, tied to the bill currently under debate.
export const seedTranscript = [
  { speakerId: 'm-kamau', time: '10:02:04', text: 'The floor recognizes the sponsor to open debate on the Infrastructure Budget 2026.' },
  { speakerId: 'm-adeyemi', time: '10:02:41', text: 'Thank you, Mr. Speaker. This budget allocates funding for road, rail, and broadband expansion across all regions, with particular emphasis on underserved rural constituencies.' },
  { speakerId: 'm-mensah', time: '10:05:12', text: 'Will the sponsor accept an amendment increasing the rural broadband allocation by 12 percent?' },
  { speakerId: 'm-adeyemi', time: '10:05:38', text: 'The sponsor is amenable to that amendment and welcomes the Committee’s recommendation.' },
  { speakerId: 'm-okafor', time: '10:08:55', text: 'I rise in support, provided the coastal road maintenance clause raised in committee is also retained in the final text.' },
  { speakerId: 'm-kamau', time: '10:10:20', text: 'Noted. Both amendments will be read into the record before the vote is called.' },
];

export const seedSpeakingQueue = [
  { memberId: 'm-adeyemi', status: 'Speaking' },
  { memberId: 'm-mensah', status: 'Queued' },
  { memberId: 'm-okafor', status: 'Queued' },
  { memberId: 'm-kamau', status: 'Chairing' },
  { memberId: 'm-owusu', status: 'Recording' },
];

// Scheduled future sittings — shown on the Dashboard's "Upcoming sittings"
// timeline, mirroring the confirmed current sitting without inventing new bills.
export const seedUpcomingSittings = [
  { id: 'sit-105', date: '2026-08-04', title: 'Sitting 105 — Floor Debate', type: 'Floor' },
  { id: 'sit-106', date: '2026-08-06', title: 'Question Time', type: 'Floor' },
  { id: 'sit-107', date: '2026-08-08', title: 'Sitting 106 — Third Reading', type: 'Floor' },
  { id: 'sit-108', date: '2026-08-12', title: 'Joint Sitting — Address to the Assembly', type: 'Joint' },
];

export const seedJoinRequest = { memberId: 'm-nabwire' };
