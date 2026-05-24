import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Toaster } from "sonner";
import {
  ShieldCheck,
  Ticket,
  Clock,
  UserRound,
  MapPin,
  Lock,
  Gift,
  ArrowRight,
  Check,
  CornerUpRight,
  
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ScenarioPicker,
  Modal,
  SUPPORT_ISSUES,
  EMPTY_BOOKING,
  ZONES,
  WaIcon,
  type Issue,
  type Booking,
} from "./index";

export const Route = createFileRoute("/guild-support")({
  head: () => ({
    meta: [
      { title: "Guild Support · Private Desk for Gharpayy Guests" },
      {
        name: "description",
        content:
          "Guild is Gharpayy's private support desk — before, during and after your stay. Real humans on WhatsApp, routed by your Bengaluru zone, manager-first, Guild-always.",
      },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { property: "og:title", content: "Guild Support · Private Desk for Gharpayy Guests" },
      {
        property: "og:description",
        content:
          "Manager first. Guild always. A private desk for everything in between — open a ticket on WhatsApp in under 30 seconds.",
      },
    ],
  }),
  component: GuildSupportPage,
});

const GUILD_WA = "916362007224";

const PROMISES = [
  { k: "Real humans only", v: "No bots, no IVR. A Guild teammate picks up — every single time." },
  { k: "Manager first, Guild always", v: "We loop in your property manager first. If they don't fix it, our ops takes over." },
  { k: "One ticket, full stay", v: "A single ID + WhatsApp thread for activation, check-in, mid-stay and check-out." },
  { k: "Routed by your zone", v: "Koramangala, Whitefield, Bellandur, Manyata or City — your Gharwala picks up, not a call center." },
];

const HOW_STEPS = [
  { n: "01", t: "Pick what's happening", s: "Seven scenarios cover 95% of stay issues. Tap the closest one — you can add detail next." },
  { n: "02", t: "Confirm your booking", s: "Name, property, area, room. We verify you're a Gharpayy guest in one screen — no app, no OTP." },
  { n: "03", t: "Pick urgency + how to help", s: "Tell us how soon and what 'fixed' looks like. Switch room? Talk to owner? Acknowledgement? Your call." },
  { n: "04", t: "WhatsApp opens, pre-filled", s: "Ticket ID + your full context, ready to send. Hit send — a real Guild human responds and stays till it's resolved." },
];

const HANDLES = [
  "Room not ready on arrival",
  "Wrong room vs photos / video tour",
  "Mid-stay switch within same property",
  "Move to a different Gharpayy property",
  "Deposit, rent or receipt confusion",
  "Wi-Fi, AC, geyser, housekeeping gaps",
  "Owner / caretaker not responding",
  "Check-out, refund & handover help",
];

const NOT_OURS = [
  "Booking a new room (that's the stay team)",
  "Anything outside Gharpayy properties",
  "Personal disputes between flatmates",
  "Lost / stolen personal belongings",
];

const SUPPORT_FAQ = [
  {
    q: "Is Guild free?",
    a: "Yes — Guild is included for every Gharpayy guest. You only pay your normal rent and refundable deposit to the property. No service fee, no membership, no premium tier.",
  },
  {
    q: "How fast does someone reply?",
    a: "Daily 11 AM – 6 PM, a real Guild teammate responds in minutes on WhatsApp. Outside hours your ticket is queued and picked up first thing the next morning.",
  },
  {
    q: "Why 'manager first, Guild always'?",
    a: "Your property manager knows your room, keys and caretaker best — so they fix things fastest. We loop them in first. If they don't solve it, Guild's ops team takes over the same thread without restarting the story.",
  },
  {
    q: "Do you handle issues after I've checked out?",
    a: "Yes — deposit refunds, final bill questions, handover disputes. The same ticket stays open till the money lands and the loop is closed.",
  },
  {
    q: "What if I'm not actually a Gharpayy guest?",
    a: "Guild's private desk is reserved for confirmed Gharpayy guests so it stays fast and focused. If you're still looking, the stay team will set you up — verified rooms, virtual tour, no hidden charges.",
  },
];

