/* ==========================================================================
   LEARN MORE DATA - Payer pour la formation
   Interactive Application Logic & Payment Flow (RDC & International)
   ========================================================================== */

// ==========================================================================
// CONFIGURATION DES PAIEMENTS (Modifiez facilement vos numéros et liens ici)
// ==========================================================================
const PAYMENT_CONFIG = {
  // Numéros Mobile Money pour la République Démocratique du Congo (RDC)
  // recipientName s'affiche entre parenthèses à côté du numéro.
  rdc: {
    orangeMoney: {
      name: "Orange Money",
      icon: "🟠",
      number: "08 40 61 94 62",
      recipientName: "Elisha"
    },
    airtelMoney: {
      name: "Airtel Money",
      icon: "🔴",
      number: "09 89 34 20 97",
      recipientName: "Elisha"
    },
    mPesa: {
      name: "Vodacom M-Pesa",
      icon: "🔴",
      number: "08 20 39 16 55",
      recipientName: "James"
    }
  },

  // Lien Chariow pour "Autres pays et cartes" (Remplacer par votre vrai lien)
  chariowUrl: "https://nbceuxnh.mychariow.shop/prd_9t3aiy2q/checkout"
};

// ==========================================================================
// FORMATION (prix en dollars uniquement)
// ==========================================================================
// Taille maximale de la capture d'écran (Mo)
const MAX_PROOF_SIZE_MB = 10;

// Stockage Supabase des preuves de paiement (voir supabase/schema.sql)
const PROOF_BUCKET = "payment-proofs";
const PROOF_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif"
};

const TRAINING = {
  name: "Formation Data",
  priceUsd: 30.0
};

