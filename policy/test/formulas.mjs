// Headless formula checks — the same assertions as the UI checks page.
// Run: node policy/test/formulas.mjs
import { initData, get, getWithOverride } from '../js/data.js';
import { runChecks } from '../js/checks.js';

await initData();
const checks = runChecks();
let failed = 0;
for (const c of checks) {
  console.log((c.ok ? '  ✓ ' : '  ✗ ') + c.name + (c.ok ? '' : ' — ' + c.detail));
  if (!c.ok) failed++;
}
console.log(`\n${checks.length - failed}/${checks.length} kontroller grønne`);
if (failed) { console.error(failed + ' kontroller feiler'); process.exit(1); }
