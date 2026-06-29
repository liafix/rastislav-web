import type { PaymentType, ServiceSlug } from "@/lib/contracts";

export const company = {
  name: "mv MARTIŠ",
  legalName: "Martiš MV",
  descriptor: "Interiérové rekonštrukcie",
  slogan: "REKONŠTRUKCIE INTERIÉRU NA KĽÚČ",
  phoneDisplay: "0948 443 899",
  phoneHref: "tel:0948443899",
  whatsappHref:
    "https://wa.me/421948443899?text=Dobr%C3%BD%20de%C5%88%2C%20m%C3%A1m%20z%C3%A1ujem%20o%20rekon%C5%A1trukciu.",
  baseLocation: "Dubnica nad Váhom",
  address: "A. Kmeša 939/28, Dubnica nad Váhom",
  licensePlate: "IL 590DF",
  serviceArea: ["Dubnica nad Váhom", "Ilava", "Trenčín", "Nová Dubnica", "Nemšová", "okolie Považia"]
} as const;

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceProcessStep = {
  title: string;
  text: string;
};

export type ServiceJsonLdData = {
  serviceType: string;
  areaServed: string[];
  providerName: string;
};

export type Service = {
  slug: ServiceSlug;
  label: string;
  shortLabel: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  localities: string[];
  benefits: string[];
  processSteps: ServiceProcessStep[];
  faq: ServiceFaq[];
  primaryCta: string;
  secondaryCta: string;
  paymentType?: PaymentType;
  jsonLd: ServiceJsonLdData;
};

const localities = ["Dubnica nad Váhom", "Ilava", "Trenčín", "Nová Dubnica", "okolité obce"];

const defaultProcessSteps: ServiceProcessStep[] = [
  {
    title: "Obhliadka",
    text: "Pozrieme priestor, podklad, rozmery a praktické obmedzenia priamo na mieste alebo podľa fotiek."
  },
  {
    title: "Cenová ponuka",
    text: "Dohodneme rozsah, materiál, poradie prác a realistický termín realizácie."
  },
  {
    title: "Realizácia",
    text: "Práce prebiehajú v nadväznosti profesií tak, aby bol výsledok čistý a bez zbytočného chaosu."
  },
  {
    title: "Odovzdanie",
    text: "Priestor skontrolujeme, doladíme detaily a zákazník vie, čo bolo hotové a v akom rozsahu."
  }
];

function makeFaq(label: string, scope: string): ServiceFaq[] {
  return [
    {
      question: `Robíte ${label.toLowerCase()} aj mimo Dubnice nad Váhom?`,
      answer:
        "Áno. Pracujeme najmä v Dubnici nad Váhom, Ilave, Trenčíne, Novej Dubnici a v okolitých obciach podľa rozsahu práce."
    },
    {
      question: "Je potrebná obhliadka pred cenovou ponukou?",
      answer:
        "Pri väčšine prác áno. Obhliadka pomôže presne určiť stav podkladu, rozsah, materiál, termín a možné riziká."
    },
    {
      question: "Môžem najskôr poslať fotky cez WhatsApp?",
      answer:
        "Áno. Fotky priestoru pomôžu rýchlo posúdiť situáciu a pripraviť sa na obhliadku. Pri väčšom rozsahu je osobná obhliadka stále najistejšia."
    },
    {
      question: `Čo ovplyvňuje cenu služby ${label.toLowerCase()}?`,
      answer: scope
    }
  ];
}

