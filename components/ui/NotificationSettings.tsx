// components/ui/NotificationSettings.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useGetIdentity } from "@refinedev/core";
import { NotificationAdd } from "@node_modules/@mui/icons-material";

export const NotificationSettings = () => (
  <Box>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Notification Settings
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Manage your notification preferences here.
    </Typography>
    <NotificationAdd
      sx={{ fontSize: 40, color: "primary.main", mt: 2 }}/>
  </Box>
);
