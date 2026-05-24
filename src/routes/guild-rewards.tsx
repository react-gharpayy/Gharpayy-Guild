import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Toaster } from "sonner";
import {
  Gift,
  ShieldCheck,
  Wallet,
  CalendarCheck,
  Infinity as InfinityIcon,
  Handshake,
  Users,
  Home,
  
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReferModal } from "./index";

export const Route = createFileRoute("/guild-rewards")({
  head: () => ({
    meta: [
      { title: "Guild Rewards · Refer friends to Gharpayy, earn up to ₹50,000" },
      {
        name: "description",
        content:
          "Send friends to Gharpayy PGs or flats and earn cash on every move-in. Base + milestone payouts on UPI. No app, no points, no expiry — just real ₹.",
      },
      { property: "og:title", content: "Guild Rewards · Earn up to ₹50,000 referring friends" },
      {
        property: "og:description",
        content:
          "Real cash on UPI for every PG or flat move-in. Milestone bonuses stack. Mix both tracks and ₹50,000 is honest math.",
      },
    ],
  }),
  component: GuildRewardsPage,
});

const PG_SLABS = [
  { label: "Every PG referral", amount: "₹500", note: "Base payout on every move-in" },
  { label: "Every 4th PG referral", amount: "₹1,000", note: "Milestone bonus — 4th, 8th, 12th…", highlight: true },
];

const FLAT_SLABS = [
  { label: "Every flat referral", amount: "₹1,000", note: "Base payout on every move-in" },
  { label: "Every 2nd flat referral", amount: "₹2,000", note: "Milestone bonus — 2nd, 4th, 6th…", highlight: true },
];

const HOW_STEPS = [
  { n: "01", t: "Send their details", s: "Name, phone, area and budget — one screen, two minutes. We take it from there." },
  { n: "02", t: "We tour them", s: "Same day video tour, then a verified room visit. No pushy sales — just honest options." },
  { n: "03", t: "They move in", s: "Once they pay rent and check in, your payout unlocks. Milestone bonuses stack automatically." },
  { n: "04", t: "₹ lands on UPI", s: "Direct to the UPI you shared. No coupons, no points, no expiry — real money, same week." },
];

const REWARDS_FAQ = [
  {
    q: "How do I get paid?",
    a: "Direct UPI transfer to the ID you submitted with the referral. Payouts run within 5–7 days of your friend's first rent payment.",
  },
  {
    q: "When does the milestone bonus trigger?",
    a: "Every 4th PG move-in (₹1,000 extra) and every 2nd flat move-in (₹2,000 extra). Counts roll forward across the calendar year — they don't reset every month.",
  },
  {
    q: "Does the friend need to know I referred them?",
    a: "Yes — we ask them at the visit to confirm your name and phone, so credit lands cleanly. No fights, no double-claims.",
  },
  {
    q: "Is there a cap on earnings?",
    a: "No cap. The ₹50,000 number is just a real example mix (25 flats + 20 PGs + 2 honest posts). Power referrers cross it comfortably.",
  },
  {
    q: "What if the friend cancels later?",
    a: "Payout is tied to actual rent payment. If they cancel before paying, the referral simply doesn't convert — no clawbacks from your account.",
  },
];

