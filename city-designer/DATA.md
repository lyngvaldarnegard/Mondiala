# Mondiala — data reference

This file is generated from `mondiala-data.js` by the repo's test pipeline. Every table below is a human-readable copy of the app's source data.

## Where Mondiala sits

The map has three default centre spots — one per placement mode — each verified against the real country it lands in:

| Mode | Flag | Country | Latitude | Longitude | Where exactly |
| --- | --- | --- | --- | --- | --- |
| geo (geographic midpoint) | 🇸🇰 | Slovakia | 49.0077 | 20.7408 | just off the Polish border |
| pop (population-weighted) | 🇰🇬 | Kyrgyzstan | 42.4053 | 71.8384 | the Talas valley, Tian Shan |
| great (size + livability + walkability) | 🇺🇦 | Ukraine | 51.4572 | 24.8977 | Volyn, near Kovel |

Once the centre moves off these spots (a city is added, or the roster is edited), the app names the country of the *nearest roster city* instead, with the distance — it never invents a spot.

## The authored core (rings 0–3)

| Ring | Hex | Name | Density |
| --- | --- | --- | --- |
| 0 | 0 | Metropol | 4355.39 |
| 1 | 1 | Paris | 19430 |
| 1 | 2 | Barcelona | 16630 |
| 1 | 3 | Moscow | 5080 |
| 1 | 4 | Singapore | 8188.27 |
| 1 | 5 | Vancouver | 5749.9 |
| 1 | 6 | New York | 11313.8 |
| 2 | 1 | Rome | — |
| 2 | 3 | Athens | — |
| 2 | 5 | Constantinople | — |
| 2 | 7 | Mesopotamia | — |
| 2 | 9 | Jerusalem | — |
| 2 | 11 | Homoia | — |
| 2 | 2 | Venus | — |
| 2 | 4 | Aphrodite | — |
| 2 | 6 | Eros | — |
| 2 | 8 | Ishtar | — |
| 2 | 10 | Kama | — |
| 2 | 12 | Freyja | — |
| 3 | 1 | Stockholm | 5261.53 |
| 3 | 2 | København | 7411.38 |
| 3 | 3 | Oslo | 1708.99 |
| 3 | 4 | Helsinki | 3238.47 |
| 3 | 5 | Reykjavík | 556 |
| 3 | 6 | Tallinn | 2864.3 |
| 3 | 7 | Riga | 2339 |
| 3 | 8 | Vilnius | 1515 |
| 3 | 9 | Malmö | 4049 |
| 3 | 10 | Aarhus | 2975 |
| 3 | 11 | Kaunas | 1903 |
| 3 | 12 | Göteborg | 1367.3 |
| 3 | 13 | Billund | 870 |
| 3 | 14 | Turku \| Åbo | 853.45 |
| 3 | 15 | Trondheim | 672.81 |
| 3 | 16 | Bergen | 660.75 |
| 3 | 17 | Tampere \| Tammerfors | 501.7 |
| 3 | 18 | Vyborg | 519 |

## The world roster (161 candidate cities)

Rings 4–8 are placed by the candidates' real coordinates, by compass bearing from Mondiala's centre. Population figures are urban-area estimates.

### Europe (35)

