"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Notifications, NotificationsOff } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useGetIdentity } from "@refinedev/core";
import { useTheme } from "@hooks/useTheme";

export const NotificationSettings = () => {
    const t = useTranslations("NotificationSettings");
    const { data: identityData } = useGetIdentity<{ id: string }>();
    const UserID = identityData?.id as string;
    const theme = useTheme();

    const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);

    // Ask permission if not already granted
    useEffect(() => {
        if (permission === "default") {
            Notification.requestPermission().then(setPermission);
        }
    }, [permission]);

    const togglePermission = async () => {
        if (permission === "granted") {
            alert("You have already allowed notifications. To disable, go to browser settings.");
        } else {
            const result = await Notification.requestPermission();
            setPermission(result);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            {permission === "granted" ? (
                <Notifications
                    color="primary"
                    onClick={togglePermission}
                    style={{ cursor: "pointer" }}
                />
            ) : (
                <NotificationsOff
                    color="disabled"
                    onClick={togglePermission}
                    style={{ cursor: "pointer" }}
                />
            )}
        </Box>
    );
};
