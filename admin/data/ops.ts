import {
  COMPANIES,
  initialsAvatar,
  type Company,
  type Market,
  type Segment,
  type TagTone,
} from "@/data/companies";

const TODAY = new Date("2026-10-08T12:00:00Z");

function hash(text: string) {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}

function isoDaysFrom(days: number) {
  const date = new Date(TODAY);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function packageOf(client: Company): Segment {
  return client.tags[0] as Segment;
}

export function stageOf(client: Company) {
  return client.tags[1];
}

export function clientById(id: string) {
  return COMPANIES.find((client) => client.id === id);
}


export const APPLICATION_STATUSES = [
  "Awaiting approval",
  "Sent",
  "Viewed",
  "Replied",
  "Interview",
  "Offer",
  "Not progressed",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_TONES: Record<ApplicationStatus, TagTone> = {
  "Awaiting approval": "amber",
  Sent: "neutral",
  Viewed: "blue",
  Replied: "teal",
  Interview: "orange",
  Offer: "moss",
  "Not progressed": "red",
};

export type Application = {
  id: string;
  clientId: string;
  role: string;
  employer: string;
  location: string;
  sent: string | null;
  status: ApplicationStatus;
};

const TARGET_ROLES: Record<string, string[]> = {
  "adaeze-okafor": ["Growth Marketing Lead", "Brand Manager", "Content Lead"],
  "chinedu-okeke": ["Senior Data Analyst", "Analytics Engineer", "BI Lead"],
  "oluwaseun-ajayi": ["Product Manager", "Associate PM", "Product Owner"],
  "ibrahim-musa": ["Backend Engineer", "Platform Engineer", "Site Reliability Engineer"],
  "temitope-alade": ["HR Business Partner", "People Operations Lead", "Talent Partner"],
  "yusuf-danjuma": ["Operations Manager", "Supply Chain Analyst", "Logistics Lead"],
  "nkechi-agu": ["Finance Manager", "FP&A Analyst", "Financial Controller"],
  "ebuka-nwankwo": ["Sales Manager", "Account Executive", "Business Development Lead"],
  "zainab-abubakar": ["UX Designer", "Product Designer", "UX Researcher"],
  "kelechi-ibe": ["Business Analyst", "Operations Analyst", "Strategy Associate"],
  "segun-afolabi": ["Customer Success Manager", "Support Lead", "Account Manager"],
};

const EMPLOYERS: Record<Market, string[]> = {
  "United Kingdom": ["Copperline Ltd", "Lumen Health", "Harbourside Group", "Calder Analytics", "Westmere Bank"],
  Canada: ["Maple & Pine Consulting", "Fairhaven Tech", "Northlake Health", "Brightside Software"],
  Germany: ["Rheinwerk GmbH", "Elbtal Logistik", "Isar Analytics", "Nordlicht Health"],
  Australia: ["Harbourline Pty", "Southbank Health", "Wattle Analytics", "Coralbay Group"],
  Singapore: ["Straits Analytics", "Marina Health", "Lionbay Tech"],
  Malaysia: ["Kuala Digital", "Petaling Systems", "Klang Logistics"],
  Russia: ["Nevsky Systems", "Volga Analytics", "Ural Logistics"],
};

const LOCATIONS: Record<Market, string[]> = {
  "United Kingdom": ["London, UK", "Manchester, UK", "Leeds, UK", "Remote, UK"],
  Canada: ["Toronto, Canada", "Vancouver, Canada", "Calgary, Canada"],
  Germany: ["Berlin, Germany", "Munich, Germany", "Hamburg, Germany"],
  Australia: ["Sydney, Australia", "Melbourne, Australia", "Brisbane, Australia"],
  Singapore: ["Singapore"],
  Malaysia: ["Kuala Lumpur, Malaysia", "Penang, Malaysia"],
  Russia: ["Moscow, Russia", "St Petersburg, Russia"],
};

function statusFor(client: Company, index: number): ApplicationStatus {
  const stage = stageOf(client);
  if (stage === "Offer received" && index === 0) return "Offer";
  if ((stage === "Interviewing" || stage === "Offer received") && index < 3) {
    return index === 2 ? "Replied" : "Interview";
  }
  const roll = hash(`${client.id}-${index}`) % 100;
  const rate = client.winProbability;
  if (roll < rate * 0.35) return "Replied";
  if (roll < rate * 0.9) return "Viewed";
  if (roll > 88) return "Not progressed";
  return "Sent";
}

export const APPLICATIONS: Application[] = COMPANIES.filter(
  (client) => client.openDeals > 0,
).flatMap((client) => {
  const roles = TARGET_ROLES[client.id] ?? ["Associate"];
  const employers = EMPLOYERS[client.market];
  const locations = LOCATIONS[client.market];
  const seed = hash(client.id);
  const count = Math.min(client.openDeals, 5);
  const searching = ["Applying", "Interviewing"].includes(stageOf(client));

  const sent: Application[] = Array.from({ length: count }, (_, index) => ({
    id: `${client.id}-a${index}`,
    clientId: client.id,
    role: roles[index % roles.length],
    employer: employers[(seed + index * 3) % employers.length],
    location: locations[(seed + index) % locations.length],
    sent: isoDaysFrom(-(client.activityDays + index * 4 + (seed % 3))),
    status: statusFor(client, index),
  }));

  const pending: Application[] = searching
    ? [
        {
          id: `${client.id}-p`,
          clientId: client.id,
          role: roles[(count + 1) % roles.length],
          employer: employers[(seed + 7) % employers.length],
          location: locations[(seed + 2) % locations.length],
          sent: null,
          status: "Awaiting approval",
        },
      ]
    : [];

  return [...pending, ...sent];
});


export type Coach = {
  name: string;
  avatar: string;
  focus: string;
  availability: string;
  sessions: number;
  rating: number;
  email: string;
};

export const COACHES: Coach[] = [
  {
    name: "Bisi Coker",
    avatar: initialsAvatar("Bisi Coker"),
    focus: "Tech and product interviews",
    availability: "Mon–Thu, 6–9pm WAT",
    sessions: 14,
    rating: 4.8,
    email: "bisi@shortlist.ng",
  },
  {
    name: "Daniel Etim",
    avatar: initialsAvatar("Daniel Etim"),
    focus: "Finance, banking and consulting",
    availability: "Tue & Sat mornings",
    sessions: 9,
    rating: 4.6,
    email: "daniel@shortlist.ng",
  },
  {
    name: "Rahma Idris",
    avatar: initialsAvatar("Rahma Idris"),
    focus: "UK and Canada panel interviews",
    availability: "Weekdays, 1–5pm WAT",
    sessions: 11,
    rating: 4.9,
    email: "rahma@shortlist.ng",
  },
];

export type PrepStatus = "Mock done" | "Mock booked" | "Prep needed";

export const PREP_TONES: Record<PrepStatus, TagTone> = {
  "Mock done": "green",
  "Mock booked": "blue",
  "Prep needed": "amber",
};

export type Interview = {
  id: string;
  clientId: string;
  role: string;
  employer: string;
  date: string;
  time: string;
  round: string;
  format: string;
  prep: PrepStatus;
  coach: string;
  outcome?: string;
};

const ROUNDS = ["Screening call", "Technical", "Panel", "Final"];
const FORMATS = ["Video", "In person", "Video", "Phone"];
const TIMES = ["10:00", "11:30", "14:00", "15:30", "16:00"];
const PREP: PrepStatus[] = ["Mock done", "Mock booked", "Prep needed"];

export const INTERVIEWS: Interview[] = APPLICATIONS.filter((app) =>
  ["Interview", "Offer"].includes(app.status),
).map((app, index) => {
  const past = app.status === "Offer" || index % 4 === 3;
  const seed = hash(app.id);
  return {
    id: `i-${app.id}`,
    clientId: app.clientId,
    role: app.role,
    employer: app.employer,
    date: isoDaysFrom(past ? -(2 + (seed % 9)) : 1 + (seed % 10)),
    time: TIMES[seed % TIMES.length],
    round: ROUNDS[(seed >>> 3) % ROUNDS.length],
    format: FORMATS[(seed >>> 5) % FORMATS.length],
    prep: past ? "Mock done" : PREP[seed % PREP.length],
    coach: COACHES[seed % COACHES.length].name,
    outcome: past
      ? app.status === "Offer"
        ? "Offer made"
        : "Moved to next round"
      : undefined,
  };
});


export type IntakeStatus = "Confirmed" | "Rescheduled" | "Completed" | "No-show";

export const INTAKE_TONES: Record<IntakeStatus, TagTone> = {
  Confirmed: "teal",
  Rescheduled: "amber",
  Completed: "neutral",
  "No-show": "red",
};

export type IntakeCall = {
  id: string;
  name: string;
  clientId?: string;
  date: string;
  time: string;
  interest: string;
  where: string;
  roles: string;
  source: string;
  specialist: string;
  status: IntakeStatus;
};

export const INTAKE_CALLS: IntakeCall[] = [
  { id: "c1", name: "Obinna Chukwu", clientId: "obinna-chukwu", date: isoDaysFrom(1), time: "10:00", interest: "Standard", where: "Germany", roles: "Sales operations, revenue ops", source: "Website", specialist: "Emeka Okonkwo", status: "Confirmed" },
  { id: "c2", name: "Chiamaka Nnadi", clientId: "chiamaka-nnadi", date: isoDaysFrom(1), time: "13:30", interest: "Starter", where: "Australia", roles: "Pharmacist, clinical research", source: "Instagram", specialist: "Kemi Lawal", status: "Confirmed" },
  { id: "c3", name: "Tolu Bankole", date: isoDaysFrom(2), time: "09:30", interest: "Not sure yet", where: "Canada, Germany", roles: "Software engineer", source: "Referral", specialist: "Ifeanyi Nwosu", status: "Confirmed" },
  { id: "c4", name: "Hauwa Garba", date: isoDaysFrom(3), time: "11:00", interest: "Full Service", where: "United Kingdom", roles: "Project manager, PMO lead", source: "LinkedIn", specialist: "Seyi Adeyemi", status: "Rescheduled" },
  { id: "c5", name: "Victor Okon", date: isoDaysFrom(4), time: "16:00", interest: "Readiness", where: "Not sure yet", roles: "Accountant, audit associate", source: "Website", specialist: "Halima Bello", status: "Confirmed" },
  { id: "c6", name: "Grace Effiong", date: isoDaysFrom(6), time: "14:30", interest: "Standard", where: "United Kingdom", roles: "Registered nurse (NMC)", source: "Website", specialist: "Amaka Obi", status: "Confirmed" },
  { id: "c7", name: "Aisha Lawan", clientId: "aisha-lawan", date: isoDaysFrom(-4), time: "10:00", interest: "Full Service", where: "Australia", roles: "Data scientist", source: "Referral", specialist: "Emeka Okonkwo", status: "Completed" },
  { id: "c8", name: "Blessing Udoh", clientId: "blessing-udoh", date: isoDaysFrom(-3), time: "11:30", interest: "Standard", where: "Canada", roles: "Customer experience lead", source: "Instagram", specialist: "Halima Bello", status: "Completed" },
  { id: "c9", name: "Peter Akande", date: isoDaysFrom(-2), time: "15:30", interest: "Not sure yet", where: "Singapore, Malaysia", roles: "Graduate trainee", source: "Website", specialist: "Ngozi Eze", status: "No-show" },
];


export type AgreementStatus = "Signed" | "Awaiting signature" | "Overdue";

export const AGREEMENT_TONES: Record<AgreementStatus, TagTone> = {
  Signed: "green",
  "Awaiting signature": "amber",
  Overdue: "red",
};

export type Agreement = {
  id: string;
  clientId: string;
  version: string;
  sent: string;
  signed: string | null;
  status: AgreementStatus;
};

const START_OFFSET: Record<string, number> = {
  "CV in progress": 2,
  Applying: 14,
  Interviewing: 30,
  "Offer received": 55,
  Paused: 40,
};

function startOffset(client: Company) {
  if (stageOf(client) === "CV in progress") return 1 + (hash(client.id) % 7);
  return (START_OFFSET[stageOf(client)] ?? 20) + (hash(client.id) % 40);
}

export const AGREEMENTS: Agreement[] = COMPANIES.filter(
  (client) => stageOf(client) !== "Intake booked",
).map((client) => {
  if (stageOf(client) === "Agreement sent") {
    const age = client.activityDays;
    return {
      id: `ag-${client.id}`,
      clientId: client.id,
      version: "v0.1",
      sent: isoDaysFrom(-age),
      signed: null,
      status: age >= 2 ? "Overdue" : "Awaiting signature",
    };
  }
  const start = startOffset(client);
  return {
    id: `ag-${client.id}`,
    clientId: client.id,
    version: "v0.1",
    sent: isoDaysFrom(-(start + 1)),
    signed: isoDaysFrom(-start),
    status: "Signed",
  };
});


export type PaymentStatus = "Paid" | "Failed" | "Refunded";

export const PAYMENT_TONES: Record<PaymentStatus, TagTone> = {
  Paid: "green",
  Failed: "red",
  Refunded: "amber",
};

export type Payment = {
  ref: string;
  clientId: string;
  amount: number;
  method: "Card" | "Bank transfer";
  date: string;
  status: PaymentStatus;
  period: string;
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const PAYMENTS: Payment[] = COMPANIES.filter(
  (client) => !["Intake booked", "Agreement sent"].includes(stageOf(client)),
)
  .flatMap((client) => {
    const date = isoDaysFrom(-startOffset(client));
    const seed = hash(client.id);
    const ref = `SL-${date.slice(2, 4)}${date.slice(5, 7)}-${String((seed % 9000) + 1000)}`;
    const base = {
      clientId: client.id,
      amount: client.pipelineValue,
      method: (seed % 3 === 0 ? "Bank transfer" : "Card") as Payment["method"],
      period: packageOf(client),
    };
    const payments: Payment[] = [];
    if (client.id === "kelechi-ibe") {
      payments.push({ ...base, ref: ref + "F", date: isoDaysFrom(-startOffset(client) - 1), status: "Failed" });
    }
    payments.push({ ...base, ref, date, status: "Paid" });
    if (client.id === "yusuf-danjuma") {
      payments.push({ ...base, ref: ref + "R", amount: Math.round(client.pipelineValue * 0.4), date: isoDaysFrom(-20), status: "Refunded" });
    }
    return payments;
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export type RevenueMonth = {
  key: string;
  label: string;
  byPackage: Record<Segment, number>;
  total: number;
};

export const REVENUE: RevenueMonth[] = (() => {
  const months = new Map<string, RevenueMonth>();
  for (let back = 3; back >= 0; back--) {
    const date = new Date(TODAY);
    date.setUTCMonth(date.getUTCMonth() - back);
    const key = date.toISOString().slice(0, 7);
    months.set(key, {
      key,
      label: `${MONTH_NAMES[date.getUTCMonth()]} ${key.slice(0, 4)}`,
      byPackage: { Readiness: 0, Starter: 0, Standard: 0, "Full Service": 0 },
      total: 0,
    });
  }
  for (const payment of PAYMENTS) {
    if (payment.status !== "Paid") continue;
    const month = months.get(payment.date.slice(0, 7));
    const client = clientById(payment.clientId);
    if (!month || !client) continue;
    month.byPackage[packageOf(client)] += payment.amount;
    month.total += payment.amount;
  }
  return [...months.values()];
})();


export type Message = { from: "client" | "team"; author: string; text: string; time: string };

export type Thread = {
  id: string;
  clientId: string;
  channel: "WhatsApp" | "Email";
  unread: boolean;
  messages: Message[];
};

export const THREADS: Thread[] = [
  {
    id: "t1",
    clientId: "adaeze-okafor",
    channel: "WhatsApp",
    unread: true,
    messages: [
      { from: "team", author: "Ngozi Eze", text: "Morning Adaeze, this week’s shortlist is in your tracker: 6 roles, 2 of them remote for UK companies.", time: "Mon 09:12" },
      { from: "client", author: "Adaeze Okafor", text: "Thank you! I’ve approved 5. Not keen on the retail one.", time: "Mon 11:40" },
      { from: "client", author: "Adaeze Okafor", text: "Also, could we add more UK remote roles from next month?", time: "Today 08:05" },
    ],
  },
  {
    id: "t2",
    clientId: "chinedu-okeke",
    channel: "Email",
    unread: true,
    messages: [
      { from: "team", author: "Tunde Bakare", text: "Your panel interview with Calder Analytics is confirmed for Thursday. Bisi will run a mock on Wednesday evening.", time: "Tue 16:20" },
      { from: "client", author: "Chinedu Okeke", text: "Perfect. Should I prepare a case study or just walk through past projects?", time: "Today 07:48" },
    ],
  },
  {
    id: "t3",
    clientId: "blessing-udoh",
    channel: "WhatsApp",
    unread: false,
    messages: [
      { from: "team", author: "Halima Bello", text: "Hi Blessing, a gentle reminder that your agreement is waiting for your signature. Any questions before you sign?", time: "Yesterday 10:30" },
    ],
  },
  {
    id: "t4",
    clientId: "fatima-sule",
    channel: "Email",
    unread: false,
    messages: [
      { from: "team", author: "Amaka Obi", text: "Your first CV draft is attached. Leave comments on any line and we’ll turn round revision one within two working days.", time: "Mon 14:02" },
      { from: "client", author: "Fatima Sule", text: "This reads so much better. A few notes on the second role, sending them tonight.", time: "Mon 18:55" },
    ],
  },
  {
    id: "t5",
    clientId: "ibrahim-musa",
    channel: "WhatsApp",
    unread: false,
    messages: [
      { from: "client", author: "Ibrahim Musa", text: "Fairhaven came back with an offer!! What should I ask for?", time: "Sun 20:14" },
      { from: "team", author: "Seyi Adeyemi", text: "Congratulations! I’ll send your salary negotiation notes tomorrow morning. Don’t reply to them yet.", time: "Sun 20:31" },
    ],
  },
  {
    id: "t6",
    clientId: "segun-afolabi",
    channel: "Email",
    unread: false,
    messages: [
      { from: "team", author: "Ngozi Eze", text: "Hi Segun, your renewal payment didn’t go through so we’ve paused applications. You can update your card from the payment link below.", time: "Sep 28 09:00" },
    ],
  },
];


export type Risk = { clientId: string; reason: string; action: string; severity: "High" | "Medium" };

export const RISK_TONES: Record<Risk["severity"], TagTone> = { High: "red", Medium: "amber" };

export function risksFor(clients: Company[]): Risk[] {
  return clients.flatMap((client) => {
    const risks: Risk[] = [];
    const stage = stageOf(client);
    if (stage === "Paused" && client.activityDays > 30) {
      risks.push({ clientId: client.id, reason: `Paused, no reply for ${client.activityDays} days`, action: "Call to agree next steps", severity: "High" });
    } else if (stage === "Paused") {
      risks.push({ clientId: client.id, reason: "Search paused", action: "Book a check-in call", severity: "Medium" });
    }
    if (stage === "Agreement sent" && client.activityDays >= 2) {
      risks.push({ clientId: client.id, reason: `Agreement unsigned for ${client.activityDays} days`, action: "Send reminder", severity: "Medium" });
    }
    if (client.activityDays > 10 && stage !== "Paused") {
      risks.push({ clientId: client.id, reason: `No touchpoint for ${client.activityDays} days`, action: "Schedule a check-in", severity: "Medium" });
    }
    if (client.openDeals >= 15 && client.winProbability < 25) {
      risks.push({ clientId: client.id, reason: `Low response rate (${client.winProbability}%)`, action: "Review CV and targeting", severity: "High" });
    }
    return risks;
  });
}

export function formatDay(iso: string) {
  const date = new Date(`${iso}T12:00:00Z`);
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

export function relativeDay(iso: string) {
  const diff = Math.round((Date.parse(`${iso}T12:00:00Z`) - TODAY.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return diff > 0 ? `In ${diff} days` : `${-diff} days ago`;
}
