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

function Korak({ slovo, naslov, children }) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-accent shrink-0 mt-0.5">
        {slovo}
      </div>
      <div>
        <p className="text-gray-900 font-semibold mb-1">{naslov}</p>
        <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
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
              className="text-[11px] font-bold uppercase tracking-wider shrink-0 w-40 pt-0.5"
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

function Separator() {
  return <div className="border-t border-gray-200 my-12" />;
}

export default function HowToUseAdmin() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #818CF8)` }}
          >
            ?
          </div>
          <div>
            <h1 className="font-bold text-base leading-none text-gray-900">Vodič za admina</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">my-icon.shop</p>
          </div>
        </div>
        <Link
          to="/admin"
          className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 border border-gray-300 hover:border-accent/50 hover:text-accent transition-all"
        >
          Otvori admin panel →
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* HERO */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-black mb-4 leading-tight text-gray-900">
            Kako koristiti<br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, #6366F1, #818CF8, #6366F1)` }}
            >
              admin panel
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Potpuni vodič za upravljanje tekstovima, bojama, kategorijama, cijenama i narudžbama — bez ikakvog tehničkog znanja.
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
              ["1", "Podaci za prijavu i otvaranje admin panela"],
              ["2", "Content Editor — uređivanje svih tekstova"],
              ["3", "Product Manager — boje, veličine, kategorije i cijene"],
              ["4", "Narudžbe — pregled, filtriranje i upravljanje"],
              ["5", "Live Preview — pregled promjena u realnom vremenu"],
              ["6", "Promjena jezika — bosanski / engleski / njemački"],
              ["7", "Snimanje promjena"],
              ["8", "Odjava"],
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
        <Odjeljak broj="1" naslov="Podaci za prijavu i otvaranje admin panela">

          <div className="rounded-2xl overflow-hidden border border-accent/40 mb-8">
            <div className="bg-accent/20 px-5 py-3 border-b border-accent/30">
              <p className="text-sm font-bold text-accent uppercase tracking-wider">🔑 Podaci za prijavu</p>
            </div>
            <div className="bg-gray-50 divide-y divide-gray-100">
              <div className="flex gap-4 px-5 py-4 items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 w-28 shrink-0">Korisničko ime</span>
                <code className="text-xl font-black text-gray-900 tracking-widest">myicon</code>
              </div>
              <div className="flex gap-4 px-5 py-4 items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 w-28 shrink-0">Lozinka</span>
                <code className="text-xl font-black text-gray-900 tracking-widest">2025</code>
              </div>
              <div className="flex gap-4 px-5 py-4 items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 w-28 shrink-0">Adresa</span>
                <a href="https://my-icon-shop.vercel.app/admin" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-accent hover:underline">my-icon-shop.vercel.app/admin</a>
              </div>
            </div>
          </div>

          <Korak slovo="1" naslov="Idite na admin adresu">
            Otvorite browser i u adresnu traku upišite:
            <div className="mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 font-mono text-accent text-sm">
              <a href="https://my-icon-shop.vercel.app/admin" target="_blank" rel="noopener noreferrer" className="hover:underline">https://my-icon-shop.vercel.app/admin</a>
            </div>
          </Korak>

          <Korak slovo="2" naslov="Forma za prijavu — šta vidite">
            Stranica je tamna, bez navigacije. U sredini ekrana nalazi se kartica za prijavu:
          </Korak>

          <OpisEkrana
            naslov="my-icon-shop.vercel.app/admin — Ekran za prijavu"
            redovi={[
              { oznaka: "Logo", opis: "Tekst \"my-icon.shop\" bijelo. Ispod: sivi natpis \"Admin Panel\"." },
              { oznaka: "Polje korisnika", opis: "Oznaka \"Username\". Kliknite unutra i upišite: myicon", naglaseno: true },
              { oznaka: "Polje lozinke", opis: "Oznaka \"Password\". Tekst se prikazuje kao tačkice. Upišite: 2025", naglaseno: true },
              { oznaka: "Greška", opis: "Ako upišete pogrešne podatke, pojavi se crveni okvir: \"Invalid username or password\"." },
              { oznaka: "Dugme Sign In", opis: "Ljubičasto dugme. Kliknite ga nakon unosa podataka. Ako su tačni, odmah ulazite na dashboard.", naglaseno: true },
            ]}
          />

          <Upozorenje>
            Ne dijelite lozinku ni s kim. Ako mislite da je kompromitovana, kontaktirajte developera.
          </Upozorenje>
        </Odjeljak>

        <Separator />

        {/* ─── 2 ─── */}
        <Odjeljak broj="2" naslov="Content Editor — uređivanje svih tekstova">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Ovdje mijenjate sve vidljive tekstove na sajtu: naslove, opise, dugmad, recenzije, navigaciju, FAQ — sve bez koda. Promjene se odmah objavljuju na sajtu.
          </p>

          <OpisEkrana
            naslov="Admin dashboard — tab Content Editor"
            redovi={[
              { oznaka: "Gornja traka", opis: "Lijevo: logo \"my-icon.shop\". Desno: birač jezika (🇬🇧 EN, 🇩🇪 DE, 🇧🇦 BS) i dugme Logout." },
              { oznaka: "Tab traka", opis: "Tri taba: Content Editor, Product Manager, Orders. Aktivni tab ima ljubičastu liniju ispod. Content Editor je uvijek aktivan po defaultu pri prijavi." },
              { oznaka: "Traka za pretragu", opis: "Upišite bilo koju riječ iz teksta koji tražite — lista polja se odmah filtrira.", naglaseno: true },
              { oznaka: "Filter sekcija", opis: "Red dugmadi: All, Hero Section, Stats, How It Works, Step 1/2/3, Features, Feature 1-4, Categories, Category Tabs, Featured, Testimonials, Testimonial 1-3, Trust Indicators, Call to Action, View All Button, About Page, Mission, Values, Value 1-3, Contact Page, FAQ, Social Media, Navigation, Shop Page, Product, Editor. Kliknite jedno da vidite samo polja iz te sekcije.", naglaseno: true },
              { oznaka: "Lista polja", opis: "Svako polje ima: naziv ključa u ljubičastoj monospace (npr. hero_title), narančastu tačkicu ● ako ima nesnimljenih izmjena, oznaku (Icon) ili (Image/Video URL) za specijalna polja, i tekstualno polje s trenutnim sadržajem." },
              { oznaka: "Dugme Snimanje", opis: "Sjaji ljubičasto kada ima nesnimljenih izmjena. Sivo kada je sve snimljeno.", naglaseno: true },
              { oznaka: "Desna strana (desktop)", opis: "Na ekranima širim od 1024px pojavljuje se Live Preview — živi prikaz sajta. Opisano u odjeljku 5." },
            ]}
          />

          <Korak slovo="1" naslov="Kako promijeniti tekst">
            <ol className="mt-1 space-y-1 list-decimal list-inside text-gray-500">
              <li>Kliknite filter dugme za odgovarajuću sekciju ili pretražite tekst u traci za pretragu.</li>
              <li>Pronađite polje koje želite, kliknite unutar okvira i upišite novi tekst.</li>
              <li>Kliknite ljubičasto dugme <strong className="text-gray-900">Save Changes</strong>.</li>
            </ol>
          </Korak>

          <Korak slovo="2" naslov="Posebna polja — ikone i slike">
            <ul className="mt-1 space-y-2 list-disc list-inside text-gray-500">
              <li><strong className="text-gray-900">(Icon)</strong> — Polje za ikonu. Pored unosa nalazi se dugme <strong className="text-gray-900">Browse Icons</strong> koje otvara pretraživač hiljada ikona. Kliknite ikonu da je odaberete. Ispod se prikazuje pregled odabrane ikone.</li>
              <li><strong className="text-gray-900">(Image/Video URL)</strong> — Zalijepite URL adresu slike ili videa.</li>
            </ul>
          </Korak>

          <Korak slovo="3" naslov="Odbacivanje izmjena">
            Ako želite poništiti sve nesnimljene izmjene, postoji opcija <strong className="text-gray-900">Discard</strong> — tražit će potvrdu prije brisanja.
          </Korak>

          <Korak slovo="4" naslov="Reset na fabričke postavke">
            Dugme <strong className="text-gray-900">Reset to Defaults</strong> na dnu panela vraća sve tekstove u svim jezicima na originalne. Ova radnja se ne može poništiti.
          </Korak>

          <Upozorenje>
            Ne zatvarajte browser tab prije nego kliknete Save Changes — nesnimljene izmjene bit će izgubljene.
          </Upozorenje>
        </Odjeljak>

        <Separator />

        {/* ─── 3 ─── */}
        <Odjeljak broj="3" naslov="Product Manager — boje, veličine, kategorije i cijene">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Ovdje upravljate konfiguracionim opcijama svakog proizvoda: koje boje postoje, koje veličine su dostupne za svaku boju, kojoj kategoriji proizvod pripada, i koliko košta svaka zona štampe.
          </p>

          <OpisEkrana
            naslov="Admin dashboard — tab Product Manager"
            redovi={[
              { oznaka: "Izbor proizvoda", opis: "Padajući meni na vrhu: Men's T-Shirt, Women's T-Shirt, Men's Polo, Women's Polo, Men's Hoodie, Baseball Cap, Tote Bag. Odabirom se učitava konfiguracija tog proizvoda ispod." },
              { oznaka: "Kategorija", opis: "Prva sekcija ispod menija. Naslov \"Product Category\" i dugme \"+ Add Category\" desno. Ispod: 2-kolonska mreža kartica kategorija. Trenutno odabrana kategorija ima ljubičastu ivicu i natpis \"Selected\".", naglaseno: true },
              { oznaka: "Dodaj kategoriju", opis: "Klik na \"+  Add Category\" otvara formu: polje za naziv (npr. Kids, Accessories) i dugme \"Add Category\". Prilagođene kategorije imaju crveni × za brisanje." },
              { oznaka: "Boje proizvoda", opis: "Sekcija \"Product Colors\" s dugmetom \"+ Add Color\" desno. Lista redova boja: kvadratni uzorak boje, naziv boje, hex kod, dugme Enabled/Disabled i crveni × za brisanje. Klik na red otvara upravljanje veličinama.", naglaseno: true },
              { oznaka: "Dodaj boju", opis: "Klik na \"+ Add Color\" otvara formu: polje za naziv, birač boje (kolo) i hex unos. Dugme \"Add Color\" je onemogućeno dok ne upišete naziv." },
              { oznaka: "Veličine za boju", opis: "Pojavljuje se ispod liste boja kada kliknete red boje. Mreža 6 dugmadi: XS, S, M, L, XL, XXL. Ljubičasto = dostupno. Sivo = nedostupno. Kliknite da uključite/isključite.", naglaseno: true },
              { oznaka: "Cijene zona", opis: "Sekcija \"Print Zone Prices\". Tri polja: Front ($5.00), Back ($5.00), Sleeves ($3.00). Ovo je dodatni iznos u USD koji se dodaje na osnovnu cijenu proizvoda kada kupac štampa u toj zoni.", naglaseno: true },
              { oznaka: "Pregled konfiguracije", opis: "Kartica na dnu: ukupan broj boja, broj aktivnih boja, cijene po zonama." },
              { oznaka: "Save Changes", opis: "Ljubičasto dugme s \"💾 Save Changes\" kada ima izmjena. Sivo s \"✓ All Changes Saved\" kada je sve snimljeno.", naglaseno: true },
              { oznaka: "Reset to Defaults", opis: "Crveno dugme ispod Save. Vraća konfiguraciju odabranog proizvoda na fabričke postavke." },
            ]}
          />

          <Korak slovo="1" naslov="Kako dodati ili ukloniti boju">
            <ol className="mt-1 space-y-1 list-decimal list-inside text-gray-500">
              <li>Odaberite proizvod iz padajućeg menija.</li>
              <li>Kliknite <strong className="text-gray-900">+ Add Color</strong>, upišite naziv (npr. "Tamno zelena"), odaberite boju, kliknite <strong className="text-gray-900">Add Color</strong>.</li>
              <li>Za brisanje: crveni × na desnoj strani reda boje.</li>
              <li>Za privremeno sakrivanje (bez brisanja): kliknite dugme <strong className="text-gray-900">Enabled</strong> — mijenja se u <strong className="text-gray-900">Disabled</strong>.</li>
              <li>Kliknite <strong className="text-gray-900">Save Changes</strong>.</li>
            </ol>
          </Korak>

          <Korak slovo="2" naslov="Kako postaviti dostupne veličine za boju">
            <ol className="mt-1 space-y-1 list-decimal list-inside text-gray-500">
              <li>Kliknite red željene boje — red se ističe i ispod se pojavljuje mreža veličina.</li>
              <li>Kliknite svaku veličinu da je uključite (ljubičasto) ili isključite (sivo).</li>
              <li>Kliknite <strong className="text-gray-900">Save Changes</strong>.</li>
            </ol>
          </Korak>

          <Korak slovo="3" naslov="Kako promijeniti kategoriju proizvoda">
            <ol className="mt-1 space-y-1 list-decimal list-inside text-gray-500">
              <li>Odaberite proizvod. Skrolujte do sekcije <strong className="text-gray-900">Product Category</strong>.</li>
              <li>Kliknite karticu kategorije (MAN, WOMAN, OTHERS ili prilagođena).</li>
              <li>Kliknite <strong className="text-gray-900">Save Changes</strong>.</li>
            </ol>
          </Korak>

          <Korak slovo="4" naslov="Kako promijeniti cijenu zone štampe">
            <ol className="mt-1 space-y-1 list-decimal list-inside text-gray-500">
              <li>Odaberite proizvod. Skrolujte do sekcije <strong className="text-gray-900">Print Zone Prices</strong>.</li>
              <li>Kliknite u broj za Front, Back ili Sleeves i upišite novu cijenu u USD.</li>
              <li>Kliknite <strong className="text-gray-900">Save Changes</strong>.</li>
            </ol>
          </Korak>

        </Odjeljak>

        <Separator />

        {/* ─── 4 ─── */}
        <Odjeljak broj="4" naslov="Narudžbe — pregled, filtriranje i upravljanje">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Tab <strong className="text-gray-900">Orders</strong> prikazuje sve narudžbe s vašeg shopa. Panel zauzima punu širinu ekrana. Ažurira se automatski iz Firebase baze — nema potrebe za osvježavanjem stranice.
          </p>

          <OpisEkrana
            naslov="Admin dashboard — tab Orders"
            redovi={[
              { oznaka: "Upozorenje", opis: "Žuti baner na vrhu: \"Payment Simulation Active — PayPal integracija još nije aktivna. Sva plaćanja su simulirana test transakcije.\"" },
              { oznaka: "Statistika", opis: "Četiri broja u redu: Total Orders (bijelo), Paid (zeleno), Shipped (plavo), Revenue u USD (ljubičasto). Ažuriraju se u realnom vremenu.", naglaseno: true },
              { oznaka: "Pretraga", opis: "Polje za pretragu po imenu kupca, emailu ili ID narudžbe." },
              { oznaka: "Filter statusa", opis: "Dugmad: All, Paid, Pending, Shipped, Cancelled. Svako prikazuje broj narudžbi u zagradi. Aktivni filter ima ljubičastu pozadinu.", naglaseno: true },
              { oznaka: "Lista narudžbi", opis: "Skrolabilna lista redova, najnovija narudžba na vrhu. Ako nema narudžbi: ikona torbe i tekst \"No orders found.\"" },
            ]}
          />

          <Korak slovo="1" naslov="Šta vidite u sklopljenom redu narudžbe">
            <OpisEkrana
              naslov="Jedan red narudžbe — sklopljeno"
              redovi={[
                { oznaka: "Order ID", opis: "Jedinstveni broj u ljubičastoj monospace (npr. ORD-1716001234). Pored njega: status bedž — zeleno PAID, žuto PENDING, plavo SHIPPED, crveno CANCELLED.", naglaseno: true },
                { oznaka: "Kupac", opis: "Ime kupca bijelo, email sivo ispod." },
                { oznaka: "Ukupno", opis: "Iznos narudžbe desno (npr. $34.99). Ispod: datum i vrijeme." },
                { oznaka: "Strelica", opis: "Mala strelica desno. Kliknite bilo gdje na red da ga raširite." },
              ]}
            />
          </Korak>

          <Korak slovo="2" naslov="Prošireni red — svi detalji">
            <OpisEkrana
              naslov="Jedan red narudžbe — prošireno"
              redovi={[
                { oznaka: "CUSTOMER", opis: "7 polja samo za čitanje: Name, Email, Phone, Address, City, ZIP, Country." },
                { oznaka: "ITEMS", opis: "Jedna kartica po naručenom artiklu.", naglaseno: true },
                { oznaka: "— Zaglavlje stavke", opis: "Krug boje + naziv proizvoda + veličina + količina + ukupna cijena stavke.", uvuceno: true },
                { oznaka: "— 3D prikaz", opis: "Živi 3D model majice u boji kupca s otisnutim dizajnom. Možete vrtjeti povlačenjem i zumirati skrolom. Ako postoji dizajn, na hoveru se pojavljuje ⤢ dugme za fullscreen.", uvuceno: true, naglaseno: true },
                { oznaka: "— Datoteke štampe", opis: "Jedna kartica po korištenoj zoni (FRONT/BACK/SLEEVES): isječena slika artworka, oznaka zone i ljubičasto dugme Download za preuzimanje PNG datoteke.", uvuceno: true, naglaseno: true },
                { oznaka: "UPDATE STATUS", opis: "Četiri rounded dugmeta desno: PAID (zeleno), PENDING (žuto), SHIPPED (plavo), CANCELLED (crveno). Trenutni status je popunjen. Kliknite drugi status da odmah promjenite — snima se automatski, bez Save dugmeta.", naglaseno: true },
              ]}
            />
          </Korak>

          <Korak slovo="3" naslov="Fullscreen prikaz otiska">
            Kliknite ⤢ ikonu u 3D vieweru (pojavljuje se na hoveru). Otvara se modal koji pokriva cijeli ekran:
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-500">
              <li>Lijeva strana: veliki 3D viewer — vrtite i zumirajte slobodno.</li>
              <li>Desna strana: kartice za svaku zonu s isječenim artworkom i Download dugmetom za preuzimanje print-ready PNG datoteke.</li>
              <li>Zatvoriti: tipka ESC, × dugme u gornjem desnom uglu, ili klik na tamnu pozadinu.</li>
            </ul>
          </Korak>

          <Upozorenje>
            PayPal integracija je trenutno u simulacijskom modu — stvarna plaćanja se ne obrađuju. Kontaktirajte developera kada budete spremni za produkciju.
          </Upozorenje>

        </Odjeljak>

        <Separator />

        {/* ─── 5 ─── */}
        <Odjeljak broj="5" naslov="Live Preview — pregled promjena u realnom vremenu">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Na ekranima širim od 1024px (laptop, desktop), desna polovina dashboarda prikazuje živi prikaz vašeg sajta. Svaka izmjena teksta u Content Editoru odmah se vidi u previewu — još dok tipkate, prije snimanja.
          </p>

          <Napomena>
            Live Preview je vidljiv samo na desktopu. Na mobilnom uređaju preview se skriva, ali sve izmjene i dalje rade normalno.
          </Napomena>

          <OpisEkrana
            naslov="Desni panel — Live Preview (samo desktop)"
            redovi={[
              { oznaka: "Birač stranica", opis: "Četiri dugmeta: Home, Shop, About, Contact. Aktivno ima ljubičastu pozadinu. Kliknite da pregledate drugu stranicu.", naglaseno: true },
              { oznaka: "Prikaz sajta", opis: "Živi render vaše web stranice — fontovi, slike, pravi tekstovi. Možete skrolovati unutar previewa.", naglaseno: true },
              { oznaka: "Hover istaknutost", opis: "Kada prijeđete mišem preko teksta u previewu, pojavljuje se ljubičasta ivica oko bloka teksta." },
              { oznaka: "Klik za uređivanje", opis: "Kliknite istaknuti tekst u previewu — Content Editor panel lijevo automatski skroluje do tog polja i ističe ga ljubičasto 2 sekunde. Najbrži način za pronalaženje polja.", naglaseno: true },
              { oznaka: "Automatsko ažuriranje", opis: "Dok tipkate u nekom polju, tekst u previewu se mijenja u realnom vremenu." },
            ]}
          />

          <Korak slovo="1" naslov="Najbrži način za uređivanje teksta">
            <ol className="mt-1 space-y-1 list-decimal list-inside text-gray-500">
              <li>Budite na tabu Content Editor.</li>
              <li>Pogledajte Live Preview desno i nađite tekst koji želite promijeniti.</li>
              <li>Pređite mišem — pojavljuje se ljubičasta ivica.</li>
              <li>Kliknite — panel lijevo skroluje do tog polja.</li>
              <li>Upišite novi tekst, kliknite Save Changes.</li>
            </ol>
          </Korak>

        </Odjeljak>

        <Separator />

        {/* ─── 6 ─── */}
        <Odjeljak broj="6" naslov="Promjena jezika — bosanski / engleski / njemački">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Vaš sajt podržava tri jezika. Posjetilac automatski vidi jezik koji odgovara podešavanjima njegovog browsera. Svaki jezik se uređuje zasebno u Content Editoru.
          </p>

          <OpisEkrana
            naslov="Birač jezika — gornji desni ugao (samo Content Editor tab)"
            redovi={[
              { oznaka: "Lokacija", opis: "Gornji desni ugao header trake, lijevo od dugmeta Logout. Vidljivo samo u Content Editor tabu." },
              { oznaka: "Izgled", opis: "Tri mala dugmeta u grupici: 🇬🇧 EN, 🇩🇪 DE, 🇧🇦 BS. Aktivni jezik ima ljubičastu pozadinu." },
              { oznaka: "EN — Engleski", opis: "Osnovni jezik. Ako prijevod za DE ili BS nedostaje, sajt automatski prikazuje englesku verziju.", naglaseno: true },
              { oznaka: "DE — Njemački", opis: "Za posjetioce s njemačkim browserom." },
              { oznaka: "BS — Bosanski", opis: "Za posjetioce s bosanskim browserom.", naglaseno: true },
            ]}
          />

          <Korak slovo="1" naslov="Kako urediti tekst za određeni jezik">
            <ol className="mt-1 space-y-1 list-decimal list-inside text-gray-500">
              <li>Budite na tabu Content Editor.</li>
              <li>Kliknite zastavu željenog jezika (🇧🇦 BS za bosanski).</li>
              <li>Podnaslov panela mijenja se u "Edit text content for Bosanski".</li>
              <li>Uredite polja i kliknite Save Changes. Snima samo odabrani jezik.</li>
              <li>Ponovite za svaki drugi jezik koji želite ažurirati.</li>
            </ol>
          </Korak>

          <Napomena>
            Uvijek prvo popunite engleski (EN) — to je osnovni jezik od kojeg se čita fallback ako prijevod nedostaje.
          </Napomena>

        </Odjeljak>

        <Separator />

        {/* ─── 7 ─── */}
        <Odjeljak broj="7" naslov="Snimanje promjena">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Izmjene u Content Editoru i Product Manageru se <strong className="text-gray-900">ne snimaju automatski</strong>. Uvijek kliknite Save dugme.
          </p>

          <OpisEkrana
            naslov="Save / Discard / Reset dugmad"
            redovi={[
              { oznaka: "Save — aktivan", opis: "Sjaji ljubičasto s gradijentom. Natpis: \"💾 Save Changes\". Ispod: \"You have unsaved changes\".", naglaseno: true },
              { oznaka: "Save — snimljeno", opis: "Sivo, nedostupno. Natpis: \"✓ All Changes Saved\"." },
              { oznaka: "Discard", opis: "Odbacuje sve nesnimljene izmjene od zadnjeg snimanja. Traži potvrdu u browseru." },
              { oznaka: "Reset to Defaults", opis: "Crvena ivica. U Content Editoru: briše sve tekstove svih jezika i vraća na original. U Product Manageru: vraća konfiguraciju odabranog proizvoda na fabričko. Traži potvrdu. Nemoguće poništiti." },
              { oznaka: "Orders — bez Save", opis: "Promjena statusa narudžbe se snima odmah. Nema Save dugmeta u Orders tabu." },
            ]}
          />

          <Upozorenje>
            Ako prebacite tab (npr. s Content Editora na Product Manager) bez snimanja, nesnimljene izmjene se gube. Uvijek snimite prije prebacivanja.
          </Upozorenje>

          <Upozorenje>
            Ne zatvarajte tab browsera prije snimanja — izmjene će biti izgubljene.
          </Upozorenje>

        </Odjeljak>

        <Separator />

        {/* ─── 8 ─── */}
        <Odjeljak broj="8" naslov="Odjava">

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Kada završite rad u admin panelu, uvijek se odjavite — posebno ako koristite dijeljeni ili javni računar.
          </p>

          <OpisEkrana
            naslov="Dugme Logout — gornji desni ugao"
            redovi={[
              { oznaka: "Lokacija", opis: "Gornji desni ugao header trake, uvijek vidljivo bez obzira na aktivni tab." },
              { oznaka: "Izgled", opis: "Dugme s tankom sivom ivicom i tekstom \"Logout\". Ivica i tekst postaju crveni na hoveru." },
              { oznaka: "Akcija", opis: "Kliknite ga — sesija se odmah briše i vraćate se na ekran za prijavu. Trebate ponovo unijeti korisničko ime i lozinku.", naglaseno: true },
            ]}
          />

          <Korak slovo="1" naslov="Uvijek snimite prije odjave">
            Provjerite da dugme Save kaže "✓ All Changes Saved" (sivo) prije odjave. Ako i dalje sjaji ljubičasto, kliknite Save Changes, pa tek onda Logout.
          </Korak>

          <Napomena>
            Ako zatvorite tab bez odjave, sesija ostaje aktivna na tom uređaju dok browser ne resetuje lokalnu pohranu. Na dijeljenim uređajima uvijek se ručno odjavite.
          </Napomena>

        </Odjeljak>

        <Separator />

        {/* BRZI PREGLED */}
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8 mb-14">
          <h2 className="text-xl font-bold mb-6 text-center text-gray-900">Brzi pregled</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["🌐", "Admin adresa", "my-icon-shop.vercel.app/admin"],
              ["👤", "Korisnik / Lozinka", "myicon / 2025"],
              ["📝", "Promjena teksta", "Content Editor → nađi polje → uredi → Save Changes"],
              ["🔍", "Brzo pronađi tekst", "Content Editor → klikni tekst u Live Previewu (desktop)"],
              ["🎨", "Dodaj boju", "Product Manager → odaberi proizvod → + Add Color"],
              ["📏", "Uključi/isključi veličinu", "Product Manager → klikni red boje → toggle veličine → Save"],
              ["🗂️", "Promjena kategorije", "Product Manager → klikni karticu kategorije → Save"],
              ["💰", "Cijena zone štampe", "Product Manager → Print Zone Prices → promijeni → Save"],
              ["📦", "Označi kao poslano", "Orders → proširi narudžbu → klikni SHIPPED"],
              ["🖼️", "Preuzmi datoteku za štampu", "Orders → proširi narudžbu → Download dugme na zoni"],
              ["🌍", "Uredi bosanski tekst", "Content Editor → klikni 🇧🇦 BS → uredi → Save"],
              ["🔒", "Odjava", "Gornji desni ugao → dugme Logout"],
            ].map(([ikona, akcija, opis]) => (
              <div key={akcija} className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-2xl shrink-0">{ikona}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{akcija}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #818CF8)` }}
          >
            Otvori Admin Panel
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-gray-400 text-sm mt-4">
            Ovaj vodič dostupan je uvijek na{" "}
            <span className="text-accent font-mono">/howtouseadmin</span>
          </p>
        </div>

      </div>
    </div>
  );
}


