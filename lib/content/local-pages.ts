import type { ServiceSlug } from "@/lib/contracts";

export type LocalPage = {
  slug: string;
  path: string;
  location: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  contextTitle: string;
  context: string;
  includedTitle: string;
  included: string[];
  processTitle: string;
  process: Array<{ title: string; text: string }>;
  serviceLinks: ServiceSlug[];
  ctaText: string;
  faq: Array<{ question: string; answer: string }>;
};

export const localPages: LocalPage[] = [
  {
    slug: "rekonstrukcie-dubnica-nad-vahom",
    path: "/rekonstrukcie-dubnica-nad-vahom",
    location: "Dubnica nad Váhom",
    title: "Rekonštrukcie interiéru Dubnica nad Váhom | Martiš MV",
    description:
      "Prémiové rekonštrukcie interiéru v Dubnici nad Váhom: obklady, dlažby, podlahy, sanita, sadrokartón a práca na kľúč.",
    h1: "Rekonštrukcie interiéru v Dubnici nad Váhom",
    eyebrow: "Lokálne rekonštrukcie",
    intro:
      "Dubnica nad Váhom je prirodzeným východiskom pre obhliadky, konzultácie a interiérové práce. Pomáhame s čiastočnými úpravami aj väčšími rekonštrukciami, kde má na seba nadväzovať príprava, obklady, podlahy, sanita a finálny detail.",
    contextTitle: "Praktický postup pre byty a domy v Dubnici",
    context:
      "Pri rekonštrukcii v Dubnici je dôležité rýchlo pochopiť stav priestoru, prístup, pripravenosť podkladu a rozsah prác. Preto začíname obhliadkou alebo fotkami, aby bolo jasné, čo sa dá spraviť hneď a čo si vyžaduje presnejšiu prípravu.",
    includedTitle: "Čo vieme riešiť",
    included: [
      "kúpeľne, WC, kuchyne a technické miestnosti",
      "obklady, dlažby, podlahy a sadrokartón",
      "sanitu, dvere, zárubne, kovania a nadväzujúce detaily",
      "kompletnejší postup pri rekonštrukcii interiéru na kľúč"
    ],
    processTitle: "Ako prebieha spolupráca v Dubnici",
    process: [
      {
        title: "Rýchle zorientovanie",
        text: "Zavoláte, pošlete fotky alebo vyplníte formulár a upresníme, či stačí konzultácia alebo je vhodná obhliadka."
      },
      {
        title: "Obhliadka priestoru",
        text: "Pozrieme rozmery, stav podkladu, napojenia a praktické obmedzenia, ktoré ovplyvnia cenu aj termín."
      },
      {
        title: "Dohoda rozsahu",
        text: "Zosúladíme práce, materiál, poradie krokov a ďalší postup tak, aby realizácia nebola chaotická."
      }
    ],
    serviceLinks: ["rekonstrukcie-interieru", "obklady", "dlazby", "sanita"],
    ctaText: "Rezervovať obhliadku v Dubnici",
    faq: [
      {
        question: "Robíte v Dubnici aj menšie práce?",
        answer:
          "Áno, podľa rozsahu. Menšie práce je dobré najskôr posúdiť cez fotky alebo krátky telefonát, aby bol jasný ďalší krok."
      },
      {
        question: "Je obhliadka v Dubnici potrebná?",
        answer:
          "Pri väčšine rekonštrukcií áno. Obhliadka pomôže určiť stav priestoru, rozsah, cenu, materiál a možné riziká."
      }
    ]
  },
  {
    slug: "rekonstrukcie-trencin",
    path: "/rekonstrukcie-trencin",
    location: "Trenčín",
    title: "Rekonštrukcie interiéru Trenčín | Martiš MV",
    description:
      "Interiérové rekonštrukcie pre Trenčín a okolie: kúpeľne, podlahy, obklady, sadrokartón, sanita a koordinovaný postup prác.",
    h1: "Rekonštrukcie interiéru pre Trenčín",
    eyebrow: "Regionálny servis",
    intro:
      "V Trenčíne a okolí dávajú zmysel najmä dobre pripravené práce s jasným rozsahom: od kúpeľne a podláh až po nadväzujúce interiérové detaily. Cieľom je, aby zákazník rozumel postupu ešte pred začiatkom realizácie.",
    contextTitle: "Dôraz na prípravu a koordináciu",
    context:
      "Pri väčších rekonštrukciách v Trenčíne býva rozhodujúce poradie prác a pripravenosť priestoru. Riešime, čo má prísť ako prvé, ako na seba nadviažu obklady, podlahy, dvere a sanita, a kde môžu vzniknúť technické obmedzenia.",
    includedTitle: "Najčastejšie práce pre Trenčín",
    included: [
      "rekonštrukcie kúpeľní a interiérových častí",
      "dlažby, obklady a prípravu podkladov",
      "podlahy, dvere a čisté ukončenia pri prechodoch",
      "sadrokartónové úpravy a zakrytie rozvodov"
    ],
    processTitle: "Ako nastavíme projekt",
    process: [
      {
        title: "Vstupné informácie",
        text: "Najskôr pomôžu fotky, rozmery, lokalita a predstava o rozsahu, aby bolo možné určiť typ ďalšieho kroku."
      },
      {
        title: "Technické posúdenie",
        text: "Pri obhliadke riešime podklad, napojenia, materiál, logistiku a možné miesta, ktoré môžu zdržať realizáciu."
      },
      {
        title: "Jasný ďalší krok",
        text: "Po posúdení sa dohodne, či má ísť o obhliadku, konzultáciu alebo konkrétnu cenovú ponuku."
      }
    ],
    serviceLinks: ["rekonstrukcie-interieru", "podlahy", "sadrokarton", "dvere-zarubne-kovania"],
    ctaText: "Dohodnúť ďalší krok v Trenčíne",
    faq: [
      {
        question: "Chodíte na obhliadky aj do Trenčína?",
        answer:
          "Áno, Trenčín patrí do obsluhovanej oblasti. Pri prvom kontakte pomôžu fotky priestoru a stručný opis rozsahu."
      },
      {
        question: "Viete riešiť viac prác naraz?",
        answer:
          "Áno, najmä pri interiérových úpravách, kde na seba nadväzujú obklady, podlahy, sanita, dvere alebo sadrokartón."
      }
    ]
  },
  {
    slug: "rekonstrukcie-ilava",
    path: "/rekonstrukcie-ilava",
    location: "Ilava",
    title: "Rekonštrukcie interiéru Ilava | Martiš MV",
    description:
      "Rekonštrukcie interiérov v Ilave: obhliadka, kúpeľne, obklady, dlažby, podlahy, sadrokartón a čisté dokončenie detailov.",
    h1: "Rekonštrukcie interiéru v Ilave",
    eyebrow: "Ilava a blízke okolie",
    intro:
      "Pre Ilavu sú vhodné najmä praktické interiérové riešenia s presným rozsahom a rozumným postupom. Pri rekonštrukcii sa sústredíme na pripravenosť priestoru, kvalitu detailu a zrozumiteľnú komunikáciu pred realizáciou.",
    contextTitle: "Rekonštrukcia bez zbytočného chaosu",
    context:
      "Pri bytoch a domoch v Ilave sa často rieši kombinácia viacerých menších prác. Dôležité je vedieť, čo má nadväzovať na čo: príprava stien, podklad, obklady, dlažby, podlahy a finálne osadenie prvkov.",
    includedTitle: "S čím vieme pomôcť",
    included: [
      "úpravy kúpeľní, WC a chodieb",
      "pokládku dlažby a realizáciu obkladov",
      "prípravu podkladov a sadrokartónové riešenia",
      "dvere, zárubne, kovania a záverečné interiérové detaily"
    ],
    processTitle: "Od prvého kontaktu po realizáciu",
    process: [
      {
        title: "Opis priestoru",
        text: "Zákazník pošle základné informácie, fotky alebo zavolá, aby sme rozlíšili menšiu opravu od širšej rekonštrukcie."
      },
      {
        title: "Rozsah a riziká",
        text: "Pri obhliadke sa preverí podklad, prístup, rozmery, materiál a všetko, čo môže ovplyvniť výsledok."
      },
      {
        title: "Realizačný postup",
        text: "Dohodne sa poradie prác, očakávaný rozsah a praktické detaily, ktoré majú byť vyriešené pred začiatkom."
      }
    ],
    serviceLinks: ["obklady", "dlazby", "omietky", "rekonstrukcie-interieru"],
    ctaText: "Rezervovať obhliadku v Ilave",
    faq: [
      {
        question: "Je Ilava v obsluhovanej oblasti?",
        answer:
          "Áno, Ilava patrí medzi obsluhované lokality pre interiérové rekonštrukcie a súvisiace práce podľa rozsahu."
      },
      {
        question: "Stačí poslať fotky pred obhliadkou?",
        answer:
          "Na prvé posúdenie často áno. Pri presnej ponuke alebo väčšom rozsahu je osobná obhliadka istejšia."
      }
    ]
  },
  {
    slug: "rekonstrukcie-nova-dubnica",
    path: "/rekonstrukcie-nova-dubnica",
    location: "Nová Dubnica",
    title: "Rekonštrukcie interiéru Nová Dubnica | Martiš MV",
    description:
      "Rekonštrukcie interiérov pre Novú Dubnicu: lokálny kontakt, obhliadka, kúpeľne, podlahy, obklady, sanita a sadrokartón.",
    h1: "Rekonštrukcie interiéru v Novej Dubnici",
    eyebrow: "Blízko Dubnice nad Váhom",
    intro:
      "Nová Dubnica je prirodzene blízko hlavnej obsluhovanej oblasti, preto je vhodná pre rýchle zorientovanie, obhliadku aj následné interiérové práce. Dôležitý je jasný rozsah a presný detail pri dokončení.",
    contextTitle: "Lokálne práce s jasným výsledkom",
    context:
      "Pri rekonštrukciách v Novej Dubnici sa často riešia byty, kúpeľne, chodby alebo menšie interiérové zmeny. Pomáhame nastaviť postup tak, aby boli práce technicky správne a výsledok pôsobil čisto.",
    includedTitle: "Typický rozsah prác",
    included: [
      "obklady a dlažby do kúpeľní, WC a chodieb",
      "podlahy a napojenia pri dverách",
      "sanitu a interiérové dokončovacie prvky",
      "sadrokartónové úpravy a prípravu stien"
    ],
    processTitle: "Ako sa rozhodnúť pre ďalší krok",
    process: [
      {
        title: "Fotky alebo formulár",
        text: "Na začiatok stačí krátky opis, fotky priestoru alebo rezervácia obhliadky cez web."
      },
      {
        title: "Kontrola miesta",
        text: "Pri obhliadke sa skontroluje stav priestoru, rozmery, podklad a nadväznosť jednotlivých prác."
      },
      {
        title: "Dohoda realizácie",
        text: "Po upresnení rozsahu sa nastaví praktický postup, aby zákazník vedel, čo bude nasledovať."
      }
    ],
    serviceLinks: ["rekonstrukcie-interieru", "sanita", "podlahy", "sadrokarton"],
    ctaText: "Rezervovať obhliadku v Novej Dubnici",
    faq: [
      {
        question: "Riešite aj rekonštrukcie v Novej Dubnici?",
        answer:
          "Áno, Nová Dubnica je súčasťou prirodzenej obsluhovanej oblasti okolo Dubnice nad Váhom."
      },
      {
        question: "Kedy je vhodná platená konzultácia?",
        answer:
          "Najmä vtedy, keď potrebujete prejsť viac možností, materiály, postup alebo rozsah ešte pred konkrétnou realizáciou."
      }
    ]
  },
  {
    slug: "rekonstrukcie-trencianska-tepla",
    path: "/rekonstrukcie-trencianska-tepla",
    location: "Trenčianska Teplá",
    title: "Rekonštrukcie interiéru Trenčianska Teplá | Martiš MV",
    description:
      "Interiérové rekonštrukcie v Trenčianskej Teplej: obklady, dlažby, podlahy, sanita, sadrokartón a praktický postup prác.",
    h1: "Rekonštrukcie interiéru v Trenčianskej Teplej",
    eyebrow: "Okolie Dubnice nad Váhom",
    intro:
      "Trenčianska Teplá patrí do blízkeho okolia Dubnice nad Váhom, kde majú zmysel praktické rekonštrukcie s dobrou prípravou. Pomáhame najmä tam, kde treba zosúladiť viac interiérových prác do jedného postupu.",
    contextTitle: "Dôležitá je pripravenosť priestoru",
    context:
      "Pri menších obciach a rodinných domoch býva rozhodujúci prístup, rozsah prác a stav existujúcich povrchov. Pred realizáciou preto riešime, čo je pripravené, čo treba upraviť a kde môžu vzniknúť technické obmedzenia.",
    includedTitle: "Práce vhodné pre túto lokalitu",
    included: [
      "rekonštrukcie kúpeľní a interiérových častí domu",
      "obklady, dlažby a podlahy s prípravou podkladu",
      "sadrokartónové prvky, úpravy stien a zakrytie rozvodov",
      "sanitu, dvere, zárubne a nadväzujúce dokončenie"
    ],
    processTitle: "Praktický postup bez zbytočných sľubov",
    process: [
      {
        title: "Predbežné posúdenie",
        text: "Najskôr dáva zmysel poslať fotky a stručný opis, aby sa dalo odhadnúť, či je potrebná obhliadka."
      },
      {
        title: "Obhliadka alebo konzultácia",
        text: "Podľa rozsahu sa rieši stav priestoru, možnosti realizácie, technické detaily a očakávania zákazníka."
      },
      {
        title: "Dohodnutý rozsah",
        text: "Výstupom má byť jasný ďalší krok: konkrétna práca, konzultácia alebo pripravenie cenovej ponuky."
      }
    ],
    serviceLinks: ["rekonstrukcie-interieru", "obklady", "podlahy", "dvere-zarubne-kovania"],
    ctaText: "Rezervovať obhliadku v Trenčianskej Teplej",
    faq: [
      {
        question: "Je Trenčianska Teplá v dosahu?",
        answer:
          "Áno, Trenčianska Teplá patrí medzi blízke lokality v okolí Dubnice nad Váhom a Považia."
      },
      {
        question: "Viete prísť aj k rodinnému domu?",
        answer:
          "Áno, podľa dohody a rozsahu. Pri dome je obzvlášť dôležité vidieť prístup, podklad a nadväznosť prác."
      }
    ]
  }
];

export function getLocalPage(slug: string) {
  return localPages.find((page) => page.slug === slug);
}
