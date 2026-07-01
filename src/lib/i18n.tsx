import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/* ============================================================
   TYPHON i18n — 25+ languages
   Supported: EN + 20 European + Chinese, Korean, Japanese, Filipino, Hindi
============================================================ */

export type LangCode =
  | "en" | "es" | "fr" | "de" | "it" | "pt" | "nl" | "pl" | "ru" | "uk"
  | "tr" | "el" | "cs" | "sv" | "no" | "da" | "fi" | "hu" | "ro" | "bg"
  | "hr" | "sk" | "zh" | "ko" | "ja" | "fil" | "hi";

export type Lang = {
  code: LangCode;
  name: string;      // native
  english: string;   // english name
  flag: string;
  currency: string;
  region: string;
};

export const LANGUAGES: Lang[] = [
  { code: "en",  name: "English",     english: "English",       flag: "🇺🇸", currency: "USD", region: "Global" },
  { code: "es",  name: "Español",     english: "Spanish",       flag: "🇪🇸", currency: "EUR", region: "Europe" },
  { code: "fr",  name: "Français",    english: "French",        flag: "🇫🇷", currency: "EUR", region: "Europe" },
  { code: "de",  name: "Deutsch",     english: "German",        flag: "🇩🇪", currency: "EUR", region: "Europe" },
  { code: "it",  name: "Italiano",    english: "Italian",       flag: "🇮🇹", currency: "EUR", region: "Europe" },
  { code: "pt",  name: "Português",   english: "Portuguese",    flag: "🇵🇹", currency: "EUR", region: "Europe" },
  { code: "nl",  name: "Nederlands",  english: "Dutch",         flag: "🇳🇱", currency: "EUR", region: "Europe" },
  { code: "pl",  name: "Polski",      english: "Polish",        flag: "🇵🇱", currency: "PLN", region: "Europe" },
  { code: "ru",  name: "Русский",     english: "Russian",       flag: "🇷🇺", currency: "RUB", region: "Europe" },
  { code: "uk",  name: "Українська",  english: "Ukrainian",     flag: "🇺🇦", currency: "UAH", region: "Europe" },
  { code: "tr",  name: "Türkçe",      english: "Turkish",       flag: "🇹🇷", currency: "TRY", region: "Europe" },
  { code: "el",  name: "Ελληνικά",    english: "Greek",         flag: "🇬🇷", currency: "EUR", region: "Europe" },
  { code: "cs",  name: "Čeština",     english: "Czech",         flag: "🇨🇿", currency: "CZK", region: "Europe" },
  { code: "sv",  name: "Svenska",     english: "Swedish",       flag: "🇸🇪", currency: "SEK", region: "Europe" },
  { code: "no",  name: "Norsk",       english: "Norwegian",     flag: "🇳🇴", currency: "NOK", region: "Europe" },
  { code: "da",  name: "Dansk",       english: "Danish",        flag: "🇩🇰", currency: "DKK", region: "Europe" },
  { code: "fi",  name: "Suomi",       english: "Finnish",       flag: "🇫🇮", currency: "EUR", region: "Europe" },
  { code: "hu",  name: "Magyar",      english: "Hungarian",     flag: "🇭🇺", currency: "HUF", region: "Europe" },
  { code: "ro",  name: "Română",      english: "Romanian",      flag: "🇷🇴", currency: "RON", region: "Europe" },
  { code: "bg",  name: "Български",   english: "Bulgarian",     flag: "🇧🇬", currency: "BGN", region: "Europe" },
  { code: "hr",  name: "Hrvatski",    english: "Croatian",      flag: "🇭🇷", currency: "EUR", region: "Europe" },
  { code: "sk",  name: "Slovenčina",  english: "Slovak",        flag: "🇸🇰", currency: "EUR", region: "Europe" },
  { code: "zh",  name: "中文",         english: "Chinese",       flag: "🇨🇳", currency: "CNY", region: "Asia" },
  { code: "ko",  name: "한국어",        english: "Korean",        flag: "🇰🇷", currency: "KRW", region: "Asia" },
  { code: "ja",  name: "日本語",        english: "Japanese",      flag: "🇯🇵", currency: "JPY", region: "Asia" },
  { code: "fil", name: "Filipino",    english: "Filipino",      flag: "🇵🇭", currency: "PHP", region: "Asia" },
  { code: "hi",  name: "हिन्दी",         english: "Hindi",         flag: "🇮🇳", currency: "INR", region: "Asia" },
];

