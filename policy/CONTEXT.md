# CONTEXT — Autopilot Policy Models

A static, interactive JavaScript webapp modeling rule-driven ("autopilot")
policy models. The models are GENERAL, not Norwegian: every user input is a
fraction or percentage of GDP, GNI, the budget or the population (or a multiple
of G, the preset basic amount) — never a money input. Money amounts are
computed read-only output, derived from the general inputs and the country
preset. Norway is only the default country preset and provides the default
data values; the user can override any percentage input. Formulas and live
data decide outcomes; users only set levels within fixed rules. Everything is
visible and editable in the UI — no hidden constants in code. All concrete
numbers live in the data layer (data.json + update register), never in logic.

## Architecture
- Plain ES-module JavaScript, no backend. Charts via Chart.js; Sankey via
  d3-sankey.
- Shared data layer first: data.json (curated constants: G = 136 549 kr, oil
  fund, SIFO rate, occupational life expectancy, etc.), a machine-readable
  update register (field, value, source, cadence, sanity range), and an SSB
  PxWeb client (POST json-stat to data.ssb.no/api/v0/no/table/{id}) with
  offline fallback to curated values. Every module reads from this layer. G
  and all other constants come from data, never hardcoded. Adding a tracked
  number = new register entry, no code change.
- Modules in one repo: pension, tax, budget, food card, municipal finance,
  electoral system, constitution builder, Mondiala sandbox.

## Modules

**Pension** — a queue, not a fixed age. P = max(1% × N, V/1.5 − U) decides how
many pensioners the economy carries (U = children + young, V = workforce). The
cutoff is the adjusted age of person nr. P in a population sorted descending.
Adjusted (virtual) age = age + Σ(years in occupation × (max(1, L_ref/L_j) − 1)):
weights computed at runtime from occupational life expectancy data — upward
only, so hard occupations accrue queue credit faster and safe ones count
exactly 1.0. Pension level 3 G/year. Pages: age-distribution chart with cutoff
line and actual/virtual toggle, society model over SSB history + projections,
individual calculator with a user-adjustable occupation-share assumption table.

**Tax** — one shared base: general capitalised income (alminnelig inntekt) minus the interest deduction,
keeping financial fees, small-scale business expenses, BSU and IPS. Three
toggleable variants over it:
- A "the staircase": marginal 0/10/20/30/40/50% per 1 G bracket.
- B "the flat template": tax = 0.5 × max(0, I − 3 G); welfare benefits (food card,
  barnetrygd 1 G/child, student stipend) add to the base; no exceptions — a 3 G
  pension hits the threshold exactly (zero tax), which is the demographic
  protection. The card-tracking "net contribution" theory is illustration copy
  only, never the formula.
- C "decile anchored": flat X% above the Y-th percentile — default 50% above the
  median wage (SSB wage statistics, one anchor number, currently 669 600 kr/yr).
  X and Y editable; one number plus one rate, no distribution machinery.

The social security contribution (trygdeavgift), bracket tax (trinnskatt) and wealth tax
(formuesskatt) are removed; the employer contribution (arbeidsgiveravgift) and
corporate 22% with current special regimes stay. Charts per variant plus a
waterfall and a comparison vs today's system. Revenue aggregates per decile
from SSB income distribution tables; V1 uses decile means.

**Budget** — a Sankey: rule-driven income on the left, expenditure posts on
the right, computed live from the other modules. Every income post and every
spending post is individually toggleable; toggling any post live-recomputes
the totals, the gap, the LVT valve rate and all Sankey percentage shares. No
preset selector. Each expenditure post either offers named alternatives with
short explanations labeled by status — country (comparable real-world country
value), constitutional (enshrined in the constitution), legislated (adopted
law), pledge (party pledge) — or a plain percentage-of-budget number field the
user sets directly (a post set to s% of budget is exactly s% of the total:
T = F/(1−Σs)). The Sankey and all post lists show each post's share of the
total budget, percentage first, money secondary, and money is always computed
read-only output. Completeness: every proposal in the Mondiala programme is a
visible, toggleable post — pensions, health, education, defence, aid,
transport, culture, research, administration, interest, the food card,
barnetrygd, the student stipend and municipal transfers; zero hidden posts.
The land value tax (LVT) is the balance valve: its rate is whatever closes the
gap, and the budget always balances — structural invariant, not a UI state.
Baseline = SBU 2026 posts from the data register; time series with SSB history
and model projection driven by population projections.



**Food card** — universal, flat SIFO single-adult grocery rate for every
resident; cost = population × rate × 12. Taxable in B, tax-free in A.

**Municipal finance** — needs-based state grants in G per unit (residents,
km², children, pupils, pensioners…), never dependence on local tax base.
Norm-cost anchor: the most expensive communes covering half the population;
KOSTRA toggle; direct-entry mode. Local LVT on land value. Mayor salary
G·(α + β·∛pop); council size odd(∛pop).

**Electoral system** — house size S = odd(∛population). Default variant: half
the seats split equally across counties (floor rounding), the rest are national
levelling seats recreated via STV-style ranked choice (Droop quota 1/(S+1) as
the structural threshold, no explicit threshold, no overhang seats, house
locked at exactly S).

**Constitution builder + Mondiala** — presets Norway / Mondiala / Italy,
fiscal rules linked to budget presets; Mondiala hex-map page as the fictional
sandbox.

## Data sources
SSB PxWebApi for everything live (public finances 10487, income distribution
09935/05854, wages 11418/11419, population/projections, KOSTRA, national
accounts). Curated with cadence where no API exists: G (yearly 1 May), oil fund
(quarterly), SIFO (February), occupational life expectancy (per publication —
raw data in register, weights computed in-app). Some inputs are draft until a
data pass (student FTE count, occupation shares) — wire logic so replacing the
value in the register is enough.

## Constraints
- Budget always balances through the LVT valve; never show an unbalanced budget.
- One tax base implementation; variants are toggles, not forks.
- Numbers live in the data layer, not in code.
- B's theory stays illustration; the sjablong is the formula.
- Progressive computations use decile means in V1; keep the upgrade path to
  finer bins.

## Acceptance
- Variant A cumulative tax matches spec: 1G→0, 2G→0.10G, 3G→0.30G, 4G→0.60G,
  5G→1.00G, 6G→1.50G, 10G→3.50G.
- Toggling pension level or the food card visibly moves the Sankey and the
  implicit LVT rate.
- Pension cutoff recomputes from data; the virtual-age toggle shifts the chart.
- A new register entry updates a value with no code change.
