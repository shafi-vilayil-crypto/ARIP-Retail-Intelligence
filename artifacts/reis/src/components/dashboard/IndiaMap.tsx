import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Simplified SVG India Map with all 28 states + 8 UTs
 * Each state is a clickable path with tooltip and color coding based on score
 */

interface StateScore {
  state: string;
  score: number;
  locations?: number;
  topCity?: string;
}

interface IndiaMapProps {
  stateScores?: StateScore[];
  onStateClick?: (state: string) => void;
  highlightStates?: string[];
}

// Simplified state paths — positioned in approximate geographic locations
// Using rect/polygon approximations for clean rendering
const STATES: Array<{ id: string; name: string; d: string }> = [
  { id: "JK", name: "Jammu & Kashmir", d: "M 155,25 L 175,20 L 195,30 L 190,50 L 175,55 L 160,45 Z" },
  { id: "HP", name: "Himachal Pradesh", d: "M 170,55 L 190,50 L 200,60 L 195,70 L 175,70 Z" },
  { id: "PB", name: "Punjab", d: "M 150,60 L 170,55 L 175,70 L 165,80 L 145,75 Z" },
  { id: "UK", name: "Uttarakhand", d: "M 195,60 L 215,55 L 225,65 L 220,78 L 200,75 Z" },
  { id: "HR", name: "Haryana", d: "M 150,80 L 168,75 L 178,85 L 170,100 L 152,95 Z" },
  { id: "DL", name: "Delhi", d: "M 168,90 L 175,88 L 178,93 L 172,95 Z" },
  { id: "RJ", name: "Rajasthan", d: "M 100,85 L 150,80 L 155,100 L 160,130 L 130,150 L 90,140 L 85,110 Z" },
  { id: "UP", name: "Uttar Pradesh", d: "M 170,80 L 200,75 L 250,85 L 260,100 L 240,120 L 200,125 L 175,115 L 165,100 Z" },
  { id: "BR", name: "Bihar", d: "M 250,100 L 285,95 L 290,110 L 270,120 L 250,115 Z" },
  { id: "SK", name: "Sikkim", d: "M 280,80 L 290,78 L 293,86 L 285,88 Z" },
  { id: "AR", name: "Arunachal Pradesh", d: "M 310,65 L 345,60 L 350,75 L 320,80 Z" },
  { id: "NL", name: "Nagaland", d: "M 335,82 L 350,80 L 352,92 L 338,94 Z" },
  { id: "MN", name: "Manipur", d: "M 335,95 L 350,93 L 352,106 L 338,108 Z" },
  { id: "MZ", name: "Mizoram", d: "M 330,110 L 345,108 L 348,125 L 332,127 Z" },
  { id: "TR", name: "Tripura", d: "M 318,110 L 330,108 L 332,122 L 320,124 Z" },
  { id: "ML", name: "Meghalaya", d: "M 298,88 L 330,85 L 332,95 L 300,98 Z" },
  { id: "AS", name: "Assam", d: "M 290,75 L 335,70 L 340,82 L 335,95 L 310,100 L 295,95 Z" },
  { id: "WB", name: "West Bengal", d: "M 270,100 L 290,95 L 300,110 L 295,140 L 280,155 L 265,130 Z" },
  { id: "JH", name: "Jharkhand", d: "M 240,120 L 270,115 L 275,140 L 255,150 L 235,140 Z" },
  { id: "OD", name: "Odisha", d: "M 225,145 L 260,140 L 275,155 L 265,175 L 235,180 L 220,165 Z" },
  { id: "CT", name: "Chhattisgarh", d: "M 195,130 L 230,125 L 240,145 L 230,170 L 210,175 L 195,155 Z" },
  { id: "MP", name: "Madhya Pradesh", d: "M 135,115 L 195,110 L 200,130 L 195,160 L 160,165 L 130,155 Z" },
  { id: "GJ", name: "Gujarat", d: "M 60,130 L 95,115 L 130,125 L 130,160 L 105,180 L 70,185 L 55,170 L 50,150 Z" },
  { id: "MH", name: "Maharashtra", d: "M 95,165 L 160,160 L 195,165 L 205,190 L 185,215 L 140,220 L 100,210 L 85,190 Z" },
  { id: "TG", name: "Telangana", d: "M 155,210 L 195,200 L 210,215 L 200,235 L 170,240 L 155,225 Z" },
  { id: "AP", name: "Andhra Pradesh", d: "M 160,235 L 205,225 L 225,240 L 230,270 L 200,285 L 175,275 L 155,255 Z" },
  { id: "KA", name: "Karnataka", d: "M 100,215 L 155,210 L 165,240 L 160,275 L 135,290 L 105,280 L 90,250 Z" },
  { id: "GA", name: "Goa", d: "M 85,225 L 100,222 L 102,235 L 88,238 Z" },
  { id: "KL", name: "Kerala", d: "M 110,280 L 135,275 L 140,310 L 130,335 L 118,330 L 108,300 Z" },
  { id: "TN", name: "Tamil Nadu", d: "M 135,275 L 175,265 L 195,285 L 185,320 L 155,340 L 135,325 Z" },
  { id: "LD", name: "Ladakh", d: "M 145,10 L 170,5 L 190,15 L 180,30 L 155,25 Z" },
  { id: "CH", name: "Chandigarh", d: "M 165,72 L 170,71 L 171,75 L 166,76 Z" },
];

