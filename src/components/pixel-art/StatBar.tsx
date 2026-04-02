import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  delay?: number;
}

const colorMap: Record<string, string> = {
  red: "#b13e53",
  orange: "#ef7d57",
  yellow: "#ffcd75",
  lime: "#a7f070",
  green: "#38b764",
  teal: "#257179",
  blue: "#3b5dc9",
  sky: "#41a6f6",
  cyan: "#73eff7",
  purple: "#5d275d",
};

export default function StatBar({
  label,
  value,
  maxValue = 100,
  color = "green",
  delay = 0,
}: StatBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const percentage = (value / maxValue) * 100;
  const fillColor = colorMap[color] || color;

  return (
    <div ref={ref} className="mb-6">
      {/* Label row */}
      <div className="flex justify-between items-center mb-2">
        <span
          className="text-[11px] tracking-wider uppercase"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: "#f4f4f4",
          }}
        >
          {label}
        </span>
        <span
          className="text-sm"
          style={{
            fontFamily: "'VT323', monospace",
            color: "#ffcd75",
            fontSize: "20px",
          }}
        >
          {value}/{maxValue}
        </span>
      </div>

      {/* Bar */}
      <div
        className="stat-bar-container pixel-border"
        style={{ margin: "4px" }}
      >
        <motion.div
          className="stat-bar-fill"
          style={{ backgroundColor: fillColor }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{
            duration: 1.2,
            delay: delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        />
      </div>
    </div>
  );
}
