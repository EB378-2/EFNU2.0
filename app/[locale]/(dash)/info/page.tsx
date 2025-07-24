import React, { Suspense } from 'react';
import { Spinner } from "@/components/ui/Spinner";
import { Box } from '@mui/material';

const AtisPage: React.FC = () => {

  return (
    <Suspense fallback={<Spinner/>}>
      <Box
        sx={{
          position: 'relative',
          zIndex: 2000,
        }}
      > 
        <iframe
          src="https://info.efnu.fi/"
          style={{
            position: "relative",
            height: "90vh",
            width: "100vw",
            border: "none",
            margin: 0,
            padding: 0,
            display: "block",
            zIndex: 9999, // add this as well, just to be safe
          }}
          allowFullScreen
          title="Info Service"
          className="transition-all duration-300"
        />
      </Box>
      

    </Suspense>
  );
};

export default AtisPage;