function getScoreColor(score: number): string {
  if (score >= 85) return "#10B981"; // emerald
  if (score >= 70) return "#34D399"; // lighter emerald
  if (score >= 55) return "#3B82F6"; // blue
  if (score >= 40) return "#F59E0B"; // amber
  if (score >= 20) return "#F97316"; // orange
  return "#EF4444"; // red
}

function getScoreOpacity(score: number): number {
  if (score >= 80) return 0.85;
  if (score >= 60) return 0.65;
  if (score >= 40) return 0.45;
  return 0.3;
}

export function IndiaMap({ stateScores = [], onStateClick, highlightStates = [] }: IndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const scoreMap = new Map(stateScores.map(s => [s.state, s]));

  const getStateScore = (stateName: string): StateScore | undefined => {
    return scoreMap.get(stateName);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const hoveredData = hoveredState ? getStateScore(hoveredState) : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-card-border rounded-[20px] p-5 card-float relative"
    >
      <h3 className="text-base font-semibold text-foreground mb-1">India Expansion Map</h3>
      <p className="text-xs text-muted-foreground mb-4">State-level opportunity heatmap</p>

      <div className="relative" onMouseMove={handleMouseMove}>
        <svg viewBox="30 -5 340 360" className="w-full h-auto max-h-[380px]">
          {/* Background */}
          <rect x="30" y="-5" width="340" height="360" fill="transparent" />

          {STATES.map((state) => {
            const data = getStateScore(state.name);
            const score = data?.score ?? 0;
            const isHighlighted = highlightStates.includes(state.name);
            const isHovered = hoveredState === state.name;
            const hasScore = score > 0;

            return (
              <path
                key={state.id}
                d={state.d}
                fill={hasScore ? getScoreColor(score) : "hsl(var(--muted))"}
                fillOpacity={hasScore ? getScoreOpacity(score) : 0.4}
                stroke={isHighlighted || isHovered ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth={isHighlighted || isHovered ? 2 : 0.8}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredState(state.name)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onStateClick?.(state.name)}
                style={{
                  transform: isHovered ? "scale(1.02)" : "scale(1)",
                  transformOrigin: "center",
                  filter: isHovered ? "brightness(1.1)" : "none",
                }}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredState && (
          <div
            className="absolute pointer-events-none z-10 bg-card border border-border rounded-xl shadow-lg px-3 py-2 text-xs"
            style={{
              left: Math.min(tooltipPos.x + 12, 250),
              top: tooltipPos.y - 60,
            }}
          >
            <div className="font-semibold text-foreground">{hoveredState}</div>
            {hoveredData ? (
              <>
                <div className="text-muted-foreground mt-0.5">
                  Score: <span className="font-bold text-foreground">{hoveredData.score}</span>
                </div>
                {hoveredData.topCity && (
                  <div className="text-muted-foreground">Top: {hoveredData.topCity}</div>
                )}
                {hoveredData.locations !== undefined && (
                  <div className="text-muted-foreground">{hoveredData.locations} locations</div>
                )}
              </>
            ) : (
              <div className="text-muted-foreground mt-0.5">No data</div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "#EF4444", opacity: 0.6 }} />
          <span className="text-[10px] text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "#F59E0B", opacity: 0.6 }} />
          <span className="text-[10px] text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "#3B82F6", opacity: 0.7 }} />
          <span className="text-[10px] text-muted-foreground">Good</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "#10B981", opacity: 0.85 }} />
          <span className="text-[10px] text-muted-foreground">Excellent</span>
        </div>
      </div>
    </motion.div>
  );
}
