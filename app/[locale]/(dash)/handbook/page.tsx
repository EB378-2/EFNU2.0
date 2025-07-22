import React from "react";
import { useTranslations } from "next-intl";
import { 
  Box
} from "@mui/material";

const PdfViewerPage = () => {
  const t = useTranslations("PdfViewer");
  // PDF file path - could also come from props or context
  const pdfPath = "https://efnu.fi/wp-content/uploads/EFNU_toimintakasikirja.pdf";

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '90vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative'
    }}>

      {/* PDF Viewer */}
      <Box sx={{
        flex: 1,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <iframe
          src={`${pdfPath}#view=fitH`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
          allowFullScreen
          title={t("pdfTitle")}
        />
      </Box>
    </Box>
  );
};

export default PdfViewerPage;