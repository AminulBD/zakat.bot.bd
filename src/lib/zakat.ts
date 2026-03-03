// Zakat Calculation Logic
// All calculations are done in BDT (Bangladeshi Taka)

// ─── Constants ───────────────────────────────────────────────────────────────

// Nisab thresholds based on Islamic jurisprudence
// Gold Nisab: 87.48 grams (7.5 tola)
// Silver Nisab: 612.36 grams (52.5 tola)
export const GOLD_NISAB_GRAMS = 87.48;
export const SILVER_NISAB_GRAMS = 612.36;

// Default market prices in BDT (users can override)
// See: https://www.bajus.org/gold-price
export const DEFAULT_GOLD_PRICE_PER_GRAM = 23785; // BDT per gram (22K)
export const DEFAULT_SILVER_PRICE_PER_GRAM = 615; // BDT per gram

// Zakat rate
export const ZAKAT_RATE = 0.025; // 2.5%

// ─── Entry Types ─────────────────────────────────────────────────────────────

/**
 * A single repeatable entry within any category.
 * Every field (bank account, gold source, loan, etc.) is an Entry.
 */
export interface Entry {
  id: string;
  label: string;
  amount: number;
}

/**
 * A repeatable entry for gold/silver that can be entered by weight OR direct value.
 */
export interface MetalEntry {
  id: string;
  label: string;
  weightGrams: number;
  /** If true, user enters BDT value directly instead of weight */
  useManualValue: boolean;
  manualValue: number;
}

/**
 * A loan entry with the amount lent and the number of years it was outstanding.
 * When a loan is returned, zakat must be paid for all the years it was unpaid.
 * Zakat on loan = amount × 2.5% × yearsOutstanding
 */
export interface LoanEntry {
  id: string;
  label: string;
  amount: number;
  yearsOutstanding: number;
}

// ─── Category Data ───────────────────────────────────────────────────────────

export interface CashAssets {
  entries: Entry[];
}

export interface GoldAssets {
  entries: MetalEntry[];
}

export interface SilverAssets {
  entries: MetalEntry[];
}

export interface InvestmentAssets {
  entries: Entry[];
}

export interface OtherAssets {
  entries: Entry[];
}

export interface LoanGivenAssets {
  entries: LoanEntry[];
}

export interface Liabilities {
  entries: Entry[];
}

// ─── Full Input Model ────────────────────────────────────────────────────────

export interface ZakatInput {
  cash: CashAssets;
  gold: GoldAssets;
  silver: SilverAssets;
  investments: InvestmentAssets;
  others: OtherAssets;
  loansGiven: LoanGivenAssets;
  liabilities: Liabilities;
  goldPricePerGram: number;
  silverPricePerGram: number;
  nisabMethod: "gold" | "silver";
}

// ─── Result Types ────────────────────────────────────────────────────────────

export interface BreakdownItem {
  label: string;
  amount: number;
}

export interface CategoryBreakdown {
  label: string;
  amount: number;
  items: BreakdownItem[];
}

export interface ZakatResult {
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
  nisabThreshold: number;
  nisabGold: number;
  nisabSilver: number;
  nisabMethod: "gold" | "silver";
  isZakatApplicable: boolean;
  zakatPayable: number;
  /** Accumulated zakat on loans given (amount × 2.5% × years for each loan) */
  loanZakat: number;
  breakdown: CategoryBreakdown[];
}

// ─── ID Helper ───────────────────────────────────────────────────────────────

let _counter = 0;