export const services: Service[] = [
  {
    slug: "obklady",
    label: "Obklady",
    shortLabel: "Obklady",
    h1: "Obklady v Dubnici nad Váhom a okolí",
    intro:
      "Realizujeme obklady do kúpeľní, kuchýň, technických miestností aj menších interiérov. Pri práci sledujeme presné napojenia, rovinu, škáry a čistý detail, aby výsledok pôsobil kvalitne aj po rokoch používania.",
    metaTitle: "Obklady Dubnica nad Váhom | mv MARTIŠ",
    metaDescription:
      "Obklady do kúpeľní, kuchýň a interiérov v Dubnici nad Váhom, Ilave a Trenčíne. Obhliadka, presný postup a čistý detail.",
    localities,
    benefits: [
      "presné napojenia pri vani, sprche, sanite a hranách",
      "kontrola podkladu pred začiatkom prác",
      "vhodné riešenie pre kúpeľne, kuchyne aj technické priestory",
      "jasná dohoda rozsahu pred realizáciou"
    ],
    processSteps: defaultProcessSteps,
    faq: makeFaq(
      "obklady",
      "Cenu ovplyvňuje plocha, formát obkladu, stav podkladu, počet rezov, rohy, niky, sokle a náročnosť napojenia na sanitu alebo sprchový kút."
    ),
    primaryCta: "Objednať obhliadku",
    secondaryCta: "Poslať fotky cez WhatsApp",
    paymentType: "reservation_fee",
    jsonLd: {
      serviceType: "Obkladanie kúpeľní, kuchýň a interiérov",
      areaServed: localities,
      providerName: company.name
    }
  },
  {
    slug: "dlazby",
    label: "Dlažby",
    shortLabel: "Dlažby",
    h1: "Dlažby v Dubnici nad Váhom a okolí",
    intro:
      "Pokladáme dlažby v kúpeľniach, chodbách, vstupoch a interiérových priestoroch. Dôležitá je príprava podkladu, správny smer pokládky, čisté rezy a spoľahlivý výsledok pre každodenné používanie.",
    metaTitle: "Dlažby Dubnica nad Váhom | Pokládka dlažby | mv MARTIŠ",
    metaDescription:
      "Pokládka dlažby v interiéri pre Dubnicu nad Váhom, Ilavu, Trenčín a okolie. Príprava podkladu, presné rezy a obhliadka.",
    localities,
    benefits: [
      "kontrola roviny a pripravenosti podkladu",
      "čisté rezy pri stenách, dverách a prechodoch",
      "praktické riešenie pre kúpeľne, chodby a vstupy",
      "dohoda dilatácií, soklov a ukončení"
    ],
    processSteps: defaultProcessSteps,
    faq: makeFaq(
      "dlažby",
      "Cenu ovplyvňuje výmera, formát dlažby, rovinnosť podkladu, množstvo rezov, sokle, prechody medzi miestnosťami a prípadná príprava alebo nivelizácia."
    ),
    primaryCta: "Objednať obhliadku",
    secondaryCta: "Poslať fotky podlahy",
    paymentType: "reservation_fee",
    jsonLd: {
      serviceType: "Pokládka interiérovej dlažby",
      areaServed: localities,
      providerName: company.name
    }
  },
  {
    slug: "omietky",
    label: "Omietky",
    shortLabel: "Omietky",
    h1: "Omietky a úpravy stien v Dubnici nad Váhom a okolí",
    intro:
      "Opravujeme a pripravujeme steny tak, aby interiér pôsobil čisto ešte pred finálnym zariadením. Riešime povrchové úpravy, opravy po zásahoch, dorovnanie detailov a prípravu pred ďalšími prácami.",
    metaTitle: "Omietky Dubnica nad Váhom | Úpravy stien | mv MARTIŠ",
    metaDescription:
      "Omietky, opravy a príprava stien pre byty a domy v Dubnici nad Váhom, Ilave, Trenčíne a okolí. Obhliadka a jasný postup.",
    localities,
    benefits: [
      "opravy stien po rekonštrukcii alebo rozvodoch",
      "príprava podkladu pred maľbou alebo ďalšími prácami",
      "riešenie detailov pri rohoch, priečkach a napojeniach",
      "vhodné pre byty, domy aj menšie priestory"
    ],
    processSteps: defaultProcessSteps,
    faq: makeFaq(
      "omietky",
      "Cenu ovplyvňuje stav stien, rozsah opráv, hrúbka vrstiev, prístupnosť priestoru, sušenie a požadovaná pripravenosť pred finálnou úpravou."
    ),
    primaryCta: "Objednať obhliadku",
    secondaryCta: "Poslať fotky stien",
    paymentType: "reservation_fee",
    jsonLd: {
      serviceType: "Omietky a interiérové úpravy stien",
      areaServed: localities,
      providerName: company.name
    }
  },
  {
    slug: "podlahy",
    label: "Podlahy",
    shortLabel: "Podlahy",
    h1: "Podlahy v Dubnici nad Váhom a okolí",
    intro:
      "Podlahy riešime od prípravy priestoru až po finálne uloženie a detail pri stenách, dverách a prechodoch. Pomáhame zvoliť praktické riešenie pre každodenné bývanie aj rekonštrukciu na kľúč.",
    metaTitle: "Podlahy Dubnica nad Váhom | Montáž podláh | mv MARTIŠ",
    metaDescription:
      "Montáž a príprava podláh v Dubnici nad Váhom, Ilave, Trenčíne a okolí. Detail pri stenách, dverách a prechodoch.",
    localities,
    benefits: [
      "príprava priestoru pred pokládkou",
      "čisté ukončenia pri stenách a dverách",
      "riešenie prechodov medzi miestnosťami",
      "nadväznosť na zárubne, lišty a ďalšie práce"
    ],
    processSteps: defaultProcessSteps,
    faq: makeFaq(
      "podlahy",
      "Cenu ovplyvňuje typ podlahy, výmera, pripravenosť podkladu, množstvo prechodov, lišty, rezanie a nadväznosť na dvere alebo existujúce povrchy."
    ),
    primaryCta: "Objednať obhliadku",
    secondaryCta: "Poslať fotky priestoru",
    paymentType: "reservation_fee",
    jsonLd: {
      serviceType: "Montáž a príprava interiérových podláh",
      areaServed: localities,
      providerName: company.name
    }
  },
  {
    slug: "sanita",
    label: "Sanita",
    shortLabel: "Sanita",
    h1: "Montáž sanity v Dubnici nad Váhom a okolí",
    intro:
      "Montáž sanity berieme ako finálny detail kúpeľne alebo WC, ktorý musí dobre fungovať aj dobre vyzerať. Riešime napojenia, osadenie, praktickú výšku a čistý výsledok v nadväznosti na obklady.",
    metaTitle: "Sanita Dubnica nad Váhom | Montáž sanity | mv MARTIŠ",
    metaDescription:
      "Montáž sanity pre kúpeľne a WC v Dubnici nad Váhom, Ilave, Trenčíne a okolí. Čisté osadenie a nadväznosť na obklady.",
    localities,
    benefits: [
      "osadenie sanity v nadväznosti na obklady",
      "riešenie praktickej výšky a používania",
      "čistý finálny detail kúpeľne alebo WC",
      "možnosť konzultácie pred výberom prvkov"
    ],
    processSteps: defaultProcessSteps,
    faq: makeFaq(
      "sanitu",
      "Cenu ovplyvňuje typ sanity, pripravenosť prívodov a odpadov, stav obkladov, rozsah montáže, počet prvkov a potreba úprav pred osadením."
    ),
    primaryCta: "Objednať konzultáciu",
    secondaryCta: "Poslať fotky kúpeľne",
    paymentType: "consultation_fee",
    jsonLd: {
      serviceType: "Montáž sanity v kúpeľni a WC",
      areaServed: localities,
      providerName: company.name
    }
  },
  {
    slug: "dvere-zarubne-kovania",
    label: "Dvere, zárubne, kovania",
    shortLabel: "Dvere a zárubne",
    h1: "Dvere, zárubne a kovania v Dubnici nad Váhom a okolí",
    intro:
      "Osádzame interiérové dvere, zárubne a kovania tak, aby sedeli s podlahou, stenami aj celkovým štýlom rekonštrukcie. Dôležitá je presnosť, rovina a čisté napojenie na hotový interiér.",
    metaTitle: "Dvere a zárubne Dubnica nad Váhom | mv MARTIŠ",
    metaDescription:
      "Osadenie interiérových dverí, zárubní a kovaní v Dubnici nad Váhom, Ilave, Trenčíne a okolí. Presné napojenie na podlahy a steny.",
    localities,
    benefits: [
      "osadenie v nadväznosti na podlahu a steny",
      "kontrola roviny a funkčnosti otvárania",
      "čisté detaily pri zárubniach a kovaniach",
      "vhodné pri čiastočnej aj kompletnej rekonštrukcii"
    ],
    processSteps: defaultProcessSteps,
    faq: makeFaq(
      "dvere, zárubne a kovania",
      "Cenu ovplyvňuje počet kusov, typ zárubne, pripravenosť stavebného otvoru, nadväznosť na podlahu, kovanie a prípadné úpravy okolia."
    ),
    primaryCta: "Objednať obhliadku",
    secondaryCta: "Poslať rozmery otvorov",
    paymentType: "reservation_fee",
    jsonLd: {
      serviceType: "Osadenie interiérových dverí, zárubní a kovaní",
      areaServed: localities,
      providerName: company.name
    }
  },
  {
    slug: "sadrokarton",
    label: "Sadrokartón",
    shortLabel: "Sadrokartón",
    h1: "Sadrokartón v Dubnici nad Váhom a okolí",
    intro:
      "Sadrokartón používame pri priečkach, podhľadoch, zakrytí rozvodov aj úpravách dispozície. Navrhujeme praktické riešenia, ktoré pomôžu priestoru pôsobiť čistejšie a lepšie pripravené na dokončenie.",
    metaTitle: "Sadrokartón Dubnica nad Váhom | Priečky a podhľady | mv MARTIŠ",
    metaDescription:
      "Sadrokartónové priečky, podhľady a zakrytie rozvodov v Dubnici nad Váhom, Ilave, Trenčíne a okolí. Obhliadka a realizácia.",
    localities,
    benefits: [
      "sadrokartónové priečky a podhľady",
      "zakrytie rozvodov a úprava dispozície",
      "čistejší interiér pred finálnymi prácami",
      "nadväznosť na omietky, podlahy a dvere"
    ],
    processSteps: defaultProcessSteps,
    faq: makeFaq(
      "sadrokartón",
      "Cenu ovplyvňuje plocha, typ konštrukcie, výška, členitosť, izolácia, zakrytie rozvodov a požadovaná pripravenosť pred finálnou úpravou."
    ),
    primaryCta: "Objednať obhliadku",
    secondaryCta: "Poslať fotky priestoru",
    paymentType: "reservation_fee",
    jsonLd: {
      serviceType: "Sadrokartónové priečky, podhľady a interiérové úpravy",
      areaServed: localities,
      providerName: company.name
    }
  },
  {
    slug: "rekonstrukcie-interieru",
    label: "Rekonštrukcie interiéru na kľúč",
    shortLabel: "Rekonštrukcie",
    h1: "Rekonštrukcie interiéru na kľúč v Dubnici nad Váhom a okolí",
    intro:
      "Kompletné rekonštrukcie interiéru spájajú obklady, dlažby, podlahy, sanitu, sadrokartón, dvere a finálne detaily do jedného súvislého postupu. Cieľom je premeniť starší priestor na hotové bývanie bez zbytočného chaosu.",
    metaTitle: "Rekonštrukcie interiéru na kľúč Dubnica nad Váhom | mv MARTIŠ",
    metaDescription:
      "Kompletné rekonštrukcie interiéru na kľúč v Dubnici nad Váhom, Ilave, Trenčíne a okolí. Obhliadka, ponuka, realizácia a odovzdanie.",
    localities,
    benefits: [
      "viac interiérových prác v jednom postupe",
      "menej koordinácie pre zákazníka",
      "jasný rozsah pred začiatkom realizácie",
      "vhodné pre byty, domy, kúpeľne a väčšie úpravy"
    ],
    processSteps: defaultProcessSteps,
    faq: makeFaq(
      "rekonštrukciu interiéru na kľúč",
      "Cenu ovplyvňuje rozsah prác, stav priestoru, materiály, počet profesií, termín, dostupnosť priestoru a miera dokončenia, ktorú zákazník očakáva."
    ),
    primaryCta: "Objednať konzultáciu",
    secondaryCta: "Poslať fotky priestoru",
    paymentType: "consultation_fee",
    jsonLd: {
      serviceType: "Kompletné interiérové rekonštrukcie na kľúč",
      areaServed: localities,
      providerName: company.name
    }
  }
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export const processSteps = defaultProcessSteps.map((step) => step.title);
