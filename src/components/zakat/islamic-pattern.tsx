import { cn } from "@/lib/utils";

/**
 * Islamic geometric pattern used as decorative background element.
 * Renders an SVG-based repeating pattern inspired by traditional Islamic art.
 */
export function IslamicPattern({
  className,
  opacity = 0.04,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <defs>
          {/* Eight-pointed star pattern tile */}
          <pattern
            id="islamic-star-pattern"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Central eight-pointed star */}
            <polygon
              points="40,8 46,20 60,14 52,28 66,28 54,36 62,50 48,44 48,58 40,46 32,58 32,44 18,50 26,36 14,28 28,28 20,14 34,20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            {/* Inner octagon */}
            <polygon
              points="40,20 48,28 48,38 40,46 32,38 32,28"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            {/* Corner connecting elements - top left */}
            <path
              d="M0,0 L12,8 L8,12 L0,0Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            {/* Corner connecting elements - top right */}
            <path
              d="M80,0 L68,8 L72,12 L80,0Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            {/* Corner connecting elements - bottom left */}
            <path
              d="M0,80 L12,72 L8,68 L0,80Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            {/* Corner connecting elements - bottom right */}
            <path
              d="M80,80 L68,72 L72,68 L80,80Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            {/* Interlocking diamond shapes between stars */}
            <path
              d="M0,40 L8,34 L20,40 L8,46Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M80,40 L72,34 L60,40 L72,46Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M40,0 L34,8 L40,20 L46,8Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M40,80 L34,72 L40,60 L46,72Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Arabesque border pattern */}
          <pattern
            id="islamic-border-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="20"
              cy="20"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle
              cx="0"
              cy="0"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle
              cx="40"
              cy="0"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle
              cx="0"
              cy="40"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle
              cx="40"
              cy="40"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <line
              x1="12"
              y1="20"
              x2="20"
              y2="12"
              stroke="currentColor"
              strokeWidth="0.4"
            />
            <line
              x1="20"
              y1="12"
              x2="28"
              y2="20"
              stroke="currentColor"
              strokeWidth="0.4"
            />
            <line
              x1="28"
              y1="20"
              x2="20"
              y2="28"
              stroke="currentColor"
              strokeWidth="0.4"
            />
            <line
              x1="20"
              y1="28"
              x2="12"
              y2="20"
              stroke="currentColor"
              strokeWidth="0.4"
            />
          </pattern>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#islamic-star-pattern)"
        />
      </svg>
    </div>
  );
}

/**
 * Decorative Islamic arch/dome shape used as a header ornament.
 */
export function IslamicArch({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("flex justify-center", className)} aria-hidden="true">
      <svg
        width="120"
        height="40"
        viewBox="0 0 120 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary/50"
      >
        {/* Pointed arch shape */}
        <path
          d="M10,38 Q10,10 60,4 Q110,10 110,38"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M18,38 Q18,16 60,10 Q102,16 102,38"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
        />
        {/* Central small star */}
        <polygon
          points="60,18 62,22 66,22 63,25 64,29 60,27 56,29 57,25 54,22 58,22"
          fill="currentColor"
          opacity="0.8"
        />
        {/* Small dots along the arch */}
        <circle cx="30" cy="24" r="1.2" fill="currentColor" opacity="0.6" />
        <circle cx="44" cy="16" r="1.2" fill="currentColor" opacity="0.6" />
        <circle cx="76" cy="16" r="1.2" fill="currentColor" opacity="0.6" />
        <circle cx="90" cy="24" r="1.2" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}

/**
 * Simple horizontal Islamic decorative divider.
 */
export function IslamicDivider({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center gap-3 py-2", className)} aria-hidden="true">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-primary/60"
      >
        {/* Small 8-pointed star */}
        <polygon
          points="12,2 14,8 20,6 16,12 22,12 16,14 20,20 14,16 14,22 12,16 10,22 10,16 4,20 8,14 2,12 8,12 4,6 10,8"
          fill="currentColor"
          transform="scale(0.8) translate(3, 3)"
        />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
    </div>
  );
}

/**
 * Mosque silhouette icon used in the header area.
 */
export function MosqueIcon({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      aria-hidden="true"
    >
      {/* Central dome */}
      <path
        d="M22,36 Q22,16 32,10 Q42,16 42,36"
        fill="currentColor"
        opacity="0.3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Crescent on top */}
      <circle cx="32" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="33.5" cy="7.5" r="2.5" fill="currentColor" opacity="0.25" stroke="none" />
      <path
        d="M33,5 Q30.5,7 33,11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Left minaret */}
      <rect x="12" y="22" width="6" height="20" rx="1" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1" />
      <path d="M12,22 Q15,16 18,22" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
      {/* Right minaret */}
      <rect x="46" y="22" width="6" height="20" rx="1" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1" />
      <path d="M46,22 Q49,16 52,22" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
      {/* Base */}
      <rect x="10" y="42" width="44" height="4" rx="1" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1" />
      {/* Door arch */}
      <path
        d="M28,46 L28,38 Q28,33 32,31 Q36,33 36,38 L36,46"
        fill="currentColor"
        opacity="0.25"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Small windows on dome */}
      <circle cx="27" cy="30" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="37" cy="30" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}