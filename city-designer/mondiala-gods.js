// Mondiala City Designer — data 5/5: the gods of love — the pink slot lattice, the waiting gods
// per ring, each god's homeland coordinates, and the full name set.
// Generated from the Mondiala City Designer canvas; edit there and re-split.
// the pink free-use district lattice — reserved, minimal, six-fold symmetric with the green spokes and mirror-symmetric inside each of the six sections between them — no two pink districts ever touch;
// the slot lattice never moves, but WHICH god sits in WHICH slot follows the compass:
// each god faces their homeland, by bearing from Mondiala's centre — same rule as the cities; the lattice runs from ring 6 outward with the city itself — the map is infinite (v1.7)
const PINK_SLOTS = {
  4: [3,7,11,15,19,23], // v1.8: the ring-4 middles join the lattice — the six favourites claim them
  6: [3,5,9,11,15,17,21,23,27,29,33,35],
  7: [2,7,9,14,16,21,23,28,30,35,37,42],
  8: [5,13,21,29,37,45],
  9: [3,8,12,17,21,26,30,35,39,44,48,53],
  10: [2,6,10,12,16,20,22,26,30,32,36,40,42,46,50,52,56,60],
  11: [4,9,15,20,26,31,37,42,48,53,59,64],
  12: [3,7,11,15,19,23,27,31,35,39,43,47,51,55,59,63,67,71] // v1.7: the frontier lattice — {2,6,10} per section, all four laws verified out here
};
// the favourites — the rules of seating favour them, so they end up close to the centre
const FAVOURITE_GODS = ["Eros","Aphrodite","Venus","Freyja","Cupid","Kama","Parvati","Lakshmi"];
// the love gods and the concepts of eros waiting around each ring — they settle onto that ring's pink slots by compass
// v1.8: all the pink tiles are equal — one allocation list, the favourites at the top; the six favourites take the ring-4 middles, Milda rides the lattice again from ring 7, and any overflow cascades outward ring by ring
const PINK_GODS = {
  4: ["Eros","Aphrodite","Venus","Freyja","Cupid","Kama"], // v1.8: the six favourites hold the ring-4 middles — the allocation list with the favourites at the top does it
  6: ["Cupid","Adonis","Oshun","Astarte","Sjöfn","Prende","Lada","Qetesh","Turan","Anteros","Pothos","Astghik"],
  7: ["Milda","Nanaya","Anahita","Cybele","Dionysus","Himeros","Peitho","Bastet","Bes","Freyr","Ishtar","Zhiva","Aizen-Myōō"],
  8: ["Áine","Parvati","Yue Lao","Mami Wata","Tlazolteotl","Erzulie Freda"],
  9: ["Shaushka","Attis","Min","Lofn","Xochipilli","Tu'er Shen","Laka","Diyan Masalanta","Lel","Lelia","Volupia"],
  10: ["Suadela","Hedylogos","Lempo","Aengus","Wadd","Hymenaios","Aphroditus","Dali","Anal","Vagina","Penis","Oral","Tantra","Chastity","Romance","Intimacy","Bondage","Dominance"],
  11: ["Lakshmi","Submission","Orgy","Promiscuity","Polyamory","Masturbation","Orgasm","Edging","Libido","Erotica","Nude","Voyeurism","Hedonism"],
  12: [] // the frontier's pink districts wait as parks — the cascade may still seat the last overflow god here
};
// where each god of love comes from [lat, lon] — the bearing from Mondiala to this spot decides
// which pink hex an OUTER god takes: eastern gods sit with the eastern cities, western with western,
// African to the south, and the Norse/Baltic ones to the north.
// the cradle goddesses wait for hand-placement; the great six sit at the ring-4 middles by compass; the rest settle by compass; the concepts of eros have no homeland — they seat in authored order
const GOD_ORIGINS = {
"zhinü":[34.62,112.45],"cavillaca":[-12.07,-76.31], // the cradle goddesses wait unplaced: the Weaver Girl of China, and the Inca goddess of the Huarochirí myth
"venus":[41.90,12.50],"aphrodite":[34.75,32.41],"eros":[37.98,23.73],"ishtar":[31.32,45.64],"kama":[23.18,75.78],"freyja":[59.86,17.64], // v1.8: the six favourites (Eros, Aphrodite, Venus, Freyja, Cupid, Kama) hold the ring-4 middles by compass; Ishtar keeps her ring-7 seat
"inanna":[31.32,45.64],"cupid":[41.90,12.50],"adonis":[34.12,35.65],"hathor":[26.14,32.33],"oshun":[7.90,4.55],"rati":[23.18,75.78],"astarte":[35.60,35.77],"sjöfn":[59.86,17.64],"prende":[42.06,19.49],"lada":[52.23,21.01],"qetesh":[34.73,36.72],"turan":[43.47,11.03],
"nanaya":[32.13,45.23],"anahita":[32.65,51.67],"cybele":[39.32,31.58],"dionysus":[38.33,23.32],"himeros":[37.98,23.73],"peitho":[37.98,23.73],"bastet":[30.58,31.51],"bes":[26.14,32.33],"freyr":[59.86,17.64],"milda":[54.69,25.28],"zhiva":[52.52,13.40],"xochiquetzal":[19.43,-99.13],
"anteros":[37.97,23.73],"pothos":[37.97,23.73],"astghik":[40.18,44.51],"aizen-myōō":[34.21,135.58], // the backfill four — Eros's brothers Anteros and Pothos, the Armenian Aphrodite Astghik, and Japan's king of desire
"áine":[52.48,-8.61],"parvati":[25.32,83.01],"yue lao":[39.90,116.41],"mami wata":[4.05,9.70],"tlazolteotl":[19.43,-99.13],"erzulie freda":[18.54,-72.34],
"lakshmi":[23.18,75.78], // the favourite pulled inward from the horizon — she ends up on ring 6
"shaushka":[37.00,39.00],"attis":[39.40,31.50],"min":[25.90,32.80],"lofn":[60.00,10.00],"xochipilli":[19.43,-99.13], // the dormant five wake for the horizon lattice
"tu'er shen":[30.60,104.10],"laka":[19.60,-155.50],"diyan masalanta":[14.60,121.00],"lel":[50.45,30.52],"lelia":[50.45,30.52], // ring 9: China's rabbit god, Hawaii's hula goddess, the Tagalog love-god, the Slavic twins of desire, and Rome's Volupia
"suadela":[41.90,12.50],"hedylogos":[37.98,23.73],"lempo":[61.00,25.50],"aengus":[53.68,-6.45],"wadd":[15.00,45.00],"hymenaios":[37.98,23.73],"aphroditus":[34.70,33.10],"dali":[42.30,43.40] // ring 10: persuasion, sweet-talk, the Finnish fiend of desire, Ireland's young god, the Arabian moon, the wedding song, Cyprus' two-formed goddess, the Georgian huntress
};

