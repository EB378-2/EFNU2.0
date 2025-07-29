"use client";

import React from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { useTranslations } from "next-intl";

export default function FeesPage() {
  const t = useTranslations("Fees");

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>

      {/* Landing Fees */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>{t("landing.title")}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t("landing.note")}
        </Typography>

        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("aircraftType")}</TableCell>
                <TableCell>{t("perLanding")}</TableCell>
                <TableCell>{t("extraDay")}</TableCell>
                <TableCell>{t("weeklyParking")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{t("balloons")}</TableCell>
                <TableCell>{t("noFee")}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("sailplanes")}</TableCell>
                <TableCell>10 €</TableCell>
                <TableCell>5 €</TableCell>
                <TableCell>30 €</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("motorSmall")}</TableCell>
                <TableCell>15 €</TableCell>
                <TableCell>10 €</TableCell>
                <TableCell>60 €</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("motorMid")}</TableCell>
                <TableCell>60 €</TableCell>
                <TableCell>50 €</TableCell>
                <TableCell>300 €</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("larger")}</TableCell>
                <TableCell>{t("agreement")}</TableCell>
                <TableCell>{t("agreement")}</TableCell>
                <TableCell>{t("agreement")}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>

        <Typography variant="body2" mt={2}>
          {t("ifrFee")}: 15 €
        </Typography>
        <Typography variant="body2">{t("fuelingFee")}: 50 €</Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Season Cards */}
      <Box>
        <Typography variant="h6" gutterBottom>{t("season.title")}</Typography>
        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("aircraftType")}</TableCell>
                <TableCell>{t("price")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow><TableCell>{t("glider")}</TableCell><TableCell>315 €</TableCell></TableRow>
              <TableRow><TableCell>{t("acft650")}</TableCell><TableCell>548 €</TableCell></TableRow>
              <TableRow><TableCell>{t("acft2000")}</TableCell><TableCell>650 €</TableCell></TableRow>
              <TableRow><TableCell>{t("acft5000")}</TableCell><TableCell>800 €</TableCell></TableRow>
              <TableRow><TableCell>{t("larger")}</TableCell><TableCell>{t("agreement")}</TableCell></TableRow>
            </TableBody>
          </Table>
        </Paper>
        <Typography variant="body2" mt={1}>
          {t("seasonDetails")}
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Winter + IFR Cards */}
      <Box>
        <Typography variant="h6">{t("winter.title")}</Typography>
        <Typography variant="body2">{t("winter.season")}: 252 €</Typography>
        <Typography variant="body2">{t("nightVFR")}: 178 €</Typography>
        <Typography variant="body2">{t("ifrCard")}: 355 €</Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* PIC Fees */}
      <Box>
        <Typography variant="h6">{t("pic.title")}</Typography>
        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("type")}</TableCell>
                <TableCell>{t("price")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow><TableCell>{t("annual")}</TableCell><TableCell>102 €</TableCell></TableRow>
              <TableRow><TableCell>{t("oneTime")}</TableCell><TableCell>20 €</TableCell></TableRow>
              <TableRow><TableCell>{t("additionalIFR")}</TableCell><TableCell>102 €</TableCell></TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Typography variant="body2" mt={2}>{t("fuelingFee")}: 50 €</Typography>
    </Container>
  );
}