| City | Flag | Country | Coordinates (lat, lon) | Population |
| --- | --- | --- | --- | --- |
| London | 🇬🇧 | the United Kingdom | 51.51, -0.13 | 11,360,000 |
| Amsterdam | 🇳🇱 | the Netherlands | 52.37, 4.90 | 2,500,000 |
| Vienna | 🇦🇹 | Austria | 48.21, 16.37 | 2,000,000 |
| Prague | 🇨🇿 | Czechia | 50.08, 14.44 | 1,300,000 |
| Dublin | 🇮🇪 | Ireland | 53.35, -6.26 | 1,250,000 |
| Berlin | 🇩🇪 | Germany | 52.52, 13.40 | 4,400,000 |
| Brussels | 🇧🇪 | Belgium | 50.85, 4.35 | 2,100,000 |
| Kyiv | 🇺🇦 | Ukraine | 50.45, 30.52 | 3,000,000 |
| Edinburgh | 🇬🇧 | the United Kingdom | 55.95, -3.19 | 520,000 |
| Manchester | 🇬🇧 | the United Kingdom | 53.48, -2.24 | 2,800,000 |
| Venice | 🇮🇹 | Italy | 45.44, 12.34 | 260,000 |
| Milan | 🇮🇹 | Italy | 45.46, 9.19 | 5,631,000 |
| Zagreb | 🇭🇷 | Croatia | 45.81, 15.98 | 800,000 |
| Saint Petersburg | 🇷🇺 | Russia | 59.94, 30.31 | 5,869,000 |
| Liverpool | 🇬🇧 | the United Kingdom | 53.41, -2.98 | 860,000 |
| Glasgow | 🇬🇧 | the United Kingdom | 55.86, -4.25 | 1,700,000 |
| Munich | 🇩🇪 | Germany | 48.14, 11.58 | 2,900,000 |
| Bratislava | 🇸🇰 | Slovakia | 48.15, 17.11 | 700,000 |
| Ljubljana | 🇸🇮 | Slovenia | 46.06, 14.51 | 300,000 |
| Sarajevo | 🇧🇦 | Bosnia and Herzegovina | 43.86, 18.41 | 420,000 |
| Kraków | 🇵🇱 | Poland | 50.06, 19.94 | 800,000 |
| Lisbon | 🇵🇹 | Portugal | 38.72, -9.14 | 2,900,000 |
| Madrid | 🇪🇸 | Spain | 40.42, -3.70 | 6,966,000 |
| Bordeaux | 🇫🇷 | France | 44.84, -0.58 | 1,000,000 |
| Florence | 🇮🇹 | Italy | 43.77, 11.26 | 850,000 |
| Utrecht | 🇳🇱 | the Netherlands | 52.09, 5.12 | 375,000 |
| Porto | 🇵🇹 | Portugal | 41.15, -8.61 | 1,300,000 |
| Bristol | 🇬🇧 | the United Kingdom | 51.45, -2.59 | 620,000 |
| Hamburg | 🇩🇪 | Germany | 53.55, 9.99 | 3,200,000 |
| Budapest | 🇭🇺 | Hungary | 47.50, 19.04 | 1,750,000 |
| Warsaw | 🇵🇱 | Poland | 52.23, 21.01 | 3,100,000 |
| Bucharest | 🇷🇴 | Romania | 44.43, 26.10 | 1,900,000 |
| Belgrade | 🇷🇸 | Serbia | 44.79, 20.45 | 1,400,000 |
| Sofia | 🇧🇬 | Bulgaria | 42.70, 23.32 | 1,200,000 |
| Frankfurt | 🇩🇪 | Germany | 50.11, 8.68 | 2,700,000 |

### Middle East & Caucasus (12)

| City | Flag | Country | Coordinates (lat, lon) | Population |
| --- | --- | --- | --- | --- |
| Ankara | 🇹🇷 | Türkiye | 39.93, 32.86 | 5,700,000 |
| Dubai | 🇦🇪 | the United Arab Emirates | 25.20, 55.27 | 5,097,000 |
| Tel Aviv | 🇮🇱 | Israel | 32.08, 34.78 | 4,200,000 |
| Riyadh | 🇸🇦 | Saudi Arabia | 24.71, 46.68 | 8,589,000 |
| Tehran | 🇮🇷 | Iran | 35.69, 51.39 | 14,137,000 |
| Baku | 🇦🇿 | Azerbaijan | 40.41, 49.87 | 2,400,000 |
| Baghdad | 🇮🇶 | Iraq | 33.31, 44.36 | 7,160,000 |
| Amman | 🇯🇴 | Jordan | 31.95, 35.93 | 2,200,000 |
| Kuwait City | 🇰🇼 | Kuwait | 29.37, 47.98 | 3,100,000 |
| Doha | 🇶🇦 | Qatar | 25.29, 51.53 | 2,400,000 |
| Tbilisi | 🇬🇪 | Georgia | 41.72, 44.78 | 1,200,000 |
| Yerevan | 🇦🇲 | Armenia | 40.18, 44.51 | 1,100,000 |

