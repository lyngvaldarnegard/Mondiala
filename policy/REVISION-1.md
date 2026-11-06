# REVISION LIST — ROUND 1

Work in the block order given after the list. Deploy to main at the end of
every block, and keep the live site working after each deploy. After every
block, run node policy/test/formulas.mjs (and the UI's #/checks route) —
all checks must pass, including new checks you add for changed formulas.

Item 1 — English everywhere: audit all repo text, code comments, UI strings
and docs; anything not in English gets translated. GitHub content is English
only.

Item 2 — HIGHEST PRIORITY, architectural: the models are GENERAL, not
Norwegian. Every user input must be a fraction or percentage of GDP, GNI,
budget or population — never a NOK/slider money input. Money amounts are
computed read-only output, derived from the general inputs and the country
preset. Norway is only the default country preset and provides default data
values; the user can override any percentage input. Rebuild the input layer
of every page to this contract before anything else depends on it.

Item 3 — Diagrams: only the tax page currently renders its diagrams. Fix the
diagram/flow rendering on all pages so every page that specifies a diagram
actually renders it.

Item 4 — Barnetrygd is missing from the models. Implement it: 1 G per child,
tax-free in tax variant A, taxable in tax variant B. Wire it into the
household/benefit calculations and the budget posts, with formula checks.

Item 5 — Budget posts: each post is individually toggleable and offers either
(a) named alternatives with short explanations, labeled by status — country
(comparable real-world country value), constitutional (enshrined in the
constitution), legislated (adopted law), pledge (party pledge), or (b) a
plain percentage-of-budget number field the user can set directly. Remove the
unexplained high/low/Mondiala preset selector. The Sankey and all post lists
must show each post's share of the total budget, percentage first, money
secondary.

Item 6 — Municipal transfers: implement the satsmodell
T_k = G · (a·I_k + b·A_k + c·B_k + d·E_barn + e·E_ung + f·E_vgs + g·S_k
          + h·P_k + i·W_k)
where G is the grant rate unit and the coefficients a–i are political
parameters: render them as user-editable number fields on the page, labeled
as political parameters (not data), initialized to 1 (neutral equal
weighting). No official satser exist — do not invent them. Variable
definitions are on the Notion page «Offentlige overføringer til
kommunesektoren» (id ec330681-da22-4d3b-889f-0046e85b4812); if any term is
ambiguous, implement it with a clear placeholder and flag it in TODO.md.

Item 7 — Mondiala page: restore the hex map; remove the flag property.

Item 8 — Budget toggles, full scope: extend item 5 to the ENTIRE budget.
Every tax post and every spending post is individually toggleable on/off.
Toggling any post must live-recompute totals, the gap, the LVT valve rate,
and all Sankey percentage shares. No preset selector anywhere.

Item 9 — Completeness: every proposal in the Mondiala program must exist as
a visible budget post. Audit the post list against the proposal list and add
every missing one, including barnetrygd (item 4). Zero hidden posts:
anything the program spends or taxes has a visible, toggleable post.

Item 10 — Tax variant C (decile anchor): C exempts ONLY decile 1. The C slab
applies to everything above the decile-1 threshold; no other exemptions.
Update the formula code, the UI copy for variant C, the checks in
policy/test/formulas.mjs, and the formula documentation in CONTEXT.md.
The decile means in the register (SSB 09935/05854) keep their draft flag —
the real numbers come at the data pass.

Item 11 — Land base (register + display): the register's land value base
field (currently draft 5,200 bn NOK, budget.income.lvtBaseNOK) is retired.
Replace its value with 3,500 bn NOK central (band 3,100–3,900) and replace
the source note: the value is the Danish-equivalence anchor — Denmark's
reconstructed total land value at market (Statistics Denmark's taxable
grundværdi 1,249 bn DKK in 2022 under the old capped regime; reconstructed
market total ~2,000–2,500 bn DKK ≈ 3,100–3,900 bn NOK), cross-validated by an
area-class × price-per-m² estimate (~2,650 bn NOK central, SSB 09594 areas
plus market price anchors). Keep an «estimated — pending data pass» flag on
the field; the DKK/NOK rate is pinned at the data pass. On the budget page,
the LVT balance valve must show TWO separate labeled numbers: (1) the valve
rate = gap / land base (≈12.6% central on the ~440 bn gap), and (2) the LVT's
share of total budget. Never label the rate as a share of budget or GDP.

BLOCK ORDER
Block A: items 1 and 2 (language + general-input architecture; nothing else
builds on the old NOK-slider scaffold).
Block B: items 3, 5, 8, 9 (diagram rendering, full budget toggles,
completeness).
Block C: items 4, 10, 11 (barnetrygd, variant C, land base — all formula
changes together, checks updated and green).
Block D: items 6 and 7 (municipal satsmodell, Mondiala hex map).

CONSTANTS
Do not invent data. Any value not already in the register or CONTEXT.md gets
a draft flag and a TODO entry. Existing draft flags stay until the data pass.
