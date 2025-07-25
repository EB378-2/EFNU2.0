"use client";

import React from "react";
import { RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useTheme } from "@hooks/useTheme";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface NavbarProps extends RefineThemedLayoutV2HeaderProps {
  children?: React.ReactNode;
}

const locales = [
  { value: "en", label: "EN", flag: "🇬🇧" },
  { value: "fi", label: "FI", flag: "🇫🇮" },
  { value: "se", label: "SE", flag: "🇸🇪" },
  { value: "de", label: "DE", flag: "🇩🇪" },
];

const LanguageSwitcher: React.FC<NavbarProps> = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const currentLocale = typeof params.locale === "string" ? params.locale : "en";

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLocale = event.target.value;
    if (newLocale === currentLocale) return;

    // Replace only the locale part in the pathname
    const pathParts = pathname.split("/");
    if (locales.some((l) => l.value === pathParts[1])) {
      pathParts[1] = newLocale;
    } else {
      pathParts.splice(1, 0, newLocale); // prepend if no locale in path
    }

    const newPath = pathParts.join("/") || "/";
    router.push(newPath);
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "50px",
        bgcolor: theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.05)",
        p: 0.5,
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s ease",
      }}
    >
      <motion.div
        whileHover={{
          scale: 1.05,
          boxShadow: `0 4px 12px ${theme.palette.primary.light}30`,
          transition: { duration: 0.3 },
        }}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Select
          value={currentLocale}
          onChange={handleLanguageChange}
          variant="standard"
          disableUnderline
          sx={{
            minWidth: 80,
            color: theme.palette.text.primary,
            fontWeight: 500,
            "& .MuiSelect-select": {
              py: 1,
              px: 2,
              display: "flex",
              alignItems: "center",
            },
            "& .MuiSelect-icon": {
              color: theme.palette.text.secondary,
              right: 8,
            },
          }}
          MenuProps={{
            disableScrollLock: true,
            PaperProps: {
              sx: {
                mt: 1,
                borderRadius: 2,
                boxShadow: theme.palette.mode === "dark"
                  ? "0 8px 24px rgba(0,0,0,0.3)"
                  : "0 8px 24px rgba(0,0,0,0.1)",
                "& .MuiMenuItem-root": {
                  px: 2,
                  py: 1.5,
                  "&.Mui-selected": {
                    bgcolor: theme.palette.primary.light + "20",
                  },
                },
              },
            },
          }}
        >
          {locales.map(({ value, label, flag }) => (
            <MenuItem key={value} value={value}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2">{flag}</Typography>
                <Typography variant="body2">{label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </motion.div>
    </Box>
  );
};

export default LanguageSwitcher;
