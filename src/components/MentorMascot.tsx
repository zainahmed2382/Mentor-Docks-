import React from "react";
import { motion, AnimatePresence } from "motion/react";

export type MascotState =
  | "idle"
  | "name"
  | "email"
  | "password"
  | "show-password"
  | "scanning"
  | "success"
  | "error";

interface MentorMascotProps {
  state?: MascotState;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function MentorMascot({
  state = "idle",
  size = "md",
  className = "",
}: MentorMascotProps) {
  // Dimensions based on size prop
  const dimensions = {
    sm: { width: 64, height: 64, viewBox: "0 0 120 120" },
    md: { width: 96, height: 96, viewBox: "0 0 120 120" },
    lg: { width: 128, height: 128, viewBox: "0 0 120 120" },
  }[size];

  // Dynamic aura/glow styles based on state
  const getGlowColor = () => {
    switch (state) {
      case "success":
        return "rgba(16, 185, 129, 0.45)"; // Emerald Green
      case "error":
        return "rgba(244, 63, 94, 0.45)"; // Rose / Amber
      case "password":
        return "rgba(139, 92, 246, 0.45)"; // Deep Purple / Privacy
      case "scanning":
        return "rgba(56, 189, 248, 0.55)"; // Cyan Electric
      default:
        return "rgba(99, 102, 241, 0.35)"; // Indigo / Cyan default
    }
  };

  // Body floating animation variants
  const bodyFloatVariants = {
    idle: {
      y: [0, -6, 0],
      rotate: [0, 1.5, -1.5, 0],
      transition: {
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
      },
    },
    name: {
      y: [0, -4, 0],
      rotate: [0, 4, 0],
      scale: 1.04,
      transition: {
        y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      },
    },
    email: {
      y: 2,
      rotate: -3,
      scale: 1.02,
      transition: { duration: 0.3 },
    },
    password: {
      y: 4,
      rotate: 0,
      scale: 0.96,
      transition: { duration: 0.3 },
    },
    "show-password": {
      y: -5,
      rotate: 0,
      scale: 1.06,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
    scanning: {
      y: [0, -3, 0],
      rotate: [0, -2, 2, 0],
      scale: [1, 1.03, 1],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
    success: {
      y: [-2, -12, -2],
      scale: [1, 1.1, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
    },
    error: {
      y: [0, 2, 0],
      rotate: [-5, 5, -5, 0],
      transition: { duration: 0.6, repeat: 2 },
    },
  };

  // Side ears/wings floating variants
  const leftEarVariants = {
    idle: { y: [0, -3, 0], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 } },
    name: { y: -3, rotate: -8, transition: { duration: 0.3 } },
    email: { y: 1, rotate: -4, transition: { duration: 0.3 } },
    password: { y: 5, rotate: -12, transition: { duration: 0.3 } },
    "show-password": { y: -6, rotate: 10, transition: { duration: 0.3 } },
    scanning: { y: [0, -4, 0], transition: { duration: 0.6, repeat: Infinity } },
    success: { y: [-2, -8, -2], rotate: -15, transition: { duration: 0.8, repeat: Infinity } },
    error: { y: 3, rotate: -15, transition: { duration: 0.3 } },
  };

  const rightEarVariants = {
    idle: { y: [0, -3, 0], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } },
    name: { y: -3, rotate: 8, transition: { duration: 0.3 } },
    email: { y: -2, rotate: 6, transition: { duration: 0.3 } },
    password: { y: 5, rotate: 12, transition: { duration: 0.3 } },
    "show-password": { y: -6, rotate: -10, transition: { duration: 0.3 } },
    scanning: { y: [0, -4, 0], transition: { duration: 0.6, repeat: Infinity, delay: 0.1 } },
    success: { y: [-2, -8, -2], rotate: 15, transition: { duration: 0.8, repeat: Infinity } },
    error: { y: 3, rotate: 15, transition: { duration: 0.3 } },
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Soft Ambient Glow Container */}
      <motion.div
        animate={{
          boxShadow: `0 0 35px 12px ${getGlowColor()}`,
          scale: state === "scanning" ? [1, 1.15, 1] : state === "success" ? [1, 1.25, 1] : 1,
        }}
        transition={{
          boxShadow: { duration: 0.5 },
          scale: { duration: 1.5, repeat: state === "scanning" || state === "success" ? Infinity : 0 },
        }}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: dimensions.width * 0.7,
          height: dimensions.height * 0.7,
        }}
      />

