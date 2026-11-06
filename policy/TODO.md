# TODO — build phases

- [x] Phase 0 — data layer: data.json, update-register.json, SSB PxWeb client
      with offline fallback; GitHub Pages live from main
- [x] Phase 1 — tax: one shared base + variants A/B/C, charts, cumulative
      check table (1G→0 … 10G→3.50 G)
- [x] Phase 2 — pension: queue P = max(1% N, V/1.5 − U), virtual-age weights
      l_j′ = max(1, L_ref/L_j), age-distribution chart with cutoff line,
      actual/virtual toggle, society model, individual calculator
- [x] Phase 3 — food card: population × SIFO rate × 12, history/projection
      cost chart, taxable-in-B note
- [x] Phase 4 — budget Sankey: locked income, editable expenditure with
      status flags and presets, LVT balance valve (always balances),
      time series
- [x] Phase 5 — municipal finance: G-per-unit needs grants, norm-cost anchor,
      KOSTRA toggle, direct entry, mayor salary G·(α+β·∛pop), council odd(∛pop)
- [x] Phase 6 — electoral: S = odd(∛pop), equal county split with floor
      rounding, STV levelling seats, Droop quota 1/(S+1), house locked at S
- [x] Phase 7 — constitution builder (Norway/Mondiala/Italy presets, fiscal
      rules linked to budget presets) + Mondiala hex-map sandbox page
- [x] Phase 8 — verification: headless formula tests (policy/test/formulas.mjs),
      visible checks page, all routes, Sankey balance, live URL

# Revision round 1 (REVISION-1.md)

- [x] Block A — item 1: English everywhere (policy/ UI strings, comments,
      docs, data names; proper nouns like Røst/Trøndelag/Lånekassen kept as names)
- [x] Block A — item 2: general-input contract — tax calculator inputs are
      multiples of G; budget expenditure inputs are shares of GDP/GNI; money is
      read-only output everywhere
- [x] Block B — item 3: diagrams fixed — Chart.js needs a canvas, pages now
      create one in each chartbox (ui.chartCanvas) instead of passing the div
- [x] Block B — items 5, 8, 9: every income and spending post individually
      toggleable; named status-labeled alternatives (country / constitutional /
      legislated / pledge) or a plain percentage-of-budget field; preset
      selector removed; share of budget shown first, money second; barnetrygd
      and student stipend added as visible posts
- [x] Block C — item 4: barnetrygd 1 G/child (0–17) wired into the B base,
      the budget posts and the checks (tax-free in A, taxable in B)
- [x] Block C — item 10: variant C exempts only decile 1 — flat slab above the
      decile-1 threshold, no other exemptions; code, UI copy and checks updated
- [x] Block C — item 11: land value base 3,500 bn NOK central (band
      3,100–3,900), Danish-equivalence anchor source note, estimated flag kept;
      budget page shows the valve rate and the LVT share of budget as two
      separate labeled numbers
- [x] Block D — item 6: satsmodell implemented with political parameters a–i
      (init 1, user-editable, labeled as political parameters, not data);
      variable definitions per the Notion page "Offentlige overføringer til
      kommunesektoren"; old per-unit rates retired
- [x] Block D — item 7: hex map restored — SVG elements need createElementNS
      (document.createElement cannot create them, so the polygons never
      rendered); no flag property exists on the policy Mondiala page (verified)
      and none was added

## Open data gaps (revision round 1)

- Ecuador's annual-ratchet education rule: no level exists in the register or
  CONTEXT.md, so no named alternative was added for education — add the level
  at the data pass before wiring the ratchet.
- welfare.studentFteCount is draft (DBH student FTE count) — the student
  stipend post recomputes when the register value is replaced.
- Ecuador/ratchet, culture 1% target and country alternative levels reuse the
  ranges already recorded in the data layer; no new numbers were invented.

- income.decile1ThresholdNOK (230,000 NOK) is a draft placeholder between the
  decile-1 and decile-2 means — the real decile-1 threshold comes at the data
  pass (SSB 09935/05854); the decile means keep their draft flag.

- Municipal per-commune demographic units are a proportional in-app assumption
  (national per-resident shares × commune residents) until commune-level data
  enters the register at the data pass.
- The municipal national grant with neutral coefficients is large (~1.4 tn NOK)
  because a–i are unweighted political parameters; the user sets the real
  political weights — no official satser exist.

## Revision round 1, follow-up

- [x] Population-history trend charts removed (budget time series, pension
      society model, food card history) — they made no sense.
- [x] Municipal finance shows support per person (grant per resident) as the
      default view, plus a per-resident column in the table.
- [x] Municipal standard rates: the point is public data — the standard rates
      are calculated from KOSTRA / SSB service and cost statistics at the data
      pass and load in as coefficient defaults through the register; until
      then a–i stay neutral at 1. Copy no longer says "no data exists".
- [x] National budget shows the commune/country split (municipal transfers are
      the commune side; everything else is country).
- [x] Sin tax income post added = estimated social cost of alcohol + tobacco
      per year — sinTax.alcoholSocialCostNOK / sinTax.tobaccoSocialCostNOK are
      DRAFT placeholders; replace with official estimates (Norwegian
      Directorate of Health / SSB) at the data pass.
- [x] Culture is 1% of the BUDGET (programme pledge), not GDP.
- [x] Default selections are the programme's own levels (constitutional floors
      and pledges); every alternative now carries a short explanation in the
      selector.
