#!/bin/sh
# regen.sh — regenerate the formula-generated seating tables (../mondiala-seating.js).
# Run after any roster or placement-formula edit, then commit the regenerated table.
# The page reads the tables; the formulas only ever run here and in the suite (drift-checked).
cd "$(dirname "$0")"
cat > .regen_driver.js <<'EOF'
__genSeating(true);
EOF
cat stubs.js loader.js gen_seating.js .regen_driver.js > .regen.js
node .regen.js
status=$?
rm -f .regen.js .regen_driver.js
exit $status
