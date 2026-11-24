import React from "react";

interface NovaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "glow" | "simple";
}

export const NovaLogo: React.FC<NovaLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  variant = "glow",
}) => {
  const sizeMap = {
    sm: { icon: 24, font: "text-lg" },
    md: { icon: 32, font: "text-xl" },
    lg: { icon: 42, font: "text-2xl" },
    xl: { icon: 56, font: "text-3xl" },
  };

  const { icon, font } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {variant === "glow" && (
          <div
            className="absolute -inset-1 rounded-xl bg-gradient-to-r from-nova-magenta to-nova-cyan opacity-75 blur-md"
            aria-hidden="true"
          />
        )}
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 hover:scale-105"
          aria-label="NOVA DECK AI Logo"
        >
          {/* Outer isometric presentation slide plane */}
          <path
            d="M8 14L24 6L40 14L24 22L8 14Z"
            fill="url(#nova-grad-top)"
            stroke="#F8F5FF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Left card depth */}
          <path
            d="M8 14V34L24 42V22L8 14Z"
            fill="url(#nova-grad-left)"
            stroke="#E82DA8"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Right card depth */}
          <path
            d="M40 14V34L24 42V22L40 14Z"
            fill="url(#nova-grad-right)"
            stroke="#43D5E8"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Cyber spark core */}
          <circle cx="24" cy="22" r="3.5" fill="#F8F5FF" filter="drop-shadow(0 0 6px #43D5E8)" />

          <defs>
            <linearGradient id="nova-grad-top" x1="8" y1="6" x2="40" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F8F5FF" stopOpacity="0.9" />
              <stop offset="1" stopColor="#B7AEC9" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="nova-grad-left" x1="8" y1="14" x2="24" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E82DA8" />
              <stop offset="1" stopColor="#870B5C" />
            </linearGradient>
            <linearGradient id="nova-grad-right" x1="40" y1="14" x2="24" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#43D5E8" />
              <stop offset="1" stopColor="#0E7887" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <span className={`font-black uppercase tracking-wider text-nova-softWhite ${font}`}>
          NOVA<span className="text-nova-magenta">DECK</span>
          <span className="ml-1.5 rounded bg-nova-cyan/15 px-1.5 py-0.5 text-[0.65em] font-extrabold text-nova-cyan border border-nova-cyan/30">
            AI
          </span>
        </span>
      )}
    </div>
  );
};
export default NovaLogo;
