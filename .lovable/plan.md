## The real bug

"Activate my Guild" currently dumps the user into the same 4-step **support modal** that demands a *problem*, an *urgency* ("I'm at the property now"), *when it started*, and a *fix-it expectation*. That's wrong. The user just booked. There is no problem — they're telling us they are coming.

Two flows are tangled into one. We separate them, and we flip the reminder model so the **customer pings us**, not the other way around. That keeps every conversation on one WhatsApp thread, with zero gaps, zero missed pings from our side, and zero "did you get my message?" loops.

## Principle: Customer-initiated, single-thread

We do not auto-message the customer. Instead, on activation the customer opens the WhatsApp thread once, and that thread becomes their permanent Guild line. They are coached (in the success screen + inside the WA message) to ping us back at two moments:

- **2 days before arrival** — to lock the room, keys, linen, Wi-Fi.
- **3 hours before arrival** — to confirm ETA and on-ground readiness.

Same chat. Same ticket ID. Same human. No gaps.

## What to build

### 1. Activation gets its own flow (no problem framing)

In `src/routes/index.tsx`, when `ScenarioPicker` returns with `issue.id === "activation"`, do **not** open the support `Modal`. Open a new `ActivationConfirm` component that:

- Echoes back the arrival details collected in the picker (name, property, area, room, arrival date, ETA).
- Has zero problem / urgency / when-did-it-start / how-can-we-help fields.
- Replaces the "reminder cadence toggles" with a **Ping-us cadence card** — read-only, explaining the two moments above and *why* it's better the customer pings (one thread, no missed chats, no spam).
- Generates one Guild ticket ID that follows the guest end-to-end.
- One primary action: **Open my Guild thread on WhatsApp** — composes a positive activation message:
  - "Hi Guild — I've just booked. Locking in my arrival so my room is ready."
  - Guest, property, area, room, arrival date + ETA, ticket ID.
  - Footer line inside the WA message: *"I'll ping this same chat 2 days before and 3 hours before I land — please keep the room locked & ready."*
- Success card after send: "Your Guild is activated. Save this WhatsApp chat — ping us here 2 days before and 3 hours before you land. Same chat, same human, same ticket."

### 2. Strip the "we will remind you" promise everywhere

- `ScenarioPicker` activation step: remove the **"Reminder cadence — keeps your room locked & ready"** card (the one with checkbox toggles that implied we'd ping). Replace with a single calm line: *"You'll ping this WhatsApp thread 2 days + 3 hours before arrival. One chat. No gaps."*
- Footer micro-copy line `Ping us 2 days + 3 hours prior · Daily 11 AM – 6 PM` is already correctly framed — keep.
- Activation carousel step copy that says Guild reminds / pings the guest → rewrite to "Guest pings Guild — same thread, twice, before landing."
- FAQ entries mentioning automatic reminders → rewrite to the customer-initiated model.

### 3. Clean cross-contamination with the support flow

- Remove `e0 — Plan my arrival & keep my room ready` from `EXPECTATIONS` in the support `Modal`. Activation no longer routes here.
- Support `Modal`'s opening WA line: "everything support (before / during / after my stay)" → "support during / after my stay". Activation owns "before".
- `ScenarioPicker` step labels: activation reads `Step 1 of 2 · Arrival details` → `Step 2 of 2 · Confirm & open WhatsApp`. Support keeps `Step 1 of 4 … Step 4 of 4`.

### 4. Footer Support button

In `Footer()` add a third pill between **Talk Now** and **Stay Here**:

```
[ Talk Now ]   [ Guild Support ]   [ Stay Here ]
```

`Guild Support` is a `<Link to="/guild-support">` styled as an outlined yellow pill (`border-yellow text-yellow hover:bg-yellow hover:text-ink`) so it visually anchors the row. Also add a small inline link under the tagline: *"Already staying? → Guild Support"*.

### 5. Full alignment audit — every entry point checked

| Entry point | Goes to | Aligned? |
|---|---|---|
| Hero "Activate my Guild" | `ActivationConfirm` (new) | ✅ activation, customer pings us |
| GuildAssurance "Activate Guild" | `ActivationConfirm` | ✅ |
| Process / FAQ / Carousel "Activate" CTAs | `ActivationConfirm` | ✅ |
| MobileBottomBar "Activate Guild" | `ActivationConfirm` | ✅ |
| `/guild-support` page (SUPPORT_ISSUES tiles) | support `Modal` | ✅ support only |
| `/guild-support` "Open a Guild ticket" | `ScenarioPicker` (no preset) → support `Modal` | ✅ support only |
| Footer new "Guild Support" pill | `/guild-support` | ✅ |
| Footer "Talk Now" | Guild WA (generic) | ✅ |
| Referral surface (`Refer`, `ReferModal`, `LoyaltyReferral`, `EarnRibbon`, `TopReferrers`) | Untouched | ✅ no overlap with activation/support |

No wrong impact found outside the items above.

## Files touched

- `src/routes/index.tsx`
  - Add `ActivationConfirm` component (customer-initiated WA thread, ticket ID, ping-us cadence card, success screen).
  - In `Index()`, branch on `issue.id === "activation"` to render `ActivationConfirm` instead of `Modal`.
  - Trim `EXPECTATIONS` (drop `e0`).
  - Update support `Modal` opening WA line.
  - Replace `ScenarioPicker` reminder-toggle card with the "you'll ping us" calm line; update step labels.
  - Rewrite activation carousel steps + any FAQ lines that imply we ping the guest.
  - Add `Guild Support` pill + inline text link in `Footer`.
- No changes to `src/routes/guild-support.tsx` (already support-only).
- No new files, no schema, no dependencies, no backend.

## Out of scope (deferred)

Extracting shared code into `src/lib/guild.tsx` is still worth doing, but it's a pure refactor with no user-visible effect and would bloat this diff. Ship the bug fix, the customer-initiated model, and the footer link first; refactor next.
