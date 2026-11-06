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
line and actual/virtual toggle, individual calculator with a user-adjustable
occupation-share assumption table. (The population-history trend charts were
removed — scaling model expenditure linearly by historic population was
misleading.)

**Tax** — one shared base: general capitalised income (alminnelig inntekt) minus the interest deduction,
keeping financial fees, small-scale business expenses, BSU and IPS. Three
toggleable variants over it:
- A "the staircase": marginal 0/10/20/30/40/50% per 1 G bracket.
- B "the flat template": tax = 0.5 × max(0, I − 3 G); welfare benefits (food card,
  barnetrygd 1 G/child, student stipend) add to the base; no exceptions — a 3 G
  pension hits the threshold exactly (zero tax), which is the demographic
  protection. Barnetrygd: 1 G per child (0–17), universal — tax-free in
  variant A, taxable in variant B (added to the base); a visible, toggleable
  budget post computed as children × 1 G. The card-tracking "net contribution" theory is illustration copy
  only, never the formula.
- C "decile anchored": C exempts ONLY decile 1. The C slab applies to
  everything above the decile-1 threshold; no other exemptions. Default rate
  50% above the decile-1 threshold (draft register field
  income.decile1ThresholdNOK — placeholder between the decile-1 and decile-2
  means until the data pass, SSB 09935/05854; the draft flag stays). One
  threshold number plus one rate, no distribution machinery.

The social security contribution (trygdeavgift), bracket tax (trinnskatt) and wealth tax
(formuesskatt) are removed; the employer contribution (arbeidsgiveravgift) and
corporate 22% with current special regimes stay. Charts per variant plus a
waterfall and a comparison vs today's system. Revenue aggregates per decile
from SSB income distribution tables; V1 uses decile means.

**Budget** — a Sankey: rule-driven income on the left, expenditure posts on
the right, computed live from the other modules. Every income post and every
spending post is individually toggleable; toggling any post live-recomputes
the totals, the gap, the LVT valve rate and all Sankey percentage shares. No
preset selector. Income posts: the oil fund (the 3% rule), the employer
contribution, corporate 22%, the income tax of the chosen variant, and a sin
tax set equal to the estimated social cost of alcohol and tobacco per year
(draft register values until the data pass). Defaults select the programme's
own levels (constitutional floors and pledges) rather than the adopted-budget
baseline. A commune/country split card shows which posts are delivered
through the municipal sector (the municipal transfers post) and which by the
state, with amounts and shares of the budget. Each expenditure post either offers named alternatives with
short explanations labeled by status — country (comparable real-world country
value), constitutional (enshrined in the constitution), legislated (adopted
law), pledge (party pledge) — or a plain percentage-of-budget number field the
user sets directly (a post set to s% of budget is exactly s% of the total:
T = F/(1−Σs)). Every alternative carries a short explanation shown in the
selector. Culture is 1% of the BUDGET (the programme pledge), not of GDP. The
Sankey and all post lists show each post's share of the
total budget, percentage first, money secondary, and money is always computed
read-only output. Completeness: every proposal in the Mondiala programme is a
visible, toggleable post — pensions, health, education, defence, aid,
transport, culture, research, administration, interest, the food card,
barnetrygd, the student stipend and municipal transfers; zero hidden posts.
The land value tax (LVT) is the balance valve: its rate is whatever closes the
gap, and the budget always balances — structural invariant, not a UI state.
The land value base (budget.income.lvtBaseNOK) is the Danish-equivalence
anchor: Denmark's reconstructed total land value at market (Statistics
Denmark's taxable grundværdi 1,249 bn DKK in 2022 under the old capped regime;
reconstructed market total ~2,000–2,500 bn DKK ≈ 3,100–3,900 bn NOK),
cross-validated by an area-class × price-per-m² estimate (~2,650 bn NOK
central, SSB 09594 areas plus market price anchors) — central value
3,500 bn NOK, band 3,100–3,900 bn NOK, flagged estimated — pending data pass
(the DKK/NOK rate is pinned at the data pass). The budget page shows TWO
separate labeled numbers: (1) the valve rate = gap / land base (~12.6% central
on the ~440 bn gap) — never labeled as a share of budget or GDP — and (2) the
LVT's share of the total budget.
Baseline = SBU 2026 posts from the data register. The population-history
trend charts were removed — they made no sense.



**Food card** — universal, flat SIFO single-adult grocery rate for every
resident; cost = population × rate × 12. Taxable in B, tax-free in A. (The
population-history cost chart was removed with the other trend charts.)

**Municipal finance** — the satsmodell:
T_k = G · (a·I_k + b·A_k + c·B_k + d·E_barn + e·E_ung + f·E_vgs + g·S_k
          + h·P_k + i·W_k)
where G is the grant rate unit and the coefficients a–i are POLITICAL
PARAMETERS (not data): user-editable number fields on the page. The STANDARD
RATES are calculated from public data (KOSTRA / SSB service and cost
statistics) at the data pass and load in as the defaults through the
register; until then the coefficients are neutral at 1 (equal weighting) —
nothing is invented. Support per person (grant per resident) is the default
view; total grants are one toggle away.
Variables (per the programme's transfer model): I_k residents, A_k km²,
B_k children in kindergarten age (1–5), E_barn primary pupils (6–12), E_ung
lower-secondary pupils (13–15), E_vgs upper-secondary pupils (16–18), S_k
students (draft register FTE count), P_k pensioners, W_k workforce. Grants are
never a function of the local tax base; per-commune demographic units are a
proportional in-app assumption from the register's age distribution. Norm-cost
anchor: the most expensive communes covering half the population; KOSTRA
toggle; direct-entry mode. Local LVT on land value. Mayor salary
G·(α + β·∛pop); council size odd(∛pop).

**Electoral system** — an explainer page, not a calculator: infographic cards
explain how the main electoral systems turn votes into seats — first past the
post, two-round runoff, party-list PR (D'Hondt/Sainte-Laguë), STV with the
Droop quota, mixed-member proportional — each with where it is used and its
pros and cons, followed by the Mondiala model step by step. A comparison chart
gives the register's example parties the same votes under winner-takes-all,
D'Hondt PR and the Mondiala model. The Mondiala model itself: house size
S = odd(∛population), locked at exactly S; half the seats split equally across
the counties (floor rounding), the rest national levelling seats recreated via
STV-style ranked choice; the Droop quota 1/(S+1) is the structural threshold —
no explicit threshold, no overhang seats.

**Constitution builder + Mondiala** — an explainer: each fiscal article
(deficit cap, debt cap, education floor, health floor, re-election ban) is
explained in plain language — what it says, what it protects against — with
presets Norway / Mondiala / Italy and editable values; the Mondiala floors
appear as budget expenditure alternatives. Mondiala hex-map page as the
fictional sandbox.

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
