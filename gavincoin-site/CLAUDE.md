# Gavin Coyne Coaching / Unbeatable — Site Notes

This is a static HTML/CSS site for gavincoynecoaching.com, hosted on Cloudflare
Pages and deployed via GitHub (push to the connected branch = auto-deploy, no
manual upload needed).

## Do not change without asking Gavin first

- **Brand name:** "Gavin Coyne" (NOT "Gavin Coin" — a past speech-to-text error).
- **Google Form link (locked, use everywhere):**
  `https://docs.google.com/forms/d/e/1FAIpQLSdwUH6vLt5X4NFMd2jQKOoG9qWr3KC9mS3N-29lddrbDZjfyQ/viewform?usp=header`
- **"Unbeatable" headline rule:** only append "by Gavin Coyne Coaching" to the
  word "Unbeatable" when it appears as a headline (`<h1>`/`<h2>`) or in a
  footer. When "Unbeatable" is used conversationally in body text, leave it
  alone.
- **CTA split:** article pages link to the Google Form survey. The homepage
  and other main pages use the email signup panel. Don't swap these.
- Preserve any content Gavin has approved as-is — don't rewrite it to fit a
  template without being asked.

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
- `articles/*.html` — the 123 individual article pages (repurposed from email content)
- `styles.css` — single shared stylesheet, everything inherits from this
- `images/` — logos + the Distraction Loop SVG diagram

## Known placeholders still needed from Gavin (don't invent these)

- Real AWeber form action URL + hidden fields (currently `#REPLACE-WITH-AWEBER-FORM-ACTION-URL` in index.html, committees.html, players.html)
- Real discovery-call booking link (currently `#REPLACE-WITH-BOOKING-LINK`)
- players.html: intro video + 2 testimonial videos, founder photo, second star testimonial quote, pricing/timeframe/age-range FAQ answers
- Footer contact email / social link (every page)
- Taglines for 7 of 9 article categories (only "Mirrors & Windows" and "The Jar" are done)
- New bio copy for the homepage bio section (Gavin said he'd supply this)

## Working style

- Gavin is not very technical — explain changes in plain terms, keep steps
  simple, and avoid jargon-heavy summaries.
- Don't keyword-stuff for SEO — genuine, useful content is the strategy.
