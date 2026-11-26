# Gavin Coyne Coaching / Unbeatable — Site Notes

This is a static HTML/CSS site, hosted free on GitHub Pages. The workflow in
`.github/workflows/pages.yml` publishes this folder on every push to the `claude/code-landing-pages-43vda4`
branch (the repo's default branch; GitHub Pages refuses deploys from any other
branch), no manual upload needed. This
CLAUDE.md file is left out of what gets published.

- Live now: https://gavincoynecoaching.github.io/unbeatable/
- 5-Day Trial page: https://gavincoynecoaching.github.io/unbeatable/trial
- Planned custom domain: gavincoynecoaching.com (not bought yet as of 10 Oct 2026)

## Do not change without asking Gavin first

- **Brand name:** "Gavin Coyne" (NOT "Gavin Coin" — a past speech-to-text error).
- **Google Form link — the 90-second survey (locked, use everywhere):**
  `https://docs.google.com/forms/d/e/1FAIpQLSdwUH6vLt5X4NFMd2jQKOoG9qWr3KC9mS3N-29lddrbDZjfyQ/viewform?usp=header`
- **"Unbeatable" headline rule:** only append "by Gavin Coyne Coaching" to the
  word "Unbeatable" when it appears as a headline (`<h1>`/`<h2>`) or in a
  footer. When "Unbeatable" is used conversationally in body text, leave it
  alone.
- **CTA split:** article pages link to the Google Form survey. The homepage
  and other main pages use the email signup panel. Don't swap these.
- Preserve any content Gavin has approved as-is — don't rewrite it to fit a
  template without being asked.

## Layout is locked (agreed 2 Oct 2026)

Gavin has signed off the current layout of every page. Don't restructure,
reorder sections or restyle anything. The only planned visual change is a
small tweak to the For Parents page (`players.html`), which Gavin will
describe. Content updates and real images are still to come.

## New multi-page site — PREVIEW ONLY (21 Oct 2026)

