import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeProvider, Box, Button } from '@mui/material';
import { darkTheme } from '../constants';
import loadingImg from '../assets/loading.gif';
import PlanetSphere from './PlanetSphere';
import StarBackground from './StarBackground'; // Import the StarBackground component

import { useNavigate } from 'react-router-dom';
function ExoplanetInfoPage() {
  const { planetName } = useParams();
  const [planet, setPlanet] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/getPlanets/?name=${planetName}`);
        const data = await response.json();
        setPlanet(data[0]);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [planetName]);

  function temperatureToColor(temperatureKelvin) {
    const coldThreshold = 150;
    const hotThreshold = 600;
    const clampedTemp = Math.max(coldThreshold, Math.min(temperatureKelvin, hotThreshold));
    const normalizedTemp = (clampedTemp - coldThreshold) / (hotThreshold - coldThreshold);

    let r, g, b;
    if (normalizedTemp < 0.33) {
      r = Math.floor(255 * (normalizedTemp * 3));
      g = 0;
      b = 255;
    } else if (normalizedTemp < 0.66) {
      r = 255;
      g = Math.floor(255 * ((normalizedTemp - 0.33) * 3));
      b = 0;
    } else {
      r = 255;
      g = Math.floor(255 * (1 - ((normalizedTemp - 0.66) * 3)));
      b = 0;
    }
    return (r << 16) | (g << 8) | b;
  }

  return (
    loading ? (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: 'black',
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <img src={loadingImg} alt="Loading..." />
      </div>
    ) : error ? (
      <p>Error: {error.message}</p>
    ) : planet ? (
      <ThemeProvider theme={darkTheme}>
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
          <div className="w-full h-full min-h-screen absolute">
            <StarBackground /> {/* Render the starry background */}
          </div>
          <p id="planet-name" style={{ zIndex: 1 }}>{planet.pl_name}</p>
          <div className="flex justify-around items-center w-full max-w-7xl" style={{ zIndex: 1 }}>
            <div className="text-white max-w-md p-5 rounded-lg">
              <div className="bg-[#393D41] text-white max-w-md p-5 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">{planet.name}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-b border-gray-500 pb-2">
                    <div className="text-sm">Discovery Year:</div>
                    <div className="text-lg">{planet?.disc_year}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2">
                    <div className="text-sm">Discovery Method:</div>
                    <div className="text-lg">{planet?.discover_method}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2">
                    <div className="text-sm">Right Ascension (RA):</div>
                    <div className="text-lg">{planet?.ra}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2">
                    <div className="text-sm">Declination (Dec):</div>
                    <div className="text-lg">{planet?.dec}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2">
                    <div className="text-sm">Radius (Earth units):</div>
                    <div className="text-lg">{planet?.pl_rade}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2">
                    <div className="text-sm">Radius (Jupiter units):</div>
                    <div className="text-lg">{planet?.pl_radj}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2">
                    <div className="text-sm">Mass (Earth units):</div>
                    <div className="text-lg">{planet?.pl_masse}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2">
                    <div className="text-sm">Mass (Jupiter units):</div>
                    <div className="text-lg">{planet?.pl_massj}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2">
                    <div className="text-sm">Equilibrium Temperature:</div>
                    <div className="text-lg">{planet?.pl_eqt} K</div>
                  </div>
                </div>

              </div>
              <Button
                onClick={() => navigate(`/stars/${planet.ra}/${planet.dec}`)}
                size="small"
                sx={{
                  padding: '10px', // Adjust padding as needed
                  bgcolor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  marginTop: '20px',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.1)', // Adjust hover background as needed
                  },
                }}
              >
                Visit the Night Sky
              </Button>
            </div>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '300px', minHeight: '300px' }}>
              <PlanetSphere radius={1.05} color={temperatureToColor(planet?.pl_eqt)} width={250} height={250} />
            </Box>
          </div>


        </div>
      </ThemeProvider>
    ) : (
      <p>No planet information available.</p>
    )
  );
}

export default ExoplanetInfoPage;