function GuildRewardsPage() {
  const [refer, setRefer] = useState(false);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Toaster position="top-center" richColors />

      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="font-display text-xl tracking-[0.18em] text-ink sm:text-2xl">
              GUIL<span className="text-yellow-deep">D</span>
            </span>
            <span className="hidden truncate rounded-full border border-yellow/40 bg-yellow/15 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-ink sm:inline-flex">
              Rewards · Refer & earn on UPI
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/guild-support"
              className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-emerald-700 transition hover:bg-emerald-500/15 sm:inline-flex"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Guild Support
            </Link>
            <button
              onClick={() => setRefer(true)}
              className="rounded-full bg-ink px-4 py-1.5 font-display text-[11px] uppercase tracking-[0.22em] text-paper transition hover:bg-yellow-deep hover:text-ink"
            >
              Refer now
            </button>
          </div>
        </div>
      </header>

      {/* ─────────── HERO ─────────── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-yellow/15 via-paper to-paper">
        <div className="bg-orbs absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow/50 bg-yellow/20 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-ink">
              <Gift className="h-3.5 w-3.5" /> Guild Rewards
            </div>
            <h1 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.4rem,7.2vw,4.6rem)] leading-[1.02] tracking-tight text-ink">
              Refer friends.{" "}
              <em className="font-serif italic text-yellow-deep">
                Earn up to ₹50,000
              </em>{" "}
              on UPI.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[13px] font-light leading-[1.75] text-muted-foreground sm:text-[14px]">
              The biggest earners aren't influencers — they're regular Gharpayy residents who
              keep sending friends our way. PG referrals add up slow and steady. Flat referrals
              hit harder. Mix both and ₹50,000 is honest math.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => setRefer(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow px-7 py-4 font-display text-[12.5px] uppercase tracking-[0.22em] text-ink transition hover:bg-yellow-deep sm:w-auto"
              >
                <Gift className="h-4 w-4" /> Refer a friend
              </button>
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/25 px-6 py-4 font-display text-[12.5px] uppercase tracking-[0.22em] text-ink transition hover:bg-ink hover:text-paper sm:w-auto"
              >
                ← Back to Guild home
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Wallet className="h-3 w-3" /> Cash on UPI</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-1.5"><CalendarCheck className="h-3 w-3" /> 5–7 day payout</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-1.5"><InfinityIcon className="h-3 w-3" /> No cap, no expiry</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-1.5"><Handshake className="h-3 w-3" /> No app needed</span>
            </div>

            {/* Hero proof — UPI payout screenshot */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mx-auto mt-12 max-w-sm"
            >
              <div className="relative overflow-hidden rounded-3xl border border-yellow/40 bg-card shadow-[0_20px_60px_-20px_oklch(0.78_0.16_85/0.55)]">
                <div className="flex items-center justify-between border-b border-border bg-paper-2/60 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow/25 text-yellow-deep">
                      <Wallet className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-semibold text-ink">UPI · Credit</div>
                      <div className="text-[9px] uppercase tracking-[0.18em] text-emerald-700">Successful</div>
                    </div>
                  </div>
                  <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Today, 14:22</div>
                </div>
                <div className="bg-gradient-to-br from-yellow/15 via-paper to-paper px-5 py-7 text-center">
                  <div className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">From GHARPAYY · GUILD</div>
                  <div className="mt-3 font-display text-[44px] leading-none tracking-tight text-ink">
                    + ₹3,000
                  </div>
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    1 flat move-in · ₹1,000 base + ₹2,000 milestone
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    <CalendarCheck className="h-3 w-3" /> Credited in 4 days
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Sample payout · names redacted
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────── TRACKS ─────────── */}
      <section className="border-b border-border bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="text-center">
            <div className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-yellow-deep">
              Two earning tracks
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05] tracking-tight text-ink">
              PG slow burn.{" "}
              <em className="font-serif italic text-yellow-deep">Flat big swing.</em>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[12.5px] font-light leading-[1.7] text-muted-foreground">
              Both tracks run side by side. Base payout on every move-in. Milestone bonus stacks
              on top, automatically.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {/* PG Track */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              className="rounded-2xl border border-yellow/30 bg-gradient-to-br from-yellow/10 via-paper to-paper p-5 sm:p-7"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-yellow/30 bg-yellow/15 text-yellow-deep">
                  <Users className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-display text-[19px] tracking-wide text-ink">PG Referrals</div>
                  <div className="text-[11px] font-light text-muted-foreground">Shared rooms · hostels · paying guest</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {PG_SLABS.map((s) => (
                  <div
                    key={s.label}
                    className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${
                      s.highlight
                        ? "border border-yellow-deep/40 bg-yellow/15"
                        : "bg-paper-2/60"
                    }`}
                  >
                    <div>
                      <div className="text-[12.5px] font-semibold text-ink">{s.label}</div>
                      <div className="text-[10.5px] font-light text-muted-foreground">{s.note}</div>
                    </div>
                    <div className="font-display text-[22px] tracking-wide text-yellow-deep">{s.amount}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-yellow/40 bg-yellow/5 px-4 py-2.5 text-center">
                <span className="text-[11px] font-medium text-ink">
                  20 PG move-ins ={" "}
                  <span className="font-display text-[16px] tracking-wide text-yellow-deep">₹12,500</span>
                </span>
              </div>
            </motion.div>

            {/* Flat Track */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.08 }}
              className="rounded-2xl border border-yellow/30 bg-gradient-to-br from-yellow/10 via-paper to-paper p-5 sm:p-7"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-yellow/30 bg-yellow/15 text-yellow-deep">
                  <Home className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-display text-[19px] tracking-wide text-ink">Flat Referrals</div>
                  <div className="text-[11px] font-light text-muted-foreground">1/2/3 BHK · independent units · apartments</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {FLAT_SLABS.map((s) => (
                  <div
                    key={s.label}
                    className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${
                      s.highlight
                        ? "border border-yellow-deep/40 bg-yellow/15"
                        : "bg-paper-2/60"
                    }`}
                  >
                    <div>
                      <div className="text-[12.5px] font-semibold text-ink">{s.label}</div>
                      <div className="text-[10.5px] font-light text-muted-foreground">{s.note}</div>
                    </div>
                    <div className="font-display text-[22px] tracking-wide text-yellow-deep">{s.amount}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-yellow/40 bg-yellow/5 px-4 py-2.5 text-center">
                <span className="text-[11px] font-medium text-ink">
                  20 flat move-ins ={" "}
                  <span className="font-display text-[16px] tracking-wide text-yellow-deep">₹30,000</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* The ₹50K plan */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 rounded-2xl border border-yellow-deep/40 bg-gradient-to-r from-yellow/20 via-paper to-yellow/15 p-5 text-center sm:p-7"
          >
            <div className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
              The plan — mixed referrals
            </div>
            <div className="mt-3 font-display text-[clamp(1.5rem,3.6vw,2.4rem)] tracking-wide text-ink">
              25 flats + 20 PGs + 2 honest posts ={" "}
              <em className="font-serif italic text-yellow-deep">₹50,000+</em>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {[
                "25 flats = ₹37,000",
                "20 PGs = ₹12,500",
                "2 posts = ₹600",
                "Total = ₹50,100",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-paper/80 px-3 py-1 text-[10.5px] font-medium text-ink/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section className="border-b border-border bg-paper-2/40">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <div className="text-center">
            <div className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-yellow-deep">
              How a referral pays out
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] tracking-tight text-ink">
              Four steps.{" "}
              <em className="font-serif italic text-yellow-deep">Cash on UPI.</em> Done.
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-yellow-deep/40"
              >
                <div className="font-display text-[32px] tracking-wide text-yellow-deep/25">{s.n}</div>
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

      {/* ─────────── FAQ ─────────── */}
      <section className="border-b border-border bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
          <div className="text-center">
            <div className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-yellow-deep">
              The fine print, honestly
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] tracking-tight text-ink">
              Stuff people <em className="font-serif italic text-yellow-deep">actually ask</em>.
            </h2>
          </div>

          <Accordion type="single" collapsible className="mt-8">
            {REWARDS_FAQ.map((f, i) => (
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
          <div className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-yellow">
            Start earning
          </div>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.05] tracking-tight">
            One friend.{" "}
            <em className="font-serif italic text-yellow">One payout.</em> Stack it up.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[13px] font-light leading-[1.7] text-paper/70">
            Two minutes to send a referral. Five to seven days to see ₹ on UPI. No tiers, no
            membership, no nonsense.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => setRefer(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow px-7 py-4 font-display text-[12.5px] uppercase tracking-[0.22em] text-ink transition hover:bg-yellow-deep sm:w-auto"
            >
              <Gift className="h-4 w-4" /> Refer a friend
            </button>
            <Link
              to="/guild-support"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-4 font-display text-[12.5px] uppercase tracking-[0.22em] text-paper transition hover:bg-white/10 sm:w-auto"
            >
              <ShieldCheck className="h-4 w-4" /> Need support instead?
            </Link>
          </div>
          <p className="mt-6 text-[10.5px] font-light uppercase tracking-[0.2em] text-paper/45">
            Payouts on UPI · No cap · gharpayy.com
          </p>
        </div>
      </section>

      {refer && <ReferModal onClose={() => setRefer(false)} />}
    </main>
  );
}