Built from Unbeatable_Website_Implementation_Spec.md and parked in `preview/`
(live at https://gavincoynecoaching.github.io/unbeatable/preview/, noindex) so the
live root is unchanged until Gavin approves. Pages: index (Home), coaches,
players, parents, media, snapshot (the club snapshot, copied from his private
artifact so the public can open it), plus copies of trial/articles/committees
with the new menu. New styles are in `preview/site.css` (classes prefixed `u-`).
Snapshot (preview/snapshot.html) now asks for email (+ optional phone), shows tailored feedback (band meaning, strengths, quick win per weakest area, next-step buttons) and emails a copy to Gavin via FormSubmit (formsubmit.co/ajax/gavincoynecoaching@gmail.com). FormSubmit's first submission sends Gavin an activation email that must be clicked once.
Player snapshot (preview/player-snapshot.html, 24 Oct 2026): 10 sporting moments rated 1–10 (total /100), written to the player, coaching not therapy. Bands: Locked In / Solid Base / Room to Grow / Starting Point; tips + Unbeatable tool for the 2 lowest moments; next step = WhatsApp Gavin or 5-Day Trial. Under-16s asked to use a parent's email. Emails Gavin via the same FormSubmit endpoint. Linked from preview/players.html.
Assessments (preview, 24 Oct 2026): assessments.html hub + assess-player/team/club.html, text verbatim from Gavin's printed Set A V4 Draft 2 sheets. Shared engine preview/assess.js (+ assess.css). Sends to Google Apps Script when APPS_SCRIPT_URL in assess.js is set (logs to the 'Unbeatable Assessments' Google Sheet, emails Gavin + the respondent); until then falls back to FormSubmit (Gavin only). Script + setup steps: /apps-script (not published). 'Assessments' tab added to the preview menu.
To go live: copy preview/* over the root files (except CLAUDE.md) and delete preview/.

## Assessment tool recommendations (28 Oct 2026)

Live assess.js maps every assessment area to kit-bag tools (AREA_TOOLS / TOOLS near the top). After the score, the lowest-rated areas (7/10 or below) recommend up to 3 tools with a plain 'for players who…' line and the areas that triggered them. Sent to the Apps Script as `recommendedTools` (Code.gs doesn't store it yet). Club assessment: mobile number required.

## Trial page payments (20 Oct 2026)

The "Start the Trial" (€35) and "Choose the Month" (€79) buttons in the
"Ready to Get Started?" block (`#pricing` in trial.html) carry `data-pay` and
open WhatsApp with a prefilled message until Gavin supplies Stripe/PayPal links.
Swap their hrefs when the links exist. The bottom "Still on the fence?" block is
the free email list (AWeber tag `Trial_Page_Email_List`) plus book-a-chat.

## Hidden tabs (15 Oct 2026)

"For Parents" (players.html) and "Articles" (articles.html) are hidden from the
menu on every page while Gavin updates them. The links are commented out with
`<!-- hidden from menu for now: ... -->`; remove those comment wrappers to
bring them back. The pages still exist at their direct URLs.

26 Nov 2026: "Coaching" (index.html) and "Join the list" (index.html#signup)
are hidden from the menu on every page the same way, while the Coaching page
gets reworked (Kit Bag pages stay live). The logo still links to index.html.

## AWeber signup (done)

All three signup boxes (index, committees, players) post to AWeber form
769902414, list `awlist6281530`. After signing up, people are redirected to
the 90-second survey. The site's own form styling is kept; AWeber's default
styles were deliberately not used.

## Brand style guide

- Colors: navy `#14304A`, blue `#2E6BB0`, yellow `#F2C200` (the ONLY accent —
  used sparingly, once per view), cool neutrals/cream for backgrounds.
- Fonts: Barlow Condensed (headings), Barlow (body) — Google Fonts.
- Signature touch: a yellow underline under one key word per section, via the
  `.accent` class (see `styles.css`).
- Section backgrounds must alternate — never two identical background tones
  in a row.
- Logos: 5 variants in `images/` (`logo-navy.png`, `logo-yellow.png`,
  `logo-blue.png`, `logo-white.png`, `logo-black.png`). Contrast rule: dark
  background → light logo, light background → dark logo.

## File map

- `index.html` — Coaching landing page (main homepage)
- `committees.html` — "For Clubs" page
- `players.html` — "For Parents" page (direct-response style, sticky CTA, FAQ accordion)
- `articles.html` — index of all 123 articles, grouped by category
- `trial.html` — "5-Day Trial" landing page, laid out like the RevFit Killiney sales page (hero offer, what's included, day-by-day, method, next steps, FAQ, price + guarantee, reviews, two ways in). Placeholder copy drawn from the articles; styles are the `.tr-` block at the end of `styles.css`. Signups tagged `5_Day_Trial` in AWeber.
- `articles/*.html` — the 123 individual article pages (repurposed from email content)
- `styles.css` — single shared stylesheet, everything inherits from this
- `images/` — logos + the Distraction Loop SVG diagram

## Known placeholders still needed from Gavin (don't invent these)

- Real discovery-call booking link (currently `#REPLACE-WITH-BOOKING-LINK` on index/committees; on trial.html the "Book a call" buttons temporarily open WhatsApp — swap the ones marked data-booking when a booking link exists)
- players.html: intro video + 2 testimonial videos, founder photo, second star testimonial quote, pricing/timeframe/age-range FAQ answers
- Footer contact email / social link (every page)
- WhatsApp for trial.html enquiries: +353 85 868 2933 (wa.me/353858682933) — done
- trial.html: hero price line, how each day is delivered, what comes after day 5, age range, testimonials. Pricing (27 Oct 2026, v2): 5-Day Trial €39 · 4-Week Programme €89 ("Most popular") · 6-Week Programme €149 ("Recommended": + halfway feedback check-in, before & after Player Assessment, end review). Trial credit: €39 off the 6-Week if upgraded within 7 days of finishing the trial (Stripe: use a €39 promo code on the 6-week link). Programmes run in 6-week cycles, eight a year. Do-the-Work Guarantee live (27 Oct 2026) on the 4- and 6-Week Programmes: use the tools + challenges, submit the journal, attend check-ins; if no change, full refund. Key conditions kept on the page (consumer-law reason); full terms emailed at sign-up — Gavin still to write those
- Taglines for 7 of 9 article categories (only "Mirrors & Windows" and "The Jar" are done)
- New bio copy for the homepage bio section (Gavin said he'd supply this)

## Working style

- Gavin is not very technical — explain changes in plain terms, keep steps
  simple, and avoid jargon-heavy summaries.
- Don't keyword-stuff for SEO — genuine, useful content is the strategy.

## Masterclass capture page (18 Nov 2026)

`masterclass.html` (email-only landing page, NOT in the menu, noindex) for the
Revolution Fitness gym list that James Hanley sends. Copy is verbatim from the
"Unbeatable_Distracted_vs_Focused_Email" PDF, plus a two-loop visual
(Distraction vs Focus). Signup posts to its own AWeber form "Masterclass - RevFit Gym"
(ID 1344493197, a copy of 769902414) on list `awlist6281530`; that form applies
tags `revfit_gym` + `masterclass`; ad tracking `RevFit_Masterclass`. Email
required, first name optional. Redirects to `masterclass-thanks.html` (noindex): kitbag video
embedded (youtube-nocookie, ID WVpchO0v-BU, the unlisted Kit Bag Upgrade masterclass) + 90-second survey button.
Live: https://gavincoynecoaching.github.io/unbeatable/masterclass

## Kit Bag page (21 Nov 2026) — PREVIEW, awaiting Gavin's approval

Flow (agreed with Gavin 21 Nov): James's email (with the Distraction & Focus PDF) links to
`kitbag.html` → blurb (DRAFT by Claude, for Gavin to check) → pick Player/Team/Club →
`assessments.html?kitbag=1#…` → rate 10 areas → email asked LAST ("Get my result") → results show
score, "Your kit bag upgrade" = top 2 tools (always 2, even if all scores are high) with What/How
and a link to that tool's part of the masterclass video, plus "Watch the full masterclass".
- Tool What/How verbatim from "Unbeatable_KitBag_WhatHow_StagDrop.pdf" (kitbag.html + KIT map in assess.js).
- Video (24 Nov 2026): WVpchO0v-BU ("Coach Gav Podcast - Masterclass - The Kit Bag Upgrade", unlisted —
  link only for people on the email list; replaces 2qNTB3oAXwg, which is being deleted). Start times in
  VIDEO_AT (assess.js), from the transcript: M&W 5:02, Jar 6:49, 5·5·5 9:05, Communication 12:18,
  Paying the Price 16:38, Stairs 22:46, FvF 29:47, Beyond the Scoreboard 33:58. Bonus bits (mistakes
  in training 38:23, unfamiliar situations ~39:45) have no tool of their own.
- Kit bag tools are LOCKED AT 8 (Gavin, 24 Nov 2026). Anywhere that says 7 tools must say 8.
- Email capture: on "Get my result", assess.js posts to AWeber form 769902414 / awlist6281530 with
  ad tracking `Kit_Bag` through a hidden iframe (no tag — the form applies none). Results also go to
  the Apps Script with `source: "Kit Bag"`, `kitbagTools`, `videoUrl`.
- apps-script/Code.gs: respondent email for Kit Bag submissions gets subject "Your Kit Bag result:
  X/100 + your free masterclass" and a kit bag section with the video links. NEEDS Gavin to paste the
  new Code.gs into the Apps Script editor and redeploy (Manage deployments → Edit → New version).
- `kitbag-thanks.html` is now only the AWeber redirect target inside the hidden iframe (video and
  worksheet removed at Gavin's request). The Two Loops worksheet is a separate lead magnet now.
- Without ?kitbag=1 the assessments behave exactly as before.
- Kit Bag tab is only in kitbag.html's own menu; add to all menus + drop noindex once approved.
Live: https://gavincoynecoaching.github.io/unbeatable/kitbag

## Kit Bag Upgrade rename (22 Nov 2026)

Gavin: the menu tab "Assessments" is now "Kit Bag Upgrade" on every live page (root + articles;
preview/ untouched). assessments.html hero: no eyebrow; heading "The Essential Kit Bag Upgrade" (Gavin)
plus a kit-bag-analogy paragraph (DRAFT by Claude — boots, gumshield, drink, gloves, tape → mental
tools). Page title "Kit Bag Upgrade". In ?kitbag=1 mode only the paragraph changes (mentions the
email step). kitbag.html no longer has its own "Kit Bag" menu item (avoids two kit bag tabs).

## Apps Script deployed (22 Nov 2026)

apps-script/Code.gs pasted into the "Untitled project" Apps Script (bound to the Unbeatable
Assessments sheet) and deployed as Version 2 of the SAME web app deployment (URL unchanged).
Kit Bag results email: subject "Your Kit Bag result: X/100 + your free masterclass"; order
Where can I build → What's working → 10 areas → kit bag upgrade (intro line, two tools with
What/How + video links, full masterclass button) → "Your next steps" (watch, try one this week,
talk to Gavin). Any future Code.gs change: paste + Manage deployments → Edit → New version.