const SEX_GODS = new Set(["venus","aphrodite","kama","freyja","zhinü","inanna","cupid","adonis","hathor","oshun","rati","astarte","sjöfn","prende","lada","qetesh","turan","nanaya","anahita","cybele","dionysus","himeros","peitho","bastet","bes","freyr","milda","zhiva","xochiquetzal","cavillaca","áine","parvati","yue lao","mami wata","tlazolteotl","erzulie freda","eros","ishtar","anteros","pothos","astghik","aizen-myōō","lakshmi","shaushka","attis","min","lofn","xochipilli","tu'er shen","laka","diyan masalanta","lel","lelia","volupia","suadela","hedylogos","lempo","aengus","wadd","hymenaios","aphroditus","dali","anal","vagina","penis","oral","tantra","chastity","romance","intimacy","bondage","dominance","submission","orgy","promiscuity","polyamory","masturbation","orgasm","edging","libido","erotica","nude","voyeurism","hedonism"]); // gods of love and sexuality — plus the concepts of eros on the horizon rings; any hex named for one of them is a pink free-use district; the favourites rule seats the favoured eight close to the centre, the compass seats every deity facing their homeland, and the concepts — no homeland — fill the gaps in authored order; the cradle goddesses wait unplaced; the lattice runs to ring 11, the designed horizon
