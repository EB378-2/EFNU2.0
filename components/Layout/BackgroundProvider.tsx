"use client";

import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@hooks/useTheme";

export function BackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Theme-aware colors with enhanced contrast
  const backgroundColor = theme.palette.background.default;
  const lineColor = isDark 
    ? theme.palette.grey[400]  // brighter grey for dark mode
    : theme.palette.grey[800]; // darker grey for light mode

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: backgroundColor,
        minHeight: "100vh",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            /* Base grid - kept subtle */
            linear-gradient(to right, ${lineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
          `,
          backgroundSize: `40px 40px`,
          opacity: isDark ? 0.1 : 0.07,
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            /* Primary diagonals - more prominent */
            linear-gradient(45deg, ${lineColor} 1px, transparent 1px),
            linear-gradient(-45deg, ${lineColor} 1px, transparent 1px),
            /* Organic connecting lines */
            linear-gradient(20deg, transparent 98%, ${lineColor} 99%, transparent 100%),
            linear-gradient(70deg, transparent 97%, ${lineColor} 98%, transparent 99%),
            linear-gradient(110deg, transparent 96%, ${lineColor} 97%, transparent 98%),
            linear-gradient(160deg, transparent 95%, ${lineColor} 96%, transparent 97%)
          `,
          backgroundSize: `
            60px 60px,  /* Diagonal grid size */
            60px 60px,
            100% 100%,   /* Full-width organic lines */
            100% 100%,
            100% 100%,
            100% 100%
          `,
          opacity: isDark ? 0.15 : 0.12,  /* Increased opacity for diagonals */
          pointerEvents: "none",
          mixBlendMode: isDark ? "overlay" : "multiply"
        }
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Main content area */}
        {children}
      </Box>
    </Box>
  );
}