### Africa (25)

| City | Flag | Country | Coordinates (lat, lon) | Population |
| --- | --- | --- | --- | --- |
| Cairo | 🇪🇬 | Egypt | 30.04, 31.24 | 22,684,000 |
| Alexandria | 🇪🇬 | Egypt | 31.20, 29.92 | 5,916,000 |
| Addis Ababa | 🇪🇹 | Ethiopia | 9.03, 38.74 | 5,700,000 |
| Cape Town | 🇿🇦 | South Africa | -33.92, 18.42 | 4,800,000 |
| Khartoum | 🇸🇩 | Sudan | 15.50, 32.56 | 7,677,000 |
| Luanda | 🇦🇴 | Angola | -8.84, 13.23 | 11,892,000 |
| Nairobi | 🇰🇪 | Kenya | -1.29, 36.82 | 5,500,000 |
| Kinshasa | 🇨🇩 | DR Congo | -4.32, 15.31 | 13,060,000 |
| Dar es Salaam | 🇹🇿 | Tanzania | -6.79, 39.21 | 8,877,000 |
| Abidjan | 🇨🇮 | Côte d'Ivoire | 5.35, -4.02 | 5,600,000 |
| Accra | 🇬🇭 | Ghana | 5.60, -0.19 | 2,600,000 |
| Dakar | 🇸🇳 | Senegal | 14.72, -17.47 | 3,300,000 |
| Casablanca | 🇲🇦 | Morocco | 33.57, -7.59 | 4,400,000 |
| Johannesburg | 🇿🇦 | South Africa | -26.20, 28.05 | 15,026,000 |
| Kampala | 🇺🇬 | Uganda | 0.35, 32.58 | 3,700,000 |
| Durban | 🇿🇦 | South Africa | -29.86, 31.02 | 3,400,000 |
| Kigali | 🇷🇬 | Rwanda | -1.94, 30.06 | 1,200,000 |
| Algiers | 🇩🇿 | Algeria | 36.75, 3.06 | 2,800,000 |
| Antananarivo | 🇲🇬 | Madagascar | -18.88, 47.51 | 3,600,000 |
| Maputo | 🇲🇿 | Mozambique | -25.97, 32.57 | 1,300,000 |
| Pretoria | 🇿🇦 | South Africa | -25.75, 28.19 | 2,900,000 |
| Yaoundé | 🇨🇲 | Cameroon | 3.87, 11.52 | 4,300,000 |
| Abuja | 🇳🇬 | Nigeria | 9.06, 7.49 | 3,800,000 |
| Monrovia | 🇱🇷 | Liberia | 6.30, -10.80 | 1,500,000 |
| Lagos | 🇳🇬 | Nigeria | 6.52, 3.38 | 15,283,000 |

### Asia (42)

