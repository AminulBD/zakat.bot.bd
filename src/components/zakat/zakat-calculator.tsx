import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import {
  calculateZakat,
  createDefaultInput,
  type ZakatInput,
  type ZakatResult,
  type CashAssets,
  type GoldAssets,
  type SilverAssets,
  type InvestmentAssets,
  type OtherAssets,
  type Liabilities,
} from "@/lib/zakat";
import {
  CashCategory,
  GoldCategory,
  SilverCategory,
  InvestmentCategory,
  OthersCategory,
  LiabilitiesCategory,
} from "@/components/zakat/asset-categories";
import { NisabSettings } from "@/components/zakat/nisab-settings";
import { ZakatSummary } from "@/components/zakat/zakat-summary";
import { IslamicPattern, IslamicArch, IslamicDivider, MosqueIcon } from "@/components/zakat/islamic-pattern";
import {
  RotateCcw,
  Moon,
  Sun,
  Languages,
  Banknote,
  Gem,
  Landmark,
  TrendingUp,
  Package,
  FileWarning,
  TriangleAlert,
} from "lucide-react";

// ─── LocalStorage keys ───────────────────────────────────────────────────────

const STORAGE_KEY_INPUT = "zakat-input";
const STORAGE_KEY_TAB = "zakat-active-tab";

function loadInputFromStorage(lang: "en" | "bn"): ZakatInput {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_INPUT);
    if (saved) {
      const parsed = JSON.parse(saved) as ZakatInput;
      // Basic validation: check that required top-level keys exist
      if (
        parsed &&
        parsed.cash &&
        parsed.gold &&
        parsed.silver &&
        parsed.investments &&
        parsed.others &&
        parsed.liabilities &&
        typeof parsed.goldPricePerGram === "number" &&
        typeof parsed.silverPricePerGram === "number"
      ) {
        return parsed;
      }
    }
  } catch {
    // Corrupted or missing data – fall through to default
  }
  return createDefaultInput(lang);
}