// ==========================================================================
// LISTE COMPLÈTE DE TOUS LES PAYS DU MONDE
// ==========================================================================
const ALL_WORLD_COUNTRIES = [
  { code: "AF", fr: "Afghanistan", en: "Afghanistan" },
  { code: "ZA", fr: "Afrique du Sud", en: "South Africa" },
  { code: "AL", fr: "Albanie", en: "Albania" },
  { code: "DZ", fr: "Algérie", en: "Algeria" },
  { code: "DE", fr: "Allemagne", en: "Germany" },
  { code: "AD", fr: "Andorre", en: "Andorra" },
  { code: "AO", fr: "Angola", en: "Angola" },
  { code: "AG", fr: "Antigua-et-Barbuda", en: "Antigua and Barbuda" },
  { code: "SA", fr: "Arabie Saoudite", en: "Saudi Arabia" },
  { code: "AR", fr: "Argentine", en: "Argentina" },
  { code: "AM", fr: "Arménie", en: "Armenia" },
  { code: "AU", fr: "Australie", en: "Australia" },
  { code: "AT", fr: "Autriche", en: "Austria" },
  { code: "AZ", fr: "Azerbaïdjan", en: "Azerbaijan" },
  { code: "BS", fr: "Bahamas", en: "Bahamas" },
  { code: "BH", fr: "Bahreïn", en: "Bahrain" },
  { code: "BD", fr: "Bangladesh", en: "Bangladesh" },
  { code: "BB", fr: "Barbade", en: "Barbados" },
  { code: "BE", fr: "Belgique", en: "Belgium" },
  { code: "BZ", fr: "Belize", en: "Belize" },
  { code: "BJ", fr: "Bénin", en: "Benin" },
  { code: "BT", fr: "Bhoutan", en: "Bhutan" },
  { code: "BY", fr: "Biélorussie", en: "Belarus" },
  { code: "MM", fr: "Birmanie (Myanmar)", en: "Myanmar" },
  { code: "BO", fr: "Bolivie", en: "Bolivia" },
  { code: "BA", fr: "Bosnie-Herzégovine", en: "Bosnia and Herzegovina" },
  { code: "BW", fr: "Botswana", en: "Botswana" },
  { code: "BR", fr: "Brésil", en: "Brazil" },
  { code: "BN", fr: "Brunei", en: "Brunei" },
  { code: "BG", fr: "Bulgarie", en: "Bulgaria" },
  { code: "BF", fr: "Burkina Faso", en: "Burkina Faso" },
  { code: "BI", fr: "Burundi", en: "Burundi" },
  { code: "KH", fr: "Cambodge", en: "Cambodia" },
  { code: "CM", fr: "Cameroun", en: "Cameroon" },
  { code: "CA", fr: "Canada", en: "Canada" },
  { code: "CV", fr: "Cap-Vert", en: "Cape Verde" },
  { code: "CL", fr: "Chili", en: "Chile" },
  { code: "CN", fr: "Chine", en: "China" },
  { code: "CY", fr: "Chypre", en: "Cyprus" },
  { code: "CO", fr: "Colombie", en: "Colombia" },
  { code: "KM", fr: "Comores", en: "Comoros" },
  { code: "CG", fr: "Congo (Brazzaville)", en: "Republic of the Congo" },
  { code: "KP", fr: "Corée du Nord", en: "North Korea" },
  { code: "KR", fr: "Corée du Sud", en: "South Korea" },
  { code: "CR", fr: "Costa Rica", en: "Costa Rica" },
  { code: "CI", fr: "Côte d'Ivoire", en: "Ivory Coast" },
  { code: "HR", fr: "Croatie", en: "Croatia" },
  { code: "CU", fr: "Cuba", en: "Cuba" },
  { code: "DK", fr: "Danemark", en: "Denmark" },
  { code: "DJ", fr: "Djibouti", en: "Djibouti" },
  { code: "DM", fr: "Dominique", en: "Dominica" },
  { code: "EG", fr: "Égypte", en: "Egypt" },
  { code: "AE", fr: "Émirats Arabes Unis", en: "United Arab Emirates" },
  { code: "EC", fr: "Équateur", en: "Ecuador" },
  { code: "ER", fr: "Érythrée", en: "Eritrea" },
  { code: "ES", fr: "Espagne", en: "Spain" },
  { code: "EE", fr: "Estonie", en: "Estonia" },
  { code: "SZ", fr: "Eswatini", en: "Eswatini" },
  { code: "US", fr: "États-Unis", en: "United States" },
  { code: "ET", fr: "Éthiopie", en: "Ethiopia" },
  { code: "FJ", fr: "Fidji", en: "Fiji" },
  { code: "FI", fr: "Finlande", en: "Finland" },
  { code: "FR", fr: "France", en: "France" },
  { code: "GA", fr: "Gabon", en: "Gabon" },
  { code: "GM", fr: "Gambie", en: "Gambia" },
  { code: "GE", fr: "Géorgie", en: "Georgia" },
  { code: "GH", fr: "Ghana", en: "Ghana" },
  { code: "GR", fr: "Grèce", en: "Greece" },
  { code: "GD", fr: "Grenade", en: "Grenada" },
  { code: "GT", fr: "Guatemala", en: "Guatemala" },
  { code: "GN", fr: "Guinée", en: "Guinea" },
  { code: "GQ", fr: "Guinée équatoriale", en: "Equatorial Guinea" },
  { code: "GW", fr: "Guinée-Bissau", en: "Guinea-Bissau" },
  { code: "GY", fr: "Guyana", en: "Guyana" },
  { code: "HT", fr: "Haïti", en: "Haiti" },
  { code: "HN", fr: "Honduras", en: "Honduras" },
  { code: "HU", fr: "Hongrie", en: "Hungary" },
  { code: "IN", fr: "Inde", en: "India" },
  { code: "ID", fr: "Indonésie", en: "Indonesia" },
  { code: "IQ", fr: "Irak", en: "Iraq" },
  { code: "IR", fr: "Iran", en: "Iran" },
  { code: "IE", fr: "Irlande", en: "Ireland" },
  { code: "IS", fr: "Islande", en: "Iceland" },
  { code: "IL", fr: "Israël", en: "Israel" },
  { code: "IT", fr: "Italie", en: "Italy" },
  { code: "JM", fr: "Jamaïque", en: "Jamaica" },
  { code: "JP", fr: "Japon", en: "Japan" },
  { code: "JO", fr: "Jordanie", en: "Jordan" },
  { code: "KZ", fr: "Kazakhstan", en: "Kazakhstan" },
  { code: "KE", fr: "Kenya", en: "Kenya" },
  { code: "KG", fr: "Kirghizistan", en: "Kyrgyzstan" },
  { code: "KI", fr: "Kiribati", en: "Kiribati" },
  { code: "KW", fr: "Koweït", en: "Kuwait" },
  { code: "LA", fr: "Laos", en: "Laos" },
  { code: "LS", fr: "Lesotho", en: "Lesotho" },
  { code: "LV", fr: "Lettonie", en: "Latvia" },
  { code: "LB", fr: "Liban", en: "Lebanon" },
  { code: "LR", fr: "Libéria", en: "Liberia" },
  { code: "LY", fr: "Libye", en: "Libya" },
  { code: "LI", fr: "Liechtenstein", en: "Liechtenstein" },
  { code: "LT", fr: "Lituanie", en: "Lithuania" },
  { code: "LU", fr: "Luxembourg", en: "Luxembourg" },
  { code: "MK", fr: "Macédoine du Nord", en: "North Macedonia" },
  { code: "MG", fr: "Madagascar", en: "Madagascar" },
  { code: "MY", fr: "Malaisie", en: "Malaysia" },
  { code: "MW", fr: "Malawi", en: "Malawi" },
  { code: "MV", fr: "Maldives", en: "Maldives" },
  { code: "ML", fr: "Mali", en: "Mali" },
  { code: "MT", fr: "Malte", en: "Malta" },
  { code: "MA", fr: "Maroc", en: "Morocco" },
  { code: "MU", fr: "Maurice", en: "Mauritius" },
  { code: "MR", fr: "Mauritanie", en: "Mauritania" },
  { code: "MX", fr: "Mexique", en: "Mexico" },
  { code: "FM", fr: "Micronésie", en: "Micronesia" },
  { code: "MD", fr: "Moldavie", en: "Moldova" },
  { code: "MC", fr: "Monaco", en: "Monaco" },
  { code: "MN", fr: "Mongolie", en: "Mongolia" },
  { code: "ME", fr: "Monténégro", en: "Montenegro" },
  { code: "MZ", fr: "Mozambique", en: "Mozambique" },
  { code: "NA", fr: "Namibie", en: "Namibia" },
  { code: "NR", fr: "Nauru", en: "Nauru" },
  { code: "NP", fr: "Népal", en: "Nepal" },
  { code: "NI", fr: "Nicaragua", en: "Nicaragua" },
  { code: "NE", fr: "Niger", en: "Niger" },
  { code: "NG", fr: "Nigéria", en: "Nigeria" },
  { code: "NO", fr: "Norvège", en: "Norway" },
  { code: "NZ", fr: "Nouvelle-Zélande", en: "New Zealand" },
  { code: "OM", fr: "Oman", en: "Oman" },
  { code: "UG", fr: "Ouganda", en: "Uganda" },
  { code: "UZ", fr: "Ouzbékistan", en: "Uzbekistan" },
  { code: "PK", fr: "Pakistan", en: "Pakistan" },
  { code: "PW", fr: "Palaos", en: "Palau" },
  { code: "PS", fr: "Palestine", en: "Palestine" },
  { code: "PA", fr: "Panama", en: "Panama" },
  { code: "PG", fr: "Papouasie-Nouvelle-Guinée", en: "Papua New Guinea" },
  { code: "PY", fr: "Paraguay", en: "Paraguay" },
  { code: "NL", fr: "Pays-Bas", en: "Netherlands" },
  { code: "PE", fr: "Pérou", en: "Peru" },
  { code: "PH", fr: "Philippines", en: "Philippines" },
  { code: "PL", fr: "Pologne", en: "Poland" },
  { code: "PT", fr: "Portugal", en: "Portugal" },
  { code: "QA", fr: "Qatar", en: "Qatar" },
  { code: "CF", fr: "République Centrafricaine", en: "Central African Republic" },
  { code: "DO", fr: "République Dominicaine", en: "Dominican Republic" },
  { code: "CZ", fr: "République Tchèque", en: "Czech Republic" },
  { code: "RO", fr: "Roumanie", en: "Romania" },
  { code: "GB", fr: "Royaume-Uni", en: "United Kingdom" },
  { code: "RU", fr: "Russie", en: "Russia" },
  { code: "RW", fr: "Rwanda", en: "Rwanda" },
  { code: "KN", fr: "Saint-Christophe-et-Niévès", en: "Saint Kitts and Nevis" },
  { code: "LC", fr: "Sainte-Lucie", en: "Saint Lucia" },
  { code: "SM", fr: "Saint-Marin", en: "San Marino" },
  { code: "VC", fr: "Saint-Vincent-et-les-Grenadines", en: "Saint Vincent and the Grenadines" },
  { code: "SB", fr: "Salomon", en: "Solomon Islands" },
  { code: "SV", fr: "Salvador", en: "El Salvador" },
  { code: "WS", fr: "Samoa", en: "Samoa" },
  { code: "ST", fr: "Sao Tomé-et-Principe", en: "Sao Tome and Principe" },
  { code: "SN", fr: "Sénégal", en: "Senegal" },
  { code: "RS", fr: "Serbie", en: "Serbia" },
  { code: "SC", fr: "Seychelles", en: "Seychelles" },
  { code: "SL", fr: "Sierra Leone", en: "Sierra Leone" },
  { code: "SG", fr: "Singapour", en: "Singapore" },
  { code: "SK", fr: "Slovaquie", en: "Slovakia" },
  { code: "SI", fr: "Slovénie", en: "Slovenia" },
  { code: "SO", fr: "Somalie", en: "Somalia" },
  { code: "SD", fr: "Soudan", en: "Sudan" },
  { code: "SS", fr: "Soudan du Sud", en: "South Sudan" },
  { code: "LK", fr: "Sri Lanka", en: "Sri Lanka" },
  { code: "SE", fr: "Suède", en: "Sweden" },
  { code: "CH", fr: "Suisse", en: "Switzerland" },
  { code: "SR", fr: "Suriname", en: "Suriname" },
  { code: "SY", fr: "Syrie", en: "Syria" },
  { code: "TJ", fr: "Tadjikistan", en: "Tajikistan" },
  { code: "TZ", fr: "Tanzanie", en: "Tanzania" },
  { code: "TD", fr: "Tchad", en: "Chad" },
  { code: "TH", fr: "Thaïlande", en: "Thailand" },
  { code: "TL", fr: "Timor oriental", en: "East Timor" },
  { code: "TG", fr: "Togo", en: "Togo" },
  { code: "TO", fr: "Tonga", en: "Tonga" },
  { code: "TT", fr: "Trinité-et-Tobago", en: "Trinidad and Tobago" },
  { code: "TN", fr: "Tunisie", en: "Tunisia" },
  { code: "TM", fr: "Turkménistan", en: "Turkmenistan" },
  { code: "TR", fr: "Turquie", en: "Turkey" },
  { code: "TV", fr: "Tuvalu", en: "Tuvalu" },
  { code: "UA", fr: "Ukraine", en: "Ukraine" },
  { code: "UY", fr: "Uruguay", en: "Uruguay" },
  { code: "VU", fr: "Vanuatu", en: "Vanuatu" },
  { code: "VA", fr: "Vatican", en: "Vatican City" },
  { code: "VE", fr: "Venezuela", en: "Venezuela" },
  { code: "VN", fr: "Viêt Nam", en: "Vietnam" },
  { code: "YE", fr: "Yémen", en: "Yemen" },
  { code: "ZM", fr: "Zambie", en: "Zambia" },
  { code: "ZW", fr: "Zimbabwe", en: "Zimbabwe" }
];