| City | Flag | Country | Coordinates (lat, lon) | Population |
| --- | --- | --- | --- | --- |
| Karachi | 🇵🇰 | Pakistan | 24.86, 67.01 | 21,258,000 |
| Delhi | 🇮🇳 | India | 28.61, 77.21 | 33,224,000 |
| Beijing | 🇨🇳 | China | 39.90, 116.41 | 22,363,000 |
| Tokyo | 🇯🇵 | Japan | 35.68, 139.69 | 37,325,000 |
| Osaka | 🇯🇵 | Japan | 34.69, 135.50 | 14,998,000 |
| Shanghai | 🇨🇳 | China | 31.23, 121.47 | 29,900,000 |
| Mumbai | 🇮🇳 | India | 19.08, 72.88 | 26,237,000 |
| Bangkok | 🇹🇭 | Thailand | 13.76, 100.50 | 20,284,000 |
| Tashkent | 🇺🇿 | Uzbekistan | 41.30, 69.24 | 2,900,000 |
| Lahore | 🇵🇰 | Pakistan | 31.55, 74.32 | 14,256,000 |
| Dhaka | 🇧🇩 | Bangladesh | 23.81, 90.41 | 25,305,000 |
| Bengaluru | 🇮🇳 | India | 12.97, 77.59 | 14,000,000 |
| Hong Kong | 🇭🇰 | Hong Kong | 22.32, 114.17 | 7,117,000 |
| Fukuoka | 🇯🇵 | Japan | 33.59, 130.40 | 5,550,000 |
| Nagoya | 🇯🇵 | Japan | 35.18, 136.91 | 9,617,000 |
| Taipei | 🇹🇼 | Taiwan | 25.03, 121.57 | 9,866,000 |
| Ho Chi Minh City | 🇻🇳 | Vietnam | 10.82, 106.63 | 16,024,000 |
| Manila | 🇵🇭 | the Philippines | 14.60, 120.98 | 25,521,000 |
| Kolkata | 🇮🇳 | India | 22.57, 88.36 | 20,327,000 |
| Chennai | 🇮🇳 | India | 13.08, 80.27 | 11,950,000 |
| Almaty | 🇰🇿 | Kazakhstan | 43.24, 76.89 | 2,200,000 |
| Astana | 🇰🇿 | Kazakhstan | 51.17, 71.43 | 1,400,000 |
| Hanoi | 🇻🇳 | Vietnam | 21.03, 105.85 | 8,700,000 |
| Yangon | 🇲🇲 | Myanmar | 16.87, 96.20 | 6,820,000 |
| Wuhan | 🇨🇳 | China | 30.59, 114.31 | 10,041,000 |
| Jakarta | 🇮🇩 | Indonesia | -6.21, 106.85 | 36,877,000 |
| Hyderabad | 🇮🇳 | India | 17.39, 78.49 | 10,101,000 |
| Ahmedabad | 🇮🇳 | India | 23.03, 72.58 | 7,961,000 |
| Colombo | 🇱🇰 | Sri Lanka | 6.93, 79.86 | 800,000 |
| Kathmandu | 🇳🇵 | Nepal | 27.72, 85.32 | 1,600,000 |
| Seoul | 🇰🇷 | South Korea | 37.57, 126.98 | 23,825,000 |
| Chengdu | 🇨🇳 | China | 30.57, 104.07 | 8,040,000 |
| Shenzhen | 🇨🇳 | China | 22.54, 114.06 | 17,900,000 |
| Guangzhou | 🇨🇳 | China | 23.13, 113.26 | 26,900,000 |
| Hangzhou | 🇨🇳 | China | 30.27, 120.16 | 12,422,000 |
| Kuala Lumpur | 🇲🇾 | Malaysia | 3.14, 101.69 | 9,899,000 |
| Macau | 🇲🇴 | Macau | 22.20, 113.55 | 700,000 |
| Xi'an | 🇨🇳 | China | 34.34, 108.94 | 8,313,000 |
| Suzhou | 🇨🇳 | China | 31.30, 120.62 | 7,000,000 |
| Nanjing | 🇨🇳 | China | 32.06, 118.80 | 8,929,000 |
| Tianjin | 🇨🇳 | China | 39.13, 117.20 | 12,095,000 |
| Bandung | 🇮🇩 | Indonesia | -6.92, 107.61 | 7,490,000 |

### Oceania (3)

| City | Flag | Country | Coordinates (lat, lon) | Population |
| --- | --- | --- | --- | --- |
| Melbourne | 🇦🇺 | Australia | -37.81, 144.96 | 5,185,000 |
| Sydney | 🇦🇺 | Australia | -33.87, 151.21 | 5,037,000 |
| Perth | 🇦🇺 | Australia | -31.95, 115.86 | 2,100,000 |

### The Americas (44)