export function generateId(): string {
  _counter += 1;
  return `e_${Date.now()}_${_counter}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Entry Factory Helpers ───────────────────────────────────────────────────

export function createEntry(label: string, amount: number = 0): Entry {
  return { id: generateId(), label, amount };
}

export function createLoanEntry(label: string, amount: number = 0, yearsOutstanding: number = 1): LoanEntry {
  return { id: generateId(), label, amount, yearsOutstanding };
}

export function createMetalEntry(label: string): MetalEntry {
  return {
    id: generateId(),
    label,
    weightGrams: 0,
    useManualValue: false,
    manualValue: 0,
  };
}

// ─── Default Category Presets ────────────────────────────────────────────────
// Each category starts with sensible default rows that the user can rename,
// remove, or add more of.

export type CategoryPreset = {
  key: string;
  en: string;
  bn: string;
};

export const CASH_PRESETS: CategoryPreset[] = [
  { key: "cashInHand", en: "Cash in Hand", bn: "হাতে নগদ টাকা" },
  { key: "cashInBank", en: "Bank Savings / Current Account", bn: "ব্যাংক সঞ্চয়ী / চলতি হিসাব" },
  { key: "fixedDeposit", en: "Fixed Deposit / DPS", bn: "ফিক্সড ডিপোজিট / ডিপিএস" },
];

export const GOLD_PRESETS: CategoryPreset[] = [
  { key: "goldJewelry", en: "Gold Jewelry", bn: "স্বর্ণালংকার" },
];

export const SILVER_PRESETS: CategoryPreset[] = [
  { key: "silverJewelry", en: "Silver Jewelry", bn: "রৌপ্যালংকার" },
];

export const INVESTMENT_PRESETS: CategoryPreset[] = [
  { key: "stocks", en: "Stocks / Share Market", bn: "শেয়ার / শেয়ার বাজার" },
  { key: "mutualFunds", en: "Mutual Funds / Bonds", bn: "মিউচুয়াল ফান্ড / বন্ড" },
  { key: "businessAssets", en: "Business Merchandise / Inventory", bn: "ব্যবসায়িক পণ্য / মজুদ" },
];

export const OTHERS_PRESETS: CategoryPreset[] = [
  { key: "rentalIncome", en: "Rental Income Receivable", bn: "ভাড়া আয় পাওনা" },
  { key: "providentFund", en: "Provident Fund / Pension", bn: "প্রভিডেন্ট ফান্ড / পেনশন" },
];

export const LOAN_GIVEN_PRESETS: CategoryPreset[] = [
  { key: "personalLoan", en: "Personal Loan Given", bn: "ব্যক্তিগত ঋণ দেওয়া" },
];

export const LIABILITY_PRESETS: CategoryPreset[] = [
  { key: "personalLoans", en: "Personal Loans / Debts", bn: "ব্যক্তিগত ঋণ / দেনা" },
  { key: "creditCard", en: "Credit Card Outstanding", bn: "ক্রেডিট কার্ড বকেয়া" },
];

// ─── "New row" suggested labels ──────────────────────────────────────────────
// When user clicks "Add", these are suggested names they can pick from or type custom.

export const CASH_SUGGESTIONS: CategoryPreset[] = [
  { key: "bankAccount", en: "Bank Account", bn: "ব্যাংক অ্যাকাউন্ট" },
  { key: "mobileBanking", en: "Mobile Banking (bKash/Nagad)", bn: "মোবাইল ব্যাংকিং (বিকাশ/নগদ)" },
  { key: "foreignCurrency", en: "Foreign Currency", bn: "বৈদেশিক মুদ্রা" },
  { key: "cashInLocker", en: "Cash in Locker / Safe", bn: "লকার / সেফে নগদ" },
  { key: "dps", en: "DPS / Recurring Deposit", bn: "ডিপিএস / রিকারিং ডিপোজিট" },
  { key: "fixedDeposit2", en: "Fixed Deposit", bn: "ফিক্সড ডিপোজিট" },
];

export const GOLD_SUGGESTIONS: CategoryPreset[] = [
  { key: "goldBar", en: "Gold Bar / Coin", bn: "গোল্ড বার / কয়েন" },
  { key: "goldNecklace", en: "Gold Necklace", bn: "স্বর্ণের হার" },
  { key: "goldBangle", en: "Gold Bangles", bn: "স্বর্ণের চুড়ি" },
  { key: "goldRing", en: "Gold Ring", bn: "স্বর্ণের আংটি" },
  { key: "goldEarring", en: "Gold Earrings", bn: "স্বর্ণের কানের দুল" },
  { key: "goldOther", en: "Other Gold Items", bn: "অন্যান্য স্বর্ণ" },
];

export const SILVER_SUGGESTIONS: CategoryPreset[] = [
  { key: "silverBar", en: "Silver Bar / Coin", bn: "সিলভার বার / কয়েন" },
  { key: "silverBangle", en: "Silver Bangles", bn: "রৌপ্যের চুড়ি" },
  { key: "silverUtensil", en: "Silver Utensils", bn: "রৌপ্যের বাসনপত্র" },
  { key: "silverOther", en: "Other Silver Items", bn: "অন্যান্য রৌপ্য" },
];

export const INVESTMENT_SUGGESTIONS: CategoryPreset[] = [
  { key: "sanchaypatra", en: "Sanchayapatra", bn: "সঞ্চয়পত্র" },
  { key: "crypto", en: "Cryptocurrency", bn: "ক্রিপ্টোকারেন্সি" },
  { key: "businessPartnership", en: "Business Partnership", bn: "ব্যবসায়িক অংশীদারিত্ব" },
  { key: "shopInventory", en: "Shop Inventory", bn: "দোকানের মজুদ" },
  { key: "otherInvestment", en: "Other Investment", bn: "অন্যান্য বিনিয়োগ" },
];

export const OTHERS_SUGGESTIONS: CategoryPreset[] = [
  { key: "otherReceivable", en: "Other Receivable Assets", bn: "অন্যান্য পাওনা সম্পদ" },
  { key: "agriculturalAssets", en: "Agricultural Assets", bn: "কৃষি সম্পদ" },
  { key: "landForSale", en: "Land / Property for Sale", bn: "বিক্রয়যোগ্য জমি / সম্পত্তি" },
  { key: "securityDeposit", en: "Security Deposit", bn: "জামানত / সিকিউরিটি ডিপোজিট" },
  { key: "advancePaid", en: "Advance Paid", bn: "অগ্রিম প্রদান" },
];

export const LOAN_GIVEN_SUGGESTIONS: CategoryPreset[] = [
  { key: "familyLoan", en: "Loan to Family Member", bn: "পরিবারের সদস্যকে ঋণ" },
  { key: "friendLoan", en: "Loan to Friend", bn: "বন্ধুকে ঋণ" },
  { key: "businessLoan", en: "Business Loan Given", bn: "ব্যবসায়িক ঋণ দেওয়া" },
  { key: "otherLoan", en: "Other Loan Given", bn: "অন্যান্য ঋণ দেওয়া" },
];

export const LIABILITY_SUGGESTIONS: CategoryPreset[] = [
  { key: "homeLoan", en: "Home Loan / Mortgage", bn: "গৃহ ঋণ / মর্টগেজ" },
  { key: "carLoan", en: "Car Loan", bn: "গাড়ির ঋণ" },
  { key: "educationLoan", en: "Education Loan", bn: "শিক্ষা ঋণ" },
  { key: "utilityBill", en: "Utility Bills Due", bn: "বকেয়া ইউটিলিটি বিল" },
  { key: "otherDebt", en: "Other Debts", bn: "অন্যান্য দেনা" },
  { key: "taxDue", en: "Tax Due", bn: "বকেয়া কর" },
];

// ─── Default State Factories ─────────────────────────────────────────────────

function presetsToEntries(presets: CategoryPreset[], lang: "en" | "bn" = "en"): Entry[] {
  return presets.map((p) => createEntry(lang === "bn" ? p.bn : p.en));
}

function presetsToMetalEntries(presets: CategoryPreset[], lang: "en" | "bn" = "en"): MetalEntry[] {
  return presets.map((p) => createMetalEntry(lang === "bn" ? p.bn : p.en));
}

function presetsToLoanEntries(presets: CategoryPreset[], lang: "en" | "bn" = "en"): LoanEntry[] {
  return presets.map((p) => createLoanEntry(lang === "bn" ? p.bn : p.en));
}

export function createDefaultCash(lang: "en" | "bn" = "en"): CashAssets {
  return { entries: presetsToEntries(CASH_PRESETS, lang) };
}

export function createDefaultGold(lang: "en" | "bn" = "en"): GoldAssets {
  return { entries: presetsToMetalEntries(GOLD_PRESETS, lang) };
}

export function createDefaultSilver(lang: "en" | "bn" = "en"): SilverAssets {
  return { entries: presetsToMetalEntries(SILVER_PRESETS, lang) };
}

export function createDefaultInvestments(lang: "en" | "bn" = "en"): InvestmentAssets {
  return { entries: presetsToEntries(INVESTMENT_PRESETS, lang) };
}

export function createDefaultOthers(lang: "en" | "bn" = "en"): OtherAssets {
  return { entries: presetsToEntries(OTHERS_PRESETS, lang) };
}

export function createDefaultLoansGiven(lang: "en" | "bn" = "en"): LoanGivenAssets {
  return { entries: presetsToLoanEntries(LOAN_GIVEN_PRESETS, lang) };
}

export function createDefaultLiabilities(lang: "en" | "bn" = "en"): Liabilities {
  return { entries: presetsToEntries(LIABILITY_PRESETS, lang) };
}

export function createDefaultInput(lang: "en" | "bn" = "en"): ZakatInput {
  return {
    cash: createDefaultCash(lang),
    gold: createDefaultGold(lang),
    silver: createDefaultSilver(lang),
    investments: createDefaultInvestments(lang),
    others: createDefaultOthers(lang),
    loansGiven: createDefaultLoansGiven(lang),
    liabilities: createDefaultLiabilities(lang),
    goldPricePerGram: DEFAULT_GOLD_PRICE_PER_GRAM,
    silverPricePerGram: DEFAULT_SILVER_PRICE_PER_GRAM,
    nisabMethod: "silver",
  };
}

// ─── Calculation Helpers ─────────────────────────────────────────────────────

export function sumEntries(entries: Entry[]): number {
  return entries.reduce((sum, e) => sum + safeNum(e.amount), 0);
}

/** Sum the principal amounts of all loan entries */
export function sumLoanEntries(entries: LoanEntry[]): number {
  return entries.reduce((sum, e) => sum + safeNum(e.amount), 0);
}

/**
 * Calculate accumulated zakat on loans given.
 * For each loan: amount × 2.5% × yearsOutstanding
 */
export function calculateLoanZakat(entries: LoanEntry[]): number {
  return entries.reduce((sum, e) => {
    const amount = safeNum(e.amount);
    const years = safeNum(e.yearsOutstanding);
    return sum + amount * ZAKAT_RATE * years;
  }, 0);
}

export function metalEntryValue(entry: MetalEntry, pricePerGram: number): number {
  if (entry.useManualValue) {
    return safeNum(entry.manualValue);
  }
  return safeNum(entry.weightGrams) * safeNum(pricePerGram);
}

export function sumMetalEntries(entries: MetalEntry[], pricePerGram: number): number {
  return entries.reduce((sum, e) => sum + metalEntryValue(e, pricePerGram), 0);
}

export function calculateNisab(
  goldPricePerGram: number,
  silverPricePerGram: number
): { gold: number; silver: number } {
  return {
    gold: GOLD_NISAB_GRAMS * safeNum(goldPricePerGram),
    silver: SILVER_NISAB_GRAMS * safeNum(silverPricePerGram),
  };
}

// ─── Main Calculation ────────────────────────────────────────────────────────

export function calculateZakat(input: ZakatInput): ZakatResult {
  const goldPrice = safeNum(input.goldPricePerGram) || DEFAULT_GOLD_PRICE_PER_GRAM;
  const silverPrice = safeNum(input.silverPricePerGram) || DEFAULT_SILVER_PRICE_PER_GRAM;

  const cashTotal = sumEntries(input.cash.entries);
  const goldTotal = sumMetalEntries(input.gold.entries, goldPrice);
  const silverTotal = sumMetalEntries(input.silver.entries, silverPrice);
  const investmentTotal = sumEntries(input.investments.entries);
  const othersTotal = sumEntries(input.others.entries);
  const loansGivenTotal = sumLoanEntries(input.loansGiven.entries);
  const liabilitiesTotal = sumEntries(input.liabilities.entries);

  // Loan principal is part of your assets (money owed to you)
  const totalAssets = cashTotal + goldTotal + silverTotal + investmentTotal + othersTotal + loansGivenTotal;
  const netAssets = Math.max(0, totalAssets - liabilitiesTotal);

  const nisab = calculateNisab(goldPrice, silverPrice);
  const nisabThreshold = input.nisabMethod === "gold" ? nisab.gold : nisab.silver;

  const isZakatApplicable = netAssets >= nisabThreshold;
  const zakatPayable = isZakatApplicable ? netAssets * ZAKAT_RATE : 0;

  // Accumulated zakat on outstanding loans (amount × 2.5% × years each)
  const loanZakat = calculateLoanZakat(input.loansGiven.entries);

  // Build breakdown for report/summary
  const breakdown: CategoryBreakdown[] = [
    {
      label: "cash",
      amount: cashTotal,
      items: input.cash.entries
        .filter((e) => safeNum(e.amount) > 0)
        .map((e) => ({ label: e.label, amount: safeNum(e.amount) })),
    },
    {
      label: "gold",
      amount: goldTotal,
      items: input.gold.entries
        .filter((e) => metalEntryValue(e, goldPrice) > 0)
        .map((e) => ({ label: e.label, amount: metalEntryValue(e, goldPrice) })),
    },
    {
      label: "silver",
      amount: silverTotal,
      items: input.silver.entries
        .filter((e) => metalEntryValue(e, silverPrice) > 0)
        .map((e) => ({ label: e.label, amount: metalEntryValue(e, silverPrice) })),
    },
    {
      label: "investments",
      amount: investmentTotal,
      items: input.investments.entries
        .filter((e) => safeNum(e.amount) > 0)
        .map((e) => ({ label: e.label, amount: safeNum(e.amount) })),
    },
    {
      label: "others",
      amount: othersTotal,
      items: input.others.entries
        .filter((e) => safeNum(e.amount) > 0)
        .map((e) => ({ label: e.label, amount: safeNum(e.amount) })),
    },
    {
      label: "loansGiven",
      amount: loansGivenTotal,
      items: input.loansGiven.entries
        .filter((e) => safeNum(e.amount) > 0)
        .map((e) => ({
          label: `${e.label} (${safeNum(e.yearsOutstanding)} yr${safeNum(e.yearsOutstanding) !== 1 ? "s" : ""})`,
          amount: safeNum(e.amount),
        })),
    },
    {
      label: "liabilities",
      amount: liabilitiesTotal,
      items: input.liabilities.entries
        .filter((e) => safeNum(e.amount) > 0)
        .map((e) => ({ label: e.label, amount: safeNum(e.amount) })),
    },
  ];

  return {
    totalAssets,
    totalLiabilities: liabilitiesTotal,
    netAssets,
    nisabThreshold,
    nisabGold: nisab.gold,
    nisabSilver: nisab.silver,
    nisabMethod: input.nisabMethod,
    isZakatApplicable,
    zakatPayable,
    loanZakat,
    breakdown,
  };
}

// ─── Entry Mutation Helpers ──────────────────────────────────────────────────
// Pure functions that return new arrays — used by category components.

export function addEntry(entries: Entry[], label: string): Entry[] {
  return [...entries, createEntry(label)];
}

export function removeEntry(entries: Entry[], id: string): Entry[] {
  return entries.filter((e) => e.id !== id);
}

export function updateEntryAmount(entries: Entry[], id: string, amount: number): Entry[] {
  return entries.map((e) => (e.id === id ? { ...e, amount } : e));
}

export function updateEntryLabel(entries: Entry[], id: string, label: string): Entry[] {
  return entries.map((e) => (e.id === id ? { ...e, label } : e));
}

export function addMetalEntry(entries: MetalEntry[], label: string): MetalEntry[] {
  return [...entries, createMetalEntry(label)];
}

export function removeMetalEntry(entries: MetalEntry[], id: string): MetalEntry[] {
  return entries.filter((e) => e.id !== id);
}

export function updateMetalEntry(
  entries: MetalEntry[],
  id: string,
  updates: Partial<Omit<MetalEntry, "id">>
): MetalEntry[] {
  return entries.map((e) => (e.id === id ? { ...e, ...updates } : e));
}

// ─── Loan Entry Mutation Helpers ─────────────────────────────────────────────

export function addLoanEntry(entries: LoanEntry[], label: string): LoanEntry[] {
  return [...entries, createLoanEntry(label)];
}

export function removeLoanEntry(entries: LoanEntry[], id: string): LoanEntry[] {
  return entries.filter((e) => e.id !== id);
}

export function updateLoanEntry(
  entries: LoanEntry[],
  id: string,
  updates: Partial<Omit<LoanEntry, "id">>
): LoanEntry[] {
  return entries.map((e) => (e.id === id ? { ...e, ...updates } : e));
}

// ─── URL Sharing (Base64 encode/decode) ──────────────────────────────────────

/**
 * Compact representation of ZakatInput for URL sharing.
 * Strips IDs and only keeps entries with non-zero values to minimize payload.
 */
interface CompactEntry {
  l: string;   // label
  a: number;   // amount
}

interface CompactMetalEntry {
  l: string;   // label
  w: number;   // weightGrams
  m: boolean;  // useManualValue
  v: number;   // manualValue
}

interface CompactLoanEntry {
  l: string;   // label
  a: number;   // amount
  y: number;   // yearsOutstanding
}

interface CompactInput {
  c: CompactEntry[];          // cash
  g: CompactMetalEntry[];     // gold
  s: CompactMetalEntry[];     // silver
  i: CompactEntry[];          // investments
  o: CompactEntry[];          // others
  lg: CompactLoanEntry[];     // loansGiven
  li: CompactEntry[];         // liabilities
  gp: number;                 // goldPricePerGram
  sp: number;                 // silverPricePerGram
  nm: "g" | "s";             // nisabMethod
}

/**
 * Encode ZakatInput into a URL-safe base64 string.
 * Only includes entries that have a non-zero amount/weight for compactness.
 */
export function encodeZakatInput(input: ZakatInput): string {
  const compact: CompactInput = {
    c: input.cash.entries
      .filter((e) => safeNum(e.amount) > 0)
      .map((e) => ({ l: e.label, a: e.amount })),
    g: input.gold.entries
      .filter((e) => e.weightGrams > 0 || e.manualValue > 0)
      .map((e) => ({ l: e.label, w: e.weightGrams, m: e.useManualValue, v: e.manualValue })),
    s: input.silver.entries
      .filter((e) => e.weightGrams > 0 || e.manualValue > 0)
      .map((e) => ({ l: e.label, w: e.weightGrams, m: e.useManualValue, v: e.manualValue })),
    i: input.investments.entries
      .filter((e) => safeNum(e.amount) > 0)
      .map((e) => ({ l: e.label, a: e.amount })),
    o: input.others.entries
      .filter((e) => safeNum(e.amount) > 0)
      .map((e) => ({ l: e.label, a: e.amount })),
    lg: input.loansGiven.entries
      .filter((e) => safeNum(e.amount) > 0)
      .map((e) => ({ l: e.label, a: e.amount, y: e.yearsOutstanding })),
    li: input.liabilities.entries
      .filter((e) => safeNum(e.amount) > 0)
      .map((e) => ({ l: e.label, a: e.amount })),
    gp: input.goldPricePerGram,
    sp: input.silverPricePerGram,
    nm: input.nisabMethod === "gold" ? "g" : "s",
  };

  const json = JSON.stringify(compact);
  // TextEncoder → Uint8Array → base64 (handles Unicode labels like Bengali)
  const bytes = new TextEncoder().encode(json);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  const base64 = btoa(binary);
  // Make URL-safe: replace +/ with -_ and strip trailing =
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decode a URL-safe base64 string back into a ZakatInput.
 * Returns null if the data is corrupted or invalid.
 */
export function decodeZakatInput(encoded: string): ZakatInput | null {
  try {
    // Restore standard base64 from URL-safe variant
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    // Re-add padding
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const compact = JSON.parse(json) as CompactInput;

    // Validate basic structure
    if (!compact || typeof compact !== "object") return null;

    const toEntries = (arr?: CompactEntry[]): Entry[] =>
      (arr || []).map((e) => createEntry(e.l, safeNum(e.a)));

    const toMetalEntries = (arr?: CompactMetalEntry[]): MetalEntry[] =>
      (arr || []).map((e) => ({
        id: generateId(),
        label: e.l,
        weightGrams: safeNum(e.w),
        useManualValue: !!e.m,
        manualValue: safeNum(e.v),
      }));

    const toLoanEntries = (arr?: CompactLoanEntry[]): LoanEntry[] =>
      (arr || []).map((e) => createLoanEntry(e.l, safeNum(e.a), safeNum(e.y) || 1));

    return {
      cash: { entries: toEntries(compact.c) },
      gold: { entries: toMetalEntries(compact.g) },
      silver: { entries: toMetalEntries(compact.s) },
      investments: { entries: toEntries(compact.i) },
      others: { entries: toEntries(compact.o) },
      loansGiven: { entries: toLoanEntries(compact.lg) },
      liabilities: { entries: toEntries(compact.li) },
      goldPricePerGram: safeNum(compact.gp) || DEFAULT_GOLD_PRICE_PER_GRAM,
      silverPricePerGram: safeNum(compact.sp) || DEFAULT_SILVER_PRICE_PER_GRAM,
      nisabMethod: compact.nm === "g" ? "gold" : "silver",
    };
  } catch {
    return null;
  }
}

// ─── Formatting Utilities ────────────────────────────────────────────────────

/**
 * Format a number as BDT currency string
 * Uses Bangladeshi number grouping: 1,00,00,000
 */
export function formatBDT(amount: number, lang: "en" | "bn" = "en"): string {
  const rounded = Math.round(amount * 100) / 100;

  if (lang === "bn") {
    return `৳ ${toBanglaNumber(formatBangladeshiGrouping(rounded))}`;
  }

  return `৳ ${formatBangladeshiGrouping(rounded)}`;
}

/**
 * Format number using Bangladeshi grouping system
 * e.g., 1,23,45,678.00
 */
function formatBangladeshiGrouping(num: number): string {
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const parts = absNum.toFixed(2).split(".");
  const intPart = parts[0];
  const decPart = parts[1];

  if (intPart.length <= 3) {
    return `${isNegative ? "-" : ""}${intPart}.${decPart}`;
  }

  const lastThree = intPart.slice(-3);
  const remaining = intPart.slice(0, -3);

  const pairs: string[] = [];
  for (let i = remaining.length; i > 0; i -= 2) {
    const start = Math.max(0, i - 2);
    pairs.unshift(remaining.slice(start, i));
  }

  const formatted = `${pairs.join(",")},${lastThree}.${decPart}`;
  return `${isNegative ? "-" : ""}${formatted}`;
}

/**
 * Convert English digits to Bangla digits
 */
export function toBanglaNumber(str: string): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return str.replace(/[0-9]/g, (d) => banglaDigits[parseInt(d)]);
}

/**
 * Format a number for display (without currency symbol)
 */
export function formatNumber(amount: number, lang: "en" | "bn" = "en"): string {
  const formatted = formatBangladeshiGrouping(Math.round(amount * 100) / 100);
  return lang === "bn" ? toBanglaNumber(formatted) : formatted;
}

/**
 * Safely parse a number, returning 0 for NaN/undefined/null
 */
export function safeNum(value: number | string | undefined | null): number {
  if (value === undefined || value === null || value === "") return 0;
  const parsed = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Get the current date formatted for the report
 */
export function getFormattedDate(lang: "en" | "bn" = "en"): string {
  const now = new Date();

  if (lang === "bn") {
    const day = toBanglaNumber(now.getDate().toString());
    const months = [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
    ];
    const month = months[now.getMonth()];
    const year = toBanglaNumber(now.getFullYear().toString());
    return `${day} ${month}, ${year}`;
  }

  return now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
