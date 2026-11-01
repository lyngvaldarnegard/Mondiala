// Mondiala City Designer — data 5/5: the gods of love — the pink slot lattice, the waiting gods
// per ring, each god's homeland coordinates, and the full name set.
// Generated from the Mondiala City Designer canvas; edit there and re-split.
// the pink free-use district lattice — reserved, minimal, six-fold symmetric with the green spokes and mirror-symmetric about the north–south axis;
// the slot lattice never moves, but WHICH god sits in WHICH slot follows the compass:
// each god faces their homeland, by bearing from Mondiala's centre — same rule as the cities
const PINK_SLOTS = {
  5: [3,4,8,9,13,14,18,19,23,24,28,29],
  7: [2,7,9,14,16,21,23,28,30,35,37,42],
  8: [5,13,21,29,37,45]
};
// the love gods waiting around each ring — they settle onto that ring's pink slots by compass
// the cradle goddesses are NOT here — they wait unplaced, to be hand-placed wherever you like; the great six sit at the ring-4 middles, and Ishtar backfills Milda's ring-7 slot — Milda moved up into the heart; the outer rings swap by compass
const PINK_GODS = {
  5: ["Cupid","Adonis","Oshun","Astarte","Sjöfn","Prende","Lada","Qetesh","Turan","Anteros","Pothos","Astghik"],
  7: ["Nanaya","Anahita","Cybele","Dionysus","Himeros","Peitho","Bastet","Bes","Freyr","Ishtar","Zhiva","Aizen-Myōō"],
  8: ["Áine","Parvati","Yue Lao","Mami Wata","Tlazolteotl","Erzulie Freda"]
};
// where each god of love comes from [lat, lon] — the bearing from Mondiala to this spot decides
// which pink hex an OUTER god takes: eastern gods sit with the eastern cities, western with western,
// African to the south, and the Norse/Baltic ones to the north.
// the cradle goddesses wait for hand-placement; the great six sit at the ring-4 middles by compass; the rest settle by compass
const GOD_ORIGINS = {
"zhinü":[34.62,112.45],"cavillaca":[-12.07,-76.31], // the cradle goddesses wait unplaced: the Weaver Girl of China, and the Inca goddess of the Huarochirí myth
"venus":[41.90,12.50],"aphrodite":[34.75,32.41],"eros":[37.98,23.73],"ishtar":[31.32,45.64],"kama":[23.18,75.78],"freyja":[59.86,17.64], // the great six — five seated at the ring-4 middles by compass (Venus west, Aphrodite south-east, Eros south-west, Kama east, Freyja north-west); Ishtar backfills Milda's ring-7 slot
"inanna":[31.32,45.64],"cupid":[41.90,12.50],"adonis":[34.12,35.65],"hathor":[26.14,32.33],"oshun":[7.90,4.55],"rati":[23.18,75.78],"astarte":[35.60,35.77],"sjöfn":[59.86,17.64],"prende":[42.06,19.49],"lada":[52.23,21.01],"qetesh":[34.73,36.72],"turan":[43.47,11.03],
"nanaya":[32.13,45.23],"anahita":[32.65,51.67],"cybele":[39.32,31.58],"dionysus":[38.33,23.32],"himeros":[37.98,23.73],"peitho":[37.98,23.73],"bastet":[30.58,31.51],"bes":[26.14,32.33],"freyr":[59.86,17.64],"milda":[54.69,25.28],"zhiva":[52.52,13.40],"xochiquetzal":[19.43,-99.13],
"anteros":[37.97,23.73],"pothos":[37.97,23.73],"astghik":[40.18,44.51],"aizen-myōō":[34.21,135.58], // the backfill four — Eros's brothers Anteros and Pothos, the Armenian Aphrodite Astghik, and Japan's king of desire
"áine":[52.48,-8.61],"parvati":[25.32,83.01],"yue lao":[39.90,116.41],"mami wata":[4.05,9.70],"tlazolteotl":[19.43,-99.13],"erzulie freda":[18.54,-72.34]
};

const SEX_GODS = new Set(["venus","aphrodite","kama","freyja","zhinü","inanna","cupid","adonis","hathor","oshun","rati","astarte","sjöfn","prende","lada","qetesh","turan","nanaya","anahita","cybele","dionysus","himeros","peitho","bastet","bes","freyr","milda","zhiva","xochiquetzal","cavillaca","áine","parvati","yue lao","mami wata","tlazolteotl","erzulie freda","eros","ishtar","anteros","pothos","astghik","aizen-myōō"]); // gods of love and sexuality — any hex named for one of them is a pink free-use district; six goddesses sit in the heart's ring 4 by compass, each facing her homeland (Milda north-east, Kama east, Aphrodite south-east, Eros south-west, Venus west, Freyja north-west); the cradle goddesses wait unplaced — name any hexagon for one of them and it turns pink; the outer gods sit on the six-fold symmetric slot lattice, proven minimal, settling by compass and facing their homelands