| City | Flag | Country | Coordinates (lat, lon) | Population |
| --- | --- | --- | --- | --- |
| Buenos Aires | 🇦🇷 | Argentina | -34.60, -58.38 | 15,933,000 |
| Montevideo | 🇺🇾 | Uruguay | -34.90, -56.16 | 1,800,000 |
| Rio de Janeiro | 🇧🇷 | Brazil | -22.91, -43.17 | 12,546,000 |
| Caracas | 🇻🇪 | Venezuela | 10.49, -66.88 | 2,900,000 |
| Washington D.C. | 🇺🇸 | the United States | 38.91, -77.04 | 7,636,000 |
| Boston | 🇺🇸 | the United States | 42.36, -71.06 | 7,375,000 |
| Chicago | 🇺🇸 | the United States | 41.88, -87.63 | 8,790,000 |
| São Paulo | 🇧🇷 | Brazil | -23.55, -46.63 | 21,747,000 |
| Quito | 🇪🇨 | Ecuador | -0.18, -78.47 | 2,000,000 |
| Panama City | 🇵🇦 | Panama | 8.98, -79.52 | 1,900,000 |
| Toronto | 🇨🇦 | Canada | 43.65, -79.38 | 6,400,000 |
| Philadelphia | 🇺🇸 | the United States | 39.95, -75.17 | 5,697,000 |
| Lima | 🇵🇪 | Peru | -12.05, -77.04 | 11,000,000 |
| Brasília | 🇧🇷 | Brazil | -15.79, -47.88 | 3,300,000 |
| Medellín | 🇨🇴 | Colombia | 6.24, -75.58 | 4,100,000 |
| Guatemala City | 🇬🇹 | Guatemala | 14.63, -90.51 | 3,000,000 |
| Monterrey | 🇲🇽 | Mexico | 25.69, -100.32 | 5,200,000 |
| Guadalajara | 🇲🇽 | Mexico | 20.67, -103.35 | 5,400,000 |
| Mexico City | 🇲🇽 | Mexico | 19.43, -99.13 | 23,146,802 |
| Miami | 🇺🇸 | the United States | 25.76, -80.19 | 6,129,000 |
| Los Angeles | 🇺🇸 | the United States | 34.05, -118.24 | 12,237,376 |
| San Francisco | 🇺🇸 | the United States | 37.77, -122.42 | 6,376,000 |
| Seattle | 🇺🇸 | the United States | 47.61, -122.33 | 3,800,000 |
| Bogotá | 🇨🇴 | Colombia | 4.71, -74.07 | 10,734,000 |
| La Paz | 🇧🇴 | Bolivia | -16.50, -68.15 | 1,900,000 |
| Cusco | 🇵🇪 | Peru | -13.53, -71.97 | 470,000 |
| Cartagena | 🇨🇴 | Colombia | 10.39, -75.51 | 1,100,000 |
| Kingston | 🇯🇲 | Jamaica | 17.97, -76.79 | 1,300,000 |
| Havana | 🇨🇺 | Cuba | 23.11, -82.37 | 2,100,000 |
| Atlanta | 🇺🇸 | the United States | 33.75, -84.39 | 5,495,000 |
| San Diego | 🇺🇸 | the United States | 32.72, -117.16 | 3,240,000 |
| Santiago | 🇨🇱 | Chile | -33.45, -70.66 | 7,192,000 |
| Valparaíso | 🇨🇱 | Chile | -33.05, -71.62 | 1,000,000 |
| Salvador | 🇧🇷 | Brazil | -12.97, -38.50 | 3,900,000 |
| Manaus | 🇧🇷 | Brazil | -3.12, -60.02 | 2,300,000 |
| Cancún | 🇲🇽 | Mexico | 21.16, -86.85 | 1,100,000 |
| San José | 🇨🇷 | Costa Rica | 9.93, -84.08 | 1,500,000 |
| San Juan | 🇵🇷 | Puerto Rico (USA) | 18.47, -66.11 | 2,500,000 |
| Ottawa | 🇨🇦 | Canada | 45.42, -75.70 | 1,500,000 |
| Montreal | 🇨🇦 | Canada | 45.50, -73.57 | 4,300,000 |
| Las Vegas | 🇺🇸 | the United States | 36.17, -115.14 | 3,200,000 |
| Dallas | 🇺🇸 | the United States | 32.78, -96.80 | 6,980,000 |
| Portland | 🇺🇸 | the United States | 45.52, -122.68 | 2,510,000 |
| Houston | 🇺🇸 | the United States | 29.76, -95.37 | 6,804,000 |

