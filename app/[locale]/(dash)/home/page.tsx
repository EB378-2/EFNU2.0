import React from "react";
import { Box } from "@mui/material";
import QuickAccessButtons from "@components/Home/QuickAccessButtons";
import Header from "@components/Home/Header";
import UpcomingEvents from "@components/Home/UpcomingEvents";
import LatestPosts from "@components/Home/LatestPosts";

export default function HomePage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>

      {/* Header */}
      <Header/>

      {/* Quick Buttons */}
      <QuickAccessButtons/>

      {/* Latest Posts */}
      <LatestPosts/>

      {/* Upcoming Events */}
      <UpcomingEvents/>

    </Box>
  );
}