function GuildSupportPage() {
  const [picker, setPicker] = useState<false | { preset?: Issue }>(false);
  const [active, setActive] = useState<{ issue: Issue; booking: Booking } | null>(null);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Toaster position="top-center" richColors />

      {/* Mini top nav — keeps brand identity continuous with homepage */}
      <header className="sticky top-0 z-40 border-b border-border bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="font-display text-xl tracking-[0.18em] text-ink sm:text-2xl">
              GUIL<span className="text-emerald-600">D</span>
            </span>
            <span className="hidden truncate rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-emerald-700 sm:inline-flex">
              Support Desk · Gharpayy guests
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/guild-rewards"
              className="hidden items-center gap-1.5 rounded-full border border-yellow/40 bg-yellow/10 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-yellow/20 sm:inline-flex"
            >
              <Gift className="h-3.5 w-3.5" /> Guild Rewards
            </Link>
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-muted-foreground sm:text-[11px]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span>Live · 11 AM – 6 PM</span>
            </span>
          </div>
        </div>
      </header>

      {/* ─────────── HERO ─────────── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-paper via-emerald-50/40 to-paper">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,oklch(0.55_0.15_165)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.55_0.15_165)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" /> Private Support Desk
            </div>
            <h1 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.4rem,7vw,4.4rem)] leading-[1.02] tracking-tight text-ink">
              Your private desk for{" "}
              <em className="font-serif italic text-emerald-700">
                everything in between
              </em>
              .
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[13px] font-light leading-[1.75] text-muted-foreground sm:text-[14px]">
              <span className="font-semibold text-ink">Manager first. Guild always.</span> A real
              human on WhatsApp, routed by your Bengaluru zone — before check-in, during your stay,
              after check-out. One ticket, one thread, no gaps.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => setPicker({})}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-display text-[12.5px] uppercase tracking-[0.22em] text-paper transition hover:bg-emerald-700 sm:w-auto"
              >
                <Ticket className="h-4 w-4" /> Open a Guild ticket
              </button>
              <a
                href={`https://wa.me/${GUILD_WA}?text=${encodeURIComponent("Hi Guild — I need quick support on my Gharpayy stay.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-6 py-4 font-display text-[12.5px] uppercase tracking-[0.22em] text-[#1a8a47] transition hover:bg-[#25D366]/20 sm:w-auto"
              >
                <WaIcon className="h-4 w-4" /> WhatsApp Guild now
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" /> Daily 11 AM – 6 PM</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-1.5"><UserRound className="h-3 w-3" /> Real humans, no bots</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Routed by your zone</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-1.5"><Lock className="h-3 w-3" /> Gharpayy guests only</span>
            </div>

            {/* Hero proof — WhatsApp ticket screenshot */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mx-auto mt-12 max-w-md"
            >
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_60px_-20px_oklch(0.55_0.15_165/0.35)]">
                <div className="flex items-center justify-between border-b border-border bg-paper-2/60 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-semibold text-ink">Guild · Support</div>
                      <div className="text-[9px] uppercase tracking-[0.18em] text-emerald-700">Online</div>
                    </div>
                  </div>
                  <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">#GR-4821</div>
                </div>
                <div className="space-y-2 bg-[oklch(0.97_0.01_120)] p-4 text-left">
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-200/70 px-3 py-2 text-[11.5px] text-ink">
                    Room not ready at check-in, anyone?
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[11.5px] text-ink shadow-sm">
                    Hi! Guild here. Caretaker dispatched — keys in 18 mins. Sending live ETA.
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[11px] text-muted-foreground shadow-sm">
                    <span className="font-medium text-ink">Update:</span> cleaning done. Room ready ✓
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Real thread · names changed
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────── PROMISES STRIP ─────────── */}
      <section className="border-b border-border bg-navy text-paper">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROMISES.map((p) => (
              <div key={p.k} className="flex flex-col gap-1.5">
                <div className="font-display text-[15px] tracking-wide text-emerald-300">
                  {p.k}
                </div>
                <p className="text-[12px] font-light leading-[1.6] text-paper/75">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section className="border-b border-border bg-paper">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <div className="text-center">
            <div className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-emerald-700">
              How a Guild ticket works
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] tracking-tight text-ink">
              Four taps. <em className="font-serif italic text-emerald-700">A real human.</em> Done.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[12.5px] font-light leading-[1.7] text-muted-foreground">
              No app install. No OTP loops. No "your call is important to us." Just one WhatsApp
              thread that stays open till the issue feels resolved.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-emerald-500/40"
              >
                <div className="font-display text-[32px] tracking-wide text-emerald-700/20">{s.n}</div>
                <div className="mt-1 font-display text-[18px] leading-tight tracking-wide text-ink">
                  {s.t}
                </div>
                <p className="mt-2 text-[11.5px] font-light leading-[1.6] text-muted-foreground">
                  {s.s}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── SCENARIOS ─────────── */}
      <section className="border-b border-border bg-emerald-50/30">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <div className="flex flex-col items-center text-center">
            <div className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-emerald-700">
              Pick your scenario
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] tracking-tight text-ink">
              Seven scenarios that{" "}
              <em className="font-serif italic text-emerald-700">cover 95% of stays</em>.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[12.5px] font-light leading-[1.7] text-muted-foreground">
              Tap the closest one — you'll add details on the next screen. Don't see it? Pick
              <span className="font-semibold text-ink"> "Something else"</span> and tell us in a line.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SUPPORT_ISSUES.map((it) => (
              <button
                key={it.title}
                onClick={() => setActive({ issue: it, booking: { ...EMPTY_BOOKING } })}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-[24px]">
                  {it.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[16px] leading-tight tracking-wide text-ink">
                    {it.title}
                  </div>
                  <p className="mt-1.5 text-[11.5px] font-light leading-[1.6] text-muted-foreground">
                    {it.sub}
                  </p>
                </div>
                <span className="self-center text-lg text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-emerald-700">
                  →
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setPicker({})}
              className="inline-flex items-center gap-2 rounded-full border border-ink/80 px-6 py-3 font-display text-[12px] uppercase tracking-[0.22em] text-ink transition hover:bg-ink hover:text-paper"
            >
              Or start a fresh ticket →
            </button>
          </div>
        </div>
      </section>

      {/* ─────────── HANDLES / NOT-OURS ─────────── */}
      <section className="border-b border-border bg-paper">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <div className="text-center">
            <div className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-emerald-700">
              What this desk owns
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] tracking-tight text-ink">
              Guild fixes. <em className="font-serif italic text-emerald-700">Honestly.</em>
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
              <div className="inline-flex items-center gap-2 font-display text-[15px] tracking-wide text-emerald-700">
                <Check className="h-4 w-4" /> Guild handles this
              </div>
              <ul className="mt-4 space-y-2.5">
                {HANDLES.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-[12.5px] text-ink/85">
                    <span className="mt-1 text-emerald-600">●</span>
                    <span className="font-light leading-[1.55]">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-paper-2/50 p-6">
              <div className="inline-flex items-center gap-2 font-display text-[15px] tracking-wide text-muted-foreground">
                <CornerUpRight className="h-4 w-4" /> We route this elsewhere
              </div>
              <ul className="mt-4 space-y-2.5">
                {NOT_OURS.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-[12.5px] text-ink/70">
                    <span className="mt-1 text-muted-foreground">○</span>
                    <span className="font-light leading-[1.55]">{h}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-border pt-4 text-[11px] font-light leading-[1.6] text-muted-foreground">
                Still unsure? Open a ticket — if it's not ours, we'll point you to the right desk
                in the same chat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── ZONES ─────────── */}
      <section className="border-b border-border bg-emerald-50/30">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <div className="text-center">
            <div className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-emerald-700">
              Routed by your Bengaluru zone
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] tracking-tight text-ink">
              Five zones. <em className="font-serif italic text-emerald-700">Five Gharwale.</em> One ticket each.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[12.5px] font-light leading-[1.7] text-muted-foreground">
              Your ticket lands with the Gharwala for your locality — not a generic call center.
              They know your property, your caretaker, your shortcut to a fix.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ZONES.map((z) => (
              <a
                key={z.id}
                href={`https://wa.me/${z.number}?text=${encodeURIComponent(`Hi ${z.short} Guild — I need support on my Gharpayy stay.`)}`}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-emerald-500/40"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[22px]">{z.emoji}</span>
                  <div className="font-display text-[16px] tracking-wide text-ink">
                    {z.name}
                  </div>
                </div>
                <p className="mt-3 text-[11px] font-light leading-[1.55] text-muted-foreground">
                  <span className="font-semibold text-ink/80">Areas:</span> {z.areas.slice(0, 4).join(", ")}
                  {z.areas.length > 4 ? "…" : ""}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 font-display text-[12px] uppercase tracking-[0.2em] text-emerald-700 transition group-hover:gap-2.5">
                  WhatsApp this zone <span>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── FAQ ─────────── */}
      <section className="border-b border-border bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
          <div className="text-center">
            <div className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-emerald-700">
              Straight answers
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] tracking-tight text-ink">
              The questions <em className="font-serif italic text-emerald-700">everyone asks</em>.
            </h2>
          </div>

          <Accordion type="single" collapsible className="mt-8">
            {SUPPORT_FAQ.map((f, i) => (
              <AccordionItem key={i} value={`f-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-display text-[16px] tracking-wide text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[12.5px] font-light leading-[1.7] text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─────────── CLOSING CTA ─────────── */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
          <div className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-emerald-300">
            Open the desk
          </div>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.05] tracking-tight">
            One ticket. <em className="font-serif italic text-emerald-300">One human.</em> Till it's fixed.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[13px] font-light leading-[1.7] text-paper/70">
            You stay focused on your day. Guild stays on the chat. That's the deal.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => setPicker({})}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-7 py-4 font-display text-[12.5px] uppercase tracking-[0.22em] text-ink transition hover:bg-emerald-300 sm:w-auto"
            >
              <Ticket className="h-4 w-4" /> Open a Guild ticket
            </button>
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-4 font-display text-[12.5px] uppercase tracking-[0.22em] text-paper transition hover:bg-white/10 sm:w-auto"
            >
              ← Back to Guild home
            </Link>
          </div>
          <p className="mt-6 text-[10.5px] font-light uppercase tracking-[0.2em] text-paper/45">
            Daily 11 AM – 6 PM · Real humans · gharpayy.com
          </p>
        </div>
      </section>

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
      {active && (
        <Modal
          issue={active.issue}
          initial={active.booking}
          onClose={() => setActive(null)}
        />
      )}
    </main>
  );
}
