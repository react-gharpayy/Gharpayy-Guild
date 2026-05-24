import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import { Toaster, toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ───── Motion presets ───── */
const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Guild — Everything Support by Gharpayy · Before, During & After Your Stay" },
      {
        name: "description",
        content:
          "Guild is your full-stay concierge — before check-in, during your stay, after check-out. Talk to your property manager first; if they don't solve it, Guild fixes it on WhatsApp.",
      },
      { property: "og:title", content: "Guild — Everything Support by Gharpayy" },
      {
        property: "og:description",
        content: "Before, during, after — secured by Guild. Manager first, Guild always.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Geologica:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

/* ───── Gharpayy Zones (5 zones · 5 numbers · data from gharpayy.com/#who-stays) ───── */
type Zone = {
  id: string;
  name: string;
  short: string;
  emoji: string;
  number: string;
  areas: string[];
  landmarks: string;
  colleges: string;
  companies: string;
};
export const ZONES: Zone[] = [
  { id: "kor", name: "Koramangala Zone", short: "Koramangala", emoji: "🌆", number: "918307396042",
    areas: ["Koramangala", "Christ University", "Jyoti Nivas", "SG Palya", "BTM Layout", "HSR Layout", "Bannerghatta Rd"],
    landmarks: "Forum Mall · Jyoti Nivas · Food Street",
    colleges: "Christ · JNC · St John's",
    companies: "Razorpay · Zomato · Ola · Accenture" },
  { id: "wft", name: "Whitefield Zone", short: "Whitefield", emoji: "🏙️", number: "917404489976",
    areas: ["Whitefield", "ITPL", "EPIP Zone", "Marathahalli", "Brookfield", "Hope Farm", "Hoodi", "Mahadevapura"],
    landmarks: "ITPL · EPIP · Phoenix · VR Mall",
    colleges: "MS Ramaiah · VTU campuses",
    companies: "SAP · Wipro · Amazon · Mercedes-Benz" },
  { id: "bel", name: "Bellandur Zone", short: "Bellandur", emoji: "🌊", number: "916363607724",
    areas: ["Bellandur", "Sarjapur", "Embassy Tech Village", "ORR", "Ecoworld", "Ecospace", "Cessna BP"],
    landmarks: "Ecoworld · Ecospace · Prestige Tech · ORR",
    colleges: "PES · Azim Premji Univ · IIM-B nearby",
    companies: "Microsoft · Oracle · Myntra · Adobe" },
  { id: "mty", name: "Manyata Zone", short: "Manyata", emoji: "🌳", number: "918431513647",
    areas: ["Manyata Tech Park", "Hebbal", "Nagawara", "Yeshwanthpur", "Bhartiya City", "Peenya", "Rajajinagar"],
    landmarks: "Manyata Tech Park · Bhartiya City · Elements Mall",
    colleges: "MS Ramaiah · IISc · CMR",
    companies: "IBM · Target · Nokia · Philips" },
  { id: "ctr", name: "Vasanth Nagar · City", short: "City", emoji: "📍", number: "917988114576",
    areas: ["Vasanth Nagar", "MG Road", "Brigade Road", "UB City", "Indiranagar", "Domlur", "Electronic City", "Ulsoor", "Other"],
    landmarks: "MG Road · Brigade · UB City · Embassy Golf Link",
    colleges: "Jain · St Joseph's · Mount Carmel",
    companies: "Infosys · Wipro · TCS · Biocon (E-City)" },
];

// Gharpayy Homes — managed flat rentals (1BHK / 2BHK / studios). Separate WhatsApp line.
const HOMES = {
  id: "homes",
  name: "Gharpayy Homes",
  short: "Homes · Flats",
  emoji: "🏡",
  number: "917404489976",
  tag: "Flat Rentals",
  pitch: "Super-furnished 1BHK & 2BHK · managed living from ₹21k",
  landmarks: "Whitefield · Bellandur · Sarjapur · HSR · Indiranagar",
  formats: "1BHK · 2BHK · Studios · Entire apartments",
  perks: "Fully furnished · zero brokerage · managed by Gharpayy",
};

function zoneFor(area: string): Zone {
  const a = area.trim().toLowerCase();
  if (!a) return GUILD_FALLBACK;
  for (const z of ZONES) {
    if (z.areas.some((x) => a.includes(x.toLowerCase()) || x.toLowerCase().includes(a))) return z;
  }
  return GUILD_FALLBACK;
}

// Guild central line — handles check-in problems & escalations across all zones.
const GUILD_NUMBER = "916362007224";
const GUILD_FALLBACK: Zone = {
  id: "guild",
  name: "Guild Central Desk",
  short: "Guild",
  emoji: "🛡️",
  number: GUILD_NUMBER,
  areas: [],
  landmarks: "All Bengaluru zones",
  colleges: "—",
  companies: "—",
};
const WA_NUMBER = GUILD_NUMBER; // generic Guild fallback for all non-zone CTAs

export type Issue = { id?: string; emoji: string; title: string; sub: string };
// Activation + support scenarios — shown only inside the modal, never on the landing.
export const ACTIVATION_ISSUE: Issue = {
  id: "activation",
  emoji: "📅",
  title: "I've just booked — activate my Guild",
  sub: "Share arrival date & ETA. Guild preps the room, keys, Wi-Fi, linen before you land.",
};
export const SUPPORT_ISSUES: Issue[] = [
  { emoji: "🏠", title: "Room not ready at check-in", sub: "Cleaning pending, keys not handed over, caretaker delayed." },
  { emoji: "🔑", title: "Room not available", sub: "Booking confirmed but no room allotted on arrival." },
  { emoji: "🛏️", title: "Different from what I saw", sub: "Room doesn't match the photos, video tour or visit." },
  { emoji: "💭", title: "Don't like the room", sub: "Want to switch — view, floor, size, layout or vibe." },
  { emoji: "💳", title: "Deposit / payment confusion", sub: "Mismatch in deposit, token, rent terms or receipts." },
  { emoji: "🎁", title: "Amenities not as promised", sub: "Wi-Fi, AC, geyser, housekeeping, food — anything missing." },
  { emoji: "💬", title: "Something else", sub: "Tell us in a line — Guild routes it to the right person." },
];
const ISSUES: Issue[] = [ACTIVATION_ISSUE, ...SUPPORT_ISSUES];

const STEPS = [
  { n: 1, title: "Tap a scenario", sub: "Activate Guild for your arrival, or pick what's coming in the way." },
  { n: 2, title: "Add 2 quick details", sub: "Property, room, arrival date — one screen. That's it." },
  { n: 3, title: "We open WhatsApp", sub: "Full context, ticket ID and your details — pre-filled for you." },
  { n: 4, title: "Guild team takes over", sub: "A real human responds in minutes and stays till it's sorted." },
];

const LOCATIONS = [
  "Koramangala", "Christ University", "Jyoti Nivas", "SG Palya", "Bannerghatta Rd",
  "BTM Layout", "HSR Layout", "Whitefield", "ITPL", "EPIP Zone", "Brookfield",
  "Hope Farm", "Hoodi", "Mahadevapura", "Marathahalli", "Bellandur", "Sarjapur",
  "Embassy Tech Village", "Ecoworld", "Ecospace", "Manyata Tech Park", "Hebbal",
  "Nagawara", "Yeshwanthpur", "Bhartiya City", "Vasanth Nagar", "MG Road",
  "Brigade Road", "UB City", "Indiranagar", "Domlur", "Ulsoor", "Electronic City",
];

type Urgency = "Low" | "Medium" | "High" | "";
type Owner = "yes" | "no" | "na" | "";
type Resolving = "yes" | "no" | "slow" | "";

const EXPECTATIONS = [
  { id: "e1", icon: "🤝", title: "Make my check-in smooth today", sub: "Get me into a clean, ready room — now", val: "Make the check-in smooth today" },
  { id: "e2", icon: "🔁", title: "Help me switch rooms", sub: "I want a different room in the same property", val: "Help me switch to a different room" },
  { id: "e3", icon: "🏘️", title: "Help me move to another property", sub: "This place isn't right — find me a better fit", val: "Help me move to a better property" },
  { id: "e4", icon: "📞", title: "Talk to the owner / caretaker", sub: "Guild speaks to them on my behalf", val: "Guild to speak with the owner / caretaker" },
  { id: "e5", icon: "💬", title: "Just need an acknowledgement", sub: "I want to know someone is on it with an ETA", val: "Acknowledgement and ETA from Guild" },
];

function makeTicketId() {
  const d = new Date();
  const ymd = `${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GLD-${ymd}-${rand}`;
}

export type Booking = {
  name: string;
  phone: string;
  propName: string;
  area: string;
  room: string;
  arrivalDate: string;
  arrivalEta: string;
  remind2Days: boolean;
  remind3Hours: boolean;
};
export const EMPTY_BOOKING: Booking = {
  name: "",
  phone: "",
  propName: "",
  area: "",
  room: "",
  arrivalDate: "",
  arrivalEta: "",
  remind2Days: true,
  remind3Hours: true,
};

/* ─── Unified Guild WhatsApp ticket builder ─── */
type GuildMsgInput = {
  scenario?: string;
  booking?: Partial<Booking>;
  expectation?: string;
  urgency?: string;
  note?: string;
  ticketId?: string;
};
export function buildGuildWhatsAppMessage(i: GuildMsgInput = {}): string {
  const t = i.ticketId ?? makeTicketId();
  const b = i.booking ?? {};
  const arrivalLine =
    b.arrivalDate || b.arrivalEta
      ? `📅 Arrival: ${[b.arrivalDate, b.arrivalEta ? `ETA ${b.arrivalEta}` : ""].filter(Boolean).join(" · ")}`
      : "";
  const reminders = [
    b.remind2Days ? "2 days prior" : "",
    b.remind3Hours ? "3 hours prior" : "",
  ].filter(Boolean);
  const reminderLine = reminders.length ? `⏰ Reminders: ${reminders.join(" + ")}` : "";
  const lines = [
    "🛡️ *Guild — Everything Support Ticket*",
    `🎟️ Ticket: ${t}`,
    i.scenario ? `📍 Scenario: ${i.scenario}` : "",
    "",
    b.name || b.phone
      ? `👤 Guest: ${[b.name, b.phone].filter(Boolean).join(" · ")}`
      : "",
    b.propName || b.area
      ? `🏠 Property: ${[b.propName, b.area].filter(Boolean).join(", ")}`
      : "",
    b.room ? `🚪 Room: ${b.room}` : "",
    arrivalLine,
    reminderLine,
    "",
    i.expectation ? `🎯 Expectation: ${i.expectation}` : "",
    i.urgency ? `⚠️ Urgency: ${i.urgency}` : "",
    "",
    i.note ? `📝 Note: ${i.note}` : "",
    "",
    "— Sent from gharpayy.com Guild",
  ];
  return lines.filter((l, idx, a) => !(l === "" && a[idx - 1] === "")).join("\n").trim();
}
export function guildWaHref(input: GuildMsgInput = {}, number: string = GUILD_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(buildGuildWhatsAppMessage(input))}`;
}

function Index() {
  const [active, setActive] = useState<{ issue: Issue; booking: Booking } | null>(null);
  const [picker, setPicker] = useState<false | { preset?: Issue }>(false);
  const [refer, setRefer] = useState(false);

  const openActivation = () => setPicker({ preset: ACTIVATION_ISSUE });

  return (
    <main className="min-h-screen bg-paper pb-20 text-ink sm:pb-0">
      <Toaster position="top-center" richColors />
      <Nav onRefer={() => setRefer(true)} />
      <Hero onStart={openActivation} onRefer={() => setRefer(true)} />
      <TrustBand />
      <GuildAssurance onActivate={openActivation} />
      <LoyaltyReferral onRefer={() => setRefer(true)} />
      <MeetGharwale />
      <Process onStart={openActivation} />
      <EarnRibbon onRefer={() => setRefer(true)} />
      <Refer onStart={() => setRefer(true)} />
      <EarnMore onStart={() => setRefer(true)} />
      <TopReferrers />
      <FAQ />
      <HowItWorksCarousels onRefer={() => setRefer(true)} onStart={openActivation} />
      <Footer />
      <StickyEarnRail onRefer={() => setRefer(true)} hidden={!!picker || refer || !!active} />
      <MobileBottomBar
        onActivate={openActivation}
        onRefer={() => setRefer(true)}
        hidden={!!picker || refer || !!active}
      />
      {picker && (
        <ScenarioPicker
          preset={picker.preset}
          onClose={() => setPicker(false)}
          onPick={(issue, booking) => {
            setPicker(false);
            setActive({ issue, booking });
          }}
        />
      )}
      {active && (active.issue.id === "activation"
        ? <ActivationConfirm booking={active.booking} onClose={() => setActive(null)} />
        : <Modal issue={active.issue} initial={active.booking} onClose={() => setActive(null)} />
      )}
      {refer && <ReferModal onClose={() => setRefer(false)} />}
    </main>
  );
}

/* ─────────────────────────── GUILD ASSURANCE (trust banner) ─────────────────────────── */
function GuildAssurance({ onActivate }: { onActivate: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-paper via-paper-2/30 to-paper">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-2xl border border-border bg-card/80 px-6 py-8 shadow-[0_1px_0_oklch(0.95_0.01_265),0_24px_60px_-30px_oklch(0.32_0.16_265/0.18)] backdrop-blur sm:px-10 sm:py-10"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-[28px]">
              🛡️
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.22em] text-primary">
                  Secured by Guild
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Gharpayy · Guest assurance
                </span>
              </div>
              <h2 className="mt-3 font-display text-[20px] leading-[1.35] tracking-wide text-ink sm:text-[24px]">
                Everything support — before, during & after your stay.
              </h2>
              <p className="mt-2 max-w-2xl text-[12.5px] font-light leading-[1.7] text-muted-foreground sm:text-[13.5px]">
                Before check-in, during your stay, after check-out — Guild is the safety net. Our rule is simple:
                <span className="font-semibold text-ink"> always talk to your property manager first.</span> If they
                don't solve it, a real human from our Bengaluru ops team picks up on WhatsApp and stays with you till
                it's fixed. 99% of stays never need us. For the rest 1%, we're already here.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Before · During · After",
                  "Manager first, Guild always",
                  "Real humans, not bots",
                  "11 AM – 6 PM, 7 days",
                  "Routed by your zone",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-paper-2/60 px-3 py-1 text-[10.5px] font-medium text-ink/80"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* 10x: Activation CTA — the front door of Everything Support */}
              <div className="mt-6 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-primary">
                      📅 Just booked? Start here
                    </div>
                    <div className="mt-2 font-display text-[16px] leading-[1.3] tracking-wide text-ink sm:text-[18px]">
                      Activate my Guild — I'm arriving soon
                    </div>
                    <p className="mt-1 text-[11.5px] font-light leading-[1.55] text-muted-foreground">
                      Share your arrival date + ETA. Guild preps the room, keys, Wi-Fi & linen
                      <em className="font-serif italic"> before you land</em>. Same ticket runs your whole stay.
                    </p>
                  </div>
                  <button
                    onClick={onActivate}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_8px_24px_-12px_oklch(0.32_0.16_265/0.6)] transition hover:scale-[1.02] active:scale-[0.99]"
                  >
                    📅 Activate Guild →
                  </button>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ─────────────────────────── LOYALTY REFERRAL (trust + earn loop) ─────────────────────────── */
function LoyaltyReferral({ onRefer }: { onRefer: () => void }) {
  const loops = [
    {
      tag: "Flat residents",
      icon: "🏠",
      title: "One flat in, friends right after.",
      body: "Guests who move into a Gharpayy flat almost always send a friend looking for the next one. Same building, same block, sometimes the unit right next door.",
      chip: "₹500 – ₹1,000 per move-in",
    },
    {
      tag: "PG residents",
      icon: "👥",
      title: "Full groups. Friends, cousins, classmates.",
      body: "PG guests rarely refer one person. They refer the whole group — college batchmates, work friends, a sibling joining the city. The ledger adds up fast.",
      chip: "Up to ₹50,000+",
    },
    {
      tag: "Long-stay loyalists",
      icon: "🪴",
      title: "Still referring, even after 3 years.",
      body: "Some of our most active referrers have been with Gharpayy for years. A good stay doesn't end — it keeps sending the next guest in.",
      chip: "No expiry on referrals",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border bg-paper-2/40">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <Reveal>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ink/90 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.22em] text-paper">
              Earn while you stay
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Real residents · real payouts
            </span>
          </div>
          <h2 className="font-display text-[26px] leading-[1.15] tracking-wide text-ink sm:text-[40px]">
            Happy at your Gharpayy? <span className="italic text-primary">Bhej do ek aur friend.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-[13px] font-light leading-[1.7] text-muted-foreground sm:text-[14.5px]">
            The biggest earners on Guild aren't influencers — they're regular residents who simply
            keep referring. Every time a friend moves in, the payout lands. Stay long, refer more,
            earn more. That's the whole loop.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {loops.map((l, i) => (
            <Reveal key={l.tag} delay={i * 0.06}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/90 p-6 shadow-[0_1px_0_oklch(0.95_0.01_265),0_18px_40px_-28px_oklch(0.32_0.16_265/0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_1px_0_oklch(0.95_0.01_265),0_24px_50px_-26px_oklch(0.32_0.16_265/0.28)] sm:p-7">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-paper-2/60 text-[20px]">
                    {l.icon}
                  </div>
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    {l.tag}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[17px] leading-[1.3] tracking-wide text-ink sm:text-[19px]">
                  {l.title}
                </h3>
                <p className="mt-2 text-[12.5px] font-light leading-[1.7] text-muted-foreground sm:text-[13px]">
                  {l.body}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10.5px] font-semibold text-primary">
                  <span>💸</span>
                  <span>{l.chip}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-ink px-6 py-6 text-paper sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-paper/60">
                The loop is simple
              </div>
              <div className="mt-1.5 font-display text-[16px] leading-[1.35] tracking-wide sm:text-[19px]">
                Good stay → refer a friend → they move in → you get paid. Repeat.
              </div>
            </div>
            <button
              onClick={onRefer}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-[12.5px] font-bold tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              🎁 Refer a friend <span>→</span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── TRUST BAND (smooth check-ins) ─────────────────────────── */
function TrustBand() {
  const stats = [
    { k: "🏢", v: "100+ Bengaluru locations", s: "Koramangala · Whitefield · Bellandur · Manyata · City", n: WA_NUMBER, t: "Hi Gharpayy! Share locations available across Bangalore." },
    { k: "💬", v: "Daily 11 AM – 6 PM", s: "WhatsApp ops team across 5 zones + Homes", n: WA_NUMBER, t: "Hi Gharpayy! Is the team online right now? I need help with a booking." },
    { k: "🛏️", v: "Verified · seen live", s: "Virtual tour before you book or move in", n: WA_NUMBER, t: "Hi Gharpayy! Can I get a live virtual tour of available rooms?" },
    { k: "🎁", v: "Earn on UPI", s: "Paid after move-in · no fake credits", n: WA_NUMBER, t: "Hi Gharpayy! I want to refer a friend and earn referral rewards." },
  ];
  return (
    <section className="relative overflow-hidden border-y border-border bg-paper-2/40">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.a
              variants={fadeUp}
              key={s.v}
              href={`https://wa.me/${s.n}?text=${encodeURIComponent(s.t)}`}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-xl p-2 text-center transition hover:bg-paper sm:text-left"
            >
              <motion.div
                className="text-[28px] leading-none"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                {s.k}
              </motion.div>
              <div className="mt-2 text-[12px] font-semibold text-ink group-hover:text-primary">{s.v}</div>
              <div className="mt-0.5 text-[10.5px] font-light leading-[1.5] text-muted-foreground">{s.s}</div>
            </motion.a>
          ))}
        </motion.div>
      </div>
      {/* Marquee strip */}
      <div className="relative overflow-hidden border-t border-border/60 bg-paper">
        <motion.div
          className="flex gap-10 whitespace-nowrap py-2.5 font-display text-[11px] uppercase tracking-[0.28em] text-muted-foreground/80"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 2 }).flatMap((_, i) =>
            [
              "📍 Koramangala · Christ · JNC",
              "📍 Whitefield · ITPL · EPIP",
              "📍 Bellandur · Ecoworld · Embassy",
              "📍 Manyata · Hebbal · Bhartiya City",
              "📍 Vasanth Nagar · MG Road · UB City",
              "📍 Electronic City · Infosys · Biocon",
              "🎁 Refer · earn up to ₹10,000",
              "🕚 Daily 11 AM – 6 PM",
            ].map((t) => (
              <span key={`${i}-${t}`} className="flex items-center gap-2">
                {t} <span className="text-yellow-deep">✦</span>
              </span>
            )),
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Nav({ onRefer }: { onRefer: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="font-display text-xl tracking-[0.18em] text-ink sm:text-2xl">
            GUIL<span className="text-primary">D</span>
          </span>
          <span className="hidden truncate rounded-full border border-border bg-paper-2 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
            by Gharpayy · Bengaluru's PG & Flat Experts
          </span>
          <span className="inline-flex truncate rounded-full border border-border bg-paper-2 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:hidden">
            by Gharpayy
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            onClick={onRefer}
            className="hidden items-center gap-1.5 rounded-full border border-yellow/40 bg-yellow/10 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-yellow/20 sm:inline-flex"
          >
            🎁 Refer · earn ₹10k
          </button>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10.5px] font-medium text-muted-foreground sm:gap-2 sm:text-[11px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="hidden xs:inline sm:inline">11 AM – 6 PM</span>
            <span className="xs:hidden sm:hidden">Live</span>
          </span>
        </div>
      </div>
    </header>

  );
}

function Hero({ onStart, onRefer }: { onStart: () => void; onRefer: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="bg-orbs absolute inset-0" />
      {/* floating sparkles */}
      {[
        { t: "12%", l: "8%", d: 0 },
        { t: "22%", l: "86%", d: 0.6 },
        { t: "70%", l: "12%", d: 1.2 },
        { t: "78%", l: "82%", d: 0.3 },
      ].map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-primary/40"
          style={{ top: p.t, left: p.l }}
          animate={{ y: [0, -14, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: p.d }}
        />
      ))}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-3xl px-5 pb-14 pt-12 text-center sm:pb-20 sm:pt-20"
      >

        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary"
        >
          <span className="h-px w-7 bg-primary/40" />
          Bengaluru's PG & Flat Experts · gharpayy.com
          <span className="h-px w-7 bg-primary/40" />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mx-auto mt-5 font-display text-[clamp(2.6rem,11vw,7rem)] leading-[0.94] tracking-tight text-ink sm:mt-7"
        >
          YOUR WHOLE STAY,
          <br />
          <em className="font-serif italic text-primary">secured by Guild</em>
        </motion.h1>
        <motion.h2
          variants={fadeUp}
          className="mt-1 font-display text-[clamp(1.7rem,8vw,5.5rem)] leading-[0.94] tracking-tight text-ink/25"
        >
          BEFORE · DURING · AFTER{" "}
          <motion.span
            className="inline-block text-primary"
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-md text-[13px] font-light leading-[1.7] text-muted-foreground sm:mt-8 sm:text-[13.5px] sm:leading-[1.75]"
        >
          Everything support — before check-in, during your stay, after check-out. Always talk to your property
          manager first; if they don't solve it, Guild fixes it. One tap, a real human on WhatsApp.
        </motion.p>


        <motion.div variants={fadeUp} className="mt-8 flex w-full flex-col items-stretch justify-center gap-2.5 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <motion.button
            onClick={onStart}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-[12px] uppercase tracking-[0.22em] text-primary-foreground shadow-[0_8px_24px_-12px_oklch(0.32_0.16_265/0.6)] sm:w-auto sm:px-7 sm:text-[13px]"
          >
            📅 Activate my Guild <span>→</span>
          </motion.button>
          <motion.button
            onClick={onRefer}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-yellow/50 bg-gradient-to-r from-yellow/15 to-yellow/5 px-5 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink sm:w-auto sm:px-6 sm:text-[12px]"
          >
            <motion.span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-yellow/40 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }}
            />
            <span className="relative">🎁 Refer · earn up to</span>
            <span className="relative font-display text-[14px] tracking-normal text-ink sm:text-[15px]">₹10,000</span>
          </motion.button>
        </motion.div>


        <motion.div
          variants={fadeUp}
          className="mt-6 text-[10.5px] font-light tracking-wide text-muted-foreground/80"
        >
          Real human on the other end · daily 11 AM – 6 PM
          <span className="mx-2 text-muted-foreground/40">·</span>
          No fake reviews · no paid testimonials
        </motion.div>
      </motion.div>
    </section>
  );
}