const TRANSLATIONS = {
  en: {
    "common.continue": "Continue",
    "landing.headline1": "Pay for the training",
    "landing.sub": "Join LEARN MORE DATA and master the most in-demand software for data analysis, statistics, qualitative research, mapping and project management. A 100% hands-on training led by experts, to turn your data into decisions.",
    "landing.expertInstruction": "Expert Instruction",
    "landing.flexiblePayments": "Flexible Payments",
    "landing.getStarted": "Get Started",
    "landing.enterEmail": "Enter your email to make your payment and access your training.",
    "landing.nameLabel": "Full Name",
    "landing.emailLabel": "Email Address",
    "landing.noPassword": "No password required. Enter your email to proceed directly to payment.",
    "landing.footer": "© 2026 LEARN MORE DATA. All rights reserved.",
    "checkout.title": "Make a Payment",
    "checkout.step1": "Method & Country",
    "checkout.step2": "Payment & Proof",
    "checkout.step3": "Confirmation",
    "checkout.howPay": "How would you like to pay?",
    "checkout.rdcDesc": "Orange Money, Airtel Money, Vodacom M-Pesa",
    "checkout.globalDesc": "Secure international payment via Chariow (Cards, etc.)",
    "checkout.selectCountry": "Select your country:",
    "checkout.selectOperator": "Choose your Mobile Money operator:",
    "checkout.continuePayment": "Continue to Payment",
    "direct.accountNumber": "Recipient / Agent Number:",
    "direct.instructionsFallback": "Send the transfer to the number above, then upload your screenshot proof below.",
    "direct.proofLabel": "Screenshot as proof of payment (required):",
    "direct.cancelGoBack": "Back",
    "direct.madeTransfer": "Submit my proof of payment",
    "chw.uploadScreenshot": "Click or drop your screenshot here",
    "chw.linkHint": "Payment opens in a secure window. Once completed, upload your confirmation screenshot below.",
    "cb.confirming": "Confirming your payment…",
    "cb.verifying": "We're verifying your proof of payment. Your training access will be activated.",
    "cb.cameThrough": "We are verifying this screenshot. You will receive an email with the training information and the link to join the group.",
    "poll.confirmed": "Screenshot received! 🎉",
    "software.title": "Software covered in the training",
    "software.intro": "Each module is organized by field: you learn the tools that match your profession, from data collection to presenting results.",
    "software.stats.title": "Statistics & quantitative analysis",
    "software.stats.desc": "Process, test and interpret survey and research data.",
    "software.quali.title": "Qualitative analysis",
    "software.quali.desc": "Code and analyze interviews, focus groups and documents.",
    "software.gis.title": "Mapping & GIS",
    "software.gis.desc": "Map and analyze geographic data.",
    "software.bi.title": "Visualization & dashboards",
    "software.bi.desc": "Turn your data into clear charts and reports to support decisions.",
    "software.code.title": "Data & programming",
    "software.code.desc": "Query, clean and automate the processing of your data.",
    "software.pm.title": "Project management",
    "software.pm.desc": "Plan, track and steer your projects and resources.",
    "testimonials.title": "They took the training",
    "testimonials.intro": "What our learners say.",
    "contact.title": "Contact us",
    "contact.intro": "A question about the training or the payment? Write to us or call us.",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "common.copied": "Copied:",
    "common.copy": "Copy",
    "global.country": "Selected country:",
    "global.amount": "Training fee:",
    "global.payBtn": "Pay via Chariow (Cards & local methods)",
    "chw.fileHint": "JPG, PNG, WebP or HEIC (transfer receipt or Chariow confirmation)",
    "proof.remove": "Remove",
    "proof.selected": "Screenshot selected ✓",
    "proof.loaded": "Screenshot loaded:",
    "proof.required": "Please upload your payment screenshot first.",
    "proof.errType": "Please choose an image file (JPG, PNG, WebP or HEIC).",
    "proof.errSize": "The image is too large (max {max} MB).",
    "submit.error": "Sending failed. Check your connection and try again.",
    "submit.notConfigured": "The payment service is not available yet. Please contact us."
  },
  fr: {
    "common.continue": "Continuer",
    "landing.headline1": "Payer pour la formation",
    "landing.sub": "Rejoignez LEARN MORE DATA et maîtrisez les logiciels les plus demandés en analyse de données, statistiques, recherche qualitative, cartographie et gestion de projet. Une formation 100 % pratique, animée par des experts, pour transformer vos données en décisions.",
    "landing.expertInstruction": "Accompagnement expert",
    "landing.flexiblePayments": "Paiements flexibles",
    "landing.getStarted": "Commencer",
    "landing.enterEmail": "Entrez votre e-mail pour effectuer votre paiement et accéder à la formation.",
    "landing.nameLabel": "Nom complet",
    "landing.emailLabel": "Adresse e-mail",
    "landing.noPassword": "Aucun mot de passe requis. Entrez votre e-mail pour passer directement au paiement.",
    "landing.footer": "© 2026 LEARN MORE DATA. Tous droits réservés.",
    "checkout.title": "Effectuer un paiement",
    "checkout.step1": "Mode & Pays",
    "checkout.step2": "Paiement & Preuve",
    "checkout.step3": "Confirmation",
    "checkout.howPay": "Comment souhaitez-vous payer ?",
    "checkout.rdcDesc": "Orange Money, Airtel Money, Vodacom M-Pesa",
    "checkout.globalDesc": "Paiement international sécurisé via Chariow",
    "checkout.selectCountry": "Sélectionnez votre pays :",
    "checkout.selectOperator": "Choisissez votre opérateur Mobile Money :",
    "checkout.continuePayment": "Continuer vers le paiement",
    "direct.accountNumber": "Numéro de dépôt / agent :",
    "direct.instructionsFallback": "Effectuez le transfert vers le numéro ci-dessus avec votre téléphone, puis déposez votre capture d'écran ci-dessous comme preuve.",
    "direct.proofLabel": "Capture d'écran comme preuve de paiement (obligatoire) :",
    "direct.cancelGoBack": "Retour",
    "direct.madeTransfer": "Soumettre ma preuve de paiement",
    "chw.uploadScreenshot": "Cliquez ou glissez votre capture d'écran ici",
    "chw.linkHint": "Le paiement s'ouvre dans un nouvel onglet sécurisé. Une fois validé, déposez la capture de confirmation ci-dessous.",
    "cb.confirming": "Confirmation de votre paiement…",
    "cb.verifying": "Nous vérifions votre preuve de paiement. Votre accès à la formation sera activé.",
    "cb.cameThrough": "Nous procédons à la vérification de cette capture et vous recevrez un mail contenant les informations de la formation et le lien pour rejoindre le groupe.",
    "poll.confirmed": "Capture reçue ! 🎉",
    "software.title": "Les logiciels de la formation",
    "software.intro": "Chaque module est organisé par domaine : vous apprenez les outils qui correspondent à votre métier, de la collecte des données jusqu'à la présentation des résultats.",
    "software.stats.title": "Statistiques & analyse quantitative",
    "software.stats.desc": "Traiter, tester et interpréter des données d'enquête et de recherche.",
    "software.quali.title": "Analyse qualitative",
    "software.quali.desc": "Coder et analyser des entretiens, des focus groups et des documents.",
    "software.gis.title": "Cartographie & SIG",
    "software.gis.desc": "Cartographier et analyser des données géographiques.",
    "software.bi.title": "Visualisation & tableaux de bord",
    "software.bi.desc": "Transformer vos données en graphiques et rapports clairs pour décider.",
    "software.code.title": "Données & programmation",
    "software.code.desc": "Interroger, nettoyer et automatiser le traitement de vos données.",
    "software.pm.title": "Gestion de projet",
    "software.pm.desc": "Planifier, suivre et piloter vos projets et vos ressources.",
    "testimonials.title": "Ils ont suivi la formation",
    "testimonials.intro": "Ce que disent nos apprenants.",
    "contact.title": "Contactez-nous",
    "contact.intro": "Une question sur la formation ou le paiement ? Écrivez-nous ou appelez-nous.",
    "contact.phone": "Téléphone",
    "contact.email": "E-mail",
    "common.copied": "Copié :",
    "common.copy": "Copier",
    "global.country": "Pays sélectionné :",
    "global.amount": "Montant de la formation :",
    "global.payBtn": "Payer via Chariow (Cartes & Moyens locaux)",
    "chw.fileHint": "JPG, PNG, WebP ou HEIC (reçu de transfert ou confirmation Chariow)",
    "proof.remove": "Supprimer",
    "proof.selected": "Capture d'écran sélectionnée ✓",
    "proof.loaded": "Capture d'écran chargée :",
    "proof.required": "Veuillez d'abord téléverser votre capture d'écran de paiement.",
    "proof.errType": "Veuillez choisir une image (JPG, PNG, WebP ou HEIC).",
    "proof.errSize": "L'image est trop volumineuse (max {max} Mo).",
    "submit.error": "L'envoi a échoué. Vérifiez votre connexion et réessayez.",
    "submit.notConfigured": "Le service de paiement n'est pas encore disponible. Contactez-nous."
  }
};

