import React, { Suspense } from 'react';
import { Spinner } from "@/components/ui/Spinner";
import { Box } from '@mui/material';

const WeatherPage: React.FC = () => {

  return (
    <Suspense fallback={<Spinner/>}>
      <Box
        sx={{
          position: 'relative',
          zIndex: 2000,
        }}
      > 
        <iframe
          src="https://ilmailusaa.fi" 
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
          title="Ilmailusaa Weather Map"
          className="transition-all duration-300"
        />
      </Box>
      

    </Suspense>
  );
};

export default WeatherPage;