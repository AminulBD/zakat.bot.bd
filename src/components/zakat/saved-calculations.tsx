import { useState, useCallback, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  formatBDT,
  type ZakatInput,
  type ZakatResult,
} from "@/lib/zakat";
import {
  Save,
  FolderOpen,
  Trash2,
  Pencil,
  Check,
  X,
  BookmarkPlus,
  Bookmark,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SavedCalculation {
  id: string;
  name: string;
  input: ZakatInput;
  summary: {
    totalAssets: number;
    netAssets: number;
    zakatPayable: number;
    loanZakat: number;
    isZakatApplicable: boolean;
  };
  savedAt: number; // timestamp
}

// ─── Storage ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "zakat-saved-calculations";

function loadSavedCalculations(): SavedCalculation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function persistSavedCalculations(items: SavedCalculation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

function generateId(): string {
  return `sc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── i18n labels ─────────────────────────────────────────────────────────────

function getLabel(
  key: string,
  lang: "en" | "bn"
): string {
  const labels: Record<string, { en: string; bn: string }> = {
    savedCalculations: { en: "Saved Calculations", bn: "সংরক্ষিত হিসাব" },
    saveCurrentTitle: { en: "Save Current Calculation", bn: "বর্তমান হিসাব সংরক্ষণ" },
    save: { en: "Save", bn: "সংরক্ষণ" },
    load: { en: "Load", bn: "লোড" },
    delete: { en: "Delete", bn: "মুছুন" },
    rename: { en: "Rename", bn: "নাম পরিবর্তন" },
    cancel: { en: "Cancel", bn: "বাতিল" },
    confirm: { en: "Confirm", bn: "নিশ্চিত" },
    noSavedItems: { en: "No saved calculations yet", bn: "এখনো কোনো হিসাব সংরক্ষিত হয়নি" },
    noSavedHint: {
      en: "Save your current calculation to access it later",
      bn: "পরে ব্যবহারের জন্য আপনার হিসাব সংরক্ষণ করুন",
    },
    namePlaceholder: { en: "e.g. Ramadan 2025", bn: "যেমন: রমজান ২০২৫" },
    zakatDue: { en: "Zakat Due", bn: "প্রদেয় যাকাত" },
    notApplicable: { en: "Not applicable", bn: "প্রযোজ্য নয়" },
    netAssets: { en: "Net Assets", bn: "নিট সম্পদ" },
    saved: { en: "Saved!", bn: "সংরক্ষিত!" },
    confirmDelete: {
      en: "Are you sure you want to delete this calculation?",
      bn: "আপনি কি এই হিসাবটি মুছে ফেলতে চান?",
    },
    enterName: { en: "Please enter a name", bn: "একটি নাম দিন" },
    showSaved: { en: "Show Saved", bn: "সংরক্ষিত দেখুন" },
    hideSaved: { en: "Hide Saved", bn: "সংরক্ষিত লুকান" },
    itemCount: { en: "calculation(s)", bn: "টি হিসাব" },
    loadedSuccess: { en: "Loaded!", bn: "লোড হয়েছে!" },
    nothingToSave: {
      en: "Enter some assets first to save a calculation",
      bn: "সংরক্ষণ করতে প্রথমে কিছু সম্পদ যোগ করুন",
    },
  };
  return labels[key]?.[lang] ?? key;
}

function formatDate(timestamp: number, lang: "en" | "bn"): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", options);
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface SavedCalculationsProps {
  currentInput: ZakatInput;
  currentResult: ZakatResult;
  onLoad: (input: ZakatInput) => void;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SavedCalculations({
  currentInput,
  currentResult,
  onLoad,
  className,
}: SavedCalculationsProps) {
  const { lang } = useI18n();

  const [savedItems, setSavedItems] = useState<SavedCalculation[]>(() =>
    loadSavedCalculations()
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  // Persist whenever savedItems changes
  useEffect(() => {
    persistSavedCalculations(savedItems);
  }, [savedItems]);

  const hasAssets = currentResult.totalAssets > 0;

  const handleSave = useCallback(() => {
    if (!hasAssets) return;

    const name =
      saveName.trim() ||
      (lang === "bn"
        ? `হিসাব ${savedItems.length + 1}`
        : `Calculation ${savedItems.length + 1}`);

    const newItem: SavedCalculation = {
      id: generateId(),
      name,
      input: structuredClone(currentInput),
      summary: {
        totalAssets: currentResult.totalAssets,
        netAssets: currentResult.netAssets,
        zakatPayable: currentResult.zakatPayable,
        loanZakat: currentResult.loanZakat,
        isZakatApplicable: currentResult.isZakatApplicable,
      },
      savedAt: Date.now(),
    };

    setSavedItems((prev) => [newItem, ...prev]);
    setSaveName("");
    setJustSaved(true);
    setIsExpanded(true);
    setTimeout(() => setJustSaved(false), 2000);
  }, [currentInput, currentResult, hasAssets, lang, saveName, savedItems.length]);

  const handleLoad = useCallback(
    (item: SavedCalculation) => {
      onLoad(item.input);
      setLoadedId(item.id);
      setTimeout(() => setLoadedId(null), 2000);
    },
    [onLoad]
  );

  const handleDelete = useCallback((id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
    setDeletingId(null);
  }, []);

  const handleStartRename = useCallback((item: SavedCalculation) => {
    setEditingId(item.id);
    setEditName(item.name);
  }, []);

  const handleConfirmRename = useCallback(() => {
    if (!editingId || !editName.trim()) return;
    setSavedItems((prev) =>
      prev.map((item) =>
        item.id === editingId ? { ...item, name: editName.trim() } : item
      )
    );
    setEditingId(null);
    setEditName("");
  }, [editingId, editName]);

  const handleCancelRename = useCallback(() => {
    setEditingId(null);
    setEditName("");
  }, []);

  return (
    <Card className={cn("print:hidden", className)}>
      {/* ─── Save Form ──────────────────────────────────────────────── */}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary/10 text-primary dark:bg-primary/20">
            <BookmarkPlus className="size-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-bold leading-tight">
              {getLabel("saveCurrentTitle", lang)}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Save input row */}
        <div className="flex gap-2">
          <Input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder={getLabel("namePlaceholder", lang)}
            className="text-sm h-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            disabled={!hasAssets}
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasAssets}
            className={cn(
              "gap-1.5 h-9 px-3 shrink-0 transition-colors",
              justSaved &&
                "bg-emerald-600 hover:bg-emerald-600 text-white dark:bg-emerald-500 dark:hover:bg-emerald-500"
            )}
          >
            {justSaved ? (
              <>
                <Check className="size-3.5" />
                {getLabel("saved", lang)}
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                {getLabel("save", lang)}
              </>
            )}
          </Button>
        </div>

        {!hasAssets && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <AlertCircle className="size-3.5 shrink-0" />
            {getLabel("nothingToSave", lang)}
          </p>
        )}

        {/* ─── Toggle saved list ─────────────────────────────────── */}
        {savedItems.length > 0 && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className={cn(
              "w-full flex items-center justify-between gap-2 py-2 px-3",
              "border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors",
              "text-sm font-medium text-foreground/90"
            )}
          >
            <span className="flex items-center gap-2">
              <Bookmark className="size-3.5 text-primary" />
              {getLabel("savedCalculations", lang)}
              <span className="text-xs text-muted-foreground font-normal">
                ({savedItems.length} {getLabel("itemCount", lang)})
              </span>
            </span>
            {isExpanded ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>
        )}

        {/* ─── Saved items list ──────────────────────────────────── */}
        {isExpanded && savedItems.length > 0 && (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {savedItems.map((item) => {
              const isEditing = editingId === item.id;
              const isDeleting = deletingId === item.id;
              const isLoaded = loadedId === item.id;
              const totalZakat = item.summary.zakatPayable + item.summary.loanZakat;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "border border-border/60 bg-background transition-colors",
                    isLoaded && "ring-2 ring-emerald-500/40"
                  )}
                >
                  {/* Item header */}
                  <div className="px-3 py-2.5">
                    {isEditing ? (
                      /* Rename mode */
                      <div className="flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="text-sm h-7 flex-1"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleConfirmRename();
                            if (e.key === "Escape") handleCancelRename();
                          }}
                        />
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={handleConfirmRename}
                          className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                        >
                          <Check className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={handleCancelRename}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    ) : isDeleting ? (
                      /* Delete confirmation */
                      <div className="space-y-2">
                        <p className="text-xs text-destructive font-medium">
                          {getLabel("confirmDelete", lang)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                            className="h-7 text-xs gap-1"
                          >
                            <Trash2 className="size-3" />
                            {getLabel("confirm", lang)}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeletingId(null)}
                            className="h-7 text-xs"
                          >
                            {getLabel("cancel", lang)}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Normal view */
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-foreground truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(item.savedAt, lang)}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            {item.summary.isZakatApplicable ? (
                              <p className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                                {formatBDT(totalZakat, lang)}
                              </p>
                            ) : (
                              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                {getLabel("notApplicable", lang)}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground tabular-nums">
                              {getLabel("netAssets", lang)}: {formatBDT(item.summary.netAssets, lang)}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLoad(item)}
                            className={cn(
                              "h-7 text-xs gap-1 flex-1 transition-colors",
                              isLoaded &&
                                "border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                            )}
                          >
                            {isLoaded ? (
                              <>
                                <Check className="size-3" />
                                {getLabel("loadedSuccess", lang)}
                              </>
                            ) : (
                              <>
                                <FolderOpen className="size-3" />
                                {getLabel("load", lang)}
                              </>
                            )}
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleStartRename(item)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title={getLabel("rename", lang)}
                          >
                            <Pencil className="size-3" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => setDeletingId(item.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            title={getLabel("delete", lang)}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state (only when expanded and no items) */}
        {isExpanded && savedItems.length === 0 && (
          <div className="py-6 text-center space-y-1">
            <Bookmark className="size-5 text-muted-foreground/50 mx-auto" />
            <p className="text-sm text-muted-foreground">
              {getLabel("noSavedItems", lang)}
            </p>
            <p className="text-xs text-muted-foreground/80">
              {getLabel("noSavedHint", lang)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}