#!/bin/sh
# run.sh — run the full Mondiala test suite.
# Needs node ≥ 18. Run from anywhere; paths are resolved from this directory.
cd "$(dirname "$0")"
cat stubs.js loader.js gen_data_md.js gen_seating.js asserts.js > .suite.js
node .suite.js
status=$?
rm -f .suite.js
exit $status