/* Core UI strings translated across all languages. Unknown keys fall back to English. */
type Dict = Record<string, string>;
const T: Record<LangCode, Dict> = {
  en: {
    home: "Home", shop: "Shop", ai: "AI", orders: "Orders", account: "Account",
    search: "Search machines, brands, parts", cart: "Cart", wishlist: "Wishlist",
    addToCart: "Add to cart", buyNow: "Buy now", checkout: "Checkout", quote: "Request Quote",
    settings: "Settings", language: "Language", region: "Region", currency: "Currency",
    profile: "Profile", signOut: "Log out", welcome: "Welcome",
    aiHello: "Hi — I'm your TYPHON equipment expert. Ask me about specs, shipping, financing, or 'find me a mini excavator under $40k'.",
    typeMessage: "Ask TYPHON AI…",
    categories: "Categories", featured: "Featured", flashDeals: "Flash Deals", recommended: "Recommended for you",
    save: "Save", cancel: "Cancel", edit: "Edit", delete: "Delete", loading: "Loading…",
  },
  es: { home: "Inicio", shop: "Tienda", ai: "IA", orders: "Pedidos", account: "Cuenta", search: "Buscar máquinas, marcas, piezas", cart: "Carrito", wishlist: "Favoritos", addToCart: "Añadir al carrito", buyNow: "Comprar ya", checkout: "Pagar", quote: "Solicitar cotización", settings: "Ajustes", language: "Idioma", region: "Región", currency: "Moneda", profile: "Perfil", signOut: "Cerrar sesión", welcome: "Bienvenido", aiHello: "Hola — soy tu experto TYPHON. Pregúntame por specs, envío, financiación o 'encuéntrame una miniexcavadora bajo $40k'.", typeMessage: "Pregúntale a TYPHON IA…", categories: "Categorías", featured: "Destacados", flashDeals: "Ofertas Flash", recommended: "Recomendado para ti", save: "Guardar", cancel: "Cancelar", edit: "Editar", delete: "Eliminar", loading: "Cargando…" },
  fr: { home: "Accueil", shop: "Boutique", ai: "IA", orders: "Commandes", account: "Compte", search: "Rechercher machines, marques, pièces", cart: "Panier", wishlist: "Favoris", addToCart: "Ajouter au panier", buyNow: "Acheter", checkout: "Paiement", quote: "Demander un devis", settings: "Paramètres", language: "Langue", region: "Région", currency: "Devise", profile: "Profil", signOut: "Déconnexion", welcome: "Bienvenue", aiHello: "Bonjour — je suis votre expert TYPHON. Demandez-moi les specs, la livraison, le financement, ou 'trouve-moi une mini-pelle sous 40k$'.", typeMessage: "Demander à TYPHON IA…", categories: "Catégories", featured: "En vedette", flashDeals: "Offres Flash", recommended: "Recommandé pour vous", save: "Enregistrer", cancel: "Annuler", edit: "Modifier", delete: "Supprimer", loading: "Chargement…" },
  de: { home: "Start", shop: "Shop", ai: "KI", orders: "Bestellungen", account: "Konto", search: "Maschinen, Marken, Teile suchen", cart: "Warenkorb", wishlist: "Merkliste", addToCart: "In den Warenkorb", buyNow: "Jetzt kaufen", checkout: "Kasse", quote: "Angebot anfordern", settings: "Einstellungen", language: "Sprache", region: "Region", currency: "Währung", profile: "Profil", signOut: "Abmelden", welcome: "Willkommen", aiHello: "Hallo — ich bin Ihr TYPHON Experte. Fragen Sie mich zu Specs, Versand, Finanzierung oder 'zeig mir einen Minibagger unter 40k$'.", typeMessage: "TYPHON KI fragen…", categories: "Kategorien", featured: "Empfohlen", flashDeals: "Flash-Angebote", recommended: "Für Sie empfohlen", save: "Speichern", cancel: "Abbrechen", edit: "Bearbeiten", delete: "Löschen", loading: "Lädt…" },
  it: { home: "Home", shop: "Negozio", ai: "IA", orders: "Ordini", account: "Account", search: "Cerca macchine, marchi, ricambi", cart: "Carrello", wishlist: "Preferiti", addToCart: "Aggiungi al carrello", buyNow: "Compra ora", checkout: "Checkout", quote: "Richiedi preventivo", settings: "Impostazioni", language: "Lingua", region: "Regione", currency: "Valuta", profile: "Profilo", signOut: "Esci", welcome: "Benvenuto", aiHello: "Ciao — sono il tuo esperto TYPHON. Chiedimi di specs, spedizione, finanziamento o 'trovami un miniescavatore sotto 40k$'.", typeMessage: "Chiedi a TYPHON IA…", categories: "Categorie", featured: "In evidenza", flashDeals: "Offerte Flash", recommended: "Consigliati per te", save: "Salva", cancel: "Annulla", edit: "Modifica", delete: "Elimina", loading: "Caricamento…" },
  pt: { home: "Início", shop: "Loja", ai: "IA", orders: "Pedidos", account: "Conta", search: "Buscar máquinas, marcas, peças", cart: "Carrinho", wishlist: "Favoritos", addToCart: "Adicionar ao carrinho", buyNow: "Comprar agora", checkout: "Finalizar", quote: "Solicitar orçamento", settings: "Configurações", language: "Idioma", region: "Região", currency: "Moeda", profile: "Perfil", signOut: "Sair", welcome: "Bem-vindo", aiHello: "Olá — sou seu especialista TYPHON. Pergunte-me sobre specs, envio, financiamento ou 'encontre uma miniescavadeira abaixo de $40k'.", typeMessage: "Perguntar à TYPHON IA…", categories: "Categorias", featured: "Destaques", flashDeals: "Ofertas Flash", recommended: "Recomendado para você", save: "Salvar", cancel: "Cancelar", edit: "Editar", delete: "Excluir", loading: "Carregando…" },
  nl: { home: "Home", shop: "Winkel", ai: "AI", orders: "Bestellingen", account: "Account", search: "Zoek machines, merken, onderdelen", cart: "Winkelwagen", wishlist: "Verlanglijst", addToCart: "In winkelwagen", buyNow: "Nu kopen", checkout: "Afrekenen", quote: "Offerte aanvragen", settings: "Instellingen", language: "Taal", region: "Regio", currency: "Valuta", profile: "Profiel", signOut: "Uitloggen", welcome: "Welkom", aiHello: "Hoi — ik ben je TYPHON expert. Vraag me over specs, verzending, financiering of 'vind een minigraver onder $40k'.", typeMessage: "Vraag TYPHON AI…", categories: "Categorieën", featured: "Uitgelicht", flashDeals: "Flash Deals", recommended: "Aanbevolen voor jou", save: "Opslaan", cancel: "Annuleren", edit: "Bewerken", delete: "Verwijderen", loading: "Laden…" },
  pl: { home: "Start", shop: "Sklep", ai: "AI", orders: "Zamówienia", account: "Konto", search: "Szukaj maszyn, marek, części", cart: "Koszyk", wishlist: "Lista życzeń", addToCart: "Do koszyka", buyNow: "Kup teraz", checkout: "Do kasy", quote: "Zapytaj o cenę", settings: "Ustawienia", language: "Język", region: "Region", currency: "Waluta", profile: "Profil", signOut: "Wyloguj", welcome: "Witaj", aiHello: "Cześć — jestem twoim ekspertem TYPHON. Zapytaj o specyfikacje, wysyłkę, finansowanie lub 'znajdź minikoparkę poniżej 40k$'.", typeMessage: "Zapytaj TYPHON AI…", categories: "Kategorie", featured: "Polecane", flashDeals: "Oferty błyskawiczne", recommended: "Polecane dla Ciebie", save: "Zapisz", cancel: "Anuluj", edit: "Edytuj", delete: "Usuń", loading: "Ładowanie…" },
  ru: { home: "Главная", shop: "Магазин", ai: "ИИ", orders: "Заказы", account: "Аккаунт", search: "Поиск техники, брендов, запчастей", cart: "Корзина", wishlist: "Избранное", addToCart: "В корзину", buyNow: "Купить", checkout: "Оформить", quote: "Запросить цену", settings: "Настройки", language: "Язык", region: "Регион", currency: "Валюта", profile: "Профиль", signOut: "Выйти", welcome: "Добро пожаловать", aiHello: "Привет — я эксперт TYPHON. Спросите о характеристиках, доставке, финансировании или 'найди мини-экскаватор до $40k'.", typeMessage: "Спросить TYPHON ИИ…", categories: "Категории", featured: "Рекомендуем", flashDeals: "Флеш-скидки", recommended: "Для вас", save: "Сохранить", cancel: "Отмена", edit: "Изменить", delete: "Удалить", loading: "Загрузка…" },
  uk: { home: "Головна", shop: "Магазин", ai: "ШІ", orders: "Замовлення", account: "Акаунт", search: "Пошук техніки, брендів, запчастин", cart: "Кошик", wishlist: "Обране", addToCart: "У кошик", buyNow: "Купити", checkout: "Оформити", quote: "Запит ціни", settings: "Налаштування", language: "Мова", region: "Регіон", currency: "Валюта", profile: "Профіль", signOut: "Вийти", welcome: "Ласкаво просимо", aiHello: "Привіт — я експерт TYPHON. Питайте про характеристики, доставку, фінансування або 'знайди міні-екскаватор до $40k'.", typeMessage: "Спитати TYPHON ШІ…", categories: "Категорії", featured: "Рекомендовані", flashDeals: "Флеш-акції", recommended: "Для вас", save: "Зберегти", cancel: "Скасувати", edit: "Змінити", delete: "Видалити", loading: "Завантаження…" },
  tr: { home: "Ana Sayfa", shop: "Mağaza", ai: "AI", orders: "Siparişler", account: "Hesap", search: "Makine, marka, parça ara", cart: "Sepet", wishlist: "Favoriler", addToCart: "Sepete ekle", buyNow: "Şimdi al", checkout: "Ödeme", quote: "Teklif iste", settings: "Ayarlar", language: "Dil", region: "Bölge", currency: "Para birimi", profile: "Profil", signOut: "Çıkış", welcome: "Hoş geldiniz", aiHello: "Merhaba — TYPHON uzmanınızım. Özellikler, kargo, finansman sorun ya da '$40k altı mini ekskavatör bul' deyin.", typeMessage: "TYPHON AI'ya sor…", categories: "Kategoriler", featured: "Öne çıkanlar", flashDeals: "Flaş fırsatlar", recommended: "Size özel", save: "Kaydet", cancel: "İptal", edit: "Düzenle", delete: "Sil", loading: "Yükleniyor…" },
  el: { home: "Αρχική", shop: "Κατάστημα", ai: "AI", orders: "Παραγγελίες", account: "Λογαριασμός", search: "Αναζήτηση μηχανημάτων", cart: "Καλάθι", wishlist: "Αγαπημένα", addToCart: "Στο καλάθι", buyNow: "Αγορά τώρα", checkout: "Ολοκλήρωση", quote: "Ζητήστε προσφορά", settings: "Ρυθμίσεις", language: "Γλώσσα", region: "Περιοχή", currency: "Νόμισμα", profile: "Προφίλ", signOut: "Αποσύνδεση", welcome: "Καλωσήρθατε", aiHello: "Γεια — είμαι ο TYPHON ειδικός. Ρωτήστε για specs, αποστολή, χρηματοδότηση.", typeMessage: "Ρωτήστε το TYPHON AI…", categories: "Κατηγορίες", featured: "Επιλεγμένα", flashDeals: "Flash προσφορές", recommended: "Για εσάς", save: "Αποθήκευση", cancel: "Ακύρωση", edit: "Επεξεργασία", delete: "Διαγραφή", loading: "Φόρτωση…" },
  cs: { home: "Domů", shop: "Obchod", ai: "AI", orders: "Objednávky", account: "Účet", search: "Hledat stroje, značky, díly", cart: "Košík", wishlist: "Oblíbené", addToCart: "Do košíku", buyNow: "Koupit", checkout: "Pokladna", quote: "Žádost o cenu", settings: "Nastavení", language: "Jazyk", region: "Region", currency: "Měna", profile: "Profil", signOut: "Odhlásit", welcome: "Vítejte", aiHello: "Ahoj — jsem tvůj TYPHON expert. Ptej se na specs, dopravu, financování.", typeMessage: "Zeptej se TYPHON AI…", categories: "Kategorie", featured: "Doporučené", flashDeals: "Flash slevy", recommended: "Pro tebe", save: "Uložit", cancel: "Zrušit", edit: "Upravit", delete: "Smazat", loading: "Načítání…" },
  sv: { home: "Hem", shop: "Butik", ai: "AI", orders: "Beställningar", account: "Konto", search: "Sök maskiner, märken, delar", cart: "Kundvagn", wishlist: "Önskelista", addToCart: "Lägg i varukorg", buyNow: "Köp nu", checkout: "Kassa", quote: "Begär offert", settings: "Inställningar", language: "Språk", region: "Region", currency: "Valuta", profile: "Profil", signOut: "Logga ut", welcome: "Välkommen", aiHello: "Hej — jag är din TYPHON expert. Fråga om specs, frakt, finansiering.", typeMessage: "Fråga TYPHON AI…", categories: "Kategorier", featured: "Utvalda", flashDeals: "Blixterbjudanden", recommended: "Rekommenderat", save: "Spara", cancel: "Avbryt", edit: "Redigera", delete: "Ta bort", loading: "Läser in…" },
  no: { home: "Hjem", shop: "Butikk", ai: "AI", orders: "Bestillinger", account: "Konto", search: "Søk maskiner, merker, deler", cart: "Handlekurv", wishlist: "Ønskeliste", addToCart: "Legg i kurv", buyNow: "Kjøp nå", checkout: "Kasse", quote: "Be om tilbud", settings: "Innstillinger", language: "Språk", region: "Region", currency: "Valuta", profile: "Profil", signOut: "Logg ut", welcome: "Velkommen", aiHello: "Hei — jeg er din TYPHON ekspert. Spør om specs, frakt, finansiering.", typeMessage: "Spør TYPHON AI…", categories: "Kategorier", featured: "Utvalgt", flashDeals: "Lyntilbud", recommended: "Anbefalt", save: "Lagre", cancel: "Avbryt", edit: "Rediger", delete: "Slett", loading: "Laster…" },
  da: { home: "Hjem", shop: "Butik", ai: "AI", orders: "Ordrer", account: "Konto", search: "Søg maskiner, mærker, dele", cart: "Kurv", wishlist: "Ønskeliste", addToCart: "Læg i kurv", buyNow: "Køb nu", checkout: "Kasse", quote: "Bed om tilbud", settings: "Indstillinger", language: "Sprog", region: "Region", currency: "Valuta", profile: "Profil", signOut: "Log ud", welcome: "Velkommen", aiHello: "Hej — jeg er din TYPHON ekspert.", typeMessage: "Spørg TYPHON AI…", categories: "Kategorier", featured: "Fremhævet", flashDeals: "Lyn-tilbud", recommended: "Anbefalet", save: "Gem", cancel: "Annuller", edit: "Rediger", delete: "Slet", loading: "Indlæser…" },
  fi: { home: "Etusivu", shop: "Kauppa", ai: "Tekoäly", orders: "Tilaukset", account: "Tili", search: "Etsi koneita, merkkejä, osia", cart: "Ostoskori", wishlist: "Toivelista", addToCart: "Lisää koriin", buyNow: "Osta nyt", checkout: "Kassalle", quote: "Pyydä tarjous", settings: "Asetukset", language: "Kieli", region: "Alue", currency: "Valuutta", profile: "Profiili", signOut: "Kirjaudu ulos", welcome: "Tervetuloa", aiHello: "Hei — olen TYPHON asiantuntijasi.", typeMessage: "Kysy TYPHON AI:lta…", categories: "Kategoriat", featured: "Suositellut", flashDeals: "Salamatarjoukset", recommended: "Sinulle", save: "Tallenna", cancel: "Peruuta", edit: "Muokkaa", delete: "Poista", loading: "Ladataan…" },
  hu: { home: "Kezdőlap", shop: "Bolt", ai: "MI", orders: "Rendelések", account: "Fiók", search: "Gépek, márkák keresése", cart: "Kosár", wishlist: "Kedvencek", addToCart: "Kosárba", buyNow: "Vásárlás", checkout: "Fizetés", quote: "Árajánlat", settings: "Beállítások", language: "Nyelv", region: "Régió", currency: "Pénznem", profile: "Profil", signOut: "Kijelentkezés", welcome: "Üdvözöljük", aiHello: "Szia — én vagyok a TYPHON szakértőd.", typeMessage: "Kérdezd a TYPHON MI-t…", categories: "Kategóriák", featured: "Kiemelt", flashDeals: "Villámakciók", recommended: "Neked ajánlott", save: "Mentés", cancel: "Mégse", edit: "Szerkesztés", delete: "Törlés", loading: "Betöltés…" },
  ro: { home: "Acasă", shop: "Magazin", ai: "IA", orders: "Comenzi", account: "Cont", search: "Caută utilaje, mărci, piese", cart: "Coș", wishlist: "Favorite", addToCart: "În coș", buyNow: "Cumpără", checkout: "Finalizare", quote: "Cere ofertă", settings: "Setări", language: "Limbă", region: "Regiune", currency: "Monedă", profile: "Profil", signOut: "Deconectare", welcome: "Bine ai venit", aiHello: "Bună — sunt expertul tău TYPHON.", typeMessage: "Întreabă TYPHON IA…", categories: "Categorii", featured: "Recomandate", flashDeals: "Oferte flash", recommended: "Pentru tine", save: "Salvează", cancel: "Anulează", edit: "Editează", delete: "Șterge", loading: "Se încarcă…" },
  bg: { home: "Начало", shop: "Магазин", ai: "ИИ", orders: "Поръчки", account: "Профил", search: "Търси машини, марки, части", cart: "Количка", wishlist: "Желани", addToCart: "В количката", buyNow: "Купи сега", checkout: "Плащане", quote: "Поискай оферта", settings: "Настройки", language: "Език", region: "Регион", currency: "Валута", profile: "Профил", signOut: "Изход", welcome: "Добре дошли", aiHello: "Здравей — аз съм твоят TYPHON експерт.", typeMessage: "Питай TYPHON ИИ…", categories: "Категории", featured: "Препоръчани", flashDeals: "Флаш оферти", recommended: "За теб", save: "Запази", cancel: "Отказ", edit: "Редактирай", delete: "Изтрий", loading: "Зареждане…" },
  hr: { home: "Početna", shop: "Trgovina", ai: "AI", orders: "Narudžbe", account: "Račun", search: "Traži strojeve, marke, dijelove", cart: "Košarica", wishlist: "Popis želja", addToCart: "U košaricu", buyNow: "Kupi odmah", checkout: "Naplata", quote: "Zatraži ponudu", settings: "Postavke", language: "Jezik", region: "Regija", currency: "Valuta", profile: "Profil", signOut: "Odjava", welcome: "Dobrodošli", aiHello: "Bok — ja sam tvoj TYPHON stručnjak.", typeMessage: "Pitaj TYPHON AI…", categories: "Kategorije", featured: "Izdvojeno", flashDeals: "Brze ponude", recommended: "Za tebe", save: "Spremi", cancel: "Odustani", edit: "Uredi", delete: "Obriši", loading: "Učitavanje…" },
  sk: { home: "Domov", shop: "Obchod", ai: "AI", orders: "Objednávky", account: "Účet", search: "Hľadať stroje, značky, diely", cart: "Košík", wishlist: "Obľúbené", addToCart: "Do košíka", buyNow: "Kúpiť", checkout: "Pokladňa", quote: "Žiadať cenu", settings: "Nastavenia", language: "Jazyk", region: "Región", currency: "Mena", profile: "Profil", signOut: "Odhlásiť", welcome: "Vitajte", aiHello: "Ahoj — som tvoj TYPHON expert.", typeMessage: "Opýtať sa TYPHON AI…", categories: "Kategórie", featured: "Odporúčané", flashDeals: "Blesk zľavy", recommended: "Pre teba", save: "Uložiť", cancel: "Zrušiť", edit: "Upraviť", delete: "Odstrániť", loading: "Načítava…" },
  zh: { home: "首页", shop: "商城", ai: "AI", orders: "订单", account: "账户", search: "搜索机械、品牌、配件", cart: "购物车", wishlist: "心愿单", addToCart: "加入购物车", buyNow: "立即购买", checkout: "结算", quote: "询价", settings: "设置", language: "语言", region: "地区", currency: "货币", profile: "个人资料", signOut: "退出", welcome: "欢迎", aiHello: "你好 — 我是您的 TYPHON 设备专家。可以问我参数、运输、融资，或「帮我找一台4万美元以下的小型挖掘机」。", typeMessage: "向 TYPHON AI 提问…", categories: "分类", featured: "精选", flashDeals: "闪购", recommended: "为您推荐", save: "保存", cancel: "取消", edit: "编辑", delete: "删除", loading: "加载中…" },
  ko: { home: "홈", shop: "쇼핑", ai: "AI", orders: "주문", account: "계정", search: "기계, 브랜드, 부품 검색", cart: "장바구니", wishlist: "위시리스트", addToCart: "장바구니 담기", buyNow: "바로 구매", checkout: "결제", quote: "견적 요청", settings: "설정", language: "언어", region: "지역", currency: "통화", profile: "프로필", signOut: "로그아웃", welcome: "환영합니다", aiHello: "안녕하세요 — TYPHON 장비 전문가입니다. 사양, 배송, 금융, 또는 '4만 달러 이하 미니 굴착기 찾아줘'라고 물어보세요.", typeMessage: "TYPHON AI에게 물어보기…", categories: "카테고리", featured: "추천", flashDeals: "특가", recommended: "맞춤 추천", save: "저장", cancel: "취소", edit: "편집", delete: "삭제", loading: "로딩 중…" },
  ja: { home: "ホーム", shop: "ショップ", ai: "AI", orders: "注文", account: "アカウント", search: "機械、ブランド、部品を検索", cart: "カート", wishlist: "お気に入り", addToCart: "カートに追加", buyNow: "今すぐ購入", checkout: "支払い", quote: "見積依頼", settings: "設定", language: "言語", region: "地域", currency: "通貨", profile: "プロフィール", signOut: "ログアウト", welcome: "ようこそ", aiHello: "こんにちは — TYPHON装備のエキスパートです。仕様、配送、ファイナンス、または「4万ドル以下のミニ油圧ショベルを探して」とお聞きください。", typeMessage: "TYPHON AIに質問…", categories: "カテゴリー", featured: "注目商品", flashDeals: "フラッシュセール", recommended: "おすすめ", save: "保存", cancel: "キャンセル", edit: "編集", delete: "削除", loading: "読み込み中…" },
  fil: { home: "Home", shop: "Tindahan", ai: "AI", orders: "Mga Order", account: "Account", search: "Maghanap ng makina, brand, parts", cart: "Cart", wishlist: "Wishlist", addToCart: "Idagdag sa cart", buyNow: "Bilhin na", checkout: "Bayaran", quote: "Humingi ng quote", settings: "Mga setting", language: "Wika", region: "Rehiyon", currency: "Pera", profile: "Profile", signOut: "Mag-logout", welcome: "Maligayang pagdating", aiHello: "Kumusta — TYPHON equipment expert ako. Magtanong tungkol sa specs, shipping, financing.", typeMessage: "Tanungin ang TYPHON AI…", categories: "Kategorya", featured: "Tampok", flashDeals: "Flash Deals", recommended: "Para sa iyo", save: "I-save", cancel: "Kanselahin", edit: "I-edit", delete: "Tanggalin", loading: "Naglo-load…" },
  hi: { home: "होम", shop: "स्टोर", ai: "AI", orders: "ऑर्डर", account: "खाता", search: "मशीन, ब्रांड, पार्ट्स खोजें", cart: "कार्ट", wishlist: "विशलिस्ट", addToCart: "कार्ट में जोड़ें", buyNow: "अभी खरीदें", checkout: "चेकआउट", quote: "कोटेशन मांगें", settings: "सेटिंग्स", language: "भाषा", region: "क्षेत्र", currency: "मुद्रा", profile: "प्रोफ़ाइल", signOut: "लॉग आउट", welcome: "स्वागत है", aiHello: "नमस्ते — मैं आपका TYPHON विशेषज्ञ हूँ। स्पेक्स, शिपिंग, फाइनेंसिंग के बारे में पूछें।", typeMessage: "TYPHON AI से पूछें…", categories: "श्रेणियाँ", featured: "फीचर्ड", flashDeals: "फ्लैश डील्स", recommended: "आपके लिए", save: "सहेजें", cancel: "रद्द करें", edit: "संपादित करें", delete: "हटाएँ", loading: "लोड हो रहा है…" },
};

type LangCtx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
  info: Lang;
};

const Ctx = createContext<LangCtx | null>(null);

const STORAGE_KEY = "typhon.lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    if (typeof window === "undefined") return "en";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
      if (stored && T[stored]) return stored;
      const nav = (navigator.language || "en").slice(0, 2).toLowerCase() as LangCode;
      return T[nav] ? nav : "en";
    } catch { return "en"; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: LangCode) => setLangState(l), []);
  const t = useCallback((key: string) => {
    const dict = T[lang] || T.en;
    return dict[key] ?? T.en[key] ?? key;
  }, [lang]);

  const info = useMemo(() => LANGUAGES.find(l => l.code === lang) || LANGUAGES[0], [lang]);

  const value = useMemo(() => ({ lang, setLang, t, info }), [lang, setLang, t, info]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used inside <LangProvider>");
  return c;
}