      {/* Main Mascot SVG */}
      <motion.svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={dimensions.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        variants={bodyFloatVariants}
        animate={state}
        className="relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
      >
        <defs>
          {/* Main Metallic Body Gradient */}
          <radialGradient id="mascotBodyGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#312E81" />
            <stop offset="40%" stopColor="#1E1B4B" />
            <stop offset="85%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Visor Screen Dark Glass Gradient */}
          <linearGradient id="mascotVisorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#080B14" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          {/* Cyan Glow Gradient for Eyes/Details */}
          <linearGradient id="cyanEyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Emerald Glow Gradient for Success */}
          <linearGradient id="emeraldEyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Rose / Amber Eye Gradient for Error */}
          <linearGradient id="amberEyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>

          {/* Visor Reflection Gloss */}
          <linearGradient id="visorGlossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>

          {/* Laser Scan Line Gradient */}
          <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </linearGradient>

          {/* Outer Ring Gradient */}
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Orbit Ring (Visible on Scanning or Idle) */}
        <motion.ellipse
          cx="60"
          cy="60"
          rx="52"
          ry="18"
          stroke="url(#ringGrad)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
          fill="none"
          animate={{
            rotate: [0, 360],
            scale: state === "scanning" ? [1, 1.08, 1] : 1,
            opacity: state === "password" ? 0.3 : 0.8,
          }}
          transition={{
            rotate: { duration: state === "scanning" ? 3 : 12, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.3 },
          }}
          style={{ originX: "60px", originY: "60px" }}
        />

        {/* Left Anti-Gravity Ear/Pod */}
        <motion.g variants={leftEarVariants} animate={state}>
          <rect x="8" y="48" width="10" height="24" rx="5" fill="#1E1B4B" stroke="#4338CA" strokeWidth="1.5" />
          <circle cx="13" cy="60" r="2.5" fill={state === "error" ? "#F43F5E" : state === "success" ? "#10B981" : "#38BDF8"} />
        </motion.g>

        {/* Right Anti-Gravity Ear/Pod */}
        <motion.g variants={rightEarVariants} animate={state}>
          <rect x="102" y="48" width="10" height="24" rx="5" fill="#1E1B4B" stroke="#4338CA" strokeWidth="1.5" />
          <circle cx="107" cy="60" r="2.5" fill={state === "error" ? "#F43F5E" : state === "success" ? "#10B981" : "#38BDF8"} />
        </motion.g>

        {/* Main Body Head Sphere */}
        <circle cx="60" cy="60" r="42" fill="url(#mascotBodyGrad)" stroke="#4338CA" strokeWidth="1.5" />
        {/* Subtle Top Cap Light Highlight */}
        <ellipse cx="60" cy="24" rx="22" ry="7" fill="#FFFFFF" fillOpacity="0.08" />

        {/* Visor Screen Container */}
        <rect
          x="26"
          y="38"
          width="68"
          height="44"
          rx="22"
          fill="url(#mascotVisorGrad)"
          stroke={
            state === "success"
              ? "#10B981"
              : state === "error"
              ? "#F43F5E"
              : state === "password"
              ? "#8B5CF6"
              : "#38BDF8"
          }
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />

        {/* Visor Top Gloss Reflection */}
        <path d="M 28 50 C 28 42, 38 40, 60 40 C 82 40, 92 42, 92 50 C 92 43, 80 40, 60 40 C 40 40, 28 43, 28 50 Z" fill="url(#visorGlossGrad)" />

