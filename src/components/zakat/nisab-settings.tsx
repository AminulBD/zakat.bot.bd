import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CurrencyInput } from "@/components/zakat/currency-input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  formatBDT,
} from "@/lib/zakat";
import { Scale, CircleAlert, Coins, ExternalLink } from "lucide-react";

interface NisabSettingsProps {
  goldPrice: number;
  silverPrice: number;
  nisabMethod: "gold" | "silver";
  onGoldPriceChange: (price: number) => void;
  onSilverPriceChange: (price: number) => void;
  onNisabMethodChange: (method: "gold" | "silver") => void;
}

/**
 * Nisab Settings Panel
 *
 * Allows the user to:
 * - Set the current market price of gold per gram (BDT)
 * - Set the current market price of silver per gram (BDT)
 * - Choose the Nisab calculation method (gold or silver standard)
 *
 * Displays the calculated Nisab thresholds based on the entered prices.
 */
export function NisabSettings({
  goldPrice,
  silverPrice,
  nisabMethod,
  onGoldPriceChange,
  onSilverPriceChange,
  onNisabMethodChange,
}: NisabSettingsProps) {
  const { t, lang } = useI18n();

  const goldNisab = GOLD_NISAB_GRAMS * (goldPrice || 0);
  const silverNisab = SILVER_NISAB_GRAMS * (silverPrice || 0);

  return (
    <Card className="relative overflow-hidden ring-1 ring-primary/10">
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden="true"
      />

      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
            <Scale className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold leading-tight">
              {t("nisabMethod")}
            </CardTitle>
            <CardDescription className="text-[11px] leading-tight mt-0.5">
              {lang === "bn"
                ? "স্বর্ণ বা রৌপ্যের বাজার দর অনুযায়ী নিসাব নির্ধারণ করুন"
                : "Set market prices and choose your Nisab standard"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {/* Market Prices Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="size-3.5 text-muted-foreground/60" />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {lang === "bn" ? "বর্তমান বাজার দর" : "Current Market Prices"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <CurrencyInput
                label={t("currentGoldPrice")}
                value={goldPrice}
                onChange={onGoldPriceChange}
                id="gold-price-per-gram"
                hint={
                  lang === "bn"
                    ? "২২ ক্যারেট স্বর্ণের প্রতি গ্রামের দাম"
                    : "22K gold price per gram in BDT"
                }
              />
              <a
                href="https://www.bajus.org/gold-price"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-primary/70 hover:text-primary transition-colors"
              >
                <ExternalLink className="size-3" />
                {lang === "bn" ? "সর্বশেষ দাম দেখুন" : "See latest price"}
              </a>
            </div>
            <CurrencyInput
              label={t("currentSilverPrice")}
              value={silverPrice}
              onChange={onSilverPriceChange}
              id="silver-price-per-gram"
              hint={
                lang === "bn"
                  ? "বিশুদ্ধ রৌপ্যের প্রতি গ্রামের দাম"
                  : "Pure silver price per gram in BDT"
              }
            />
          </div>
        </div>

        {/* Nisab Method Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Scale className="size-3.5 text-muted-foreground/60" />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {lang === "bn" ? "নিসাব পদ্ধতি নির্বাচন" : "Select Nisab Standard"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Gold Standard Option */}
            <NisabMethodOption
              isSelected={nisabMethod === "gold"}
              onClick={() => onNisabMethodChange("gold")}
              label={t("useGoldNisab")}
              description={t("goldNisabDesc")}
              nisabValue={goldNisab}
              iconEmoji="🥇"
              lang={lang}
              accentClass="border-amber-500/30"
              selectedAccentClass="border-amber-500/50 ring-2 ring-amber-500/20"
            />

            {/* Silver Standard Option */}
            <NisabMethodOption
              isSelected={nisabMethod === "silver"}
              onClick={() => onNisabMethodChange("silver")}
              label={t("useSilverNisab")}
              description={t("silverNisabDesc")}
              nisabValue={silverNisab}
              iconEmoji="🥈"
              lang={lang}
              accentClass="border-slate-400/30"
              selectedAccentClass="border-slate-400/50 ring-2 ring-slate-400/20"
            />
          </div>
        </div>

        {/* Nisab Summary */}
        <div className="border border-dashed border-primary/20 bg-primary/[0.02] px-3.5 py-3 dark:bg-primary/[0.05]">
          <div className="flex items-start gap-2.5">
            <CircleAlert className="size-4 text-primary/50 mt-0.5 shrink-0" />
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-foreground/80">
                {t("nisabThreshold")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {t("nisabGold")}:
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold tabular-nums",
                      nisabMethod === "gold"
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatBDT(goldNisab, lang)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {t("nisabSilver")}:
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold tabular-nums",
                      nisabMethod === "silver"
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatBDT(silverNisab, lang)}
                  </span>
                </div>
              </div>
              <p className="text-[10px] leading-snug text-muted-foreground/60 pt-1 border-t border-primary/10">
                {t("nisabNote")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Nisab Method Radio Option ───────────────────────────────────────────────

interface NisabMethodOptionProps {
  isSelected: boolean;
  onClick: () => void;
  label: string;
  description: string;
  nisabValue: number;
  iconEmoji: string;
  lang: "en" | "bn";
  accentClass: string;
  selectedAccentClass: string;
}

function NisabMethodOption({
  isSelected,
  onClick,
  label,
  description,
  nisabValue,
  iconEmoji,
  lang,
  accentClass,
  selectedAccentClass,
}: NisabMethodOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-start gap-2 border p-3 text-left transition-all duration-200 cursor-pointer",
        "hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isSelected ? selectedAccentClass : accentClass
      )}
      role="radio"
      aria-checked={isSelected}
    >
      {/* Selection indicator */}
      <div className="absolute top-2.5 right-2.5">
        <div
          className={cn(
            "h-4 w-4 border-2 transition-all duration-200 flex items-center justify-center",
            isSelected
              ? "border-primary bg-primary"
              : "border-muted-foreground/30"
          )}
        >
          {isSelected && (
            <div className="h-1.5 w-1.5 bg-primary-foreground" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg leading-none" aria-hidden="true">
          {iconEmoji}
        </span>
        <span className="text-xs font-semibold text-foreground">
          {label}
        </span>
      </div>

      <span className="text-[11px] text-muted-foreground leading-tight">
        {description}
      </span>

      {nisabValue > 0 && (
        <div
          className={cn(
            "w-full px-2 py-1.5 text-center",
            isSelected
              ? "bg-primary/10 dark:bg-primary/20"
              : "bg-muted/50"
          )}
        >
          <span
            className={cn(
              "text-xs font-bold tabular-nums",
              isSelected ? "text-primary" : "text-muted-foreground"
            )}
          >
            {formatBDT(nisabValue, lang)}
          </span>
        </div>
      )}
    </button>
  );
}
