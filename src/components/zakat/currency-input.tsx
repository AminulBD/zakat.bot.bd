import { useCallback, useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  hint?: string;
  isCurrency?: boolean;
  suffix?: string;
}

/**
 * A specialized input component for BDT currency values.
 * Displays formatted values when blurred and raw numbers when focused.
 * Supports both currency (৳) and weight (grams) inputs.
 */
export function CurrencyInput({
  label,
  value,
  onChange,
  placeholder,
  id,
  className,
  disabled = false,
  hint,
  isCurrency = true,
  suffix,
}: CurrencyInputProps) {
  const { t, lang } = useI18n();
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultPlaceholder = isCurrency
    ? t("enterAmount")
    : t("enterWeight");

  // Format the value for display when not focused
  const formatForDisplay = useCallback(
    (num: number): string => {
      if (num === 0) return "";
      // Use Bangladeshi grouping for currency
      if (isCurrency) {
        return formatBangladeshiGrouping(num);
      }
      // For weight, just show the number with up to 2 decimal places
      const formatted = num % 1 === 0 ? num.toString() : num.toFixed(2);
      return formatted;
    },
    [isCurrency]
  );

  // Update display value when external value changes and input is not focused
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatForDisplay(value));
    }
  }, [value, isFocused, formatForDisplay]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    // Show raw number on focus for easy editing
    setDisplayValue(value === 0 ? "" : value.toString());
    // Select all text on focus for easy replacement
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Parse and clean the value
    const cleaned = displayValue.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    const finalValue = isNaN(parsed) ? 0 : Math.max(0, parsed);
    onChange(finalValue);
    setDisplayValue(formatForDisplay(finalValue));
  }, [displayValue, onChange, formatForDisplay]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;

      // Allow empty string
      if (raw === "") {
        setDisplayValue("");
        onChange(0);
        return;
      }

      // Only allow digits, one decimal point, and leading minus
      const sanitized = raw.replace(/[^0-9.]/g, "");

      // Prevent multiple decimal points
      const parts = sanitized.split(".");
      const cleaned =
        parts.length > 2
          ? parts[0] + "." + parts.slice(1).join("")
          : sanitized;

      setDisplayValue(cleaned);

      // Update the numeric value in real-time
      const parsed = parseFloat(cleaned);
      if (!isNaN(parsed) && parsed >= 0) {
        onChange(parsed);
      } else if (cleaned === "" || cleaned === "0") {
        onChange(0);
      }
    },
    [onChange]
  );

  const inputId = id || label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label
        htmlFor={inputId}
        className="text-xs font-medium text-foreground/80"
      >
        {label}
      </Label>
      <div className="relative">
        {isCurrency && (
          <span
            className={cn(
              "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium select-none",
              value > 0
                ? "text-primary"
                : "text-muted-foreground/60"
            )}
          >
            ৳
          </span>
        )}
        <Input
          ref={inputRef}
          id={inputId}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || defaultPlaceholder}
          disabled={disabled}
          className={cn(
            "h-9 tabular-nums transition-colors",
            isCurrency && "pl-7",
            suffix && "pr-14",
            value > 0 &&
              "border-primary/30",
            lang === "bn" && "font-[Noto_Sans_Bengali]"
          )}
          autoComplete="off"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/60 select-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p className="text-[11px] leading-tight text-muted-foreground/60">
          {hint}
        </p>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format number using Bangladeshi grouping system
 * Last 3 digits, then groups of 2: e.g., 1,23,45,678.00
 */
function formatBangladeshiGrouping(num: number): string {
  if (num === 0) return "0";

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  // Only show decimals if present
  const hasDecimals = absNum % 1 !== 0;
  const fixedStr = hasDecimals ? absNum.toFixed(2) : Math.floor(absNum).toString();
  const parts = fixedStr.split(".");
  const intPart = parts[0];
  const decPart = parts[1];

  let formatted: string;

  if (intPart.length <= 3) {
    formatted = intPart;
  } else {
    // Last 3 digits
    const lastThree = intPart.slice(-3);
    const remaining = intPart.slice(0, -3);

    // Group remaining digits in pairs
    const pairs: string[] = [];
    for (let i = remaining.length; i > 0; i -= 2) {
      const start = Math.max(0, i - 2);
      pairs.unshift(remaining.slice(start, i));
    }

    formatted = `${pairs.join(",")},${lastThree}`;
  }

  if (decPart) {
    formatted += `.${decPart}`;
  }

  return `${isNegative ? "-" : ""}${formatted}`;
}