class App {
  constructor() {
    this.currentLang = "fr"; // Default to French as requested

    this.userState = {
      name: "",
      email: ""
    };

    // Checkout state
    this.checkoutSession = {
      paymentRail: "RDC", // 'RDC' | 'GLOBAL'
      selectedCountryCode: "FR",
      selectedCountryName: "France",
      selectedOperatorKey: "orangeMoney",
      usdTotal: TRAINING.priceUsd,
      uploadedFile: null
    };

    this.init();
  }

  init() {
    this.initCursorGlow();
    this.initDropzone();
    this.initAccessibility();

    let savedLang = null;
    try {
      savedLang = localStorage.getItem("learn-more-data-lang");
    } catch (e) { /* storage unavailable (private mode) */ }

    this.setLanguage(savedLang === "en" || savedLang === "fr" ? savedLang : this.currentLang);
  }

  /* -------------------------------------------------------------
     Cursor Glow
     ------------------------------------------------------------- */
  initCursorGlow() {
    window.addEventListener("pointermove", (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--cursor-x", `${x}%`);
      document.documentElement.style.setProperty("--cursor-y", `${y}%`);
    });
  }

  /* -------------------------------------------------------------
     Language (i18n)
     ------------------------------------------------------------- */

  setLanguage(lang) {
    this.currentLang = lang;
    try {
      localStorage.setItem("learn-more-data-lang", lang);
    } catch (e) { /* storage unavailable (private mode) */ }
    document.documentElement.setAttribute("lang", lang);

    document.getElementById("langEnBtn").classList.toggle("active", lang === "en");
    document.getElementById("langFrBtn").classList.toggle("active", lang === "fr");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        el.textContent = TRANSLATIONS[lang][key];
      }
    });

    if (!this.checkoutSession.uploadedFile) this.resetProofUpload();

    this.populateWorldCountries();
  }

  t(key, fallback = "") {
    if (TRANSLATIONS[this.currentLang] && TRANSLATIONS[this.currentLang][key]) {
      return TRANSLATIONS[this.currentLang][key];
    }
    return fallback || key;
  }

  /* -------------------------------------------------------------
     Populate All World Countries Dropdown
     ------------------------------------------------------------- */
  populateWorldCountries() {
    const select = document.getElementById("worldCountrySelect");
    if (!select) return;

    const currentVal = select.value || "FR";
    select.innerHTML = "";

    // Sort countries by name in current language
    const sorted = [...ALL_WORLD_COUNTRIES].sort((a, b) => {
      const nameA = this.currentLang === "fr" ? a.fr : a.en;
      const nameB = this.currentLang === "fr" ? b.fr : b.en;
      return nameA.localeCompare(nameB, this.currentLang);
    });

    sorted.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.code;
      opt.textContent = this.currentLang === "fr" ? c.fr : c.en;
      if (c.code === currentVal) opt.selected = true;
      select.appendChild(opt);
    });

    // Update session country name
    const found = ALL_WORLD_COUNTRIES.find(c => c.code === select.value);
    if (found) {
      this.checkoutSession.selectedCountryName = this.currentLang === "fr" ? found.fr : found.en;
    }
  }

  handleWorldCountrySelect(countryCode) {
    this.checkoutSession.selectedCountryCode = countryCode;
    const found = ALL_WORLD_COUNTRIES.find(c => c.code === countryCode);
    if (found) {
      this.checkoutSession.selectedCountryName = this.currentLang === "fr" ? found.fr : found.en;
      const display = document.getElementById("globalCountryDisplay");
      if (display) display.textContent = this.checkoutSession.selectedCountryName;
    }
  }

  /* -------------------------------------------------------------
     Get Started Form (DIRECT ACCESS TO PAYMENT AS REQUESTED)
     ------------------------------------------------------------- */
  handleGetStarted(e) {
    e.preventDefault();
    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    if (!name || !email) return;

    this.userState.name = name;
    this.userState.email = email;
    // Direct opening of the payment modal with Effectuer un paiement !
    this.startCheckout();
  }

  /* -------------------------------------------------------------
     Payment Flow: RDC vs Autres pays & Capture comme preuve
     ------------------------------------------------------------- */
  startCheckout() {
    this.checkoutSession.uploadedFile = null;

    // Default to RDC option
    this.selectPaymentRail("RDC");

    // Reset steps
    this.setStepIndicator(1);
    document.getElementById("checkoutStep1").style.display = "block";
    document.getElementById("checkoutStep2").style.display = "none";
    document.getElementById("checkoutStep3").style.display = "none";

    // Reset upload preview
    this.resetProofUpload();

    document.getElementById("checkoutModal").classList.add("active");
  }

  closeCheckout() {
    document.getElementById("checkoutModal").classList.remove("active");
  }

  setStepIndicator(step) {
    const s1 = document.getElementById("stepIndicator1");
    const s2 = document.getElementById("stepIndicator2");
    const s3 = document.getElementById("stepIndicator3");

    [s1, s2, s3].forEach(el => el.className = "step-circle");

    if (step === 1) {
      s1.classList.add("active");
    } else if (step === 2) {
      s1.classList.add("completed");
      s2.classList.add("active");
    } else if (step === 3) {
      s1.classList.add("completed");
      s2.classList.add("completed");
      s3.classList.add("active");
    }
  }

  selectPaymentRail(rail) {
    this.checkoutSession.paymentRail = rail;

    const rdcCard = document.getElementById("railCardRdc");
    const globalCard = document.getElementById("railCardGlobal");
    const worldCountriesContainer = document.getElementById("worldCountriesContainer");

    if (rail === "RDC") {
      rdcCard.classList.add("selected");
      globalCard.classList.remove("selected");
      worldCountriesContainer.style.display = "none";
    } else {
      globalCard.classList.add("selected");
      rdcCard.classList.remove("selected");
      worldCountriesContainer.style.display = "block";
    }

    this.renderSummary();
  }

  renderSummary() {
    const totalUsd = TRAINING.priceUsd;
    this.checkoutSession.usdTotal = totalUsd;

    document.getElementById("summaryProductName").textContent = TRAINING.name;
    document.getElementById("summaryTotalUsd").textContent = `$${totalUsd.toFixed(2)}`;
  }

  proceedToStep2() {
    this.setStepIndicator(2);
    document.getElementById("checkoutStep1").style.display = "none";
    document.getElementById("checkoutStep2").style.display = "block";

    const isRdc = this.checkoutSession.paymentRail === "RDC";
    const branchRdc = document.getElementById("branchRdcPayment");
    const branchGlobal = document.getElementById("branchGlobalPayment");

    if (isRdc) {
      branchRdc.style.display = "block";
      branchGlobal.style.display = "none";
      this.selectRdcOperator(this.checkoutSession.selectedOperatorKey || "orangeMoney");
    } else {
      branchRdc.style.display = "none";
      branchGlobal.style.display = "block";

      // Setup Chariow info
      document.getElementById("globalCountryDisplay").textContent = this.checkoutSession.selectedCountryName || "France";
      document.getElementById("globalAmountDisplay").textContent = `$${this.checkoutSession.usdTotal.toFixed(2)} USD`;

      const chariowBtn = document.getElementById("chariowLinkBtn");
      chariowBtn.href = PAYMENT_CONFIG.chariowUrl;
    }
  }

  backToStep1() {
    this.setStepIndicator(1);
    document.getElementById("checkoutStep1").style.display = "block";
    document.getElementById("checkoutStep2").style.display = "none";
  }

  selectRdcOperator(opKey) {
    this.checkoutSession.selectedOperatorKey = opKey;

    ["opOrangeMoney", "opAirtelMoney", "opMpesa"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("selected");
    });

    if (opKey === "orangeMoney") document.getElementById("opOrangeMoney").classList.add("selected");
    if (opKey === "airtelMoney") document.getElementById("opAirtelMoney").classList.add("selected");
    if (opKey === "mPesa") document.getElementById("opMpesa").classList.add("selected");

    const opConfig = PAYMENT_CONFIG.rdc[opKey];
    document.getElementById("recipientNumber").textContent = opConfig.number;
    document.getElementById("recipientNameDisplay").textContent = `(${opConfig.recipientName})`;
  }

  /* -------------------------------------------------------------
     Screenshot Proof Upload (Capture comme preuve de paiement)
     ------------------------------------------------------------- */
  handleFileSelect(event) {
    this.setProofFile(event.target.files[0]);
  }

  setProofFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      this.showToast(this.t("proof.errType"));
      this.resetProofUpload();
      return;
    }
    if (file.size > MAX_PROOF_SIZE_MB * 1024 * 1024) {
      this.showToast(this.t("proof.errSize").replace("{max}", MAX_PROOF_SIZE_MB));
      this.resetProofUpload();
      return;
    }

    this.resetProofUpload();
    this.checkoutSession.uploadedFile = file;
    this.previewUrl = URL.createObjectURL(file);

    document.getElementById("proofPreviewImg").src = this.previewUrl;
    document.getElementById("proofPreviewName").textContent = file.name;
    document.getElementById("proofPreviewSize").textContent = `${Math.round(file.size / 1024)} KB`;
    document.getElementById("proofPreviewContainer").style.display = "flex";
    document.getElementById("uploadDropText").textContent = this.t("proof.selected");

    this.showToast(`${this.t("proof.loaded")} ${file.name}`);
  }

  removeSelectedFile(event) {
    if (event) event.stopPropagation();
    this.resetProofUpload();
  }

  resetProofUpload() {
    this.checkoutSession.uploadedFile = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }

    const fileInput = document.getElementById("proofFileInput");
    if (fileInput) fileInput.value = "";

    const previewContainer = document.getElementById("proofPreviewContainer");
    if (previewContainer) previewContainer.style.display = "none";

    const dropText = document.getElementById("uploadDropText");
    if (dropText) dropText.textContent = this.t("chw.uploadScreenshot");
  }

  initDropzone() {
    const zone = document.getElementById("proofDropzone");
    if (!zone) return;

    ["dragenter", "dragover"].forEach((evt) => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.add("dragover");
      });
    });
    ["dragleave", "drop"].forEach((evt) => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.remove("dragover");
      });
    });
    zone.addEventListener("drop", (e) => {
      this.setProofFile(e.dataTransfer.files[0]);
    });
  }

  /* -------------------------------------------------------------
     Accessibility: keyboard support for clickable cards, Escape to close
     ------------------------------------------------------------- */
  initAccessibility() {
    document.querySelectorAll("div[onclick]").forEach((el) => {
      if (el.classList.contains("brand-logo") || el.classList.contains("upload-dropzone") || el.classList.contains("payment-rail-card") || el.classList.contains("selection-card")) {
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
      }
    });

    document.addEventListener("keydown", (e) => {
      const target = e.target;
      if ((e.key === "Enter" || e.key === " ") && target.getAttribute && target.getAttribute("role") === "button") {
        e.preventDefault();
        target.click();
      }
      if (e.key === "Escape") this.closeCheckout();
    });
  }

  /* -------------------------------------------------------------
     Backend (Supabase) : envoi de la preuve + création de la demande
     ------------------------------------------------------------- */
  getSupabase() {
    if (this.supabase) return this.supabase;
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return null;
    this.supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    return this.supabase;
  }

  async savePayment() {
    const db = this.getSupabase();
    if (!db) throw new Error("not-configured");

    const session = this.checkoutSession;
    const file = session.uploadedFile;
    const ext = PROOF_EXTENSIONS[file.type] || "jpg";
    const proofPath = `${crypto.randomUUID()}.${ext}`;

    const upload = await db.storage
      .from(PROOF_BUCKET)
      .upload(proofPath, file, { contentType: file.type, upsert: false });
    if (upload.error) throw upload.error;

    const isRdc = session.paymentRail === "RDC";
    const insert = await db.from("payments").insert({
      full_name: this.userState.name,
      email: this.userState.email,
      rail: session.paymentRail,
      operator: isRdc ? session.selectedOperatorKey : null,
      country_code: isRdc ? "CD" : session.selectedCountryCode,
      amount_usd: session.usdTotal,
      proof_path: proofPath
    });
    if (insert.error) throw insert.error;
  }

  async submitPaymentProof() {
    // The screenshot is mandatory
    if (!this.checkoutSession.uploadedFile) {
      this.showToast(this.t("proof.required"));
      return;
    }
    if (this.submitting) return;
    this.submitting = true;

    const submitBtn = document.getElementById("submitProofBtn");
    submitBtn.disabled = true;

    // Move to Step 3: sending
    this.setStepIndicator(3);
    document.getElementById("checkoutStep2").style.display = "none";
    document.getElementById("checkoutStep3").style.display = "block";
    document.getElementById("pollingInProgress").style.display = "flex";
    document.getElementById("pollingSuccess").style.display = "none";

    try {
      await this.savePayment();
      document.getElementById("pollingInProgress").style.display = "none";
      document.getElementById("pollingSuccess").style.display = "flex";
    } catch (err) {
      console.error("Payment submission failed:", err);
      // Back to step 2 so the learner can retry without losing the screenshot
      this.setStepIndicator(2);
      document.getElementById("checkoutStep3").style.display = "none";
      document.getElementById("checkoutStep2").style.display = "block";
      const key = err && err.message === "not-configured" ? "submit.notConfigured" : "submit.error";
      this.showToast(this.t(key));
    } finally {
      this.submitting = false;
      submitBtn.disabled = false;
    }
  }

  copyToClipboard(text) {
    const done = () => this.showToast(`${this.t("common.copied")} ${text}`);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      done();
    }
  }

  showToast(message) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast";

    const dot = document.createElement("span");
    dot.style.color = "var(--brand-400)";
    dot.textContent = "●";
    const text = document.createElement("span");
    text.textContent = message; // textContent: never interpret user-provided text (e.g. file names) as HTML

    toast.append(dot, text);
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Global initialization
const app = new App();
window.app = app;
