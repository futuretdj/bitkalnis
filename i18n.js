// Bitkalnis: interface strings (EN / LT)
export const L = (document.documentElement.lang || 'en').toLowerCase().startsWith('lt') ? 'lt' : 'en';
const NF = new Intl.NumberFormat(L === 'lt' ? 'lt-LT' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2, minimumFractionDigits: 0 });
export const eur = n => NF.format(Math.round(n * 100) / 100);
export const DL = L === 'lt' ? 'lt-LT' : 'en-GB';
const S = {
  en: {
    add: 'Add', added: 'Added to bag', bottle: 'bottle', abv: '{a}% · {v}', sweet: 'Sweetness', notes: 'Notes', pair: 'With',
    t_mead: 'Still mead', t_spark: 'Sparkling', t_cider: 'Cider', t_honey: 'Honey', new: 'New', limited: 'Limited',
    like_white: 'Start with Kadagys, then the sparkling Putojantis.', like_beer: 'The honey cider and the dry Kadagys are your door in.', like_dessert: 'Liepžiedis, served cold, then Grikių for after dinner.', like_whisky: 'The three-year oak reserve. Sip it like a single malt.',
    bag_empty: 'The bag is empty. The bees are working on it.', ship_free: 'Free delivery in Lithuania unlocked.', ship_left: '{n} more for free delivery in Lithuania', ship_eu: 'EU delivery €9.90 · 4–6 days',
    age_need: 'Please confirm you are 20 or older.', checkout_note: 'Concept site: payment (Stripe / Montonio) connects here. Nothing was charged.', box: 'Gift box', remove: 'Remove',
    e1: 'Hill flight', e1d: 'Six meads, rye bread, smoked cheese and comb honey at the long table.', e1m: '75 min · €26 per guest',
    e2: 'Cellar & barrels', e2d: 'Walk through the press room and down to the 11 °C cellar, a sample straight from the barrel, then the full flight.', e2m: '2 h · €42 per guest',
    e3: 'Beekeeper morning', e3d: 'Suit up, open a hive with our beekeeper, eat honey from the comb. Families welcome, from age 8.', e3m: '2 h · €48 · May–Sep',
    wd: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], seats: '{n} seats', full: 'full', pick_slot: 'Pick a time.', pick_date: 'Pick a date first.',
    sum: '{g} guests{d} · {e} · {when}', drv: ', {n} driving', err_slot: 'Choose a date and a time.', err_name: 'Please add your name.', err_mail: 'Please check the email address.', err_seats: 'Only {n} seats left at that time.',
    tk_note: 'A confirmation would go to {m}. Free cancellation up to 24 h before.', closed: 'Closed today', open_now: 'Open now · until {t}', opens: 'Opens {d} at {t}', today: 'today', tomorrow: 'tomorrow',
    g_pick: '({n} of {m})', g_need: 'Pick {m} bottles for this case.', g_burn: 'Burning the lid needs the pine crate.', g_added: 'Gift box added', card: 'Card', crate: 'Pine crate', kraft: 'Kraft box',
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  lt: {
    add: 'Į krepšelį', added: 'Įdėta į krepšelį', bottle: 'butelis', abv: '{a} % · {v}', sweet: 'Saldumas', notes: 'Skonis', pair: 'Tinka su',
    t_mead: 'Midus', t_spark: 'Putojantis', t_cider: 'Sidras', t_honey: 'Medus', new: 'Naujiena', limited: 'Ribotas',
    like_white: 'Pradėkite nuo „Kadagio“, tada putojantis.', like_beer: 'Medaus sidras ir sausas „Kadagys“ – jūsų pradžia.', like_dessert: '„Liepžiedis“ atšaldytas, o po vakarienės – „Grikių“.', like_whisky: 'Trejų metų ąžuolo rezervas. Gurkšnokite kaip viskį.',
    bag_empty: 'Krepšelis tuščias. Bitės dirba.', ship_free: 'Nemokamas pristatymas Lietuvoje.', ship_left: 'Iki nemokamo pristatymo Lietuvoje trūksta {n}', ship_eu: 'Pristatymas į ES 9,90 € · 4–6 d.',
    age_need: 'Patvirtinkite, kad jums jau 20 metų.', checkout_note: 'Koncepcinė svetainė: čia jungiamas mokėjimas (Stripe / Montonio). Pinigai nenuskaičiuoti.', box: 'Dovanų dėžutė', remove: 'Pašalinti',
    e1: 'Kalvos degustacija', e1d: 'Šeši midūs, ruginė duona, rūkytas sūris ir korinis medus prie ilgo stalo.', e1m: '75 min · 26 € asmeniui',
    e2: 'Rūsys ir statinės', e2d: 'Spaudykla, nusileidimas į 11 °C rūsį, gurkšnis tiesiai iš statinės ir visa degustacija.', e2m: '2 val. · 42 € asmeniui',
    e3: 'Rytas su bitininku', e3d: 'Apsirengiate kostiumą, kartu su bitininku atidarote avilį ir ragaujate medų iš korio. Šeimoms, vaikams nuo 8 m.', e3m: '2 val. · 48 € · gegužė–rugsėjis',
    wd: ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk'], seats: '{n} vietos', full: 'užimta', pick_slot: 'Pasirinkite laiką.', pick_date: 'Pirmiausia pasirinkite datą.',
    sum: 'Svečių: {g}{d} · {e} · {when}', drv: ', vairuoja {n}', err_slot: 'Pasirinkite datą ir laiką.', err_name: 'Įrašykite vardą.', err_mail: 'Patikrinkite el. paštą.', err_seats: 'Tuo metu liko tik {n} vietos.',
    tk_note: 'Patvirtinimas būtų išsiųstas adresu {m}. Atšaukti nemokamai galima iki 24 val.', closed: 'Šiandien uždaryta', open_now: 'Atidaryta · iki {t}', opens: 'Atsidarys {d} {t}', today: 'šiandien', tomorrow: 'rytoj',
    g_pick: '({n} iš {m})', g_need: 'Šiai dėžutei pasirinkite {m} butelius.', g_burn: 'Išdeginti vardą galima tik ant pušinės dėžės.', g_added: 'Dovanų dėžutė įdėta', card: 'Atvirukas', crate: 'Pušinė dėžė', kraft: 'Kartoninė dėžutė',
    days: ['sekmadienį', 'pirmadienį', 'antradienį', 'trečiadienį', 'ketvirtadienį', 'penktadienį', 'šeštadienį']
  }
};
export const t = (k, v = {}) => { let s = (S[L][k] ?? S.en[k] ?? k); if (typeof s === 'string') for (const [a, b] of Object.entries(v)) s = s.replaceAll(`{${a}}`, b); return s; };
