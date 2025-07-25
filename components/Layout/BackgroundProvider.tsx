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

  const backgroundColor = theme.palette.background.default;
  const lineColor = isDark 
    ? theme.palette.grey[400]
    : theme.palette.grey[800];

  return (
    <Box sx={{ position: 'relative', maxHeight: '90vh', overflow: 'auto' }}>
      
      {/* Background layers in separate Box with negative zIndex */}
      <Box
        sx={{
          position: 'fixed', // or absolute if you want relative to container
          top: 0,
          left: 0,
          right: 0,
          bottom: "10vh",
          backgroundColor: backgroundColor,
          pointerEvents: 'none',
          zIndex: -1,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
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
              linear-gradient(45deg, ${lineColor} 1px, transparent 1px),
              linear-gradient(-45deg, ${lineColor} 1px, transparent 1px),
              linear-gradient(20deg, transparent 98%, ${lineColor} 99%, transparent 100%),
              linear-gradient(70deg, transparent 97%, ${lineColor} 98%, transparent 99%),
              linear-gradient(110deg, transparent 96%, ${lineColor} 97%, transparent 98%),
              linear-gradient(160deg, transparent 95%, ${lineColor} 96%, transparent 97%)
            `,
            backgroundSize: `
              60px 60px,
              60px 60px,
              100% 100%,
              100% 100%,
              100% 100%,
              100% 100%
            `,
            opacity: isDark ? 0.15 : 0.12,
            pointerEvents: "none",
            mixBlendMode: isDark ? "overlay" : "multiply"
          }
        }}
      />
      
      {/* Content wrapper with relative zIndex */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