        {/* VISOR EYES / EXPRESSIONS CONTENT */}
        <g id="mascot-eyes">
          {/* 1. IDLE / DEFAULT EYES */}
          {state === "idle" && (
            <g>
              {/* Left Eye */}
              <motion.ellipse
                cx="46"
                cy="58"
                rx="6"
                ry="8"
                fill="url(#cyanEyeGrad)"
                animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.9, 1] }}
              />
              <circle cx="44.5" cy="55.5" r="2" fill="#FFFFFF" opacity="0.9" />

              {/* Right Eye */}
              <motion.ellipse
                cx="74"
                cy="58"
                rx="6"
                ry="8"
                fill="url(#cyanEyeGrad)"
                animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.9, 1] }}
              />
              <circle cx="72.5" cy="55.5" r="2" fill="#FFFFFF" opacity="0.9" />
            </g>
          )}

          {/* 2. NAME FIELD (FRIENDLY HAPPY EYES `^ ^`) */}
          {state === "name" && (
            <g>
              {/* Left Happy Curved Arc */}
              <motion.path
                d="M 40 61 Q 46 51 52 61"
                stroke="url(#cyanEyeGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
              {/* Right Happy Curved Arc */}
              <motion.path
                d="M 68 61 Q 74 51 80 61"
                stroke="url(#cyanEyeGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
              {/* Soft Blushing Dots */}
              <circle cx="36" cy="65" r="3" fill="#818CF8" opacity="0.6" />
              <circle cx="84" cy="65" r="3" fill="#818CF8" opacity="0.6" />
            </g>
          )}

          {/* 3. EMAIL FIELD (LOOKING DOWN/LEFT TOWARDS FIELD) */}
          {state === "email" && (
            <g>
              {/* Left Eye shifting pupil */}
              <ellipse cx="44" cy="60" rx="7" ry="7" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
              <motion.circle
                cx="42"
                cy="62"
                r="4"
                fill="url(#cyanEyeGrad)"
                animate={{ x: [-1, 1, -1], y: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx="41" cy="60.5" r="1.5" fill="#FFFFFF" opacity="0.9" />

              {/* Right Eye shifting pupil */}
              <ellipse cx="72" cy="60" rx="7" ry="7" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
              <motion.circle
                cx="70"
                cy="62"
                r="4"
                fill="url(#cyanEyeGrad)"
                animate={{ x: [-1, 1, -1], y: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx="69" cy="60.5" r="1.5" fill="#FFFFFF" opacity="0.9" />
            </g>
          )}

          {/* 4. PASSWORD FIELD (PRIVACY / CLOSED EYES `- -`) */}
          {state === "password" && (
            <g>
              {/* Left Closed Eye Line */}
              <motion.path
                d="M 40 59 L 52 59"
                stroke="#8B5CF6"
                strokeWidth="4.5"
                strokeLinecap="round"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
              {/* Right Closed Eye Line */}
              <motion.path
                d="M 68 59 L 80 59"
                stroke="#8B5CF6"
                strokeWidth="4.5"
                strokeLinecap="round"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
              {/* Privacy Shield Badge Lock Icon overlay */}
              <motion.path
                d="M 60 48 L 60 52 M 57 52 L 63 52 L 63 56 L 57 56 Z"
                stroke="#C084FC"
                strokeWidth="1.5"
                fill="none"
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 0.9, y: 0 }}
              />
            </g>
          )}

          {/* 5. SHOW PASSWORD (PEEKING WIDE EYES `O O`) */}
          {state === "show-password" && (
            <g>
              {/* Left Eye Wide */}
              <circle cx="45" cy="58" r="8" fill="url(#cyanEyeGrad)" />
              <circle cx="45" cy="58" r="3.5" fill="#0F172A" />
              <circle cx="47" cy="55" r="2" fill="#FFFFFF" />

              {/* Right Eye Wide */}
              <circle cx="75" cy="58" r="8" fill="url(#cyanEyeGrad)" />
              <circle cx="75" cy="58" r="3.5" fill="#0F172A" />
              <circle cx="77" cy="55" r="2" fill="#FFFFFF" />

              {/* Curious Eyebrows */}
              <path d="M 39 46 Q 45 43 51 47" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 69 47 Q 75 43 81 46" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* 6. SCANNING (TECH HORIZONTAL SWEEP BEAM) */}
          {state === "scanning" && (
            <g>
              {/* Concentric Focused Target Eye */}
              <circle cx="46" cy="58" r="6" stroke="#38BDF8" strokeWidth="2" fill="none" />
              <circle cx="46" cy="58" r="2" fill="#38BDF8" />

              <circle cx="74" cy="58" r="6" stroke="#38BDF8" strokeWidth="2" fill="none" />
              <circle cx="74" cy="58" r="2" fill="#38BDF8" />

              {/* Moving Laser Beam Sweep */}
              <motion.rect
                x="28"
                y="40"
                width="64"
                height="4"
                fill="url(#scanBeamGrad)"
                animate={{ y: [0, 36, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </g>
          )}

          {/* 7. SUCCESS (EMERALD HAPPY EYES + SPARKLES) */}
          {state === "success" && (
            <g>
              {/* Left Emerald Arc */}
              <motion.path
                d="M 39 61 Q 46 49 53 61"
                stroke="url(#emeraldEyeGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Emerald Arc */}
              <motion.path
                d="M 67 61 Q 74 49 81 61"
                stroke="url(#emeraldEyeGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Happy Mouth Smile Line */}
              <motion.path
                d="M 55 66 Q 60 70 65 66"
                stroke="#34D399"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
              {/* Little Star Sparkle */}
              <motion.polygon
                points="60,44 61.5,47.5 65,49 61.5,50.5 60,54 58.5,50.5 55,49 58.5,47.5"
                fill="#34D399"
                animate={{ rotate: [0, 90, 180, 270, 360], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ originX: "60px", originY: "49px" }}
              />
            </g>
          )}

          {/* 8. ERROR (CONFUSED / CONCERNED EXPRESSION `o_O`) */}
          {state === "error" && (
            <g>
              {/* Left Eye Small */}
              <circle cx="46" cy="58" r="4.5" fill="url(#amberEyeGrad)" />
              <circle cx="45" cy="57" r="1.5" fill="#FFFFFF" />

              {/* Right Eye Wide Concerned */}
              <circle cx="74" cy="56" r="7.5" fill="url(#amberEyeGrad)" />
              <circle cx="74" cy="56" r="3" fill="#0F172A" />
              <circle cx="76" cy="54" r="1.5" fill="#FFFFFF" />

              {/* Confused Slanted Eyebrows */}
              <path d="M 40 47 L 52 51" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 68 49 L 80 46" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />

              {/* Wavy Mouth */}
              <path d="M 54 67 Q 58 64 62 67 Q 66 70 68 67" stroke="#FB7185" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}
        </g>
      </motion.svg>
    </div>
  );
}
