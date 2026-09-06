import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavigationItem {
  label: string;
  hasDropdown?: boolean;
  onClick?: () => void;
}

interface ProgramCard {
  image: string;
  category: string;
  title: string;
  onClick?: () => void;
}

interface PulseFitHeroProps {
  logo?: React.ReactNode | string;
  navigation?: NavigationItem[];
  ctaButton?: {
    label: string;
    onClick: () => void;
  };
  title: React.ReactNode | string;
  subtitle: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  disclaimer?: string;
  socialProof?: {
    avatars: string[];
    text: string;
  };
  programs?: ProgramCard[];
  className?: string;
  children?: React.ReactNode;
}

export function PulseFitHero({
  logo = "Nalar",
  navigation = [
    { label: "Fitur" },
    { label: "Materi Kuliah", hasDropdown: true },
    { label: "Testimoni" },
    { label: "Harga" },
  ],
  ctaButton,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  disclaimer,
  socialProof,
  programs = [],
  className,
  children,
}: PulseFitHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex flex-col overflow-hidden",
        className
      )}
      style={{
        background: "linear-gradient(180deg, #F7F7F5 0%, #FFFFFF 100%)",
      }}
      role="banner"
      aria-label="Hero section"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex flex-row justify-between items-center px-6 lg:px-16"
        style={{
          paddingTop: "32px",
          paddingBottom: "32px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            color: "#000000",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {logo}
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex flex-row items-center gap-8" aria-label="Main navigation">
          {navigation.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex flex-row items-center gap-1 hover:opacity-70 transition-opacity"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "15px",
                fontWeight: 500,
                color: "#615D59",
              }}
            >
              {item.label}
              {item.hasDropdown && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        {ctaButton && (
          <button
            onClick={ctaButton.onClick}
            className="px-5 py-2.5 transition-all hover:opacity-90"
            style={{
              background: "#2383E2",
              borderRadius: "3px",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#FFFFFF",
              boxShadow: "0 2px 6px rgba(35, 131, 226, 0.2)",
            }}
          >
            {ctaButton.label}
          </button>
        )}
      </motion.header>

      {/* Main Content */}
      {children ? (
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center max-w-4xl"
            style={{ gap: "32px" }}
          >
            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(40px, 7vw, 76px)",
                lineHeight: "1.1",
                color: "#000000",
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 400,
                fontSize: "clamp(16px, 2.5vw, 22px)",
                lineHeight: "1.6",
                color: "#615D59",
                maxWidth: "640px",
              }}
            >
              {subtitle}
            </p>

            {/* Action Buttons */}
            {(primaryAction || secondaryAction) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center gap-4 mt-4"
              >
                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    className="flex flex-row items-center gap-2 px-8 py-3.5 transition-all hover:scale-[1.02]"
                    style={{
                      background: "#2383E2",
                      borderRadius: "3px",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#FFFFFF",
                      boxShadow: "0 4px 12px rgba(35, 131, 226, 0.3)",
                    }}
                  >
                    {primaryAction.label}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M7 10H13M13 10L10 7M13 10L10 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}

                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    className="px-8 py-3.5 transition-all hover:bg-[#F7F7F5]"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E9E9E7",
                      borderRadius: "3px",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#37352F",
                    }}
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </motion.div>
            )}

            {/* Disclaimer */}
            {disclaimer && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#787774",
                }}
              >
                {disclaimer}
              </motion.p>
            )}

            {/* Social Proof */}
            {socialProof && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-row items-center gap-3 mt-4"
              >
                <div className="flex flex-row -space-x-2">
                  {socialProof.avatars.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt={`User ${index + 1}`}
                      className="rounded-full border-2 border-white"
                      style={{
                        width: "36px",
                        height: "36px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#615D59",
                  }}
                >
                  {socialProof.text}
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* Program Cards Carousel */}
      {programs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-10 w-full overflow-hidden"
          style={{
            paddingTop: "20px",
            paddingBottom: "60px",
          }}
        >
          {/* Gradient Overlays */}
          <div
            className="absolute left-0 top-0 bottom-0 z-20 pointer-events-none"
            style={{
              width: "150px",
              background: "linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 z-20 pointer-events-none"
            style={{
              width: "150px",
              background: "linear-gradient(270deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
            }}
          />

          {/* Scrolling Container */}
          <motion.div
            className="flex items-center"
            animate={{
              x: [0, -((programs.length * 380) / 2)],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: programs.length * 5,
                ease: "linear",
              },
            }}
            style={{
              gap: "24px",
              paddingLeft: "24px",
            }}
          >
            {/* Duplicate programs for seamless loop */}
            {[...programs, ...programs].map((program, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
                onClick={program.onClick}
                className="flex-shrink-0 cursor-pointer relative overflow-hidden"
                style={{
                  width: "356px",
                  height: "400px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #E9E9E7"
                }}
              >
                {/* Image */}
                <img
                  src={program.image}
                  alt={program.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
                  }}
                />

                {/* Text Content */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {program.category}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      lineHeight: "1.3",
                    }}
                  >
                    {program.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
