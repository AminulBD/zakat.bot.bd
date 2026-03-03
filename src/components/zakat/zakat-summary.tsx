import { useRef, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  formatBDT,
  getFormattedDate,
  type ZakatResult,
  ZAKAT_RATE,
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
} from "@/lib/zakat";
import { IslamicDivider, MosqueIcon } from "@/components/zakat/islamic-pattern";
import {
  Printer,
  CheckCircle2,
  XCircle,
  ArrowDown,
  ArrowUp,
  Minus,
  Calculator,
  Info,
  Scale,
  Banknote,
  Gem,
  Landmark,
  TrendingUp,
  Package,
  FileWarning,
} from "lucide-react";

// ─── Props ───────────────────────────────────────────────────────────────────

interface ZakatSummaryProps {
  result: ZakatResult;
  className?: string;
}

// ─── Category Icons Map ──────────────────────────────────────────────────────

const categoryIcons: Record<string, React.ElementType> = {
  cash: Banknote,
  gold: Gem,
  silver: Landmark,
  investments: TrendingUp,
  others: Package,
  liabilities: FileWarning,
};

// ─── Category Labels ─────────────────────────────────────────────────────────

function getCategoryLabel(key: string, lang: "en" | "bn"): string {
  const labels: Record<string, { en: string; bn: string }> = {
    cash: { en: "Cash & Bank", bn: "নগদ ও ব্যাংক" },
    gold: { en: "Gold", bn: "স্বর্ণ" },
    silver: { en: "Silver", bn: "রৌপ্য" },
    investments: { en: "Investments", bn: "বিনিয়োগ" },
    others: { en: "Other Assets", bn: "অন্যান্য সম্পদ" },
    liabilities: { en: "Liabilities", bn: "দায়" },
  };
  return labels[key]?.[lang] ?? key;
}



// ─── Main Component ──────────────────────────────────────────────────────────

