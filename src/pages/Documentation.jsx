import { Link } from "react-router-dom";

const ACCENT = "#6366F1";

function Odjeljak({ broj, naslov, children }) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, #818CF8)` }}
        >
          {broj}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{naslov}</h2>
      </div>
      <div className="ml-14">{children}</div>
    </section>
  );
}

function OpisEkrana({ naslov, redovi }) {
  return (
    <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200">
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        <span className="text-xs text-gray-400 ml-2 font-mono">{naslov}</span>
      </div>
      <div className="bg-gray-50 divide-y divide-gray-100">
        {redovi.map(({ oznaka, opis, naglaseno, uvuceno }, i) => (
          <div key={i} className={`flex gap-3 px-5 py-3.5 ${uvuceno ? "pl-10" : ""}`}>
            <span
              className="text-[11px] font-bold uppercase tracking-wider shrink-0 w-44 pt-0.5"
              style={{ color: naglaseno ? "#6366F1" : "#9ca3af" }}
            >
              {oznaka}
            </span>
            <span className="text-sm text-gray-600 leading-relaxed">{opis}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Napomena({ children }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-200 mb-6">
      <span className="text-accent text-lg shrink-0">💡</span>
      <p className="text-gray-700 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function Upozorenje({ children }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 mb-6">
      <span className="text-yellow-400 text-lg shrink-0">⚠️</span>
      <p className="text-gray-700 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function Separator() {
  return <div className="border-t border-gray-200 my-12" />;
}

function TokKorak({ n, naslov, children }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, #818CF8)` }}
        >
          {n}
        </div>
        <div className="w-px flex-1 bg-gray-200 my-2" />
      </div>
      <div className="pb-8">
        <p className="text-gray-900 font-semibold mb-1.5">{naslov}</p>
        <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function Documentation() {
  const products = [
    { ime: "Men's T-Shirt", cijena: "$28", kat: "T-Shirts" },
    { ime: "Women's T-Shirt", cijena: "$28", kat: "T-Shirts" },
    { ime: "Men's Polo", cijena: "$38", kat: "Polos" },
    { ime: "Women's Polo", cijena: "$38", kat: "Polos" },
    { ime: "Men's Hoodie", cijena: "$52", kat: "Hoodies" },
    { ime: "Baseball Cap", cijena: "$24", kat: "Accessories" },
    { ime: "Tote Bag", cijena: "$22", kat: "Accessories" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #818CF8)` }}
          >
            📄
          </div>
          <div>
            <h1 className="font-bold text-base leading-none text-gray-900">Dokumentacija</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">my-icon.shop</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/howtouseadmin"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 border border-gray-300 hover:border-accent/50 hover:text-accent transition-all hidden sm:block"
          >
            Admin vodič →
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #818CF8)` }}
          >
            Otvori sajt →
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* HERO */}
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest mb-6">
            Prezentacija projekta
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight text-gray-900">
            my-icon.shop —<br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, #6366F1, #818CF8, #6366F1)` }}
            >
              kompletna dokumentacija
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Sve što trebate znati o ovom projektu: šta je sajt, kako radi, šta kupac može raditi i kako vi kao vlasnik upravljate svime.
          </p>
        </div>

        {/* DEMO BANNER */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-indigo-50 border border-indigo-200 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl" style={{ background: `linear-gradient(135deg, ${ACCENT}, #818CF8)` }}>🌐</div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 font-bold text-sm">Demo verzija sajta je trenutno dostupna na:</p>
            <a href="https://my-icon-shop.vercel.app" target="_blank" rel="noopener noreferrer" className="text-accent font-mono font-bold text-base hover:underline break-all">https://my-icon-shop.vercel.app</a>
          </div>
          <a href="https://my-icon-shop.vercel.app" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl text-sm font-bold text-white shrink-0" style={{ background: `linear-gradient(135deg, ${ACCENT}, #818CF8)` }}>Otvori →</a>
        </div>

        {/* SADRŽAJ */}
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 mb-14">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Sadržaj</h2>
          <ol className="space-y-2">
            {[
              ["1", "Šta je my-icon.shop"],
              ["2", "Stranice sajta i navigacija"],
              ["3", "Korisnički tok — od posjete do narudžbe"],
              ["4", "3D editor dizajna"],
              ["5", "Košarica i lista želja"],
              ["6", "Plaćanje i checkout"],
              ["7", "Višejezičnost"],
              ["8", "Admin panel — upravljanje"],
              ["9", "Tehnička osnova"],
              ["10", "Trenutno stanje i sljedeći koraci"],
            ].map(([n, label]) => (
              <li key={n} className="flex items-center gap-3 text-sm">
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #818CF8)` }}
                >
                  {n}
                </span>
                <span className="text-gray-600">{label}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* ─── 1 ─── */}
        <Odjeljak broj="1" naslov="Šta je my-icon.shop">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            <strong className="text-gray-900">my-icon.shop</strong> je moderna web platforma za prodaju prilagođene odjeće i dodataka. Kupci mogu pregledati proizvode, odabrati boju i veličinu, a zatim u ugrađenom 3D editoru postaviti vlastiti dizajn direktno na majicu, polo, duksericu ili kapu — i sve to naručiti odmah.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { ikona: "🛍️", naslov: "E-commerce", opis: "Potpuno funkcionalan shop s košaricom, listom želja i checkout procesom." },
              { ikona: "🎨", naslov: "3D editor", opis: "Kupci dizajniraju odjeću u realnom vremenu na 3D modelu — bez Photoshopa." },
              { ikona: "📦", naslov: "Upravljanje narudžbama", opis: "Vlasniku stižu sve narudžbe s podacima kupca i datotekama za štampu." },
            ].map(({ ikona, naslov, opis }) => (
              <div key={naslov} className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="text-3xl mb-3">{ikona}</div>
                <p className="text-gray-900 font-bold text-sm mb-1">{naslov}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{opis}</p>
              </div>
            ))}
          </div>

          <OpisEkrana
            naslov="my-icon.shop — Ključne informacije"
            redovi={[
              { oznaka: "Tip platforme", opis: "Print-on-demand e-commerce — prodajete odjeću s prilagođenim dizajnom kupca." },
              { oznaka: "Tehnologija", opis: "React 18, Vite, Tailwind CSS, Firebase Realtime Database." },
              { oznaka: "Hosting", opis: "Statički frontend — može se hostovati na Vercel, Netlify, Firebase Hosting ili bilo kojoj CDN platformi." },
              { oznaka: "Baza podataka", opis: "Firebase Realtime Database. Čuva: narudžbe, konfiguracije proizvoda, sadržaj sajta (tekstovi, ikone).", naglaseno: true },
              { oznaka: "Plaćanje", opis: "PayPal integracija. Trenutno u simulacijskom modu — svaki klik \"Plati\" simulira transakciju bez naplate.", naglaseno: true },
              { oznaka: "Jezici", opis: "Engleski (EN), Njemački (DE), Bosanski (BS). Browser kupca automatski bira jezik." },
              { oznaka: "Proizvodi", opis: "7 proizvoda: Men's & Women's T-Shirt, Men's & Women's Polo, Men's Hoodie, Baseball Cap, Tote Bag." },
              { oznaka: "Cijene", opis: "$22–$52 osnovna cijena + zona štampe (Front +$5, Back +$5, Sleeves +$3)." },
            ]}
          />

        </Odjeljak>

        <Separator />

        {/* ─── 2 ─── */}
        <Odjeljak broj="2" naslov="Stranice sajta i navigacija">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Sajt ima navigacijsku traku na vrhu (desktop) i hamburger meni na mobilnom. Svaka stranica je dostupna bez prijave — admin panel jedini zahtijeva lozinku.
          </p>

          <OpisEkrana
            naslov="Navigacijska traka (header)"
            redovi={[
              { oznaka: "Logo", opis: "\"my-icon.shop\" tekst, klik vraća na Home." },
              { oznaka: "Linkovi", opis: "Home, Shop, About, Contact — uvijek vidljivi u gornjoj traci na desktopu." },
              { oznaka: "Birač jezika", opis: "Zastave 🇬🇧 🇩🇪 🇧🇦 u gornjem desnom uglu za ručno prebacivanje jezika.", naglaseno: true },
              { oznaka: "Košarica", opis: "Ikona košarice s brojem artikala. Vodi na /cart.", naglaseno: true },
              { oznaka: "Lista želja", opis: "Ikona srca. Vodi na /wishlist." },
              { oznaka: "Mobilni meni", opis: "Hamburger ikona — otvara bočnu navigaciju s istim linkovima + jezici + cart + wishlist." },
            ]}
          />

          <div className="space-y-4 mb-6">
            {[
              { ruta: "/", naziv: "Home", opis: "Početna stranica. Hero sekcija s animiranim naslovom, statistike (narudžbe/recenzije/zadovoljstvo), kako funkcionira (3 koraka), featured proizvodi po kategoriji (MAN/WOMAN/OTHERS filteri), recenzije kupaca, trust indicators i CTA sekcija." },
              { ruta: "/shop", naziv: "Shop", opis: "Prikaz svih proizvoda. Filteri lijevo: spol (All/Men/Women/Others), kategorija (T-Shirts/Polos/Hoodies/Accessories), veličina, cijena. Sortiranje: Featured, Price Low-High, Price High-Low, Name. Svaka kartica ima dugme za wishlist (srce) i direktan link na editor." },
              { ruta: "/product/:id", naziv: "Product", opis: "Stranica jednog proizvoda. Slika lijevo, detalji desno: naziv, cijena, opis, picker boja (iz Firebase), picker veličina (zavisno od odabrane boje), količina, dugme Add to Cart, dugme Design It (vodi u editor), related products ispod." },
              { ruta: "/editor/:id?", naziv: "Editor", opis: "3D editor za dizajniranje. Detaljan opis u odjeljku 4." },
              { ruta: "/cart", naziv: "Cart", opis: "Lista odabranih artikala: slika, naziv, boja, veličina, quantity stepper, cijena, dugme za uklanjanje. Subtotal, Shipping (Free), Total. Dugme Proceed to Checkout i Continue Shopping." },
              { ruta: "/wishlist", naziv: "Wishlist", opis: "Sačuvani (omiljeni) proizvodi. Iste kartice kao u shopu. Dugme Remove i Add to Cart na svakoj." },
              { ruta: "/checkout", naziv: "Checkout", opis: "Forma za dostavu + PayPal plaćanje. Detaljan opis u odjeljku 6." },
              { ruta: "/about", naziv: "About", opis: "Stranica \"O nama\". Misija, vrijednosti (3 kartice), team/brand tekst. Sav sadržaj editabilan iz Content Editora." },
              { ruta: "/contact", naziv: "Contact", opis: "Kontakt stranica. Forma (ime, email, poruka) i kontakt informacije. Sav sadržaj editabilan." },
              { ruta: "/admin", naziv: "Admin", opis: "Admin panel. Pristup samo s lozinkom. Opisan u odjeljku 8." },
            ].map(({ ruta, naziv, opis }) => (
              <div key={ruta} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <code className="text-accent text-xs font-mono shrink-0 w-32 pt-0.5">{ruta}</code>
                <div>
                  <p className="text-gray-900 font-semibold text-sm mb-0.5">{naziv}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{opis}</p>
                </div>
              </div>
            ))}
          </div>

        </Odjeljak>

        <Separator />

        {/* ─── 3 ─── */}
        <Odjeljak broj="3" naslov="Korisnički tok — od posjete do narudžbe">

          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Tipični put kupca od dolaska na sajt do završene narudžbe:
          </p>

          <div>
            <TokKorak n="1" naslov="Posjeta Home ili Shop stranici">
              Kupac dolazi na sajt i vidi animiranu hero sekciju s prikazom proizvoda. Na Home stranici su featured proizvodi filtrirani po kategoriji (MAN/WOMAN/OTHERS). Kliknite karticu kategorije da vidite odgovarajuće proizvode. Svaka kartica ima naziv, cijenu, dostupne boje (u obliku kružića) i ikonu srca za wishlist.
            </TokKorak>

            <TokKorak n="2" naslov="Filtriranje u Shopu (po potrebi)">
              Kupac otvara /shop. Lijeva bočna traka sadrži filtere: spol, tip odjeće, veličina, raspon cijena. Desno se ažurira lista proizvoda u realnom vremenu. Sortiranje u gornjem desnom uglu (Featured, cijena rastuće/padajuće, abecedno).
            </TokKorak>

            <TokKorak n="3" naslov="Stranica proizvoda — odabir boje i veličine">
              Klik na proizvod vodi na /product/:id. Kupac odabire boju iz liste (boje dolaze iz Firebase — vi kao admin kontrolišete koje boje su dostupne). Ovisno o odabranoj boji, prikazuju se dostupne veličine (i ovo kontrolišete u Product Manageru). Kupac bira količinu.
            </TokKorak>

            <TokKorak n="4" naslov="Design It — ulaz u 3D editor">
              Dugme <strong className="text-gray-900">Design It</strong> na stranici proizvoda otvara /editor/:id. Kupac može dizajnirati majicu u 3D prostoru (detalji u odjeljku 4). Ovo je glavna unique prodajna tačka sajta.
            </TokKorak>

            <TokKorak n="5" naslov="Dodavanje u košaricu">
              Iz editora ili stranice proizvoda kupac klikne <strong className="text-gray-900">Add to Cart</strong>. Dizajn se automatski sprema zajedno s artiklom (boja, veličina, dizajn po zonama). Broj u ikoni košarice u navigaciji se ažurira.
            </TokKorak>

            <TokKorak n="6" naslov="Pregled košarice">
              /cart prikazuje sve artiklele. Kupac može promijeniti količinu ili ukloniti artikal. Vidljivo: cijena po artiklu, ukupno, dostava (besplatna). Dugme "Proceed to Checkout".
            </TokKorak>

            <TokKorak n="7" naslov="Checkout i plaćanje">
              Kupac popunjava formu: ime, email, telefon, adresa, grad, ZIP, država. Zatim klikne PayPal dugme. Pojavljuje se PayPal modal (simulirani). Unosi email i lozinku (simulirano), potvrđuje plaćanje. Nakon uspjeha: narudžba se sprema u Firebase s cijelim dizajnom, prikazuje se stranica potvrde s order ID-om.
            </TokKorak>

            <TokKorak n="8" naslov="Narudžba stiže u admin panel">
              Vi otvarate /admin → tab Orders. Nova narudžba se pojavljuje automatski. Vidite sve podatke kupca, 3D prikaz narudžbe, i print-ready PNG datoteke za svaku zonu štampe. Možete preuzeti datoteke i mijenjati status (Paid → Shipped itd.).
            </TokKorak>
          </div>

        </Odjeljak>

        <Separator />

        {/* ─── 4 ─── */}
        <Odjeljak broj="4" naslov="3D editor dizajna">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Editor je srce ovog projekta. Kupac može vidjeti majicu u 3D prikazu, odabrati zonu štampe, uploadovati sliku ili dodati tekst, i odmah vidjeti rezultat na modelu. Sve bez ikakvog softvera — direktno u browseru.
          </p>

          <OpisEkrana
            naslov="vasadomena.com/editor — Raspored ekrana"
            redovi={[
              { oznaka: "Lijevu panel", opis: "Sidebar s alatima: odabir zone (Front/Back/Sleeves), upload slike, dodavanje teksta, boja majice." },
              { oznaka: "Centar", opis: "3D viewer s modelom majice u odabranoj boji. Vrtite povlačenjem, zumirajte skrolom. Dizajn se prikazuje na modelu u realnom vremenu.", naglaseno: true },
              { oznaka: "Desni panel", opis: "Uređivanje odabranog elementa: skaliranje, rotacija, pozicioniranje, boja teksta, font, veličina fonta." },
              { oznaka: "Gornja traka", opis: "Naziv proizvoda, birač boje majice (kružići), košarica s brojem, dugme Add to Cart, dugme Checkout." },
            ]}
          />

          <OpisEkrana
            naslov="Editor — dostupni alati (lijevi panel)"
            redovi={[
              { oznaka: "Zona: Front", opis: "Prednja strana majice. Kliknite da uredite prednju zonu. Cijena: +$5.00 (po defaultu, editabilno).", naglaseno: true },
              { oznaka: "Zona: Back", opis: "Zadnja strana. Cijena: +$5.00.", naglaseno: true },
              { oznaka: "Zona: Sleeves", opis: "Rukavi. Cijena: +$3.00.", naglaseno: true },
              { oznaka: "Upload slike", opis: "Klik otvara file picker. Podržani formati: PNG, JPG, SVG, WebP. Slika se smješta na canvas zone i može se pomicati i skalirati." },
              { oznaka: "Dodaj tekst", opis: "Klik dodaje tekstualni blok na canvas. Dvostruki klik na tekst za uređivanje. U desnom panelu: font, veličina, boja, bold/italic." },
              { oznaka: "Boja majice", opis: "Kružići u boji — kliknite da promijenite boju majice. 3D model se automatski ažurira." },
              { oznaka: "Undo/Redo", opis: "Ctrl+Z / Ctrl+Y ili dugmad u traci iznad canvasa." },
              { oznaka: "Delete element", opis: "Odaberite element, pritisnite Delete/Backspace." },
            ]}
          />

          <Napomena>
            Svaka zona (Front, Back, Sleeves) je zaseban canvas. Kupac može imati različit dizajn na svakoj zoni. Svaka korištena zona se naplaćuje posebno i generiše zasebnu print-ready PNG datoteku.
          </Napomena>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            <strong className="text-gray-900">Šta su print-ready datoteke?</strong> Kada kupac završi dizajn i naruči, sistem automatski generira PNG slike u punoj rezoluciji za svaku korištenu zonu štampe (Front, Back, Sleeves). Te datoteke su vidljive u admin panelu pod narudžbom i mogu se preuzeti jednim klikom — direktno se šalju u štampu.
          </p>

        </Odjeljak>

        <Separator />

        {/* ─── 5 ─── */}
        <Odjeljak broj="5" naslov="Košarica i lista želja">

          <OpisEkrana
            naslov="Košarica (/cart)"
            redovi={[
              { oznaka: "Lista artikala", opis: "Svaki artikal: thumbnail slika (ili boja), naziv, odabrana boja, veličina, stepper za količinu (− i +), cijena.", naglaseno: true },
              { oznaka: "Uklanjanje", opis: "Ikona kante desno od artikla. Odmah uklanja bez potvrde." },
              { oznaka: "Subtotal", opis: "Automatski izračunava ukupno × količina za sve artiklele." },
              { oznaka: "Dostava", opis: "Prikazuje se kao Free Shipping." },
              { oznaka: "Checkout dugme", opis: "\"Proceed to Checkout\" — vodi na /checkout.", naglaseno: true },
              { oznaka: "Lokalno čuvanje", opis: "Košarica se čuva u localStorage — ostaje i nakon zatvaranja browsera, dok kupac ne obriše podatke browsera." },
            ]}
          />

          <OpisEkrana
            naslov="Lista želja (/wishlist)"
            redovi={[
              { oznaka: "Svrha", opis: "Kupac može zapamtiti proizvode koji mu se sviđaju, bez dodavanja u košaricu." },
              { oznaka: "Dodavanje", opis: "Klik na ikonu srca na bilo kojoj kartici proizvoda (shop, home, product stranica)." },
              { oznaka: "Uklanjanje", opis: "Drugi klik na srce uklanja. Ili dugme Remove na /wishlist stranici." },
              { oznaka: "Add to Cart", opis: "Dugme na svakoj wishlist kartici direktno dodaje u košaricu.", naglaseno: true },
              { oznaka: "Lokalno čuvanje", opis: "Lista želja se čuva u localStorage kao košarica." },
            ]}
          />

        </Odjeljak>

        <Separator />

        {/* ─── 6 ─── */}
        <Odjeljak broj="6" naslov="Plaćanje i checkout">

          <OpisEkrana
            naslov="Checkout forma (/checkout)"
            redovi={[
              { oznaka: "Polje: First Name", opis: "Ime kupca. Obavezno polje.", naglaseno: true },
              { oznaka: "Polje: Last Name", opis: "Prezime. Obavezno." },
              { oznaka: "Polje: Email", opis: "Email adresa — šalje se s narudžbom u Firebase. Obavezno." },
              { oznaka: "Polje: Phone", opis: "Broj telefona." },
              { oznaka: "Polje: Address", opis: "Ulica i broj." },
              { oznaka: "Polje: City / ZIP / Country", opis: "Grad, poštanski broj, zemlja." },
              { oznaka: "Order Summary", opis: "Desna strana: pregled artikala, ukupno + dostava." },
              { oznaka: "PayPal dugme", opis: "Plavi gradijent dugme s PayPal logom i iznosom. Klik otvara simulirani PayPal modal.", naglaseno: true },
            ]}
          />

          <OpisEkrana
            naslov="PayPal modal (simulirani tok)"
            redovi={[
              { oznaka: "Korak 1", opis: "Animacija \"Connecting to PayPal...\" s logom i loading spinerom. Traje ~2 sekunde." },
              { oznaka: "Korak 2", opis: "Login forma: email polje + lozinka polje + \"Confirm Payment\" dugme. Kupac unosi bilo šta — ovo je simulacija." },
              { oznaka: "Korak 3", opis: "Animacija \"Processing...\" ~2 sekunde." },
              { oznaka: "Korak 4", opis: "Uspjeh: narudžba se sprema u Firebase (orders/ node) s: Order ID (npr. MIS-ABC123-XYZ), podaci kupca, stavke, dizajni, statuso PENDING.", naglaseno: true },
              { oznaka: "Potvrda", opis: "Stranica potvrde prikazuje: Order ID, summary, animirane checkmark." },
            ]}
          />

          <Upozorenje>
            PayPal plaćanje je trenutno simulacija — nikakav novac se ne naplaćuje. Za aktivaciju pravog PayPal-a potrebno je dodati PayPal Client ID i prebaciti modal na pravu PayPal SDK integraciju. Kontaktirajte developera kada budete spremni.
          </Upozorenje>

          <Napomena>
            Svaka narudžba dobija jedinstveni ID formata <strong className="text-gray-900">MIS-[timestamp]-[random]</strong>, npr. MIS-L9K2M4-AB3C. Taj ID je vidljiv kupcu na potvrdi i vama u admin panelu.
          </Napomena>

        </Odjeljak>

        <Separator />

        {/* ─── 7 ─── */}
        <Odjeljak broj="7" naslov="Višejezičnost">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Sajt automatski detektuje jezik browsera kupca i prikazuje sadržaj na odgovarajućem jeziku. Podržana su tri jezika, a svi tekstovi su editabilni u admin panelu bez ikakvog koda.
          </p>

          <OpisEkrana
            naslov="Jezični sistem"
            redovi={[
              { oznaka: "EN — Engleski", opis: "Glavni/fallback jezik. Ako prijevod za drugi jezik nedostaje, prikazuje se engleska verzija.", naglaseno: true },
              { oznaka: "DE — Njemački", opis: "Automatski aktivan za posjetioce s njemačkim browserom." },
              { oznaka: "BS — Bosanski", opis: "Automatski aktivan za posjetioce s bosanskim/hrvatskim/srpskim browserom." },
              { oznaka: "Ručni odabir", opis: "Kupac može ručno kliknuti zastavu u navigaciji da promijeni jezik." },
              { oznaka: "Admin editor", opis: "U Content Editoru birač 🇬🇧 EN / 🇩🇪 DE / 🇧🇦 BS mijenja koji jezik uređujete. Svaki jezik se sprema zasebno.", naglaseno: true },
              { oznaka: "Firebase pohrana", opis: "Svi tekstovi se čuvaju u Firebase Realtime Database — promjene su trenutne bez rebuilda sajta." },
            ]}
          />

          <Napomena>
            Preporučuje se da uvijek popunite EN verziju — ona je fallback. Zatim prevedite na DE i BS.
          </Napomena>

        </Odjeljak>

        <Separator />

        {/* ─── 8 ─── */}
        <Odjeljak broj="8" naslov="Admin panel — upravljanje">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Admin panel je vaše kontrolno sučelje. Dostupan je na <code className="text-accent">/admin</code> i zaštićen lozinkom. Detaljni vodič za svaki tab je dostupan na <Link to="/howtouseadmin" className="text-accent hover:underline">/howtouseadmin</Link>.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                ikona: "📝",
                naziv: "Content Editor",
                stavke: [
                  "Svi tekstovi sajta",
                  "27 sekcija (Hero, About, FAQ...)",
                  "Ikone, slike, URL-ovi",
                  "Pretraga i filter",
                  "3 jezika (EN/DE/BS)",
                  "Live Preview na desktopu",
                ]
              },
              {
                ikona: "👕",
                naziv: "Product Manager",
                stavke: [
                  "7 proizvoda",
                  "Boje (dodaj/ukloni/enable)",
                  "Veličine po boji",
                  "Kategorije (MAN/WOMAN/OTHERS)",
                  "Cijene zona štampe",
                  "Save / Reset",
                ]
              },
              {
                ikona: "📦",
                naziv: "Orders",
                stavke: [
                  "Sve narudžbe u realnom vremenu",
                  "Statistika (Total/Paid/Shipped)",
                  "Pretraga i filter statusa",
                  "Podaci kupca",
                  "3D prikaz narudžbe",
                  "Download print datoteka",
                ]
              },
            ].map(({ ikona, naziv, stavke }) => (
              <div key={naziv} className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="text-2xl mb-2">{ikona}</div>
                <p className="text-gray-900 font-bold text-sm mb-3">{naziv}</p>
                <ul className="space-y-1.5">
                  {stavke.map(s => (
                    <li key={s} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="text-accent mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-accent/10 border border-accent/30 flex gap-4 items-start">
            <span className="text-2xl shrink-0">🔑</span>
            <div>
              <p className="text-gray-900 font-bold text-sm mb-1">Podaci za prijavu na admin panel</p>
              <div className="flex gap-6 mt-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Korisničko ime</p>
                  <code className="text-gray-900 font-black text-lg">myicon</code>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lozinka</p>
                  <code className="text-gray-900 font-black text-lg">2025</code>
                </div>
              </div>
            </div>
          </div>

        </Odjeljak>

        <Separator />

        {/* ─── 9 ─── */}
        <Odjeljak broj="9" naslov="Tehnička osnova">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Ovaj odjeljak je namijenjen razumijevanju infrastrukture sajta — šta koja tehnologija radi i šta to znači za vas kao vlasnika.
          </p>

          <OpisEkrana
            naslov="Tehnički stack"
            redovi={[
              { oznaka: "React 18", opis: "JavaScript framework za izgradnju korisničkog sučelja. Cijeli sajt je Single Page Application — stranice se mijenjaju bez punog reload-a browsera.", naglaseno: true },
              { oznaka: "Vite", opis: "Build alat. Kompajlira kod u optimizirane statičke datoteke (HTML/CSS/JS) za deploy na hosting." },
              { oznaka: "Tailwind CSS", opis: "CSS framework za dizajn. Sve stilove kontroliše tailwind.config.js." },
              { oznaka: "Firebase Realtime DB", opis: "Google cloud baza podataka. Čuva: narudžbe (/orders), konfiguracije proizvoda (/productConfigs), sadržaj sajta (/content). Radi u realnom vremenu — promjene u adminu vidljive su odmah na sajtu bez refresha.", naglaseno: true },
              { oznaka: "Three.js / WebGL", opis: "3D rendering engine koji pokreće editor. Renderuje 3D modele odjeće direktno u browseru." },
              { oznaka: "Fabric.js", opis: "Canvas library za crtanje i uređivanje dizajn elemenata (slike, tekst) unutar print zona." },
              { oznaka: "Framer Motion", opis: "Animacijska library — svi smooth prijelazi, fade-in efekti i animirani hero." },
              { oznaka: "localStorage", opis: "Pretraživačeva lokalna pohrana. Koristi se za: košaricu, listu želja, admin sesiju, editor stanje. Briše se s \"Clear browser data\"." },
              { oznaka: "PayPal SDK", opis: "Trenutno simulirani modal. Zamjena s pravim PayPal SDK-om zahtijeva Client ID i backend za verifikaciju plaćanja." },
            ]}
          />

          <OpisEkrana
            naslov="Struktura podataka u Firebase"
            redovi={[
              { oznaka: "orders/", opis: "Svaka narudžba na zasebnom ključu. Sadrži: orderId, customer (sve podatke), items (naziv, boja, veličina, cijena, dizajni), status, total, createdAt.", naglaseno: true },
              { oznaka: "productConfigs/", opis: "Konfiguracija svakog od 7 proizvoda: category, colors (niz s ime/hex/enabled), sizes po boji, printZonePrices (front/back/sleeves)." },
              { oznaka: "content/", opis: "Svi tekstovi sajta po jeziku (en/de/bs) — svaki ključ (hero_title, faq_q1 itd.) mapira na vrijednost." },
            ]}
          />

          <Napomena>
            Sve što vidite u admin panelu direktno mijenja Firebase. Ne postoji međusloj (backend server) — frontend komunicira direktno s Firebase-om. Ovo je sigurno za ove namjene jer su Firebase Security Rules konfigurisane da blokiraju neovlašteni pristup.
          </Napomena>

        </Odjeljak>

        <Separator />

        {/* ─── 10 ─── */}
        <Odjeljak broj="10" naslov="Trenutno stanje i sljedeći koraci">

          <div className="space-y-3 mb-8">
            {[
              { status: "✅", tekst: "Kompletan frontend sajt (Home, Shop, Product, About, Contact)" },
              { status: "✅", tekst: "3D editor dizajna s upload slike, tekst alatima i zone prikaz" },
              { status: "✅", tekst: "Košarica i lista želja (localStorage)" },
              { status: "✅", tekst: "Checkout forma" },
              { status: "✅", tekst: "Firebase integracija — narudžbe, konfiguracije, sadržaj" },
              { status: "✅", tekst: "Admin panel — Content Editor, Product Manager, Orders" },
              { status: "✅", tekst: "Višejezičnost EN/DE/BS" },
              { status: "✅", tekst: "Live Preview u adminu" },
              { status: "✅", tekst: "Print-ready PNG generisanje iz editorovog canvasa" },
              { status: "✅", tekst: "Responzivni dizajn (mobile + desktop)" },
              { status: "⚠️", tekst: "PayPal plaćanje — SIMULACIJA, nije aktivno naplaćivanje" },
              { status: "⚠️", tekst: "Email notifikacije kupcu — nisu implementirane" },
              { status: "⚠️", tekst: "Email notifikacije vlasniku pri novoj narudžbi — nisu implementirane" },
            ].map(({ status, tekst }) => (
              <div key={tekst} className={`flex items-start gap-3 p-3.5 rounded-xl border ${status === "✅" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}>
                <span className="text-base shrink-0">{status}</span>
                <span className={`text-sm ${status === "✅" ? "text-gray-600" : "text-yellow-700"}`}>{tekst}</span>
              </div>
            ))}
          </div>

          <Upozorenje>
            Prije lansiranja sajta u produkciju potrebno je aktivirati pravo PayPal plaćanje. To zahtijeva PayPal Business account, Client ID i kratku backend implementaciju za sigurnu verifikaciju transakcije. Kontaktirajte developera za detalje.
          </Upozorenje>

          <p className="text-gray-600 text-sm leading-relaxed">
            Sve ostale funkcionalnosti su potpuno operativne i spremne za korištenje. Možete odmah početi uređivati sadržaj u adminu, konfigurirati proizvode, i primati narudžbe (simulirane za testiranje).
          </p>

        </Odjeljak>

        <Separator />

        {/* PROIZVODI */}
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8 mb-14">
          <h2 className="text-xl font-bold mb-2">Katalog proizvoda</h2>
          <p className="text-gray-500 text-sm mb-6">7 proizvoda dostupnih u shopu s osnovnim cijenama</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { ime: "Men's T-Shirt", cijena: "$28", kat: "T-Shirts", boje: 5 },
              { ime: "Women's T-Shirt", cijena: "$28", kat: "T-Shirts", boje: 5 },
              { ime: "Men's Polo", cijena: "$38", kat: "Polos", boje: 4 },
              { ime: "Women's Polo", cijena: "$38", kat: "Polos", boje: 4 },
              { ime: "Men's Hoodie", cijena: "$52", kat: "Hoodies", boje: 5 },
              { ime: "Baseball Cap", cijena: "$24", kat: "Accessories", boje: 5 },
              { ime: "Tote Bag", cijena: "$22", kat: "Accessories", boje: 5 },
            ].map(({ ime, cijena, kat, boje }) => (
              <div key={ime} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-gray-900 font-bold text-sm">{ime}</p>
                <p className="text-accent font-black text-lg">{cijena}</p>
                <p className="text-gray-400 text-xs mt-1">{kat} · {boje} boja</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-4">
            + Zona štampe: Front +$5 · Back +$5 · Sleeves +$3 (editabilno u Product Manageru)
          </p>
        </div>

        {/* CTA */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <Link
            to="/"
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #818CF8)` }}
          >
            🛍️ Otvori sajt
          </Link>
          <Link
            to="/howtouseadmin"
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-gray-700 border border-gray-300 hover:border-accent/50 hover:text-accent transition-all"
          >
            🔧 Admin vodič
          </Link>
        </div>

        <p className="text-gray-400 text-xs text-center">
          Dokumentacija dostupna na <span className="text-accent font-mono">/documentation</span> · Admin vodič na <span className="text-accent font-mono">/howtouseadmin</span>
        </p>

      </div>
    </div>
  );
}


