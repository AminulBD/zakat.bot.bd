import { useCallback, useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";
import { CurrencyInput } from "@/components/zakat/currency-input";
import { useI18n } from "@/lib/i18n";
import {
  formatBDT,
  sumEntries,
  sumMetalEntries,
  sumLoanEntries,
  calculateLoanZakat,
  metalEntryValue,
  addEntry,
  removeEntry,
  updateEntryAmount,
  updateEntryLabel,
  addMetalEntry,
  removeMetalEntry,
  updateMetalEntry,
  addLoanEntry,
  removeLoanEntry,
  updateLoanEntry,
  ZAKAT_RATE,
  type Entry,
  type MetalEntry,
  type LoanEntry,
  type CashAssets,
  type GoldAssets,
  type SilverAssets,
  type InvestmentAssets,
  type OtherAssets,
  type LoanGivenAssets,
  type Liabilities,
  type CategoryPreset,
  CASH_SUGGESTIONS,
  GOLD_SUGGESTIONS,
  SILVER_SUGGESTIONS,
  INVESTMENT_SUGGESTIONS,
  OTHERS_SUGGESTIONS,
  LOAN_GIVEN_SUGGESTIONS,
  LIABILITY_SUGGESTIONS,
} from "@/lib/zakat";
import { cn } from "@/lib/utils";
import {
  Banknote,
  Landmark,
  Gem,
  TrendingUp,
  CircleDollarSign,
  Package,
  FileWarning,
  HandCoins,
  Plus,
  X,
  GripVertical,
  ChevronDown,
  Pencil,
  Clock,
  type LucideIcon,
} from "lucide-react";

// ─── Shared Category Card Shell ──────────────────────────────────────────────

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  subtotal: number;
  children: React.ReactNode;
  className?: string;
  isLiability?: boolean;
  /** Add button config */
  addLabel: string;
  onAdd: (label: string) => void;
  suggestions: CategoryPreset[];
}