export function ZakatSummary({ result, className }: ZakatSummaryProps) {
  const { t, lang } = useI18n();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const hasAnyAssets = result.totalAssets > 0;

  return (
    <div className={cn("space-y-4", className)} id="zakat-summary">
      {/* ─── Main Result Card ────────────────────────────────────────────── */}
      <Card
        ref={printRef}
        className={cn(
          "relative overflow-hidden print:shadow-none print:ring-0",
          result.isZakatApplicable
            ? "ring-1 ring-emerald-500/20 dark:ring-emerald-500/15"
            : hasAnyAssets
              ? "ring-1 ring-amber-500/20 dark:ring-amber-500/15"
              : ""
        )}
      >
        {/* Top gradient accent */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1",
            result.isZakatApplicable
              ? "bg-gradient-to-r from-emerald-500/40 via-emerald-600/60 to-emerald-500/40"
              : hasAnyAssets
                ? "bg-gradient-to-r from-amber-500/40 via-amber-600/60 to-amber-500/40"
                : "bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          )}
          aria-hidden="true"
        />

        {/* ─── Print Header (only visible when printing) ──────────────── */}
        <div className="hidden print:block px-6 pt-6 pb-2">
          <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
            <div className="flex items-center gap-3">
              <MosqueIcon size={40} className="text-foreground/80 print:text-black" />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {t("reportTitle")}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t("bismillahTranslation")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t("generatedOn")}</p>
              <p className="text-sm font-medium">{getFormattedDate(lang)}</p>
            </div>
          </div>
          <p className="text-center text-lg font-arabic mt-3 text-foreground/70 print:text-black/60">
            {t("bismillah")}
          </p>
        </div>

        {/* ─── Summary Header ─────────────────────────────────────────── */}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center",
                  result.isZakatApplicable
                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-primary/10 text-primary dark:bg-primary/20"
                )}
              >
                <Calculator className="size-4.5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold leading-tight">
                  {t("summaryTitle")}
                </CardTitle>
                <CardDescription className="text-[11px] leading-tight mt-0.5">
                  {t("zakatRate")}
                </CardDescription>
              </div>
            </div>

            {/* Print Button - hidden when printing */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="print:hidden gap-1.5"
              disabled={!hasAnyAssets}
            >
              <Printer className="size-3.5" />
              <span className="hidden sm:inline">{t("downloadPDF")}</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ─── Assets Breakdown Table ──────────────────────────────── */}
          {hasAnyAssets && (
            <div className="border border-border/60 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_auto] gap-2 bg-muted/40 px-3 py-2 border-b border-border/40">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("category")}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">
                  {t("amount")}
                </span>
              </div>

              {/* Category Rows */}
              <div className="divide-y divide-border/30">
                {result.breakdown.map((category) => {
                  if (category.amount === 0) return null;
                  const IconComp = categoryIcons[category.label] || Package;
                  const isLiability = category.label === "liabilities";

                  return (
                    <div key={category.label} className="group">
                      {/* Category summary row */}
                      <div
                        className={cn(
                          "grid grid-cols-[1fr_auto] gap-2 px-3 py-2.5 transition-colors",
                          isLiability
                            ? "bg-destructive/[0.02] dark:bg-destructive/[0.04]"
                            : "hover:bg-muted/20"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <IconComp
                            className={cn(
                              "size-3.5 shrink-0",
                              isLiability
                                ? "text-destructive/60"
                                : "text-primary/60"
                            )}
                          />
                          <span className="text-xs font-semibold text-foreground">
                            {getCategoryLabel(category.label, lang)}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "text-xs font-bold tabular-nums text-right",
                            isLiability ? "text-destructive" : "text-foreground"
                          )}
                        >
                          {isLiability ? "− " : ""}
                          {formatBDT(category.amount, lang)}
                        </span>
                      </div>

                      {/* Item detail rows */}
                      <div className="bg-muted/10 dark:bg-muted/5">
                        {category.items
                          .filter((item) => item.amount > 0)
                          .map((item, idx) => (
                            <div
                              key={`${item.label}-${idx}`}
                              className="grid grid-cols-[1fr_auto] gap-2 px-3 py-1.5 pl-9"
                            >
                              <span className="text-[11px] text-muted-foreground truncate">
                                {item.label}
                              </span>
                              <span className="text-[11px] tabular-nums text-muted-foreground text-right">
                                {formatBDT(item.amount, lang)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Calculation Summary ─────────────────────────────────── */}
          {hasAnyAssets && (
            <div className="space-y-2.5">
              <IslamicDivider className="print:hidden" />

              {/* Total Assets */}
              <SummaryRow
                icon={ArrowUp}
                label={t("totalAssets")}
                value={formatBDT(result.totalAssets, lang)}
                iconClass="text-emerald-500"
                valueClass="text-emerald-600 dark:text-emerald-400"
                isBold
              />

              {/* Total Liabilities */}
              {result.totalLiabilities > 0 && (
                <SummaryRow
                  icon={ArrowDown}
                  label={t("totalLiabilities")}
                  value={`− ${formatBDT(result.totalLiabilities, lang)}`}
                  iconClass="text-destructive/70"
                  valueClass="text-destructive"
                />
              )}

              {/* Separator */}
              {result.totalLiabilities > 0 && (
                <Separator className="my-1" />
              )}

              {/* Net Assets */}
              <SummaryRow
                icon={Minus}
                label={t("netAssets")}
                value={formatBDT(result.netAssets, lang)}
                iconClass="text-primary"
                valueClass="text-primary"
                isBold
                isLarge
              />

              <Separator className="my-1" />

              {/* Nisab Threshold */}
              <SummaryRow
                icon={Scale}
                label={`${t("nisabThreshold")} (${result.nisabMethod === "gold" ? t("useGoldNisab") : t("useSilverNisab")})`}
                value={formatBDT(result.nisabThreshold, lang)}
                iconClass="text-amber-500"
                valueClass="text-amber-600 dark:text-amber-400"
                hint={
                  result.nisabMethod === "gold"
                    ? `${GOLD_NISAB_GRAMS}g ${lang === "bn" ? "স্বর্ণ" : "gold"}`
                    : `${SILVER_NISAB_GRAMS}g ${lang === "bn" ? "রৌপ্য" : "silver"}`
                }
              />
            </div>
          )}

          {/* ─── Zakat Result Banner ─────────────────────────────────── */}
          {hasAnyAssets && (
            <div
              className={cn(
                "border-2 p-4 text-center space-y-2",
                result.isZakatApplicable
                  ? "border-emerald-500/30 bg-emerald-500/5 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                  : "border-amber-500/30 bg-amber-500/5 dark:border-amber-500/20 dark:bg-amber-500/10"
              )}
            >
              {/* Status Icon */}
              <div className="flex justify-center">
                {result.isZakatApplicable ? (
                  <div className="flex h-12 w-12 items-center justify-center  bg-emerald-500/10 dark:bg-emerald-500/20">
                    <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center  bg-amber-500/10 dark:bg-amber-500/20">
                    <XCircle className="size-6 text-amber-600 dark:text-amber-400" />
                  </div>
                )}
              </div>

              {/* Status Message */}
              <div>
                <h3
                  className={cn(
                    "text-sm font-bold",
                    result.isZakatApplicable
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-amber-700 dark:text-amber-300"
                  )}
                >
                  {result.isZakatApplicable
                    ? t("zakatApplicable")
                    : t("zakatNotApplicable")}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
                  {result.isZakatApplicable
                    ? t("zakatApplicableDesc")
                    : t("zakatNotApplicableDesc")}
                </p>
              </div>

              {/* Zakat Amount */}
              {result.isZakatApplicable && (
                <div className="pt-2 space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    {t("zakatPayable")}
                  </p>
                  <p className="text-3xl sm:text-4xl font-black tabular-nums text-emerald-600 dark:text-emerald-400 tracking-tight">
                    {formatBDT(result.zakatPayable, lang)}
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-1 text-[10px] font-medium"
                  >
                    {result.netAssets > 0
                      ? `${formatBDT(result.netAssets, lang)} × ${ZAKAT_RATE * 100}%`
                      : t("zakatRate")}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* ─── Empty State ─────────────────────────────────────────── */}
          {!hasAnyAssets && (
            <div className="py-10 text-center space-y-3">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center bg-muted/50">
                  <Calculator className="size-6 text-muted-foreground/40" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground/70">
                  {lang === "bn"
                    ? "আপনার সম্পদের তথ্য দিন"
                    : "Enter your asset details"}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto">
                  {lang === "bn"
                    ? "বাম পাশের ফর্মে আপনার সম্পদ ও দায়ের তথ্য পূরণ করলে এখানে যাকাতের হিসাব দেখা যাবে।"
                    : "Fill in your assets and liabilities in the form to see your Zakat calculation here."}
                </p>
              </div>
            </div>
          )}

          {/* ─── Quran Verse ──────────────────────────────────────────── */}
          {hasAnyAssets && (
            <>
              <IslamicDivider />
              <blockquote className="text-center px-4 py-2 space-y-1">
                <p className="text-xs italic text-muted-foreground leading-relaxed">
                  {t("quranVerse")}
                </p>
                <cite className="text-[10px] text-muted-foreground/60 not-italic block">
                  {t("quranRef")}
                </cite>
              </blockquote>
            </>
          )}
        </CardContent>

        {/* ─── Print Footer (only visible when printing) ──────────────── */}
        {hasAnyAssets && (
          <CardFooter className="print:flex hidden border-t flex-col gap-2 py-4">
            <IslamicDivider />
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed max-w-lg">
              {t("printFooter")}
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              {t("generatedOn")}: {getFormattedDate(lang)}
            </p>
          </CardFooter>
        )}
      </Card>

      {/* ─── Nisab Info Note (screen only) ──────────────────────────────── */}
      {hasAnyAssets && (
        <div className="flex items-start gap-2.5 border border-dashed border-border/50 bg-muted/20 px-3.5 py-3 print:hidden">
          <Info className="size-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-medium text-foreground/70 mb-0.5">
              {t("note")}
            </p>
            <p className="text-[10px] leading-relaxed text-muted-foreground/70">
              {t("nisabNote")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Summary Row Sub-Component ───────────────────────────────────────────────

interface SummaryRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  iconClass?: string;
  valueClass?: string;
  isBold?: boolean;
  isLarge?: boolean;
  hint?: string;
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  iconClass,
  valueClass,
  isBold = false,
  isLarge = false,
  hint,
}: SummaryRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        isLarge && "py-1"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Icon className={cn("size-3.5 shrink-0", iconClass)} />
        <div className="min-w-0">
          <span
            className={cn(
              "text-xs truncate block",
              isBold ? "font-semibold text-foreground" : "text-muted-foreground"
            )}
          >
            {label}
          </span>
          {hint && (
            <span className="text-[10px] text-muted-foreground/50 block">
              {hint}
            </span>
          )}
        </div>
      </div>
      <span
        className={cn(
          "tabular-nums shrink-0 text-right",
          isLarge ? "text-base font-black" : "text-xs",
          isBold && !isLarge && "font-bold",
          valueClass || "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}