function Process({ onStart }: { onStart: () => void }) {
  return (
    <section id="how" className="relative">
      <div className="mx-auto max-w-5xl px-5 pb-14 sm:pb-24">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground/70">
            How Guild works
          </span>
          <h3 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] tracking-tight text-ink">
            Four taps. <em className="font-serif italic text-primary">Done.</em>
          </h3>
          <p className="max-w-md text-[12.5px] font-light text-muted-foreground">
            Designed so a guest checking in can use it in 30 seconds — 11 AM to 6 PM, every day.
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((s) => (
            <motion.div
              key={s.n}
              variants={fadeUp}
              whileHover={{ y: -6, borderColor: "oklch(0.32 0.16 265 / 0.4)" }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5"
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.4 }}
              />
              <div className="relative flex items-center justify-between">
                <motion.span
                  className="font-display text-3xl text-primary/90"
                  whileHover={{ scale: 1.15, rotate: -4 }}
                >
                  0{s.n}
                </motion.span>
                {s.n === 3 && (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    WhatsApp
                  </span>
                )}
              </div>
              <div className="relative text-[14px] font-bold text-ink">{s.title}</div>
              <p className="relative text-[11.5px] font-light leading-[1.55] text-muted-foreground">
                {s.sub}
              </p>
            </motion.div>
          ))}
        </motion.div>


        <div className="mt-10 flex justify-center">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-display text-[13px] uppercase tracking-[0.22em] text-paper transition hover:bg-primary"
          >
            Start now <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export function ScenarioPicker({
  onClose,
  onPick,
  preset,
}: {
  onClose: () => void;
  onPick: (i: Issue, b: Booking) => void;
  preset?: Issue;
}) {
  const isActivation = preset?.id === "activation";
  const [phase, setPhase] = useState<"gate" | "form" | "nobooking" | "scenarios">(
    preset ? "form" : "gate",
  );
  const [b, setB] = useState<Booking>(EMPTY_BOOKING);
  const [err, setErr] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function submitForm() {
    if (!b.name.trim()) return setErr("Please share your name.");
    if (!b.propName.trim()) return setErr("Please enter your Gharpayy property name.");
    if (!b.area.trim()) return setErr("Please enter your area or locality.");
    if (isActivation && !b.arrivalDate.trim()) return setErr("Please share your arrival date so Guild can prep your room.");
    setErr("");
    if (preset) {
      onPick(preset, b);
      return;
    }
    setPhase("scenarios");
  }

  const stepLabel = isActivation
    ? "Step 1 of 2"
    : phase === "scenarios" ? "Step 2 of 4" : "Step 1 of 4";
  const stepSub =
    phase === "gate" ? "Confirm your booking"
      : phase === "form" ? (isActivation ? "Activate my Guild — arrival details" : "Your booking details")
      : phase === "nobooking" ? "Let's get you a room first"
      : "What's getting in the way";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 animate-in fade-in bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        className="relative z-10 flex max-h-[93vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="overflow-y-auto p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <div className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {stepLabel}
              </div>
              <div className="mt-1 font-display text-[22px] tracking-wide text-ink">
                {stepSub}
              </div>
              <div className="mt-1 text-[11.5px] font-light text-muted-foreground">
                {phase === "gate" && "Guild handles everything — before, during & after your stay. Quick booking check first."}
                {phase === "form" && "A few quick details so the right zone Gharwala picks up."}
                {phase === "nobooking" && "Guild's everything support is for confirmed Gharpayy guests. Let's get you in first."}
                {phase === "scenarios" && "Pick the closest one — you can add details on the next screen."}
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-ink"
            >
              ✕
            </button>
          </div>

          {/* Trust line on every phase */}
          <div className="mb-5 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-[11.5px] font-light leading-[1.6] text-ink/80">
            <span className="mr-1.5">🛡️</span>
            <span className="font-semibold text-ink">Always talk to your property manager first.</span>{" "}
            If they don't solve it, Guild fixes it — before, during, or after your stay.
          </div>

          {err && (
            <div className="mb-3 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[11.5px] text-destructive">
              <span>⚠</span>
              <span>{err}</span>
            </div>
          )}

          {phase === "gate" && (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                onClick={() => setPhase("form")}
                className="group flex flex-col items-start gap-1 rounded-xl border border-border bg-paper-2/40 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="text-[22px]">✅</span>
                <div className="text-[13px] font-bold text-ink">Yes, I have a Gharpayy booking</div>
                <p className="text-[11px] font-light leading-[1.5] text-muted-foreground">
                  Continue — share what's happening (before, during or after your stay).
                </p>
              </button>
              <button
                onClick={() => setPhase("nobooking")}
                className="group flex flex-col items-start gap-1 rounded-xl border border-border bg-paper-2/40 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="text-[22px]">🔎</span>
                <div className="text-[13px] font-bold text-ink">No, I'm still looking</div>
                <p className="text-[11px] font-light leading-[1.5] text-muted-foreground">
                  We'll help you book a verified room first.
                </p>
              </button>
            </div>
          )}

          {phase === "nobooking" && (
            <div className="space-y-4">
              <p className="text-[12.5px] font-light leading-[1.7] text-ink/85">
                Guild's everything-support is reserved for confirmed Gharpayy guests, so it stays fast and focused.
                If you don't have a booking yet, our stay team will set you up — verified rooms, virtual tour
                before you confirm, no hidden charges.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Gharpayy! I'd like help booking a room in Bangalore.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-[12.5px] font-bold uppercase tracking-[0.16em] text-white transition hover:brightness-[0.97]"
                >
                  <WaIcon /> Talk to stay team
                </a>
                <a
                  href="https://cal.com/gharpayy.com/stay"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center rounded-xl border border-border bg-paper-2/40 px-5 py-3.5 text-[12.5px] font-bold uppercase tracking-[0.16em] text-ink transition hover:border-primary/40"
                >
                  Book a stay
                </a>
              </div>
              <button
                onClick={() => setPhase("gate")}
                className="text-[11.5px] font-medium text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
              >
                ← Back
              </button>
            </div>
          )}

          {phase === "form" && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Your Name" required>
                  <input className={input} value={b.name} onChange={(e) => setB({ ...b, name: e.target.value })} placeholder="e.g. Rahul, Ananya, Karan..." />
                </Field>
                <Field label="Phone (optional)">
                  <input className={input} value={b.phone} onChange={(e) => setB({ ...b, phone: e.target.value })} placeholder="+91 ..." />
                </Field>
              </div>
              <Field label="Gharpayy Property" required>
                <input className={input} value={b.propName} onChange={(e) => setB({ ...b, propName: e.target.value })} placeholder="e.g. Sunrise Heights, Green Meadows..." />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Area / Locality" required>
                  <input className={input} value={b.area} onChange={(e) => setB({ ...b, area: e.target.value })} placeholder="e.g. Koramangala, HSR..." />
                </Field>
                <Field label="Room / Flat No.">
                  <input className={input} value={b.room} onChange={(e) => setB({ ...b, room: e.target.value })} placeholder="e.g. 204, B-12" maxLength={20} />
                </Field>
              </div>
              {isActivation && (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Arrival Date" required>
                      <input
                        type="date"
                        className={input}
                        value={b.arrivalDate}
                        onChange={(e) => setB({ ...b, arrivalDate: e.target.value })}
                      />
                    </Field>
                    <Field label="Arrival ETA (time + train/flight)">
                      <input
                        className={input}
                        value={b.arrivalEta}
                        onChange={(e) => setB({ ...b, arrivalEta: e.target.value })}
                        placeholder="e.g. 3:30 PM · Train SBC Exp"
                      />
                    </Field>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                      ⏰ You ping us — 2 days + 3 hours prior
                    </div>
                    <p className="mt-1.5 text-[11.5px] font-light leading-[1.6] text-muted-foreground">
                      <span className="font-semibold text-ink">One WhatsApp thread, no gaps.</span>{" "}
                      You drop a quick "T-2 days" and "T-3 hours" message on the same chat — Guild
                      locks the room, keys, linen & Wi-Fi each time. No outbound spam from us, no
                      missed pings, no "did you get my message?" loops.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {["Room prep", "Keys ready", "Wi-Fi tested", "Linen fresh", "Caretaker briefed"].map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border bg-paper-2/60 px-2.5 py-0.5 text-[10px] font-medium text-ink/80"
                        >
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => (preset ? onClose() : setPhase("gate"))}
                  className="text-[11.5px] font-medium text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
                >
                  ← Back
                </button>
                <button
                  onClick={submitForm}
                  className="rounded-md bg-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-ink/90"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {phase === "scenarios" && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ISSUES.map((it) => (
                <button
                  key={it.title}
                  onClick={() => onPick(it, b)}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-paper-2/40 p-3.5 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5"
                >
                  <span className="text-[22px] leading-none">{it.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold leading-tight text-ink">{it.title}</div>
                    <p className="mt-1 text-[11px] font-light leading-[1.5] text-muted-foreground">
                      {it.sub}
                    </p>
                  </div>
                  <span className="ml-auto self-center text-muted-foreground transition group-hover:text-primary">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── HOW IT WORKS — TWIN CAROUSELS ─────────────────────────── */
type FlowStep = {
  n: number;
  title: string;
  sub: string;
  mock: "chat-out" | "chat-in" | "form" | "list" | "tour" | "upi" | "celebrate" | "ticket" | "route" | "live" | "verify" | "moved" | "broadcast" | "shield";
  chip?: string;
  amount?: string;
};

const REWARDS_FLOW: FlowStep[] = [
  { n: 1, title: "Tap 'Refer a friend'", sub: "Open the Guild referral sheet from any page on the site.", mock: "chat-out", chip: "Step 01" },
  { n: 2, title: "Drop your friend's details", sub: "Name, phone, area & budget. Takes 30 seconds — no app install.", mock: "form", chip: "Step 02" },
  { n: 3, title: "Guild opens WhatsApp", sub: "Pre-filled message routes to the right Gharwala for their zone.", mock: "chat-out", chip: "Step 03" },
  { n: 4, title: "Gharwala calls your friend", sub: "Shares verified rooms, books a live tour over WhatsApp video.", mock: "tour", chip: "Step 04" },
  { n: 5, title: "Friend moves in", sub: "Deposit cleared, keys handed over, stay starts — Guild logs the match.", mock: "moved", chip: "Step 05" },
  { n: 6, title: "₹ credited to your UPI", sub: "Slab rewards paid after move-in. PG ₹500 base · every 4th = ₹1,000. Flat ₹1,000 · every 2nd = ₹2,000.", mock: "upi", chip: "Step 06", amount: "+ ₹2,000" },
  { n: 7, title: "Repeat. Up to ₹50,000+", sub: "Stack referrals across friends, juniors, colleagues. No expiry, no cap.", mock: "celebrate", chip: "Step 07", amount: "₹50,000+" },
];

const CONCIERGE_FLOW: FlowStep[] = [
  { n: 1, title: "Tap 'Get everything support'", sub: "Already activated? Jump straight to a scenario. Before / during / after — one tap.", mock: "shield", chip: "Step 01" },
  { n: 2, title: "Share booking details", sub: "Property, area, room. We confirm you're a Gharpayy guest before opening the scenarios.", mock: "verify", chip: "Step 02" },
  { n: 3, title: "Pick the exact scenario", sub: "Pre-move-in, room not ready, mid-stay issue, switch, check-out, deposit refund — any of it.", mock: "list", chip: "Step 03" },
  { n: 4, title: "Guild generates a ticket", sub: "Unique ID + priority + your context — auto-routed to your zone Gharwala.", mock: "ticket", chip: "Step 04" },
  { n: 5, title: "Routed to the right Gharwala", sub: "Koramangala, Whitefield, Bellandur, Manyata, City or Homes — instantly.", mock: "route", chip: "Step 05" },
  { n: 6, title: "Manager first, Guild always", sub: "We loop in your property manager first. If they don't solve it, our ops team takes over.", mock: "chat-in", chip: "Step 06" },
  { n: 7, title: "Stays till it's fixed", sub: "Before check-in to after check-out — Guild stays on chat till the issue feels resolved.", mock: "live", chip: "Step 07" },
];

const ACTIVATION_FLOW: FlowStep[] = [
  { n: 1, title: "Tap 'Activate my Guild'", sub: "Just booked? Lock in your arrival before you land.", mock: "shield", chip: "Step 01" },
  { n: 2, title: "Share arrival date + ETA", sub: "Date, time, train / flight, luggage count — 20 seconds.", mock: "form", chip: "Step 02" },
  { n: 3, title: "Confirm booking + room", sub: "Property, room no., name on booking. We verify before activating.", mock: "verify", chip: "Step 03" },
  { n: 4, title: "Guild generates your ticket", sub: "One ID follows you for the full stay — activation through check-in.", mock: "ticket", chip: "Step 04" },
  { n: 5, title: "Ping us 2 days prior", sub: "Quick reminder so Guild confirms room, cleaning, keys & linen ahead of time.", mock: "chat-out", chip: "Step 05" },
  { n: 6, title: "Ping us 3 hours prior", sub: "Final check — caretaker on site, Wi-Fi tested, keys in hand, room locked & ready.", mock: "chat-in", chip: "Step 06" },
  { n: 7, title: "Smooth arrival — walk straight in", sub: "Same ticket, same WhatsApp thread. Room ready the moment you land.", mock: "live", chip: "Step 07" },
];

function ChatBubble({ side, text, time }: { side: "in" | "out"; text: string; time: string }) {
  const isOut = side === "out";
  return (
    <div className={`flex ${isOut ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-3 py-1.5 text-[10.5px] leading-[1.4] shadow-sm ${
          isOut
            ? "rounded-tr-sm bg-[#dcf8c6] text-ink"
            : "rounded-tl-sm bg-white text-ink"
        }`}
      >
        <div>{text}</div>
        <div className="mt-0.5 text-right text-[8.5px] font-medium text-ink/40">{time} {isOut && <span className="text-sky-500">✓✓</span>}</div>
      </div>
    </div>
  );
}

function PhoneFrame({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[210px] overflow-hidden rounded-[22px] border border-ink/15 bg-[#ece5dd] shadow-[0_12px_30px_-12px_oklch(0.25_0.05_265/0.35)]">
      {/* WA header */}
      <div className="flex items-center gap-2 bg-[#075e54] px-3 py-2 text-paper">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-[10px]">🛡️</div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[10px] font-semibold tracking-wide">Guild · Gharpayy</div>
          <div className="truncate text-[8px] font-light opacity-80">online · daily 11 AM – 6 PM</div>
        </div>
        <div className="text-[10px] opacity-80">⋮</div>
      </div>
      {header}
      <div className="flex h-[170px] flex-col gap-1.5 overflow-hidden bg-[#ece5dd] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.04)_1px,transparent_0)] bg-[length:8px_8px] px-2.5 py-2">
        {children}
      </div>
    </div>
  );
}

function StepMock({ step }: { step: FlowStep }) {
  switch (step.mock) {
    case "chat-out":
      return (
        <PhoneFrame>
          <ChatBubble side="out" text="Hi Guild! I'd like to refer my friend Aarav for a 1BHK near Bellandur." time="11:02" />
          <ChatBubble side="in" text="Got it 🌿 Routing to your Bellandur Gharwala now…" time="11:02" />
          <ChatBubble side="out" text="His budget: ₹18k · move-in next week." time="11:03" />
        </PhoneFrame>
      );
    case "chat-in":
      return (
        <PhoneFrame>
          <ChatBubble side="in" text="Hi! Guild here 🛡️ I've seen your ticket #GR-4821." time="11:14" />
          <ChatBubble side="in" text="Sending the caretaker right now. ETA 8 mins." time="11:14" />
          <ChatBubble side="out" text="Thank you 🙏 I'll wait at the gate." time="11:15" />
        </PhoneFrame>
      );
    case "form":
      return (
        <div className="mx-auto w-[210px] rounded-[18px] border border-border bg-card p-3 shadow-[0_12px_30px_-12px_oklch(0.25_0.05_265/0.35)]">
          <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Refer a friend</div>
          {[
            { l: "Friend's name", v: "Aarav Mehta" },
            { l: "Phone", v: "+91 98•••• 4421" },
            { l: "Area", v: "Bellandur" },
            { l: "Budget / month", v: "₹18,000" },
          ].map((f) => (
            <div key={f.l} className="mb-1.5">
              <div className="text-[8px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">{f.l}</div>
              <div className="mt-0.5 rounded-md border border-border bg-paper px-2 py-1 text-[10px] font-medium text-ink">{f.v}</div>
            </div>
          ))}
          <div className="mt-2 rounded-md bg-primary py-1.5 text-center text-[9.5px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
            Send to Guild →
          </div>
        </div>
      );
    case "list":
      return (
        <div className="mx-auto w-[210px] rounded-[18px] border border-border bg-card p-3 shadow-[0_12px_30px_-12px_oklch(0.25_0.05_265/0.35)]">
          <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Pick scenario</div>
          {[
            { e: "🏠", t: "Room not ready", s: "Selected" },
            { e: "🔑", t: "Keys not handed over", s: "" },
            { e: "🛏️", t: "Different from photos", s: "" },
            { e: "🛡️", t: "Safety concern", s: "" },
          ].map((i) => (
            <div
              key={i.t}
              className={`mb-1 flex items-center gap-2 rounded-md border px-2 py-1.5 text-[10px] ${
                i.s ? "border-primary/40 bg-primary/5 text-ink" : "border-border bg-paper text-muted-foreground"
              }`}
            >
              <span>{i.e}</span>
              <span className="flex-1 font-medium">{i.t}</span>
              {i.s && <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-primary">✓</span>}
            </div>
          ))}
        </div>
      );
    case "tour":
      return (
        <PhoneFrame>
          <div className="flex h-full flex-col items-center justify-center gap-1.5 rounded-xl bg-ink/90 text-paper">
            <div className="text-[28px]">📹</div>
            <div className="text-[10px] font-semibold">Live WhatsApp tour</div>
            <div className="text-[8.5px] font-light opacity-80">Bellandur · Pavion Coed · Room 3B</div>
            <div className="mt-1 flex gap-1.5">
              <div className="h-1.5 w-6 rounded-full bg-emerald-400" />
              <div className="h-1.5 w-1.5 rounded-full bg-paper/30" />
              <div className="h-1.5 w-1.5 rounded-full bg-paper/30" />
            </div>
          </div>
        </PhoneFrame>
      );
    case "upi":
      return (
        <div className="mx-auto w-[210px] rounded-[18px] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-card to-card p-3 shadow-[0_12px_30px_-12px_oklch(0.55_0.16_155/0.35)]">
          <div className="flex items-center justify-between">
            <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-700">UPI · Credited</div>
            <div className="text-[8px] font-mono text-muted-foreground">Today</div>
          </div>
          <div className="mt-2 font-display text-[26px] font-bold tracking-tight text-emerald-700">
            {step.amount ?? "+ ₹2,000"}
          </div>
          <div className="text-[9.5px] font-light text-muted-foreground">From GHARPAYY GUILD REWARDS</div>
          <div className="mt-2 rounded-md bg-paper-2 px-2 py-1.5 text-[9px]">
            <div className="text-[8px] uppercase tracking-[0.16em] text-muted-foreground/70">UTR</div>
            <div className="font-mono text-[10px] text-ink">GR48217X92K</div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-4 w-4 rounded bg-[#5f259f]" />
            <div className="text-[9px] font-semibold text-ink">PhonePe · UPI</div>
            <div className="ml-auto text-[10px] text-emerald-600">✓</div>
          </div>
        </div>
      );
    case "celebrate":
      return (
        <div className="relative mx-auto flex w-[210px] flex-col items-center gap-2 rounded-[18px] border border-yellow/40 bg-gradient-to-br from-yellow/15 via-card to-card p-4 shadow-[0_12px_30px_-12px_oklch(0.55_0.16_85/0.35)]">
          <div className="text-[36px]">🎁</div>
          <div className="font-display text-[20px] font-bold leading-none tracking-tight text-ink">₹50,000+</div>
          <div className="text-center text-[9.5px] font-light leading-[1.4] text-muted-foreground">
            stacked over flats + PGs<br />· no expiry · paid on UPI
          </div>
          <div className="flex w-full justify-between text-[8px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
            <span>Flat #1 ₹1k</span>
            <span>·</span>
            <span>Flat #2 ₹2k</span>
            <span>·</span>
            <span>PG #4 ₹1k</span>
          </div>
        </div>
      );
    case "ticket":
      return (
        <div className="mx-auto w-[210px] rounded-[18px] border border-border bg-card p-3 shadow-[0_12px_30px_-12px_oklch(0.25_0.05_265/0.35)]">
          <div className="rounded-md border border-dashed border-primary/40 bg-primary/5 p-2.5">
            <div className="text-[8px] font-semibold uppercase tracking-[0.22em] text-primary">Ticket Generated</div>
            <div className="mt-1 font-mono text-[14px] font-bold text-ink">#GR-4821</div>
            <div className="mt-1 text-[9px] font-light text-muted-foreground">Room not ready · Bellandur</div>
            <div className="mt-2 flex items-center gap-1.5 text-[8.5px]">
              <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 font-semibold text-red-600">🔴 High</span>
              <span className="rounded-full bg-paper-2 px-1.5 py-0.5 font-medium text-muted-foreground">Routed</span>
            </div>
          </div>
          <div className="mt-2 text-[9px] font-light text-muted-foreground">Saved & shared on WhatsApp →</div>
        </div>
      );
    case "route":
      return (
        <div className="mx-auto w-[210px] rounded-[18px] border border-border bg-card p-3 shadow-[0_12px_30px_-12px_oklch(0.25_0.05_265/0.35)]">
          <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Auto-routed</div>
          {[
            { e: "🌆", n: "Koramangala", a: false },
            { e: "🏙️", n: "Whitefield", a: false },
            { e: "🌊", n: "Bellandur", a: true },
            { e: "🌳", n: "Manyata", a: false },
            { e: "📍", n: "City · Vasanth Nagar", a: false },
            { e: "🏡", n: "Homes · Flats", a: false },
          ].map((z) => (
            <div
              key={z.n}
              className={`mb-0.5 flex items-center gap-2 rounded px-1.5 py-1 text-[9.5px] ${
                z.a ? "bg-emerald-500/10 font-semibold text-emerald-700" : "text-muted-foreground"
              }`}
            >
              <span>{z.e}</span>
              <span className="flex-1">{z.n}</span>
              {z.a && <span className="text-[8px]">● routing</span>}
            </div>
          ))}
        </div>
      );
    case "live":
      return (
        <PhoneFrame>
          <ChatBubble side="in" text="Caretaker is at your room. Cleaning done ✨" time="11:42" />
          <ChatBubble side="in" text="Sending you a quick video walkthrough." time="11:43" />
          <ChatBubble side="out" text="Got it. Everything matches the photos 👌" time="11:46" />
          <ChatBubble side="in" text="Welcome home 🌿 Guild stays here till you settle." time="11:46" />
        </PhoneFrame>
      );
    case "verify":
      return (
        <div className="mx-auto w-[210px] rounded-[18px] border border-border bg-card p-3 shadow-[0_12px_30px_-12px_oklch(0.25_0.05_265/0.35)]">
          <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Booking details</div>
          {[
            { l: "Property", v: "Pavion Coed" },
            { l: "Area", v: "Bellandur" },
            { l: "Room / Flat", v: "3B · Twin sharing" },
            { l: "Move-in", v: "Today · 4 PM" },
          ].map((f) => (
            <div key={f.l} className="mb-1.5">
              <div className="text-[8px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">{f.l}</div>
              <div className="mt-0.5 rounded-md border border-border bg-paper px-2 py-1 text-[10px] font-medium text-ink">{f.v}</div>
            </div>
          ))}
          <div className="mt-1 flex items-center gap-1 text-[8.5px] font-medium text-emerald-700">
            <span>🔒</span> Issue list unlocks after booking is verified
          </div>
        </div>
      );
    case "moved":
      return (
        <div className="mx-auto w-[210px] rounded-[18px] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-3 shadow-[0_12px_30px_-12px_oklch(0.55_0.16_155/0.35)]">
          <div className="text-[8.5px] font-semibold uppercase tracking-[0.22em] text-emerald-700">Move-in confirmed</div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-[18px]">🏡</div>
            <div className="min-w-0">
              <div className="truncate font-display text-[12px] font-semibold text-ink">Aarav Mehta</div>
              <div className="truncate text-[9px] text-muted-foreground">Pavion Coed · Bellandur</div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[8px]">
            <div className="rounded bg-paper-2 p-1"><div className="text-emerald-600">✓</div><div className="font-semibold text-ink">Deposit</div></div>
            <div className="rounded bg-paper-2 p-1"><div className="text-emerald-600">✓</div><div className="font-semibold text-ink">Keys</div></div>
            <div className="rounded bg-paper-2 p-1"><div className="text-emerald-600">✓</div><div className="font-semibold text-ink">Logged</div></div>
          </div>
          <div className="mt-2 text-[8.5px] font-light text-muted-foreground">Your reward unlocks now →</div>
        </div>
      );
    case "shield":
      return (
        <div className="mx-auto flex w-[210px] flex-col items-center gap-2 rounded-[18px] border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-[0_12px_30px_-12px_oklch(0.32_0.16_265/0.35)]">
          <div className="text-[36px]">🛡️</div>
          <div className="font-display text-[14px] font-bold tracking-tight text-ink">Get everything support</div>
          <div className="text-center text-[9px] font-light leading-[1.5] text-muted-foreground">
            Before · During · After <br /> Manager first, Guild always.
          </div>
          <div className="mt-1 rounded-full bg-ink px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-paper">
            Tap to start →
          </div>
        </div>
      );
    case "broadcast":
      return null;
    default:
      return null;
  }
}

function FlowCarousel({
  title,
  kicker,
  blurb,
  steps,
  accent,
  cta,
  onCta,
  scenario,
}: {
  title: React.ReactNode;
  kicker: string;
  blurb: string;
  steps: FlowStep[];
  accent: "primary" | "yellow";
  cta: string;
  onCta: () => void;
  scenario: string;
}) {
  const accentChip =
    accent === "primary"
      ? "border-primary/30 bg-primary/5 text-primary"
      : "border-yellow/40 bg-yellow/10 text-yellow-deep";
  const accentBtn =
    accent === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-ink text-paper";

  return (
    <div className="relative">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.22em] ${accentChip}`}>
            {kicker}
          </span>
          <h3 className="mt-2 font-display text-[clamp(1.6rem,3.6vw,2.3rem)] leading-[1.05] tracking-tight text-ink">
            {title}
          </h3>
          <p className="mt-1.5 max-w-md text-[12px] font-light leading-[1.55] text-muted-foreground">
            {blurb}
          </p>
        </div>
        <button
          onClick={onCta}
          className={`hidden shrink-0 items-center gap-1.5 self-start rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition hover:scale-[1.02] sm:inline-flex ${accentBtn}`}
        >
          {cta} →
        </button>
      </div>

      <div className="-mx-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-4 pr-5">
          {steps.map((s, i) => {
            return (
              <motion.a
                key={s.n}
                href={guildWaHref({
                  scenario: `${scenario} · ${s.title}`,
                  note: `Currently at step "${s.title}". Please walk me through it.`,
                })}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05 }}
                className="relative flex w-[78vw] max-w-[260px] shrink-0 snap-start flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-[0_10px_30px_-12px_oklch(0.32_0.16_265/0.25)] sm:w-[250px]"
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.22em] ${accentChip}`}>
                    {s.chip ?? `Step ${String(s.n).padStart(2, "0")}`}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/60">0{s.n}/0{steps.length}</span>
                </div>

                <div className="flex h-[200px] items-center justify-center rounded-xl bg-paper-2/60 p-2">
                  <StepMock step={s} />
                </div>

                <div>
                  <div className="font-display text-[14px] font-semibold leading-[1.2] text-ink">{s.title}</div>
                  <div className="mt-1 text-[10.5px] font-light leading-[1.55] text-muted-foreground">{s.sub}</div>
                </div>

                <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-ink/90 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-paper">
                  <WaIcon className="h-2.5 w-2.5" /> Tap to ask experts
                </span>

                {i < steps.length - 1 && (
                  <div className="pointer-events-none absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-paper text-[11px] text-muted-foreground sm:flex">
                    →
                  </div>
                )}
              </motion.a>
            );
          })}
        </div>
      </div>

      <button
        onClick={onCta}
        className={`mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] sm:hidden ${accentBtn}`}
      >
        {cta} →
      </button>
    </div>
  );
}

function HowItWorksCarousels({ onRefer, onStart }: { onRefer: () => void; onStart: () => void }) {
  return (
    <section className="relative overflow-hidden border-t border-border bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <div className="mb-12 flex flex-col items-center gap-2 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground/70">
            How it works · step by step
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] leading-[1.02] tracking-tight text-ink">
            See exactly how <em className="font-serif italic text-primary">Guild</em> moves
          </h2>
          <p className="max-w-xl text-[12.5px] font-light leading-[1.6] text-muted-foreground">
            Two flows, two carousels. Swipe through real WhatsApp mockups — how friends refer through Guild,
            and how you activate Guild the moment you book so your room is ready before you land.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          <FlowCarousel
            kicker="Guild Rewards · Step-by-step"
            title={
              <>
                How a referral turns into <em className="font-serif italic text-yellow-deep">₹ on UPI</em>
              </>
            }
            blurb="From the moment you tap Refer to the moment money lands in your account — seven steps, zero forms to chase."
            steps={REWARDS_FLOW}
            accent="yellow"
            cta="🎁 Refer a friend"
            onCta={onRefer}
            scenario="Guild Rewards — Referral flow"
          />

          <FlowCarousel
            kicker="Guild Activation · Plan my check-in"
            title={
              <>
                How to <em className="font-serif italic text-primary">activate Guild</em> before you land
              </>
            }
            blurb="Just booked? Lock in your arrival, ping us 2 days + 3 hours prior, and walk straight into a ready room."
            steps={ACTIVATION_FLOW}
            accent="primary"
            cta="📅 Activate my Guild"
            onCta={onStart}
            scenario="Guild Activation — Plan my arrival"
          />
        </div>

        <p className="mt-12 text-center text-[10.5px] font-light text-muted-foreground/80">
          Activate at booking · Ping us 2 days + 3 hours prior · Daily 11 AM – 6 PM · gharpayy.com
        </p>
      </div>
    </section>
  );
}


function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-paper">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-display text-3xl tracking-[0.18em]">
              GHAR<span className="text-yellow">PAYY</span>
            </div>
            <p className="mt-2 max-w-md text-[12.5px] font-light text-paper/65">
              Comfortable accommodation in 10 minutes. Verified. Seen live. Peace of mind.
            </p>
            <p className="mt-2 text-[11.5px] font-light text-paper/70">
              Already staying? →{" "}
              <Link to="/guild-support" className="font-semibold text-yellow underline-offset-4 hover:underline">
                Guild Support
              </Link>
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.16em] text-paper/55">
              <a href="mailto:team@gharpayy.com" className="hover:text-yellow">team@gharpayy.com</a>
              <a href="tel:+917988114576" className="hover:text-yellow">+91 79881 14576</a>
              <span>Bangalore, India</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-yellow px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink transition hover:bg-yellow-deep"
            >
              Talk Now
            </a>
            <Link
              to="/guild-rewards"
              className="rounded-full border border-yellow px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow transition hover:bg-yellow hover:text-ink"
            >
              Guild Rewards
            </Link>
            <Link
              to="/guild-support"
              className="rounded-full border border-emerald-400/60 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:bg-emerald-400 hover:text-ink"
            >
              Guild Support
            </Link>
            <a
              href="https://cal.com/gharpayy.com/stay"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-white/10"
            >
              Stay Here
            </a>
          </div>
        </div>


        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-yellow">
            5 zones across Bengaluru
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {LOCATIONS.map((l) => (
              <a
                key={l}
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/12 px-3 py-1 text-[10.5px] text-paper/70 transition hover:border-yellow hover:text-yellow"
              >
                {l}
              </a>
            ))}
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-yellow/90 px-3 py-1 text-[10.5px] font-semibold text-ink"
            >
              + 100 more
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[10.5px] text-paper/45">
          <div>© {new Date().getFullYear()} Gharpayy · Bana hai Bengaluru mein, dil se</div>
          <a href="https://gharpayy.com" target="_blank" rel="noreferrer" className="hover:text-yellow">
            gharpayy.com →
          </a>
        </div>
      </div>
    </footer>
  );
}

/* -------------------- ACTIVATION CONFIRM -------------------- */
export function ActivationConfirm({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const ticket = useMemo(() => makeTicketId(), []);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const arrivalLine =
    booking.arrivalDate || booking.arrivalEta
      ? `📅 Arrival: ${[booking.arrivalDate, booking.arrivalEta ? `ETA ${booking.arrivalEta}` : ""].filter(Boolean).join(" · ")}`
      : "";

  const message = [
    "🛡️ *Guild — Activate my arrival*",
    `🎟️ Ticket: ${ticket}`,
    "",
    "👋 Hi Guild — I've just booked. Locking in my arrival so my room is ready.",
    "",
    booking.name || booking.phone ? `👤 Guest: ${[booking.name, booking.phone].filter(Boolean).join(" · ")}` : "",
    booking.propName || booking.area ? `🏠 Property: ${[booking.propName, booking.area].filter(Boolean).join(", ")}` : "",
    booking.room ? `🚪 Room: ${booking.room}` : "",
    arrivalLine,
    "",
    "⏰ *I'll ping this same chat:*",
    "• 2 days before arrival — lock the room, keys, linen, Wi-Fi",
    "• 3 hours before arrival — confirm ETA & on-ground readiness",
    "",
    "One thread, same ticket, same human. Please keep the room locked & ready 🌿",
    "",
    "— Sent from gharpayy.com Guild",
  ].filter(Boolean).join("\n");

  function openThread() {
    const zone = zoneFor(booking.area);
    window.open(`https://wa.me/${zone.number}?text=${encodeURIComponent(message + `\n\n📡 Routed to: ${zone.emoji} ${zone.name}`)}`, "_blank");
    setSent(true);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 animate-in fade-in bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        className="relative z-10 flex max-h-[93vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        {sent ? (
          <div className="p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-2xl">
              ✅
            </div>
            <div className="mt-4 font-display text-[22px] tracking-wide text-ink">
              Your Guild is activated.
            </div>
            <p className="mx-auto mt-2 max-w-sm text-[12.5px] font-light leading-[1.65] text-muted-foreground">
              <span className="font-semibold text-ink">Save this WhatsApp chat.</span> Ping us here
              <span className="font-semibold text-ink"> 2 days before</span> and
              <span className="font-semibold text-ink"> 3 hours before</span> you land. Same chat,
              same human, same ticket — zero gaps.
            </p>
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-paper-2 px-4 py-2 text-[11px] font-medium tracking-wide text-muted-foreground">
              Ticket <span className="font-mono text-ink">{ticket}</span>
            </div>
            <button
              onClick={onClose}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-border px-5 py-3 text-[12.5px] font-medium text-ink transition hover:border-primary/40"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-[22px]">
                  📅
                </div>
                <div>
                  <div className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Step 2 of 2 · Confirm & open WhatsApp
                  </div>
                  <div className="mt-0.5 font-display text-[19px] leading-tight tracking-wide text-ink">
                    Activate my Guild
                  </div>
                  <div className="mt-0.5 max-w-[320px] text-[10.5px] font-light leading-snug text-muted-foreground">
                    One WhatsApp thread. You ping us, we keep the room locked & ready.
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* Arrival details echo */}
            <div className="rounded-xl border border-border bg-paper-2/50 p-4">
              <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Your arrival
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11.5px] text-ink">
                <div><span className="text-muted-foreground">Guest</span><div className="font-semibold">{booking.name || "—"}</div></div>
                <div><span className="text-muted-foreground">Phone</span><div className="font-semibold">{booking.phone || "—"}</div></div>
                <div className="col-span-2"><span className="text-muted-foreground">Property</span><div className="font-semibold">{booking.propName}{booking.area ? `, ${booking.area}` : ""}</div></div>
                <div><span className="text-muted-foreground">Room</span><div className="font-semibold">{booking.room || "—"}</div></div>
                <div><span className="text-muted-foreground">Arrival</span><div className="font-semibold">{booking.arrivalDate || "—"}{booking.arrivalEta ? ` · ${booking.arrivalEta}` : ""}</div></div>
              </div>
            </div>

            {/* Ping-us cadence card */}
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                ⏰ You ping us — 2 days + 3 hours prior
              </div>
              <p className="mt-1.5 text-[11.5px] font-light leading-[1.6] text-muted-foreground">
                <span className="font-semibold text-ink">One thread, no gaps.</span> You drop a quick
                "T-2 days" and "T-3 hours" on this same WhatsApp chat. Guild locks the room each
                time. No outbound spam from us, no missed pings, no "did you get my message?" loops.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Room prep", "Keys ready", "Wi-Fi tested", "Linen fresh", "Caretaker briefed"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-paper-2/60 px-2.5 py-0.5 text-[10px] font-medium text-ink/80"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-paper-2/40 px-3 py-2 text-[10.5px]">
              <span className="text-muted-foreground">Ticket</span>
              <span className="font-mono font-semibold text-ink">{ticket}</span>
            </div>

            <button
              onClick={openThread}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-[12.5px] font-bold uppercase tracking-[0.16em] text-white transition hover:brightness-[0.97]"
            >
              <WaIcon /> Open my Guild thread on WhatsApp
            </button>
            <p className="mt-3 text-center text-[10.5px] font-light text-muted-foreground">
              Save this chat. It's your single Guild line — before, during & after your stay.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- MODAL -------------------- */
export function Modal({ issue, initial, onClose }: { issue: Issue; initial?: Booking; onClose: () => void }) {
  // Booking is collected in the picker; modal starts at step 3 (What's Happening).
  const hasBooking = !!(initial?.name && initial?.propName && initial?.area);
  const [step, setStep] = useState(hasBooking ? 3 : 2);
  const [alert, setAlert] = useState("");
  const [sent, setSent] = useState<{ ticket: string } | null>(null);
  const ticket = useMemo(() => makeTicketId(), []);
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");

  const [propName, setPropName] = useState(initial?.propName ?? "");
  const [area, setArea] = useState(initial?.area ?? "");
  const [room, setRoom] = useState(initial?.room ?? "");

  const [problem, setProblem] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("");
  const [duration, setDuration] = useState("");

  const [owner, setOwner] = useState<Owner>("");
  const [resolving, setResolving] = useState<Resolving>("");

  const [expectation, setExpectation] = useState<{ val: string; id: string }>({ val: "", id: "" });
  const [extra, setExtra] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const meta = [
    { pct: "40%", label: "Step 2 of 4", sub: "Edit Booking" },
    { pct: "75%", label: "Step 3 of 4", sub: "What's Happening" },
    { pct: "100%", label: "Step 4 of 4", sub: "How Can We Help" },
  ][step - 2];

  function go(n: number) {
    if (n > step) {
      const err = validate(step);
      if (err) {
        setAlert(err);
        return;
      }
    }
    setAlert("");
    setStep(n);
  }

  function validate(n: number): string {
    if (n === 2) {
      if (!name.trim()) return "Please share your name so we can address you right.";
      if (!propName.trim()) return "Please enter your Gharpayy property name.";
      if (!area.trim()) return "Please enter your area or locality.";
    }
    if (n === 3) {
      if (!problem.trim()) return "Tell us in a line what's happening — before, during or after your stay.";
      if (!urgency) return "Please pick how urgent this is.";
    }
    if (n === 4) {
      if (!expectation.val) return "Please pick how we should help.";
    }
    return "";
  }

  function send() {
    for (let i = 2; i <= 4; i++) {
      const err = validate(i);
      if (err) {
        setAlert(err);
        setStep(i);
        return;
      }
    }
    const urgMap: Record<string, string> = {
      Low: "🟢 Low — flexible",
      Medium: "🟡 Medium — today if possible",
      High: "🔴 High — I'm at the property now",
    };
    const lines = [
      "👋 *Hi Guild team — I need support during / after my stay.*",
      "",
      `🎫 *Ticket:* \`${ticket}\``,
      `🏷️ *Scenario:* ${issue.emoji} ${issue.title}`,
      `⏱️ *Priority:* ${urgMap[urgency as string]}`,
      duration ? `🗓️ *Since:* ${duration}` : "",
      "",
      "👤 *Guest*",
      `• Name: ${name.trim()}`,
      phone.trim() ? `• Phone: ${phone.trim()}` : "",
      "",
      "📍 *Booking*",
      `• Property: ${propName.trim()}`,
      `• Area: ${area.trim()}`,
      room.trim() ? `• Room / Flat: ${room.trim()}` : "",
      initial?.arrivalDate ? `• 📅 Arrival: ${initial.arrivalDate}${initial.arrivalEta ? ` · ETA ${initial.arrivalEta}` : ""}` : "",
      "",
      "📝 *What's happening*",
      problem.trim(),
      "",
      "🙏 *How Guild can help*",
      expectation.val,
      extra.trim() ? `\n💬 *A little more context*\n${extra.trim()}` : "",
      "",
      "— Sent via *Guild* · gharpayy.com",
      "Reply on this chat and I'll stay here. Thank you! 🌿",
    ]
      .filter(Boolean)
      .join("\n");

    const zone = zoneFor(area);
    const linesWithZone = lines + `\n\n📡 *Routed to:* ${zone.emoji} ${zone.name}`;
    window.open(`https://wa.me/${zone.number}?text=${encodeURIComponent(linesWithZone)}`, "_blank");
    setSent({ ticket });
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 animate-in fade-in bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        className="relative z-10 flex max-h-[93vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        {sent ? (
          <div className="p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-2xl">
              ✅
            </div>
            <div className="mt-4 font-display text-[22px] tracking-wide text-ink">
              You're in good hands.
            </div>
            <p className="mx-auto mt-2 max-w-sm text-[12.5px] font-light leading-[1.65] text-muted-foreground">
              We've opened WhatsApp with your full context. Just hit send — Guild loops in your property manager first, and if they don't solve it, our ops team stays with you till it's fixed.
            </p>
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-paper-2 px-4 py-2 text-[11px] font-medium tracking-wide text-muted-foreground">
              Ticket <span className="font-mono text-ink">{sent.ticket}</span>
            </div>
            <button
              onClick={onClose}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-border px-5 py-3 text-[12.5px] font-medium text-ink transition hover:border-primary/40"
            >
              Close
            </button>
          </div>
        ) : (
        <div className="overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-[22px]">
                {issue.emoji}
              </div>
              <div>
                <div className="font-display text-[19px] leading-tight tracking-wide text-ink">
                  {issue.title}
                </div>
                <div className="mt-0.5 max-w-[280px] text-[10.5px] font-light leading-snug text-muted-foreground">
                  {issue.sub}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-ink"
            >
              ✕
            </button>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {meta.label}
              </span>
              <span className="text-[9px] font-semibold text-primary">{meta.sub}</span>
            </div>
            <div className="h-[2px] overflow-hidden rounded-full bg-paper-2">
              <div
                className="h-full bg-gradient-to-r from-primary/70 to-primary transition-[width] duration-500"
                style={{ width: meta.pct }}
              />
            </div>
          </div>

          {alert && (
            <div className="mb-3 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[11.5px] text-destructive">
              <span>⚠</span>
              <span>{alert}</span>
            </div>
          )}

          {/* Steps */}
          {step === 2 && (
            <StepBlock heading="Your Booking">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Your Name" required>
                  <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul, Ananya, Karan..." />
                </Field>
                <Field label="Phone (optional)">
                  <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 ..." />
                </Field>
              </div>
              <Field label="Gharpayy Property" required>
                <input className={input} value={propName} onChange={(e) => setPropName(e.target.value)} placeholder="e.g. Sunrise Heights, Green Meadows..." />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Area / Locality" required>
                  <input className={input} value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Koramangala, HSR..." />
                </Field>
                <Field label="Room / Flat No.">
                  <input className={input} value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. 204, B-12" maxLength={20} />
                </Field>
              </div>
              <Nav2 onNext={() => go(3)} />
            </StepBlock>
          )}

          {step === 3 && (
            <StepBlock heading="What's Happening">
              <Field label="Tell us in a line or two" required>
                <textarea className={`${input} min-h-[78px] resize-none leading-[1.6]`} value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="e.g. I just reached the property and the room isn't ready yet..." />
              </Field>
              <Field label="How urgent is this for you?" required>
                <div className="flex flex-wrap gap-2">
                  {(["Low", "Medium", "High"] as Urgency[]).map((u) => (
                    <UrgBtn key={u} value={u} current={urgency} onClick={() => setUrgency(u)} />
                  ))}
                </div>
              </Field>
              <Field label="When did this start?">
                <select className={`${input} pr-8`} value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="">Select</option>
                  <option>I'm at the property right now</option>
                  <option>Earlier today</option>
                  <option>Yesterday</option>
                  <option>2 to 3 days</option>
                  <option>A week or more</option>
                </select>
              </Field>
              <Nav2 onBack={() => go(2)} onNext={() => go(4)} />
            </StepBlock>
          )}

          {step === 4 && (
            <StepBlock heading="How Can Guild Help">
              <Field label="How would you like us to help?" required>
                <div className="flex flex-col gap-2">
                  {EXPECTATIONS.map((e) => (
                    <OptBtn
                      key={e.id}
                      icon={e.icon}
                      title={e.title}
                      sub={e.sub}
                      selected={expectation.id === e.id}
                      onClick={() => setExpectation({ val: e.val, id: e.id })}
                    />
                  ))}
                </div>
              </Field>
              <Field label="Anything else we should know?">
                <textarea className={`${input} min-h-[60px] resize-none leading-[1.6]`} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Best time to call, who we should speak to, anything that helps..." />
              </Field>

              <button
                onClick={send}
                className="mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 font-display text-lg tracking-[0.2em] text-white shadow-[0_6px_0_#1ea855] transition active:translate-y-[2px] active:shadow-[0_4px_0_#1ea855]"
              >
                <WaIcon /> SEND ON WHATSAPP
              </button>
              <div className="mt-2 text-center text-[10px] font-light text-muted-foreground">
                Opens WhatsApp with your details &amp; ticket{" "}
                <span className="font-mono text-ink">{ticket}</span> pre-filled
              </div>
              <Nav2 onBack={() => go(3)} fullBack />
            </StepBlock>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

/* ---------- modal subcomponents ---------- */
const input =
  "w-full rounded-md border border-border bg-paper-2/40 px-3 py-2.5 text-[13.5px] font-light text-ink outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/40 focus:bg-primary/5 focus:shadow-[0_0_0_3px_oklch(0.32_0.16_265/0.08)]";

function StepBlock({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-300">
      <div className="mb-3.5 flex items-center gap-2 font-display text-[13px] uppercase tracking-[0.22em] text-muted-foreground">
        {heading}
        <span className="h-px flex-1 bg-border" />
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <label className="mb-1.5 block text-[9.5px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}

function Nav2({ onBack, onNext, fullBack }: { onBack?: () => void; onNext?: () => void; fullBack?: boolean }) {
  return (
    <div className="mt-5 flex gap-2.5">
      {onBack && (
        <button
          onClick={onBack}
          className={`${fullBack ? "w-full" : ""} rounded-md border border-border bg-transparent px-5 py-3 text-[13px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-ink`}
        >
          ← Back
        </button>
      )}
      {onNext && (
        <button
          onClick={onNext}
          className="flex-1 rounded-md bg-primary/10 px-5 py-3 text-[13px] font-semibold text-primary transition hover:bg-primary/20"
        >
          Continue →
        </button>
      )}
    </div>
  );
}

function UrgBtn({ value, current, onClick }: { value: Urgency; current: Urgency; onClick: () => void }) {
  const sel = current === value;
  const styles = useMemo(() => {
    if (!sel) return "border-border bg-paper-2/40 text-muted-foreground";
    if (value === "Low") return "border-emerald-500 bg-emerald-500/10 text-emerald-700";
    if (value === "Medium") return "border-amber-500 bg-amber-500/10 text-amber-700";
    return "border-red-500 bg-red-500/10 text-red-700";
  }, [sel, value]);
  const emoji = value === "Low" ? "🟢" : value === "Medium" ? "🟡" : "🔴";
  const label = value === "High" ? "High — Today" : value;
  return (
    <button
      onClick={onClick}
      className={`flex min-w-[90px] flex-1 flex-col items-center gap-1 rounded-md border px-3 py-2.5 transition ${styles}`}
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">{label}</span>
    </button>
  );
}

function OptBtn({
  icon, title, sub, selected, onClick, variant,
}: {
  icon: string; title: string; sub: string; selected: boolean; onClick: () => void;
  variant?: "red" | "amber";
}) {
  const selectedStyle =
    variant === "red"
      ? "border-red-500 bg-red-500/10"
      : variant === "amber"
      ? "border-amber-500 bg-amber-500/10"
      : "border-primary bg-primary/8 shadow-[0_0_0_3px_oklch(0.32_0.16_265/0.08)]";
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center gap-2.5 rounded-md border px-3.5 py-3 text-left transition ${
        selected ? selectedStyle : "border-border bg-paper-2/40 hover:border-primary/25 hover:bg-primary/5"
      }`}
    >
      <span className="text-[18px]">{icon}</span>
      <div className="min-w-0">
        <div className="text-[12.5px] font-semibold leading-tight text-ink">{title}</div>
        <div className="mt-0.5 text-[10.5px] font-light leading-[1.4] text-muted-foreground">{sub}</div>
      </div>
    </button>
  );
}

export function WaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ─────────────────────────── REFER & EARN ─────────────────────────── */
const PG_SLABS = [
  { label: "Every PG referral", amount: "₹500", highlight: false, note: "Base payout per move-in" },
  { label: "Every 4th PG referral", amount: "₹1,000", highlight: true, note: "Milestone bonus — 4th, 8th, 12th..." },
];

const FLAT_SLABS = [
  { label: "Every flat referral", amount: "₹1,000", highlight: false, note: "Base payout per move-in" },
  { label: "Every 2nd flat referral", amount: "₹2,000", highlight: true, note: "Milestone bonus — 2nd, 4th, 6th..." },
];

function Refer({ onStart }: { onStart: () => void }) {
  return (
    <section id="refer" className="relative">
      <div className="mx-auto max-w-6xl px-5 pb-14 sm:pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-yellow/30 bg-gradient-to-br from-yellow/10 via-paper to-paper p-8 sm:p-12">
          <div className="bg-grid absolute inset-0 opacity-40" />
          <div className="relative">
            <div className="mb-8 text-center sm:mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-yellow/40 bg-yellow/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink">
                🎁 Guild Rewards
              </span>
              <h3 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-tight text-ink">
                Loved your stay?
                <br />
                <em className="font-serif italic text-primary">Earn up to ₹50,000</em>
                <br className="hidden sm:block" />
                <span className="sm:text-[0.85em]">referring friends to Gharpayy.</span>
              </h3>
              <p className="mx-auto mt-5 max-w-xl text-[13px] font-light leading-[1.7] text-muted-foreground">
                The biggest earners aren't influencers — they're regular residents who keep sending friends our way.
                PG referrals add up slow and steady. Flat referrals hit harder. Mix both and ₹50,000 is real.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* PG Track */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className="rounded-2xl border border-border bg-card/80 p-5 sm:p-7"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-paper-2/60 text-[22px]">
                    👥
                  </div>
                  <div>
                    <div className="font-display text-[17px] tracking-wide text-ink">PG Referrals</div>
                    <div className="text-[10.5px] font-light text-muted-foreground">Shared rooms · hostels · paying guest</div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {PG_SLABS.map((s) => (
                    <motion.div
                      key={s.label}
                      variants={fadeUp}
                      whileHover={{ y: -2 }}
                      className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${
                        s.highlight
                          ? "border border-primary/20 bg-primary/5"
                          : "bg-paper-2/60"
                      }`}
                    >
                      <div>
                        <div className="text-[12.5px] font-bold text-ink">{s.label}</div>
                        <div className="text-[10.5px] font-light text-muted-foreground">{s.note}</div>
                      </div>
                      <div className="font-display text-[18px] tracking-wide text-primary">{s.amount}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-paper-2/40 px-4 py-2.5 text-center">
                  <span className="text-[11px] font-medium text-ink">
                    20 PG move-ins = <span className="font-display text-[14px] text-primary">₹12,500</span>
                  </span>
                </div>
              </motion.div>

              {/* Flat Track */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className="rounded-2xl border border-border bg-card/80 p-5 sm:p-7"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-paper-2/60 text-[22px]">
                    🏠
                  </div>
                  <div>
                    <div className="font-display text-[17px] tracking-wide text-ink">Flat Referrals</div>
                    <div className="text-[10.5px] font-light text-muted-foreground">1/2/3 BHK · independent units · apartments</div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {FLAT_SLABS.map((s) => (
                    <motion.div
                      key={s.label}
                      variants={fadeUp}
                      whileHover={{ y: -2 }}
                      className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${
                        s.highlight
                          ? "border border-primary/20 bg-primary/5"
                          : "bg-paper-2/60"
                      }`}
                    >
                      <div>
                        <div className="text-[12.5px] font-bold text-ink">{s.label}</div>
                        <div className="text-[10.5px] font-light text-muted-foreground">{s.note}</div>
                      </div>
                      <div className="font-display text-[18px] tracking-wide text-primary">{s.amount}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-paper-2/40 px-4 py-2.5 text-center">
                  <span className="text-[11px] font-medium text-ink">
                    20 flat move-ins = <span className="font-display text-[14px] text-primary">₹30,000</span>
                  </span>
                </div>
              </motion.div>
            </div>

            {/* The ₹50K Plan */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="mt-6 rounded-2xl border border-yellow/40 bg-gradient-to-r from-yellow/12 via-paper to-yellow/8 p-5 text-center sm:p-7"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground/70">
                The plan — mixed referrals
              </div>
              <div className="mt-3 font-display text-[clamp(1.4rem,3.5vw,2.2rem)] tracking-wide text-ink">
                25 flat move-ins + 20 PG move-ins + 2 honest posts = <em className="font-serif italic text-primary">₹50,000+</em>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {[
                  "25 flats = ₹37,000",
                  "20 PGs = ₹12,500",
                  "2 posts = ₹600",
                  "Total = ₹50,100",
                ].map((t) => (
                  <span key={t} className="rounded-full border border-border bg-paper-2/60 px-3 py-1 text-[10.5px] font-medium text-ink/80">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-display text-[12.5px] uppercase tracking-[0.22em] text-paper transition hover:bg-primary"
              >
                Refer a friend <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReferModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [yourName, setYourName] = useState("");
  const [yourPhone, setYourPhone] = useState("");
  const [yourUpi, setYourUpi] = useState("");
  const [friendName, setFriendName] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [friendArea, setFriendArea] = useState("");
  const [friendBudget, setFriendBudget] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [note, setNote] = useState("");
  const [alert, setAlert] = useState("");
  const [sent, setSent] = useState<{ ticket: string; zone: Zone } | null>(null);
  const refId = useMemo(() => {
    const d = new Date();
    const ymd = `${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    return `REF-${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function next() {
    if (!yourName.trim()) return setAlert("Please tell us your name.");
    if (!yourPhone.trim()) return setAlert("Please share your phone — we need it to credit your reward.");
    setAlert("");
    setStep(2);
  }

  function submit() {
    if (!friendName.trim()) return setAlert("Please add your friend's name.");
    if (!friendPhone.trim()) return setAlert("Please add your friend's phone — we'll reach out to them.");
    if (!friendArea.trim()) return setAlert("Please pick the area they're looking for.");
    setAlert("");

    const zone = zoneFor(friendArea);
    const lines = [
      "🎁 *New Referral via Guild*",
      "",
      `🎫 *Referral ID:* \`${refId}\``,
      `📡 *Zone:* ${zone.emoji} ${zone.name}`,
      "",
      "🙋 *Referrer (please credit reward)*",
      `• Name: ${yourName.trim()}`,
      `• Phone: ${yourPhone.trim()}`,
      yourUpi.trim() ? `• UPI: ${yourUpi.trim()}` : "",
      "",
      "👤 *Friend looking for a PG*",
      `• Name: ${friendName.trim()}`,
      `• Phone: ${friendPhone.trim()}`,
      `• Area: ${friendArea.trim()}`,
      friendBudget.trim() ? `• Budget: ${friendBudget.trim()}` : "",
      moveIn ? `• Move-in: ${moveIn}` : "",
      note.trim() ? `\n📝 *Note*\n${note.trim()}` : "",
      "",
      "💰 *Reward slabs:* PG ₹500 base · every 4th ₹1,000 · Flat ₹1,000 base · every 2nd ₹2,000 · up to ₹50,000",
      "",
      "— Sent via *Guild* · gharpayy.com",
      "Please confirm receipt and ETA. Thank you! 🌿",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/${zone.number}?text=${encodeURIComponent(lines)}`, "_blank");
    setSent({ ticket: refId, zone });
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 animate-in fade-in bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        className="relative z-10 flex max-h-[93vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="h-[2px] bg-gradient-to-r from-yellow via-primary to-yellow" />
        {sent ? (
          <div className="p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow/15 text-2xl">
              🎁
            </div>
            <div className="mt-4 font-display text-[22px] tracking-wide text-ink">
              Referral sent · thank you!
            </div>
            <p className="mx-auto mt-2 max-w-sm text-[12.5px] font-light leading-[1.65] text-muted-foreground">
              We've opened WhatsApp with your friend's details, routed to{" "}
              <span className="font-semibold text-ink">{sent.zone.emoji} {sent.zone.name}</span>.
              Hit send — once they move in, your reward lands on UPI within 7 days.
            </p>
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-paper-2 px-4 py-2 text-[11px] font-medium tracking-wide text-muted-foreground">
              Referral ID <span className="font-mono text-ink">{sent.ticket}</span>
            </div>
            <button
              onClick={onClose}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-border px-5 py-3 text-[12.5px] font-medium text-ink transition hover:border-primary/40"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow/15 text-[22px]">🎁</div>
                <div>
                  <div className="font-display text-[19px] leading-tight tracking-wide text-ink">
                    Refer & earn up to ₹50,000
                  </div>
                  <div className="mt-0.5 text-[10.5px] font-light text-muted-foreground">
                    Step {step} of 2 · {step === 1 ? "Your details" : "Friend's details"}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div className="mb-5 h-[2px] overflow-hidden rounded-full bg-paper-2">
              <div className="h-full bg-gradient-to-r from-yellow to-primary transition-[width] duration-500" style={{ width: step === 1 ? "50%" : "100%" }} />
            </div>

            {alert && (
              <div className="mb-3 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[11.5px] text-destructive">
                <span>⚠</span><span>{alert}</span>
              </div>
            )}

            {step === 1 ? (
              <StepBlock heading="About you">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Your Name" required>
                    <input className={input} value={yourName} onChange={(e) => setYourName(e.target.value)} placeholder="e.g. Rahul, Ananya..." />
                  </Field>
                  <Field label="Your Phone" required>
                    <input className={input} value={yourPhone} onChange={(e) => setYourPhone(e.target.value)} placeholder="+91 ..." />
                  </Field>
                </div>
                <Field label="UPI ID (for reward · optional)">
                  <input className={input} value={yourUpi} onChange={(e) => setYourUpi(e.target.value)} placeholder="e.g. arjun@upi" />
                </Field>
                <div className="rounded-lg border border-yellow/30 bg-yellow/8 p-3 text-[11px] leading-[1.6] text-ink">
                  💰 <span className="font-semibold">PG</span> ₹500 base · every 4th ₹1,000 ·
                  <span className="font-semibold"> Flat</span> ₹1,000 base · every 2nd ₹2,000.
                  Paid via UPI after your friend moves in.
                </div>
                <Nav2 onNext={next} />
              </StepBlock>
            ) : (
              <StepBlock heading="Your friend">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Friend's Name" required>
                    <input className={input} value={friendName} onChange={(e) => setFriendName(e.target.value)} placeholder="e.g. Karan, Aditi..." />
                  </Field>
                  <Field label="Friend's Phone" required>
                    <input className={input} value={friendPhone} onChange={(e) => setFriendPhone(e.target.value)} placeholder="+91 ..." />
                  </Field>
                </div>
                <Field label="Looking for area / locality" required>
                  <input list="zone-areas" className={input} value={friendArea} onChange={(e) => setFriendArea(e.target.value)} placeholder="e.g. Koramangala, Whitefield, Manyata..." />
                  <datalist id="zone-areas">
                    {ZONES.flatMap((z) => z.areas).map((a) => <option key={a} value={a} />)}
                  </datalist>
                  {friendArea && (
                    <div className="mt-1.5 text-[10.5px] font-medium text-muted-foreground">
                      → Routes to <span className="text-ink">{zoneFor(friendArea).emoji} {zoneFor(friendArea).name}</span>
                    </div>
                  )}
                </Field>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Budget (optional)">
                    <select className={`${input} pr-8`} value={friendBudget} onChange={(e) => setFriendBudget(e.target.value)}>
                      <option value="">Select</option>
                      <option>₹7k – 11k (Basic)</option>
                      <option>₹12k – 17k (Classic)</option>
                      <option>₹17k – 26k (Prive)</option>
                      <option>₹25k – 45k (Luxe Max)</option>
                    </select>
                  </Field>
                  <Field label="Move-in (optional)">
                    <select className={`${input} pr-8`} value={moveIn} onChange={(e) => setMoveIn(e.target.value)}>
                      <option value="">Select</option>
                      <option>This week</option>
                      <option>This month</option>
                      <option>Next month</option>
                      <option>Just exploring</option>
                    </select>
                  </Field>
                </div>
                <Field label="Anything we should know? (optional)">
                  <textarea className={`${input} min-h-[60px] resize-none leading-[1.6]`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Best time to call, food preference, near which office..." />
                </Field>

                <button
                  onClick={submit}
                  className="mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 font-display text-lg tracking-[0.2em] text-white shadow-[0_6px_0_#1ea855] transition active:translate-y-[2px] active:shadow-[0_4px_0_#1ea855]"
                >
                  <WaIcon /> SEND REFERRAL
                </button>
                <div className="mt-2 text-center text-[10px] font-light text-muted-foreground">
                  Routed to the right zone team · Referral ID{" "}
                  <span className="font-mono text-ink">{refId}</span>
                </div>
                <Nav2 onBack={() => setStep(1)} fullBack />
              </StepBlock>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── EARN MORE WAYS ─────────────────────────── */
type EarnWay = { icon: string; title: string; amount: string; sub: string; cta?: string };
const EARN_WAYS: EarnWay[] = [
  { icon: "👥", title: "Refer a friend (move-in)", amount: "₹500 – ₹2,000", sub: "PG ₹500–₹1,000 · Flat ₹1,000–₹2,000 · up to ₹50,000+" },
  { icon: "💼", title: "Post on LinkedIn", amount: "₹300", sub: "Tag @Gharpayy + your referral link · screenshot to claim" },
  { icon: "👽", title: "Post on Reddit", amount: "₹300", sub: "r/bangalore · r/india · genuine review with your code" },
];

function EarnMore({ onStart }: { onStart: () => void }) {
  return (
    <section id="earn" className="relative bg-paper-2/30">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-20">
        <div className="mb-10 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground/70">
            The earnings playbook
          </span>
          <h3 className="mt-3 font-display text-[clamp(1.9rem,4.5vw,3rem)] tracking-tight text-ink">
            How to earn with <em className="font-serif italic text-primary">Gharpayy</em>
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-[12.5px] font-light text-muted-foreground">
            PG referrals build slow. Flat referrals hit fast. Mix both with honest posts
            and active residents cross ₹50,000 without breaking a sweat.
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-3 sm:grid-cols-3"
        >
          {EARN_WAYS.map((w) => (
            <motion.div
              key={w.title}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="group relative flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 hover:border-yellow/50"
            >
              <div className="flex items-start justify-between">
                <motion.span
                  className="text-[26px] leading-none"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  {w.icon}
                </motion.span>
                <span className="font-display text-[16px] tracking-wide text-primary">{w.amount}</span>
              </div>
              <div className="mt-1 text-[13px] font-bold leading-tight text-ink">{w.title}</div>
              <p className="text-[11px] font-light leading-[1.55] text-muted-foreground">{w.sub}</p>
            </motion.div>
          ))}
        </motion.div>


        {/* Earnings progress visualizer */}
        <Reveal className="mt-10 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
                Illustrative — mixed flat + PG referrals
              </div>
              <div className="mt-1 font-display text-[18px] tracking-wide text-ink">
                Your road to <span className="text-primary">₹50,000</span>
              </div>
            </div>
            <div className="font-display text-[14px] tracking-wide text-muted-foreground">
              50 referrals
            </div>
          </div>
          <div className="relative mt-5 h-2.5 rounded-full bg-paper-2">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.6, ease }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-yellow via-yellow-deep to-primary"
            />
            {[10, 20, 30, 40, 50].map((n, i) => (
              <div
                key={n}
                className="absolute -top-1 flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${(n / 50) * 100}%` }}
              >
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15, type: "spring", stiffness: 260, damping: 18 }}
                  className="h-3.5 w-3.5 rounded-full border-2 border-paper bg-ink sm:h-4 sm:w-4"
                />
                <span className="mt-2 font-display text-[9px] tracking-wide text-muted-foreground sm:text-[10px]">
                  #{n}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 text-center sm:grid-cols-5">
            {[
              { n: 10, amt: "₹10,000" },
              { n: 20, amt: "₹21,000" },
              { n: 30, amt: "₹31,000" },
              { n: 40, amt: "₹42,000" },
              { n: 50, amt: "₹50,000+" },
            ].map((r) => (
              <div key={r.n} className="rounded-xl bg-paper-2/60 px-2 py-3">
                <div className="font-display text-[15px] tracking-wide text-primary">{r.amt}</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  at #{r.n}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Share kit */}
        <ShareKit />

        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-yellow/40 bg-gradient-to-r from-yellow/10 via-paper to-yellow/10 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <div className="font-display text-[18px] tracking-wide text-ink">
              Stack referrals + honest posts → cross <span className="text-primary">₹50,000</span> easily
            </div>
            <div className="mt-1 text-[11px] font-light text-muted-foreground">
              Payouts on UPI after verification. Social posts need to be genuine — no spam, no copy-paste.
            </div>
          </div>
          <button
            onClick={onStart}
            className="shrink-0 rounded-full bg-ink px-6 py-3 font-display text-[12px] uppercase tracking-[0.22em] text-paper transition hover:bg-primary"
          >
            Start earning →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── COMMUNITY (soft trust strip · no fake numbers) ─────────────────────────── */
function TopReferrers() {
  const clusters = [
    {
      emoji: "🎓",
      title: "Campus crowd",
      zones: "Koramangala · Bannerghatta · Vasanth Nagar",
      tags: ["Christ University", "JNC", "St John's", "Jain", "St Joseph's", "Mount Carmel", "MS Ramaiah", "IISc", "PES"],
    },
    {
      emoji: "💼",
      title: "Tech & startup teams",
      zones: "Koramangala · Bellandur · Whitefield",
      tags: ["Razorpay", "Zomato", "Ola", "Microsoft", "Oracle", "Myntra", "Adobe", "Amazon", "SAP", "Wipro", "Mercedes-Benz", "Accenture"],
    },
    {
      emoji: "🏢",
      title: "Manyata & Electronic City",
      zones: "Hebbal · Nagawara · E-City",
      tags: ["IBM", "Target", "Nokia", "Philips", "Infosys", "Wipro", "TCS", "Biocon"],
    },
  ];
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-5 pb-14 sm:pb-24">
        <div className="mb-10 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground/70">
            Who actually stays with us
          </span>
          <h3 className="mt-3 font-display text-[clamp(1.9rem,4.5vw,3rem)] tracking-tight text-ink">
            Real <em className="font-serif italic text-primary">communities</em>, real referrals
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-[12.5px] font-light text-muted-foreground">
            Students, founders and working professionals — these are the campuses and offices
            whose people keep moving in (and sending friends our way).
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-4 lg:grid-cols-3"
        >
          {clusters.map((c) => (
            <motion.div
              key={c.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-[0_10px_30px_-12px_oklch(0.32_0.16_265/0.25)]"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 opacity-0 transition group-hover:opacity-100" />
              <div className="relative flex items-start justify-between">
                <motion.span
                  className="text-[30px] leading-none"
                  whileHover={{ scale: 1.15, rotate: -6 }}
                >
                  {c.emoji}
                </motion.span>
                <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {c.zones}
                </span>
              </div>
              <div className="relative text-[15px] font-bold text-ink">{c.title}</div>
              <div className="relative flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-paper-2/60 px-2.5 py-1 text-[10.5px] font-medium text-ink/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-center text-[11px] font-light text-muted-foreground">
          <span className="rounded-full bg-paper-2 px-3 py-1">🔒 Payouts on UPI · after move-in</span>
          <span className="rounded-full bg-paper-2 px-3 py-1">👥 Real people · no fake credits</span>
          <span className="rounded-full bg-paper-2 px-3 py-1">📍 5 zones · 100+ Bengaluru locations</span>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── MEET YOUR GHARWALE (zone strip) ─────────────────────────── */
function MeetGharwale() {
  return (
    <section className="relative bg-paper">
      <div className="mx-auto max-w-6xl px-5 pb-14 pt-2 sm:pb-20 sm:pt-6">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground/70">
            Your local Bengaluru experts
          </span>
          <h3 className="font-display text-[clamp(1.9rem,4.5vw,2.8rem)] tracking-tight text-ink">
            Meet your <em className="font-serif italic text-primary">Bengaluru experts</em>
          </h3>
          <p className="max-w-lg text-[12.5px] font-light text-muted-foreground">
            Five PG zone experts + Gharpayy Homes flat-rental experts. Six dedicated WhatsApp lines.
            One expert who already knows your area, your campus and your office — inside out.
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ZONES.map((z) => (
            <motion.a
              key={z.id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              href={`https://wa.me/${z.number}?text=${encodeURIComponent(`Heyy GHARPAYY ${z.short.toUpperCase()}! I'm looking for a good accommodation in ${z.short}. Please share available rooms.`)}`}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-[0_10px_30px_-12px_oklch(0.32_0.16_265/0.25)]"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-yellow/10 opacity-0 transition group-hover:opacity-100" />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[26px] leading-none">{z.emoji}</span>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">
                      {z.short}
                    </div>
                    <div className="font-display text-[17px] tracking-wide text-ink">
                      Your {z.short} expert
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>

              <dl className="relative grid gap-1.5 border-t border-dashed border-border pt-4 text-[11px]">
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 font-medium uppercase tracking-[0.16em] text-muted-foreground/70">Landmarks</dt>
                  <dd className="font-medium text-ink">{z.landmarks}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 font-medium uppercase tracking-[0.16em] text-muted-foreground/70">Campuses</dt>
                  <dd className="font-light text-muted-foreground">{z.colleges}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 font-medium uppercase tracking-[0.16em] text-muted-foreground/70">Offices</dt>
                  <dd className="font-light text-muted-foreground">{z.companies}</dd>
                </div>
              </dl>

              <div className="relative mt-1 flex items-center justify-between">
                <div className="font-mono text-[11px] tracking-wide text-ink/70">
                  +91 {z.number.slice(2, 7)} {z.number.slice(7)}
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper transition group-hover:bg-primary">
                  <WaIcon className="h-3 w-3" /> WhatsApp
                </span>
              </div>
            </motion.a>
          ))}

          {/* 6th card — Gharpayy Homes (flat rentals) */}
          <motion.a
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            href={`https://wa.me/${HOMES.number}?text=${encodeURIComponent("Heyy GHARPAYY HOMES! I'm looking for a fully furnished 1BHK / 2BHK flat in Bangalore. Please share availability.")}`}
            target="_blank"
            rel="noreferrer"
            className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-yellow/50 bg-gradient-to-br from-yellow/10 via-card to-card p-6 hover:border-primary/50 hover:shadow-[0_10px_30px_-12px_oklch(0.32_0.16_265/0.25)] sm:col-span-2 lg:col-span-1"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 opacity-0 transition group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[26px] leading-none">{HOMES.emoji}</span>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-deep">
                    NEW · {HOMES.tag}
                  </div>
                  <div className="font-display text-[17px] tracking-wide text-ink">
                    Gharpayy <em className="font-serif italic text-primary">Homes</em>
                  </div>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>

            <p className="relative text-[11.5px] font-light leading-[1.55] text-muted-foreground">
              {HOMES.pitch}
            </p>

            <dl className="relative grid gap-1.5 border-t border-dashed border-border pt-4 text-[11px]">
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-medium uppercase tracking-[0.16em] text-muted-foreground/70">Zones</dt>
                <dd className="font-medium text-ink">{HOMES.landmarks}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-medium uppercase tracking-[0.16em] text-muted-foreground/70">Formats</dt>
                <dd className="font-light text-muted-foreground">{HOMES.formats}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-medium uppercase tracking-[0.16em] text-muted-foreground/70">Perks</dt>
                <dd className="font-light text-muted-foreground">{HOMES.perks}</dd>
              </div>
            </dl>

            <div className="relative mt-1 flex items-center justify-between">
              <div className="font-mono text-[11px] tracking-wide text-ink/70">
                +91 {HOMES.number.slice(2, 7)} {HOMES.number.slice(7)}
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition group-hover:scale-[1.03]">
                <WaIcon className="h-3 w-3" /> Homes WhatsApp
              </span>
            </div>
          </motion.a>
        </motion.div>

        <p className="mt-6 text-center text-[10.5px] font-light text-muted-foreground/80">
          Numbers and zones lifted straight from <a href="https://gharpayy.com" className="underline decoration-dotted underline-offset-4 hover:text-primary">gharpayy.com</a> · daily 11 AM – 6 PM
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────── EARN RIBBON (inline CTA) ─────────────────────────── */
function EarnRibbon({ onRefer }: { onRefer: () => void }) {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-10">
      <motion.button
        onClick={onRefer}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        whileHover={{ y: -2 }}
        className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-yellow/40 bg-gradient-to-r from-yellow/15 via-paper to-yellow/10 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[22px]">🎁</span>
          <div>
            <div className="text-[13px] font-bold text-ink">
              Helped a friend find a Gharpayy?
            </div>
            <div className="text-[11px] font-light text-muted-foreground">
              PG ₹500–₹1,000 · Flat ₹1,000–₹2,000 · up to ₹50,000+ across referrals.
            </div>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-ink px-3 py-2 font-display text-[11px] uppercase tracking-[0.22em] text-paper transition group-hover:bg-primary sm:px-4">
          <span className="hidden sm:inline">Refer now&nbsp;</span>→
        </span>

      </motion.button>
    </div>
  );
}

/* ─────────────────────────── FAQ ─────────────────────────── */
const FAQS = [
  {
    q: "Is Guild free for guests?",
    a: "Yes. Guild is the everything-support layer for Gharpayy guests — before check-in, during your stay, and after check-out. No fee. You only pay your normal rent and refundable security deposit to the property. Our rule: always talk to your property manager first; if they don't solve it, Guild fixes it.",
  },
  {
    q: "What's the price range for a Gharpayy room?",
    a: "Four tiers on gharpayy.com — Basic ₹7k–11k (shared, essentials), Classics ₹12k–17k (larger layouts), Privé ₹17k–26k (private rooms, premium finishes) and Luxe Max ₹25k–45k (the flagship). Exact rent depends on zone and room type.",
  },
  {
    q: "Which Bengaluru zones do you cover?",
    a: "Five live zones — Koramangala (Christ, JNC, BTM, HSR), Whitefield (ITPL, EPIP, Brookfield, Hoodi, Mahadevapura), Bellandur (Sarjapur, Embassy Tech Village, Ecoworld), Manyata (Hebbal, Nagawara, Yeshwanthpur, Bhartiya City) and Vasanth Nagar / City (MG Road, Brigade, UB City, Indiranagar, Electronic City). 100+ specific micro-locations in the footer.",
  },
  {
    q: "Are virtual tours really live?",
    a: "Yes — book a slot and an ops team member walks you through the actual room on WhatsApp video, not a pre-recorded reel. Rooms change daily, so what you see is what's available right then.",
  },
  {
    q: "What about food and amenities?",
    a: "Power breakfast, North-Indian + South-Indian daily meals, 24/7 security with CCTV and biometric access, high-speed Wi-Fi, laundry, housekeeping and concierge. Listed on gharpayy.com under Amenities.",
  },
  {
    q: "Is there a deposit or hidden fee?",
    a: "A refundable security deposit / token applies, and it's stated upfront at booking — no hidden charges. Cancellation and lock-in terms vary by property and are shared before you confirm.",
  },
  {
    q: "Can I switch rooms or move to another property?",
    a: "Yes. Open Guild, pick 'Help me switch rooms' or 'Help me move to another property', and the zone team handles owner/caretaker coordination on your behalf.",
  },
  {
    q: "Who pays the referral amount?",
    a: "Gharpayy does. We pay you on UPI after your referred friend moves in and the booking is verified — no fake credits, no in-app wallet you can't withdraw.",
  },
  {
    q: "When do I get paid for a referral?",
    a: "After move-in and verification. Payouts land on your UPI — PG referrals pay ₹500 base (every 4th ₹1,000) and flat referrals pay ₹1,000 base (every 2nd ₹2,000). Active referrers cross ₹50,000+.",
  },
  {
    q: "Do you have Girls-only PGs?",
    a: "Yes — separate Girls PG and Boys / Coed PG inventory across all five zones. Ask your Gharwala on WhatsApp and they'll filter by what you need.",
  },
  {
    q: "I'm moving from another city — can I pre-book?",
    a: "Yes. Most properties accept pre-booking before you land in Bengaluru, and select ones run a ₹2K-off pre-booking offer. Your zone Gharwala will hold the room till your arrival date.",
  },
  {
    q: "Is this an official Gharpayy channel?",
    a: "Yes — Guild is by Gharpayy. The team replying on WhatsApp is the same Bengaluru ops team that handles your stay.",
  },
];

function FAQ() {
  return (
    <section className="relative bg-paper-2/30">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-20">
        <div className="mb-8 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground/70">
            Straight answers
          </span>
          <h3 className="mt-3 font-display text-[clamp(1.8rem,4.5vw,2.8rem)] tracking-tight text-ink">
            Things people <em className="font-serif italic text-primary">actually ask</em>
          </h3>
        </div>
        <Reveal>
          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`} className="border-border px-5">
                <AccordionTrigger className="text-left text-[13.5px] font-semibold text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[12.5px] font-light leading-[1.7] text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── STICKY EARN RAIL (desktop) ─────────────────────────── */
function StickyEarnRail({ onRefer, hidden }: { onRefer: () => void; hidden: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && !hidden && (
        <motion.button
          onClick={onRefer}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 items-center gap-2 rounded-full border border-yellow/50 bg-paper/95 px-4 py-3 font-display text-[11px] uppercase tracking-[0.22em] text-ink shadow-[0_10px_30px_-10px_oklch(0.32_0.16_265/0.35)] backdrop-blur transition hover:bg-yellow/20 lg:inline-flex"
        >
          🎁 Refer · ₹50k
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────── MOBILE BOTTOM BAR ─────────────────────────── */
function MobileBottomBar({
  onActivate,
  onRefer,
  hidden,
}: {
  onActivate: () => void;
  onRefer: () => void;
  hidden: boolean;
}) {
  if (hidden) return null;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-paper/95 px-3 pt-2 backdrop-blur sm:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
    >
      <div className="flex gap-2">
        <button
          onClick={onActivate}
          className="flex-[2] rounded-full bg-primary px-3 py-3 font-display text-[10.5px] uppercase tracking-[0.16em] text-primary-foreground"
        >
          📅 Activate Guild
        </button>
        <button
          onClick={onRefer}
          className="flex-1 rounded-full border border-yellow/50 bg-yellow/15 px-3 py-3 font-display text-[10.5px] uppercase tracking-[0.16em] text-ink"
        >
          🎁 Earn
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── SHARE KIT ─────────────────────────── */
const SHARE_TEMPLATES = [
  {
    icon: "💬",
    label: "WhatsApp",
    text: "Hey! If you're hunting for a PG in Bangalore, try Gharpayy — I've stayed with them and it's been smooth. Tell them {your-name} sent you: {your-link}",
  },
  {
    icon: "💼",
    label: "LinkedIn",
    text: "Moving to Bangalore for work or college? I've been staying with Gharpayy and the check-in / support has genuinely been hassle-free. If anyone in my network is looking, drop me a DM — happy to share my referral link.\n\n— {your-name}\n{your-link}",
  },
  {
    icon: "👽",
    label: "Reddit",
    text: "(r/bangalore / r/india) Honest take: I've been with Gharpayy for a while now. Rooms match the listings, deposit is clean, and their WhatsApp support actually responds. If you want, here's my referral link: {your-link}",
  },
];

function ShareKit() {
  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} template copied`);
    } catch {
      toast.error("Couldn't copy — long-press to select instead");
    }
  };
  return (
    <Reveal className="mt-8 rounded-2xl border border-border bg-card p-6">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
            Share kit
          </div>
          <div className="mt-1 font-display text-[18px] tracking-wide text-ink">
            Steal these <em className="font-serif italic text-primary">message templates</em>
          </div>
        </div>
        <div className="hidden text-right text-[10.5px] font-light text-muted-foreground sm:block">
          Replace <code className="rounded bg-paper-2 px-1">{`{your-name}`}</code> &{" "}
          <code className="rounded bg-paper-2 px-1">{`{your-link}`}</code> before posting.
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {SHARE_TEMPLATES.map((t) => (
          <motion.div
            key={t.label}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="flex flex-col gap-3 rounded-xl border border-border bg-paper-2/40 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[18px]">{t.icon}</span>
                <span className="font-display text-[12px] uppercase tracking-[0.22em] text-ink">
                  {t.label}
                </span>
              </div>
              <button
                onClick={() => copy(t.text, t.label)}
                className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-primary"
              >
                Copy
              </button>
            </div>
            <p className="whitespace-pre-line text-[11.5px] font-light leading-[1.65] text-muted-foreground">
              {t.text}
            </p>
          </motion.div>
        ))}
      </div>
    </Reveal>
  );
}