function loadTabFromStorage(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TAB);
    if (saved && ["cash", "gold", "silver", "investments", "others", "liabilities"].includes(saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return "cash";
}

// ─── Tab definitions ─────────────────────────────────────────────────────────

const ASSET_TABS = [
  { value: "cash", icon: Banknote },
  { value: "gold", icon: Gem },
  { value: "silver", icon: Landmark },
  { value: "investments", icon: TrendingUp },
  { value: "others", icon: Package },
  { value: "liabilities", icon: FileWarning },
] as const;

function getTabLabel(value: string, lang: "en" | "bn"): string {
  const labels: Record<string, { en: string; bn: string }> = {
    cash: { en: "Cash", bn: "নগদ" },
    gold: { en: "Gold", bn: "স্বর্ণ" },
    silver: { en: "Silver", bn: "রৌপ্য" },
    investments: { en: "Invest", bn: "বিনিয়োগ" },
    others: { en: "Others", bn: "অন্যান্য" },
    liabilities: { en: "Debts", bn: "দায়" },
  };
  return labels[value]?.[lang] ?? value;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ZakatCalculator() {
  const { t, lang, toggleLanguage } = useI18n();
  const { isDark, toggleTheme } = useTheme();

  // ─── State (hydrated from localStorage) ──────────────────────────────────
  const [input, setInput] = useState<ZakatInput>(() => loadInputFromStorage(lang));
  const [activeTab, setActiveTab] = useState(() => loadTabFromStorage());

  // ─── Persist state to localStorage ───────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INPUT, JSON.stringify(input));
    } catch {
      // Storage full or unavailable – silently ignore
    }
  }, [input]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TAB, activeTab);
    } catch {
      // ignore
    }
  }, [activeTab]);

  // ─── Derived result (memoized) ───────────────────────────────────────────
  const result: ZakatResult = useMemo(() => calculateZakat(input), [input]);

  // ─── Update handlers ─────────────────────────────────────────────────────
  const updateCash = useCallback(
    (cash: CashAssets) => setInput((prev) => ({ ...prev, cash })),
    []
  );
  const updateGold = useCallback(
    (gold: GoldAssets) => setInput((prev) => ({ ...prev, gold })),
    []
  );
  const updateSilver = useCallback(
    (silver: SilverAssets) => setInput((prev) => ({ ...prev, silver })),
    []
  );
  const updateInvestments = useCallback(
    (investments: InvestmentAssets) =>
      setInput((prev) => ({ ...prev, investments })),
    []
  );
  const updateOthers = useCallback(
    (others: OtherAssets) => setInput((prev) => ({ ...prev, others })),
    []
  );
  const updateLiabilities = useCallback(
    (liabilities: Liabilities) =>
      setInput((prev) => ({ ...prev, liabilities })),
    []
  );
  const updateGoldPrice = useCallback(
    (goldPricePerGram: number) =>
      setInput((prev) => ({ ...prev, goldPricePerGram })),
    []
  );
  const updateSilverPrice = useCallback(
    (silverPricePerGram: number) =>
      setInput((prev) => ({ ...prev, silverPricePerGram })),
    []
  );
  const updateNisabMethod = useCallback(
    (nisabMethod: "gold" | "silver") =>
      setInput((prev) => ({ ...prev, nisabMethod })),
    []
  );

  const handleReset = useCallback(() => {
    const defaults = createDefaultInput(lang);
    setInput(defaults);
    setActiveTab("cash");
    try {
      localStorage.removeItem(STORAGE_KEY_INPUT);
      localStorage.removeItem(STORAGE_KEY_TAB);
    } catch {
      // ignore
    }
  }, [lang]);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "relative min-h-screen",
        lang === "bn" && "font-[Noto_Sans_Bengali,Outfit,sans-serif]"
      )}
    >
      {/* Background Islamic pattern */}
      <IslamicPattern className="fixed inset-0 print:hidden" opacity={isDark ? 0.03 : 0.04} />

      {/* Gradient background accents */}
      <div className="pointer-events-none fixed inset-0 print:hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-100 h-100 blur-[100px]" />
      </div>

      {/* Main content wrapper */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 print:px-0 print:py-0 print:max-w-none">
        {/* ─── Top Navigation Bar ──────────────────────────────────── */}
        <nav className="mb-6 flex items-center justify-between gap-3 print:hidden">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <MosqueIcon size={28} className="shrink-0" />
            <span className="text-sm font-bold text-foreground truncate">
              {t("appTitle")}
            </span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="gap-1.5 text-[11px] h-7"
              title={lang === "en" ? "বাংলায় দেখুন" : "Switch to English"}
            >
              <Languages className="size-3.5" />
              <span className="hidden sm:inline">{t("language")}</span>
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={toggleTheme}
              title={t("darkMode")}
              className="h-7 w-7"
            >
              {isDark ? (
                <Sun className="size-3.5" />
              ) : (
                <Moon className="size-3.5" />
              )}
            </Button>

            {/* Reset Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleReset}
              title={t("reset")}
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </nav>

        {/* ─── Header Section ──────────────────────────────────────── */}
        <header className="mb-8 text-center print:hidden">
          {/* Bismillah */}
          <p className="text-xl sm:text-2xl font-arabic text-primary/60 mb-1 leading-relaxed" dir="rtl">
            {t("bismillah")}
          </p>
          <p className="text-[11px] text-muted-foreground/60 mb-4">
            {t("bismillahTranslation")}
          </p>

          <IslamicArch className="mb-3" />

          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mb-1.5">
            {t("appTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t("appDescription")}
          </p>
        </header>

        {/* ─── Caution Banner ──────────────────────────────────────── */}
        <div className="mb-6 flex items-start gap-3 border border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/5 px-4 py-3 print:hidden">
          <TriangleAlert className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed text-amber-900/80 dark:text-amber-200/80">
            {lang === "bn"
              ? "⚠️ এই অ্যাপটি শুধুমাত্র হিসাবের উদ্দেশ্যে। চূড়ান্ত সিদ্ধান্ত নেওয়ার আগে অবশ্যই একজন আলেমের সাথে পরামর্শ করুন।"
              : "⚠️ This app is only for calculation purposes. Please consult with your scholar before finalizing your Zakat."}
          </p>
        </div>

        {/* ─── Main Grid Layout ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 print:grid-cols-1 items-start">
          {/* ─── LEFT COLUMN: Input Forms ──────────────────────────── */}
          <div className="space-y-6 print:hidden">
            {/* Nisab Settings */}
            <NisabSettings
              goldPrice={input.goldPricePerGram}
              silverPrice={input.silverPricePerGram}
              nisabMethod={input.nisabMethod}
              onGoldPriceChange={updateGoldPrice}
              onSilverPriceChange={updateSilverPrice}
              onNisabMethodChange={updateNisabMethod}
            />

            {/* ─── Asset Category Tabs ───────────────────────────── */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList
                variant="line"
                className="w-full flex flex-wrap justify-start gap-0.5 mb-2"
              >
                {ASSET_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isLiability = tab.value === "liabilities";
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={cn(
                        "gap-1.5 text-[11px] px-2.5 py-1.5 flex-1 min-w-0 sm:flex-none",
                        isLiability && "data-active:text-destructive"
                      )}
                    >
                      <Icon className="size-3.5 shrink-0 hidden sm:block" />
                      <span className="truncate">{getTabLabel(tab.value, lang)}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Tab Contents */}
              <TabsContent value="cash">
                <CashCategory data={input.cash} onChange={updateCash} />
              </TabsContent>

              <TabsContent value="gold">
                <GoldCategory
                  data={input.gold}
                  goldPrice={input.goldPricePerGram}
                  onChange={updateGold}
                />
              </TabsContent>

              <TabsContent value="silver">
                <SilverCategory
                  data={input.silver}
                  silverPrice={input.silverPricePerGram}
                  onChange={updateSilver}
                />
              </TabsContent>

              <TabsContent value="investments">
                <InvestmentCategory
                  data={input.investments}
                  onChange={updateInvestments}
                />
              </TabsContent>

              <TabsContent value="others">
                <OthersCategory data={input.others} onChange={updateOthers} />
              </TabsContent>

              <TabsContent value="liabilities">
                <LiabilitiesCategory
                  data={input.liabilities}
                  onChange={updateLiabilities}
                />
              </TabsContent>
            </Tabs>

            {/* ─── Reset Button (bottom) ─────────────────────────── */}
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="size-3.5" />
                {t("reset")}
              </Button>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Summary/Result ─────────────────────── */}
          <div className="lg:sticky lg:top-6">
            <ZakatSummary result={result} />
          </div>
        </div>

        {/* ─── Footer ──────────────────────────────────────────────── */}
        <footer className="mt-12 mb-4 text-center print:hidden">
          <IslamicDivider />
          <blockquote className="mt-3 px-4">
            <p className="text-xs italic text-muted-foreground/60 leading-relaxed max-w-lg mx-auto">
              {t("quranVerse")}
            </p>
            <cite className="text-[10px] text-muted-foreground/40 not-italic block mt-1">
              {t("quranRef")}
            </cite>
          </blockquote>
          <p className="text-[10px] text-muted-foreground/30 mt-4">
            {lang === "bn"
              ? "এই ক্যালকুলেটর শুধুমাত্র একটি সহায়ক টুল। বিস্তারিত বিধানের জন্য একজন আলেমের সাথে পরামর্শ করুন।"
              : "This calculator is a helper tool only. Please consult a scholar for detailed rulings."}
          </p>
        </footer>
      </div>
    </div>
  );
}
