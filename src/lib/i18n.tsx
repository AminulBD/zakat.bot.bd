import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Language = "en" | "bn";

const translations = {
  en: {
    // App
    appTitle: "Zakat Calculator",
    appSubtitle: "Calculate your Zakat obligations accurately",
    appDescription: "Enter your assets below to calculate your annual Zakat in BDT (Bangladeshi Taka)",
    bismillah: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    bismillahTranslation: "In the name of Allah, the Most Gracious, the Most Merciful",
    language: "বাংলা",
    darkMode: "Dark Mode",

    // Categories
    cashTitle: "Cash & Bank",
    cashDescription: "Cash in hand and bank accounts",
    cashInHand: "Cash in Hand",
    cashInBank: "Bank Savings / Current Account",
    fixedDeposit: "Fixed Deposit / DPS",

    goldTitle: "Gold",
    goldDescription: "Gold jewelry and assets",
    goldWeight: "Gold Weight (grams)",
    goldValue: "Gold Value (BDT)",
    goldHint: "Market rate per gram is used. Making charge is deducted when entered as grams.",

    silverTitle: "Silver",
    silverDescription: "Silver jewelry and assets",
    silverWeight: "Silver Weight (grams)",
    silverValue: "Silver Value (BDT)",
    silverHint: "Market rate per gram is used. Making charge is deducted when entered as grams.",

    investmentTitle: "Investments",
    investmentDescription: "Stocks, mutual funds, and business",
    stocks: "Stocks / Share Market",
    mutualFunds: "Mutual Funds / Bonds",
    businessAssets: "Business Merchandise / Inventory",
    otherInvestments: "Other Investments",

    othersTitle: "Other Assets",
    othersDescription: "Receivables and other wealth",
    rentalIncome: "Rental Income Receivable",
    otherAssets: "Other Receivable Assets",
    providentFund: "Provident Fund / Pension",
    agriculturalAssets: "Agricultural Assets",

    loansGivenTitle: "Loans Given",
    loansGivenDescription: "Money lent to others (unpaid loans)",
    loansGivenHint: "When a loan is returned after multiple years, zakat is due for all outstanding years.",
    yearsOutstanding: "Years Outstanding",
    loanZakatLabel: "Accumulated Loan Zakat",
    loanZakatDesc: "Zakat on outstanding loans (amount × 2.5% × years)",
    addLoanItem: "Add Loan",
    yearsSuffix: "yr",
    yearsSuffixPlural: "yrs",

    lentMoney: "Money Lent to Others",
    liabilitiesTitle: "Liabilities",
    liabilitiesDescription: "Outstanding debts and dues",
    personalLoans: "Personal Loans / Debts",
    creditCard: "Credit Card Outstanding",
    otherLiabilities: "Other Liabilities / Dues",

    // Summary
    summaryTitle: "Zakat Summary",
    totalAssets: "Total Assets",
    totalLiabilities: "Total Liabilities",
    netAssets: "Net Zakatable Assets",
    nisabThreshold: "Nisab Threshold",
    nisabGold: "Based on Gold (87.48g)",
    nisabSilver: "Based on Silver (612.36g)",
    zakatPayable: "Zakat Payable (2.5%)",
    zakatNotApplicable: "Zakat is not applicable",
    zakatNotApplicableDesc: "Your net assets are below the Nisab threshold. Zakat is not obligatory upon you at this time.",
    zakatApplicable: "Zakat is obligatory upon you",
    zakatApplicableDesc: "Your net assets exceed the Nisab threshold. Please pay your Zakat to purify your wealth.",

    // Nisab
    nisabMethod: "Nisab Calculation Method",
    useGoldNisab: "Gold Standard",
    useSilverNisab: "Silver Standard",
    goldNisabDesc: "87.48 grams of gold",
    silverNisabDesc: "612.36 grams of silver",
    currentGoldPrice: "Gold Price (per gram)",
    currentSilverPrice: "Silver Price (per gram)",

    // Print
    printReport: "Print Report",
    downloadPDF: "Download / Print",
    generatedOn: "Generated on",
    reportTitle: "Zakat Calculation Report",
    printFooter: "This report is generated for personal use. Please consult a scholar for detailed rulings.",

    // Actions
    calculate: "Calculate Zakat",
    reset: "Reset All",
    currency: "BDT",
    currencySymbol: "৳",
    shareLink: "Share",
    copyLink: "Copy Link",
    linkCopied: "Link copied!",
    sharedCalculation: "Shared Calculation",
    sharedCalculationDesc: "This calculation was shared with you. You can modify the values below.",

    // Quran verse
    quranVerse: "\"Take from their wealth a charity to purify them and cause them increase.\"",
    quranRef: "— Surah At-Tawbah (9:103)",

    // Misc
    zakatRate: "Zakat Rate: 2.5%",
    note: "Note",
    nisabNote: "Nisab is the minimum amount of wealth a Muslim must possess before being obligated to pay Zakat. It is calculated based on the current market value of gold or silver.",
    enterAmount: "Enter amount",
    enterWeight: "Enter weight in grams",
    subtotal: "Subtotal",
    category: "Category",
    amount: "Amount",
    details: "Details",

    // Repeatable fields
    addItem: "Add Item",
    removeItem: "Remove",
    itemName: "Description / Name",
    itemNamePlaceholder: "e.g. Sonali Bank Savings",
    enterValueDirectly: "Enter value directly",
    hasMakingCharge: "Has making charge",
    noMakingCharge: "No making charge (bar/coin)",
    addBankAccount: "Add Account",
    addGoldItem: "Add Gold Item",
    addSilverItem: "Add Silver Item",
    addInvestment: "Add Investment",
    addOtherAsset: "Add Asset",
    addLiability: "Add Liability",
    noItems: "No items added yet",
    noItemsHint: "Click the button below to add an item",
    suggestedItems: "Suggested items",
    customItem: "Custom item",
    customItemPlaceholder: "Type a custom name...",

    // Saved calculations
    saveCalculation: "Save",
    savedCalculations: "Saved Calculations",
    savedCalculationsDesc: "Your previously saved Zakat calculations",
    noSavedCalculations: "No saved calculations",
    noSavedCalculationsHint: "Save your current calculation to access it later",
    loadCalculation: "Load",
    deleteCalculation: "Delete",
    deleteAllCalculations: "Delete All",
    calculationSaved: "Saved!",
    calculationName: "Calculation name",
    calculationNamePlaceholder: "e.g. Ramadan 2025",
    savedOn: "Saved on",
    zakatAmount: "Zakat",
    totalAssetsLabel: "Assets",
    confirmDeleteAll: "Are you sure you want to delete all saved calculations?",
    confirmDelete: "Are you sure you want to delete this calculation?",
  },
  bn: {
    // App
    appTitle: "যাকাত ক্যালকুলেটর",
    appSubtitle: "আপনার যাকাতের পরিমাণ সঠিকভাবে হিসাব করুন",
    appDescription: "আপনার বার্ষিক যাকাত বাংলাদেশী টাকায় (BDT) হিসাব করতে নিচে আপনার সম্পদ লিখুন",
    bismillah: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    bismillahTranslation: "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে",
    language: "English",
    darkMode: "ডার্ক মোড",

    // Categories
    cashTitle: "নগদ ও ব্যাংক",
    cashDescription: "হাতে নগদ এবং ব্যাংক অ্যাকাউন্ট",
    cashInHand: "হাতে নগদ টাকা",
    cashInBank: "ব্যাংক সঞ্চয়ী / চলতি হিসাব",
    fixedDeposit: "ফিক্সড ডিপোজিট / ডিপিএস",

    goldTitle: "স্বর্ণ",
    goldDescription: "স্বর্ণালংকার ও স্বর্ণ সম্পদ",
    goldWeight: "স্বর্ণের ওজন (গ্রাম)",
    goldValue: "স্বর্ণের মূল্য (টাকা)",
    goldHint: "বাজার দর প্রতি গ্রাম অনুযায়ী হিসাব হবে। গ্রামে দিলে মেকিং চার্জ কর্তন হবে।",

    silverTitle: "রৌপ্য",
    silverDescription: "রৌপ্যালংকার ও রৌপ্য সম্পদ",
    silverWeight: "রৌপ্যের ওজন (গ্রাম)",
    silverValue: "রৌপ্যের মূল্য (টাকা)",
    silverHint: "বাজার দর প্রতি গ্রাম অনুযায়ী হিসাব হবে। গ্রামে দিলে মেকিং চার্জ কর্তন হবে।",

    investmentTitle: "বিনিয়োগ",
    investmentDescription: "শেয়ার, মিউচুয়াল ফান্ড ও ব্যবসা",
    stocks: "শেয়ার / শেয়ার বাজার",
    mutualFunds: "মিউচুয়াল ফান্ড / বন্ড",
    businessAssets: "ব্যবসায়িক পণ্য / মজুদ",
    otherInvestments: "অন্যান্য বিনিয়োগ",

    othersTitle: "অন্যান্য সম্পদ",
    othersDescription: "পাওনা ও অন্যান্য সম্পদ",
    rentalIncome: "ভাড়া আয় পাওনা",
    otherAssets: "অন্যান্য পাওনা সম্পদ",
    providentFund: "প্রভিডেন্ট ফান্ড / পেনশন",
    agriculturalAssets: "কৃষি সম্পদ",

    loansGivenTitle: "প্রদত্ত ঋণ",
    loansGivenDescription: "অন্যকে ধার দেওয়া টাকা (অপরিশোধিত ঋণ)",
    loansGivenHint: "কেউ বহু বছর পর ঋণ ফেরত দিলে, সব বকেয়া বছরের জন্য যাকাত দিতে হবে।",
    yearsOutstanding: "বকেয়া বছর",
    loanZakatLabel: "সঞ্চিত ঋণ যাকাত",
    loanZakatDesc: "প্রদত্ত ঋণের যাকাত (পরিমাণ × ২.৫% × বছর)",
    addLoanItem: "ঋণ যোগ",
    yearsSuffix: "বছর",
    yearsSuffixPlural: "বছর",

    lentMoney: "অন্যকে ধার দেওয়া টাকা",
    liabilitiesTitle: "দায়",
    liabilitiesDescription: "বকেয়া ঋণ ও পাওনা",
    personalLoans: "ব্যক্তিগত ঋণ / দেনা",
    creditCard: "ক্রেডিট কার্ড বকেয়া",
    otherLiabilities: "অন্যান্য দায় / বকেয়া",

    // Summary
    summaryTitle: "যাকাত সারসংক্ষেপ",
    totalAssets: "মোট সম্পদ",
    totalLiabilities: "মোট দায়",
    netAssets: "নিট যাকাতযোগ্য সম্পদ",
    nisabThreshold: "নিসাব সীমা",
    nisabGold: "স্বর্ণের ভিত্তিতে (৮৭.৪৮ গ্রাম)",
    nisabSilver: "রৌপ্যের ভিত্তিতে (৬১২.৩৬ গ্রাম)",
    zakatPayable: "প্রদেয় যাকাত (২.৫%)",
    zakatNotApplicable: "যাকাত প্রযোজ্য নয়",
    zakatNotApplicableDesc: "আপনার নিট সম্পদ নিসাব সীমার নিচে। এই মুহূর্তে আপনার উপর যাকাত ফরজ নয়।",
    zakatApplicable: "আপনার উপর যাকাত ফরজ",
    zakatApplicableDesc: "আপনার নিট সম্পদ নিসাব সীমা অতিক্রম করেছে। আপনার সম্পদ পবিত্র করতে যাকাত প্রদান করুন।",

    // Nisab
    nisabMethod: "নিসাব হিসাবের পদ্ধতি",
    useGoldNisab: "স্বর্ণ মান",
    useSilverNisab: "রৌপ্য মান",
    goldNisabDesc: "৮৭.৪৮ গ্রাম স্বর্ণ",
    silverNisabDesc: "৬১২.৩৬ গ্রাম রৌপ্য",
    currentGoldPrice: "স্বর্ণের দাম (প্রতি গ্রাম)",
    currentSilverPrice: "রৌপ্যের দাম (প্রতি গ্রাম)",

    // Print
    printReport: "রিপোর্ট প্রিন্ট",
    downloadPDF: "ডাউনলোড / প্রিন্ট",
    generatedOn: "তৈরির তারিখ",
    reportTitle: "যাকাত হিসাব রিপোর্ট",
    printFooter: "এই রিপোর্টটি ব্যক্তিগত ব্যবহারের জন্য তৈরি। বিস্তারিত বিধানের জন্য একজন আলেমের সাথে পরামর্শ করুন।",

    // Actions
    calculate: "যাকাত হিসাব করুন",
    reset: "সব মুছুন",
    currency: "টাকা",
    currencySymbol: "৳",
    shareLink: "শেয়ার",
    copyLink: "লিংক কপি",
    linkCopied: "লিংক কপি হয়েছে!",
    sharedCalculation: "শেয়ারকৃত হিসাব",
    sharedCalculationDesc: "এই হিসাবটি আপনার সাথে শেয়ার করা হয়েছে। নিচে মান পরিবর্তন করতে পারেন।",

    // Quran verse
    quranVerse: "\"তাদের সম্পদ থেকে সদকা নাও, যা দ্বারা তুমি তাদের পবিত্র ও পরিশুদ্ধ করবে।\"",
    quranRef: "— সূরা আত-তাওবাহ (৯:১০৩)",

    // Misc
    zakatRate: "যাকাতের হার: ২.৫%",
    note: "নোট",
    nisabNote: "নিসাব হলো সেই ন্যূনতম সম্পদ যা একজন মুসলিমের থাকলে তার উপর যাকাত ফরজ হয়। এটি স্বর্ণ বা রৌপ্যের বর্তমান বাজার মূল্যের ভিত্তিতে হিসাব করা হয়।",
    enterAmount: "পরিমাণ লিখুন",
    enterWeight: "গ্রামে ওজন লিখুন",
    subtotal: "উপমোট",
    category: "বিভাগ",
    amount: "পরিমাণ",
    details: "বিবরণ",

    // Repeatable fields
    addItem: "আইটেম যোগ করুন",
    removeItem: "মুছুন",
    itemName: "বিবরণ / নাম",
    itemNamePlaceholder: "যেমন: সোনালী ব্যাংক সঞ্চয়ী",
    enterValueDirectly: "সরাসরি মূল্য লিখুন",
    hasMakingCharge: "মেকিং চার্জ আছে",
    noMakingCharge: "মেকিং চার্জ নেই (বার/কয়েন)",
    addBankAccount: "অ্যাকাউন্ট যোগ",
    addGoldItem: "স্বর্ণ যোগ",
    addSilverItem: "রৌপ্য যোগ",
    addInvestment: "বিনিয়োগ যোগ",
    addOtherAsset: "সম্পদ যোগ",
    addLiability: "দায় যোগ",
    noItems: "কোনো আইটেম যোগ করা হয়নি",
    noItemsHint: "নিচের বাটনে ক্লিক করে আইটেম যোগ করুন",
    suggestedItems: "প্রস্তাবিত আইটেম",
    customItem: "কাস্টম আইটেম",
    customItemPlaceholder: "একটি কাস্টম নাম লিখুন...",

    // Saved calculations
    saveCalculation: "সংরক্ষণ",
    savedCalculations: "সংরক্ষিত হিসাব",
    savedCalculationsDesc: "আপনার পূর্বে সংরক্ষিত যাকাত হিসাবসমূহ",
    noSavedCalculations: "কোনো সংরক্ষিত হিসাব নেই",
    noSavedCalculationsHint: "পরে দেখতে আপনার বর্তমান হিসাব সংরক্ষণ করুন",
    loadCalculation: "লোড",
    deleteCalculation: "মুছুন",
    deleteAllCalculations: "সব মুছুন",
    calculationSaved: "সংরক্ষিত!",
    calculationName: "হিসাবের নাম",
    calculationNamePlaceholder: "যেমন: রমজান ২০২৫",
    savedOn: "সংরক্ষণের তারিখ",
    zakatAmount: "যাকাত",
    totalAssetsLabel: "সম্পদ",
    confirmDeleteAll: "আপনি কি সব সংরক্ষিত হিসাব মুছে ফেলতে চান?",
    confirmDelete: "আপনি কি এই হিসাবটি মুছে ফেলতে চান?",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  lang: Language;
  t: (key: TranslationKey) => string;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zakat-lang");
      if (saved === "bn" || saved === "en") return saved;
    }
    return "en";
  });

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[lang][key] ?? translations.en[key] ?? key;
    },
    [lang]
  );

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "bn" : "en";
      localStorage.setItem("zakat-lang", next);
      return next;
    });
  }, []);

  const setLanguageWithSave = useCallback((newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("zakat-lang", newLang);
  }, []);

  return (
    <I18nContext.Provider value={{ lang, t, toggleLanguage, setLanguage: setLanguageWithSave }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useLang() {
  return useI18n().lang;
}

export function useT() {
  return useI18n().t;
}