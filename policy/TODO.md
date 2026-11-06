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
- [ ] Block B — items 3, 5, 8, 9: diagram rendering, budget post alternatives,
      full toggles, completeness
- [ ] Block C — items 4, 10, 11: barnetrygd, variant C decile-1 exemption,
      land base update
- [ ] Block D — items 6, 7: municipal satsmodell coefficients, Mondiala hex map