## The pink free-use districts (the love gods)

The pink hexes form a reserved, minimal, mirror-symmetric lattice. **Which god takes which hex is decided by compass**: each god faces their homeland, by bearing from Mondiala's centre — the same rule as the cities — so eastern gods sit with the eastern cities, African gods to the south, and the Norse and Baltic ones to the north. The gods re-shuffle whenever the centre moves, but always keep the reserved slots.

### The centre six (ring 2)

| Hex | God |
| --- | --- |
| 2 | Venus |
| 4 | Aphrodite |
| 6 | Eros |
| 8 | Ishtar |
| 10 | Kama |
| 12 | Freyja |

### The outer gods (rings 5, 7, 8)

| Ring | God | Homeland (lat, lon) |
| --- | --- | --- |
| 5 | Inanna | 31.32, 45.64 |
| 5 | Cupid | 41.90, 12.50 |
| 5 | Adonis | 34.12, 35.65 |
| 5 | Hathor | 26.14, 32.33 |
| 5 | Oshun | 7.90, 4.55 |
| 5 | Rati | 23.18, 75.78 |
| 5 | Astarte | 35.60, 35.77 |
| 5 | Sjöfn | 59.86, 17.64 |
| 5 | Prende | 42.06, 19.49 |
| 5 | Lada | 52.23, 21.01 |
| 5 | Qetesh | 34.73, 36.72 |
| 5 | Turan | 43.47, 11.03 |
| 7 | Nanaya | 32.13, 45.23 |
| 7 | Anahita | 32.65, 51.67 |
| 7 | Cybele | 39.32, 31.58 |
| 7 | Dionysus | 38.33, 23.32 |
| 7 | Himeros | 37.98, 23.73 |
| 7 | Peitho | 37.98, 23.73 |
| 7 | Bastet | 30.58, 31.51 |
| 7 | Bes | 26.14, 32.33 |
| 7 | Freyr | 59.86, 17.64 |
| 7 | Milda | 54.69, 25.28 |
| 7 | Zhiva | 52.52, 13.40 |
| 7 | Xochiquetzal | 19.43, -99.13 |
| 8 | Áine | 52.48, -8.61 |
| 8 | Parvati | 25.32, 83.01 |
| 8 | Yue Lao | 39.90, 116.41 |
| 8 | Mami Wata | 4.05, 9.70 |
| 8 | Tlazolteotl | 19.43, -99.13 |
| 8 | Erzulie Freda | 18.54, -72.34 |

Each of these rings has exactly as many reserved pink slots as gods (12 on ring 5, 12 on ring 7, 6 on ring 8), and the circular compass match decides who goes where.

## The green spokes

Ring 2's spokes are the famous ancient cities (Rome, Athens, Constantinople, Mesopotamia, Jerusalem, Homoia); ring 3's spokes belong to the Nordic capitals:

| Spoke city | Flag | Style |
| --- | --- | --- |
| Stockholm | 🇸🇪 | Nordic capital on water — Gamla Stan pastel facades, functionalist housing, arch… |
| København | 🇩🇰 | Copenhagen humanism — colourful Nyhavn, protected bike streets, quietly modern r… |
| Oslo | 🇳🇴 | Fjord city — the white marble opera roof you can walk on, Munch-museum curves, t… |
| Helsinki | 🇫🇮 | Sauna-and-design capital — granite churches, art nouveau towers, harbourside mar… |
| Reykjavík | 🇮🇸 | Volcanic minimalism — bright corrugated-iron houses, mossy lava fields at the ed… |
| Göteborg | 🇸🇪 | Docklands city — stone quays, trams, maritime grit softened by parks.… |

Ring 3's remaining hexes are filled by population, and everything from ring 4 outward is placed by compass bearing.