function CategoryCard({
  icon: Icon,
  title,
  description,
  subtotal,
  children,
  className,
  isLiability = false,
  addLabel,
  onAdd,
  suggestions,
}: CategoryCardProps) {
  const { t, lang } = useI18n();

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        "hover:ring-primary/30 hover:ring-2",
        subtotal > 0 && !isLiability && "ring-1 ring-primary/25",
        subtotal > 0 && isLiability && "ring-1 ring-destructive/25",
        className
      )}
    >
      {/* Subtle top accent line when has value */}
      {subtotal > 0 && (
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-0.5",
            isLiability
              ? "bg-gradient-to-r from-transparent via-destructive/40 to-transparent"
              : "bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          )}
          aria-hidden="true"
        />
      )}

      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center",
                isLiability
                  ? "bg-destructive/15 text-destructive dark:bg-destructive/25"
                  : "bg-primary/15 text-primary dark:bg-primary/25"
              )}
            >
              <Icon className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold leading-tight">
                {title}
              </CardTitle>
              <CardDescription className="text-sm leading-tight mt-0.5">
                {description}
              </CardDescription>
            </div>
          </div>

          {subtotal > 0 && (
            <Badge
              variant={isLiability ? "destructive" : "default"}
              className="tabular-nums text-xs shrink-0 h-5 font-semibold"
            >
              {isLiability ? "−" : ""}
              {formatBDT(subtotal, lang)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-3">
          {children}
        </div>

        {/* Add Item Button */}
        <div className="mt-4">
          <AddItemButton
            label={addLabel}
            suggestions={suggestions}
            onAdd={onAdd}
            isLiability={isLiability}
          />
        </div>

        {/* Subtotal row */}
        {subtotal > 0 && (
          <div
            className={cn(
              "mt-4 flex items-center justify-between border-t pt-3",
              isLiability ? "border-destructive/10" : "border-primary/10"
            )}
          >
            <span className="text-xs font-medium text-muted-foreground">
              {t("subtotal")}
            </span>
            <span
              className={cn(
                "text-sm font-bold tabular-nums",
                isLiability ? "text-destructive" : "text-primary"
              )}
            >
              {isLiability ? "− " : ""}
              {formatBDT(subtotal, lang)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Add Item Button with Suggestions Dropdown ───────────────────────────────

interface AddItemButtonProps {
  label: string;
  suggestions: CategoryPreset[];
  onAdd: (label: string) => void;
  isLiability?: boolean;
}

function AddItemButton({ label, suggestions, onAdd, isLiability = false }: AddItemButtonProps) {
  const { t, lang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setCustomValue("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleAdd = useCallback(
    (name: string) => {
      if (name.trim()) {
        onAdd(name.trim());
        setIsOpen(false);
        setCustomValue("");
      }
    },
    [onAdd]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && customValue.trim()) {
        handleAdd(customValue.trim());
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setCustomValue("");
      }
    },
    [customValue, handleAdd]
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full gap-1.5 border-dashed text-xs",
          isLiability
            ? "border-destructive/30 text-destructive/90 hover:text-destructive hover:border-destructive/50 hover:bg-destructive/5"
            : "border-primary/30 text-primary/90 hover:text-primary hover:border-primary/50 hover:bg-primary/5"
        )}
      >
        <Plus className="size-3.5" />
        {label}
        <ChevronDown className={cn("size-3 ml-auto transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <div className="left-0 right-0 top-full z-50 mt-1 border border-border bg-popover p-2 shadow-lg animate-in fade-in-0 slide-in-from-top-1 duration-150">
          {/* Custom input */}
          <div className="mb-2">
            <Input
              ref={inputRef}
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("customItemPlaceholder")}
              className="h-8 text-xs"
            />
            {customValue.trim() && (
              <Button
                type="button"
                variant="default"
                size="xs"
                onClick={() => handleAdd(customValue.trim())}
                className="mt-1.5 w-full text-xs"
              >
                <Plus className="size-3" />
                {t("addItem")}: "{customValue.trim()}"
              </Button>
            )}
          </div>

          {/* Suggestion list */}
          {suggestions.length > 0 && (
            <>
              <div className="mb-1.5 px-1">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("suggestedItems")}
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {suggestions.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => handleAdd(lang === "bn" ? s.bn : s.en)}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Plus className="size-3.5 text-muted-foreground shrink-0" />
                    {lang === "bn" ? s.bn : s.en}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Inline Editable Label ───────────────────────────────────────────────────

interface EditableLabelProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function EditableLabel({ value, onChange, className }: EditableLabelProps) {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Sync if parent changes
  useEffect(() => {
    if (!isEditing) setDraft(value);
  }, [value, isEditing]);

  const handleCommit = useCallback(() => {
    setIsEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    } else {
      setDraft(value);
    }
  }, [draft, value, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleCommit();
      if (e.key === "Escape") {
        setDraft(value);
        setIsEditing(false);
      }
    },
    [handleCommit, value]
  );

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        className={cn("h-7 text-xs px-1.5 py-0.5 w-full min-w-0", className)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className={cn(
        "group/label flex items-center gap-1 min-w-0 text-left",
        className
      )}
      title={t("itemName")}
    >
      <span className="text-xs font-medium text-foreground truncate leading-tight">
        {value}
      </span>
      <Pencil className="size-2.5 shrink-0 text-muted-foreground/0 group-hover/label:text-muted-foreground/70 transition-colors" />
    </button>
  );
}

// ─── Entry Row (for cash, investments, others, liabilities) ──────────────────

interface EntryRowProps {
  entry: Entry;
  onAmountChange: (amount: number) => void;
  onLabelChange: (label: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  isLiability?: boolean;
}

function EntryRow({
  entry,
  onAmountChange,
  onLabelChange,
  onRemove,
  canRemove,
  isLiability = false,
}: EntryRowProps) {
  const { t } = useI18n();

  return (
    <div className="group/row relative border border-border/60 bg-muted/15 p-3 transition-colors hover:border-border dark:bg-muted/10">
      {/* Row header: editable label + remove button */}
      <div className="flex items-center gap-2 mb-2">
        <GripVertical className="size-3 text-muted-foreground/50 shrink-0 hidden sm:block" />
        <EditableLabel
          value={entry.label}
          onChange={onLabelChange}
          className="flex-1 min-w-0"
        />
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            className={cn(
              "shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity",
              isLiability
                ? "text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                : "text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10"
            )}
            title={t("removeItem")}
          >
            <X className="size-3" />
          </Button>
        )}
      </div>

      {/* Amount input */}
      <CurrencyInput
        label=""
        value={entry.amount}
        onChange={onAmountChange}
        id={`entry-${entry.id}`}
      />
    </div>
  );
}

// ─── Metal Entry Row (for gold, silver) ──────────────────────────────────────

interface MetalEntryRowProps {
  entry: MetalEntry;
  pricePerGram: number;
  makingChargeRate: number;
  onUpdate: (updates: Partial<Omit<MetalEntry, "id">>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function MetalEntryRow({
  entry,
  pricePerGram,
  makingChargeRate,
  onUpdate,
  onRemove,
  canRemove,
}: MetalEntryRowProps) {
  const { t, lang } = useI18n();
  const entryValue = metalEntryValue(entry, pricePerGram, makingChargeRate);

  return (
    <div className="group/row relative border border-border/60 bg-muted/15 p-3 transition-colors hover:border-border dark:bg-muted/10">
      {/* Row header: editable label + remove */}
      <div className="flex items-center gap-2 mb-2">
        <GripVertical className="size-3 text-muted-foreground/50 shrink-0 hidden sm:block" />
        <EditableLabel
          value={entry.label}
          onChange={(label) => onUpdate({ label })}
          className="flex-1 min-w-0"
        />
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            className="shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10"
            title={t("removeItem")}
          >
            <X className="size-3" />
          </Button>
        )}
      </div>

      {/* Options row: "Enter value directly" + "Making charge" side by side */}
      <div className="flex items-center border border-dashed border-border/60 bg-muted/30 mb-2.5 divide-x divide-border/60">
        <label
          htmlFor={`metal-toggle-${entry.id}`}
          className="flex flex-1 items-center justify-between gap-2 px-2.5 py-1.5 cursor-pointer"
        >
          <span className="text-xs text-foreground/80">
            {t("enterValueDirectly")}
          </span>
          <Switch
            id={`metal-toggle-${entry.id}`}
            size="sm"
            checked={entry.useManualValue}
            onCheckedChange={(checked) => onUpdate({ useManualValue: !!checked })}
          />
        </label>
        {!entry.useManualValue && (
          <label
            htmlFor={`making-charge-toggle-${entry.id}`}
            className={cn(
              "flex flex-1 items-center justify-between gap-2 px-2.5 py-1.5 cursor-pointer",
              entry.hasMakingCharge && "bg-primary/5"
            )}
          >
            <span className={cn(
              "text-xs",
              entry.hasMakingCharge ? "text-foreground/80" : "text-muted-foreground"
            )}>
              {entry.hasMakingCharge
                ? (lang === "bn" ? "মেকিং চার্জ" : "Making charge")
                : (lang === "bn" ? "মেকিং নেই" : "No making charge")}
            </span>
            <Switch
              id={`making-charge-toggle-${entry.id}`}
              size="sm"
              checked={entry.hasMakingCharge}
              onCheckedChange={(checked) => onUpdate({ hasMakingCharge: !!checked })}
            />
          </label>
        )}
      </div>

      {/* Value input */}
      {entry.useManualValue ? (
        <CurrencyInput
          label=""
          value={entry.manualValue}
          onChange={(v) => onUpdate({ manualValue: v })}
          id={`metal-value-${entry.id}`}
        />
      ) : (
        <div className="space-y-2">
          <CurrencyInput
            label=""
            value={entry.weightGrams}
            onChange={(v) => onUpdate({ weightGrams: v })}
            id={`metal-weight-${entry.id}`}
            isCurrency={false}
            suffix={lang === "bn" ? "গ্রাম" : "grams"}
          />
          {entry.weightGrams > 0 && pricePerGram > 0 && (
            <div className="flex items-center gap-2 bg-primary/8 px-2.5 py-1.5 dark:bg-primary/15">
              <CircleDollarSign className="size-3.5 text-primary shrink-0" />
              <p className="text-xs text-foreground/80">
                {entry.weightGrams}
                {lang === "bn" ? " গ্রাম" : "g"} × {formatBDT(pricePerGram, lang)}/
                {lang === "bn" ? "গ্রাম" : "g"}
                {entry.hasMakingCharge && makingChargeRate > 0 && (
                  <span className="text-muted-foreground">
                    {" "}− {Math.round(makingChargeRate * 100)}%{" "}
                    {lang === "bn" ? "মেকিং চার্জ" : "making"}
                  </span>
                )}
                {" "}={" "}
                <span className="font-semibold text-primary">
                  {formatBDT(entryValue, lang)}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center bg-muted/60 mb-2">
        <Plus className="size-4 text-muted-foreground/70" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{t("noItems")}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{t("noItemsHint")}</p>
    </div>
  );
}

// ─── Cash & Bank Category ────────────────────────────────────────────────────

interface CashCategoryProps {
  data: CashAssets;
  onChange: (data: CashAssets) => void;
}

export function CashCategory({ data, onChange }: CashCategoryProps) {
  const { t } = useI18n();
  const subtotal = sumEntries(data.entries);

  const handleAdd = useCallback(
    (label: string) => {
      onChange({ entries: addEntry(data.entries, label) });
    },
    [data, onChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange({ entries: removeEntry(data.entries, id) });
    },
    [data, onChange]
  );

  const handleAmountChange = useCallback(
    (id: string, amount: number) => {
      onChange({ entries: updateEntryAmount(data.entries, id, amount) });
    },
    [data, onChange]
  );

  const handleLabelChange = useCallback(
    (id: string, label: string) => {
      onChange({ entries: updateEntryLabel(data.entries, id, label) });
    },
    [data, onChange]
  );

  return (
    <CategoryCard
      icon={Banknote}
      title={t("cashTitle")}
      description={t("cashDescription")}
      subtotal={subtotal}
      addLabel={t("addBankAccount")}
      onAdd={handleAdd}
      suggestions={CASH_SUGGESTIONS}
    >
      {data.entries.length === 0 && <EmptyState />}
      {data.entries.map((entry) => (
        <EntryRow
          key={entry.id}
          entry={entry}
          onAmountChange={(amount) => handleAmountChange(entry.id, amount)}
          onLabelChange={(label) => handleLabelChange(entry.id, label)}
          onRemove={() => handleRemove(entry.id)}
          canRemove={data.entries.length > 1}
        />
      ))}
    </CategoryCard>
  );
}

// ─── Gold Category ───────────────────────────────────────────────────────────

interface GoldCategoryProps {
  data: GoldAssets;
  goldPrice: number;
  makingChargeRate: number;
  onChange: (data: GoldAssets) => void;
}

export function GoldCategory({ data, goldPrice, makingChargeRate, onChange }: GoldCategoryProps) {
  const { t } = useI18n();
  const subtotal = sumMetalEntries(data.entries, goldPrice, makingChargeRate);

  const handleAdd = useCallback(
    (label: string) => {
      onChange({ entries: addMetalEntry(data.entries, label) });
    },
    [data, onChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange({ entries: removeMetalEntry(data.entries, id) });
    },
    [data, onChange]
  );

  const handleUpdate = useCallback(
    (id: string, updates: Partial<Omit<MetalEntry, "id">>) => {
      onChange({ entries: updateMetalEntry(data.entries, id, updates) });
    },
    [data, onChange]
  );

  return (
    <CategoryCard
      icon={Gem}
      title={t("goldTitle")}
      description={t("goldDescription")}
      subtotal={subtotal}
      addLabel={t("addGoldItem")}
      onAdd={handleAdd}
      suggestions={GOLD_SUGGESTIONS}
    >
      {data.entries.length === 0 && <EmptyState />}
      {data.entries.map((entry) => (
        <MetalEntryRow
          key={entry.id}
          entry={entry}
          pricePerGram={goldPrice}
          makingChargeRate={makingChargeRate}
          onUpdate={(updates) => handleUpdate(entry.id, updates)}
          onRemove={() => handleRemove(entry.id)}
          canRemove={data.entries.length > 1}
        />
      ))}
      {data.entries.length > 0 && (
        <p className="text-xs text-muted-foreground leading-tight px-1 pt-1">
          {t("goldHint")}
        </p>
      )}
    </CategoryCard>
  );
}

// ─── Silver Category ─────────────────────────────────────────────────────────

interface SilverCategoryProps {
  data: SilverAssets;
  silverPrice: number;
  makingChargeRate: number;
  onChange: (data: SilverAssets) => void;
}

export function SilverCategory({ data, silverPrice, makingChargeRate, onChange }: SilverCategoryProps) {
  const { t } = useI18n();
  const subtotal = sumMetalEntries(data.entries, silverPrice, makingChargeRate);

  const handleAdd = useCallback(
    (label: string) => {
      onChange({ entries: addMetalEntry(data.entries, label) });
    },
    [data, onChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange({ entries: removeMetalEntry(data.entries, id) });
    },
    [data, onChange]
  );

  const handleUpdate = useCallback(
    (id: string, updates: Partial<Omit<MetalEntry, "id">>) => {
      onChange({ entries: updateMetalEntry(data.entries, id, updates) });
    },
    [data, onChange]
  );

  return (
    <CategoryCard
      icon={Landmark}
      title={t("silverTitle")}
      description={t("silverDescription")}
      subtotal={subtotal}
      addLabel={t("addSilverItem")}
      onAdd={handleAdd}
      suggestions={SILVER_SUGGESTIONS}
    >
      {data.entries.length === 0 && <EmptyState />}
      {data.entries.map((entry) => (
        <MetalEntryRow
          key={entry.id}
          entry={entry}
          pricePerGram={silverPrice}
          makingChargeRate={makingChargeRate}
          onUpdate={(updates) => handleUpdate(entry.id, updates)}
          onRemove={() => handleRemove(entry.id)}
          canRemove={data.entries.length > 1}
        />
      ))}
      {data.entries.length > 0 && (
        <p className="text-xs text-muted-foreground leading-tight px-1 pt-1">
          {t("silverHint")}
        </p>
      )}
    </CategoryCard>
  );
}

// ─── Investment Category ─────────────────────────────────────────────────────

interface InvestmentCategoryProps {
  data: InvestmentAssets;
  onChange: (data: InvestmentAssets) => void;
}

export function InvestmentCategory({ data, onChange }: InvestmentCategoryProps) {
  const { t } = useI18n();
  const subtotal = sumEntries(data.entries);

  const handleAdd = useCallback(
    (label: string) => {
      onChange({ entries: addEntry(data.entries, label) });
    },
    [data, onChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange({ entries: removeEntry(data.entries, id) });
    },
    [data, onChange]
  );

  const handleAmountChange = useCallback(
    (id: string, amount: number) => {
      onChange({ entries: updateEntryAmount(data.entries, id, amount) });
    },
    [data, onChange]
  );

  const handleLabelChange = useCallback(
    (id: string, label: string) => {
      onChange({ entries: updateEntryLabel(data.entries, id, label) });
    },
    [data, onChange]
  );

  return (
    <CategoryCard
      icon={TrendingUp}
      title={t("investmentTitle")}
      description={t("investmentDescription")}
      subtotal={subtotal}
      addLabel={t("addInvestment")}
      onAdd={handleAdd}
      suggestions={INVESTMENT_SUGGESTIONS}
    >
      {data.entries.length === 0 && <EmptyState />}
      {data.entries.map((entry) => (
        <EntryRow
          key={entry.id}
          entry={entry}
          onAmountChange={(amount) => handleAmountChange(entry.id, amount)}
          onLabelChange={(label) => handleLabelChange(entry.id, label)}
          onRemove={() => handleRemove(entry.id)}
          canRemove={data.entries.length > 1}
        />
      ))}
    </CategoryCard>
  );
}

// ─── Others Category ─────────────────────────────────────────────────────────

interface OthersCategoryProps {
  data: OtherAssets;
  onChange: (data: OtherAssets) => void;
}

export function OthersCategory({ data, onChange }: OthersCategoryProps) {
  const { t } = useI18n();
  const subtotal = sumEntries(data.entries);

  const handleAdd = useCallback(
    (label: string) => {
      onChange({ entries: addEntry(data.entries, label) });
    },
    [data, onChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange({ entries: removeEntry(data.entries, id) });
    },
    [data, onChange]
  );

  const handleAmountChange = useCallback(
    (id: string, amount: number) => {
      onChange({ entries: updateEntryAmount(data.entries, id, amount) });
    },
    [data, onChange]
  );

  const handleLabelChange = useCallback(
    (id: string, label: string) => {
      onChange({ entries: updateEntryLabel(data.entries, id, label) });
    },
    [data, onChange]
  );

  return (
    <CategoryCard
      icon={Package}
      title={t("othersTitle")}
      description={t("othersDescription")}
      subtotal={subtotal}
      addLabel={t("addOtherAsset")}
      onAdd={handleAdd}
      suggestions={OTHERS_SUGGESTIONS}
    >
      {data.entries.length === 0 && <EmptyState />}
      {data.entries.map((entry) => (
        <EntryRow
          key={entry.id}
          entry={entry}
          onAmountChange={(amount) => handleAmountChange(entry.id, amount)}
          onLabelChange={(label) => handleLabelChange(entry.id, label)}
          onRemove={() => handleRemove(entry.id)}
          canRemove={data.entries.length > 1}
        />
      ))}
    </CategoryCard>
  );
}

// ─── Liabilities Category ────────────────────────────────────────────────────

// ─── Loan Given Category ─────────────────────────────────────────────────────

interface LoanEntryRowProps {
  entry: LoanEntry;
  onUpdate: (updates: Partial<Omit<LoanEntry, "id">>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function LoanEntryRow({
  entry,
  onUpdate,
  onRemove,
  canRemove,
}: LoanEntryRowProps) {
  const { t, lang } = useI18n();
  const zakatOnThis = entry.amount * ZAKAT_RATE * entry.yearsOutstanding;

  return (
    <div className="group/row relative border border-border/60 bg-muted/15 p-3 transition-colors hover:border-border dark:bg-muted/10">
      {/* Row header: editable label + remove button */}
      <div className="flex items-center gap-2 mb-2">
        <GripVertical className="size-3 text-muted-foreground/50 shrink-0 hidden sm:block" />
        <EditableLabel
          value={entry.label}
          onChange={(label) => onUpdate({ label })}
          className="flex-1 min-w-0"
        />
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            className="shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10"
            title={t("removeItem")}
          >
            <X className="size-3" />
          </Button>
        )}
      </div>

      {/* Amount + Years in a single row */}
      <div className="flex items-end gap-2">
        <div className="flex-1 min-w-0">
          <CurrencyInput
            label=""
            value={entry.amount}
            onChange={(v) => onUpdate({ amount: v })}
            id={`loan-amount-${entry.id}`}
          />
        </div>
        <div className="w-28 shrink-0">
          <CurrencyInput
            label=""
            value={entry.yearsOutstanding}
            onChange={(v) => onUpdate({ yearsOutstanding: Math.max(1, Math.round(v)) })}
            id={`loan-years-${entry.id}`}
            isCurrency={false}
            suffix={lang === "bn" ? t("yearsSuffixPlural") : (entry.yearsOutstanding === 1 ? t("yearsSuffix") : t("yearsSuffixPlural"))}
          />
        </div>
      </div>

      {/* Zakat preview for this loan */}
      {entry.amount > 0 && entry.yearsOutstanding > 0 && (
        <div className="flex items-center gap-2 bg-amber-500/8 dark:bg-amber-500/15 px-2.5 py-1.5 mt-2.5 border border-dashed border-amber-500/30">
          <HandCoins className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-xs text-foreground/80">
            {formatBDT(entry.amount, lang)} × 2.5% × {entry.yearsOutstanding}{" "}
            {lang === "bn" ? t("yearsSuffixPlural") : (entry.yearsOutstanding === 1 ? t("yearsSuffix") : t("yearsSuffixPlural"))} ={" "}
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              {formatBDT(zakatOnThis, lang)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

interface LoanGivenCategoryProps {
  data: LoanGivenAssets;
  onChange: (data: LoanGivenAssets) => void;
}

export function LoanGivenCategory({ data, onChange }: LoanGivenCategoryProps) {
  const { t, lang } = useI18n();
  const subtotal = sumLoanEntries(data.entries);
  const totalLoanZakat = calculateLoanZakat(data.entries);

  const handleAdd = useCallback(
    (label: string) => {
      onChange({ entries: addLoanEntry(data.entries, label) });
    },
    [data, onChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange({ entries: removeLoanEntry(data.entries, id) });
    },
    [data, onChange]
  );

  const handleUpdate = useCallback(
    (id: string, updates: Partial<Omit<LoanEntry, "id">>) => {
      onChange({ entries: updateLoanEntry(data.entries, id, updates) });
    },
    [data, onChange]
  );

  return (
    <CategoryCard
      icon={HandCoins}
      title={t("loansGivenTitle")}
      description={t("loansGivenDescription")}
      subtotal={subtotal}
      addLabel={t("addLoanItem")}
      onAdd={handleAdd}
      suggestions={LOAN_GIVEN_SUGGESTIONS}
    >
      {/* Hint about loan zakat rule */}
      <div className="flex items-start gap-2 border border-dashed border-amber-500/30 bg-amber-500/8 dark:bg-amber-500/15 px-3 py-2 mb-2">
        <Clock className="size-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
          {t("loansGivenHint")}
        </p>
      </div>

      {data.entries.length === 0 && <EmptyState />}
      {data.entries.map((entry) => (
        <LoanEntryRow
          key={entry.id}
          entry={entry}
          onUpdate={(updates) => handleUpdate(entry.id, updates)}
          onRemove={() => handleRemove(entry.id)}
          canRemove={data.entries.length > 1}
        />
      ))}

      {/* Total accumulated loan zakat */}
      {totalLoanZakat > 0 && (
        <div className="border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 px-3 py-2.5 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HandCoins className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                {t("loanZakatLabel")}
              </span>
            </div>
            <span className="text-sm font-bold tabular-nums text-amber-700 dark:text-amber-400">
              {formatBDT(totalLoanZakat, lang)}
            </span>
          </div>
          <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1">
            {t("loanZakatDesc")}
          </p>
        </div>
      )}
    </CategoryCard>
  );
}

// ─── Liabilities Category ────────────────────────────────────────────────────

interface LiabilitiesCategoryProps {
  data: Liabilities;
  onChange: (data: Liabilities) => void;
}

export function LiabilitiesCategory({ data, onChange }: LiabilitiesCategoryProps) {
  const { t } = useI18n();
  const subtotal = sumEntries(data.entries);

  const handleAdd = useCallback(
    (label: string) => {
      onChange({ entries: addEntry(data.entries, label) });
    },
    [data, onChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange({ entries: removeEntry(data.entries, id) });
    },
    [data, onChange]
  );

  const handleAmountChange = useCallback(
    (id: string, amount: number) => {
      onChange({ entries: updateEntryAmount(data.entries, id, amount) });
    },
    [data, onChange]
  );

  const handleLabelChange = useCallback(
    (id: string, label: string) => {
      onChange({ entries: updateEntryLabel(data.entries, id, label) });
    },
    [data, onChange]
  );

  return (
    <CategoryCard
      icon={FileWarning}
      title={t("liabilitiesTitle")}
      description={t("liabilitiesDescription")}
      subtotal={subtotal}
      isLiability
      addLabel={t("addLiability")}
      onAdd={handleAdd}
      suggestions={LIABILITY_SUGGESTIONS}
    >
      {data.entries.length === 0 && <EmptyState />}
      {data.entries.map((entry) => (
        <EntryRow
          key={entry.id}
          entry={entry}
          onAmountChange={(amount) => handleAmountChange(entry.id, amount)}
          onLabelChange={(label) => handleLabelChange(entry.id, label)}
          onRemove={() => handleRemove(entry.id)}
          canRemove={data.entries.length > 1}
          isLiability
        />
      ))}
    </CategoryCard>
  );
}

// ─── Re-export icons for use in other components if needed ───────────────────

export {
  Banknote as CashIcon,
  Gem as GoldIcon,
  Landmark as SilverIcon,
  TrendingUp as InvestmentIcon,
  Package as OthersIcon,
  HandCoins as LoanGivenIcon,
  FileWarning as LiabilitiesIcon,
};
