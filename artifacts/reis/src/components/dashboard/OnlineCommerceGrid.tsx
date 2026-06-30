import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Star } from "lucide-react";

interface PlatformData {
  platform: string;
  coverage?: string;
  peakHour?: string;
  avgRating?: number;
  available?: boolean;
}

interface OnlineCommerceGridProps {
  platforms?: PlatformData[];
}

const DEFAULT_PLATFORMS: PlatformData[] = [
  { platform: "Swiggy", coverage: "—", avgRating: 0, available: false },
  { platform: "Zomato", coverage: "—", avgRating: 0, available: false },
  { platform: "Blinkit", coverage: "—", avgRating: 0, available: false },
  { platform: "Instamart", coverage: "—", avgRating: 0, available: false },
  { platform: "BigBasket", coverage: "—", avgRating: 0, available: false },
  { platform: "ONDC", coverage: "—", avgRating: 0, available: false },
];

const PLATFORM_COLORS: Record<string, string> = {
  "Swiggy": "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  "Zomato": "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  "Blinkit": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  "Instamart": "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  "BigBasket": "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  "ONDC": "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
};

export function OnlineCommerceGrid({ platforms }: OnlineCommerceGridProps) {
  const data = platforms && platforms.length > 0 ? platforms : DEFAULT_PLATFORMS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-card-border rounded-[20px] p-5 card-float"
    >
      <h3 className="text-base font-semibold text-foreground mb-1">Online Commerce Coverage</h3>
      <p className="text-xs text-muted-foreground mb-4">Delivery platform availability & ratings</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((p, i) => (
          <motion.div
            key={p.platform}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="border border-border rounded-2xl p-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${PLATFORM_COLORS[p.platform] ?? "bg-gray-100 text-gray-600"}`}>
                {p.platform}
              </span>
              {p.available !== undefined && (
                p.available
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  : <XCircle className="h-4 w-4 text-muted-foreground/40" />
              )}
            </div>
            {p.coverage && p.coverage !== "—" && (
              <div className="text-xs text-muted-foreground">
                Coverage: <span className="text-foreground font-medium">{p.coverage}</span>
              </div>
            )}
            {p.peakHour && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                Peak: <span className="text-foreground font-medium">{p.peakHour}</span>
              </div>
            )}
            {p.avgRating !== undefined && p.avgRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span className="text-foreground font-medium">{p.avgRating.toFixed(1)}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
