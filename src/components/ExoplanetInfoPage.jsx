import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, Box, Button } from '@mui/material';
import { darkTheme } from '../constants';
import loadingImg from '../assets/loading.gif';
import PlanetSphere from './PlanetSphere';
import StarBackground from './StarBackground';
import MarkdownIt from 'markdown-it';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

function ExoplanetInfoPage() {
  const { planetName } = useParams();
  const [planet, setPlanet] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState('');
  const navigate = useNavigate();
  const md = new MarkdownIt(); // Initialize markdown-it

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/getPlanets/?name=${planetName}&detailed=True`);
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

  useEffect(() => {
    const apiKey = "AIzaSyDEmoJPQhkqu9EWUQJCBGbQeSVKx5qjy_w";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const data = {
      contents: [
        {
          parts: [
            {
              text: `Generate a report about ${planetName}, 1-2 Pages length`
            }
          ]
        }
      ]
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setReport(data.candidates[0].content.parts[0].text); // Store the generated report text
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });

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

  const savePDF = async () => {
    const pdf = new jsPDF();
    console.log("here", report);

    // Split the report into lines for processing
    const lines = report.split('\n'); // Split by new lines

    let position = 10; // Initial vertical position
    const pageHeight = pdf.internal.pageSize.height; // Get the height of the PDF page

    lines.forEach((line) => {
      // Handle bold text, italic text, and regular text
      const textElements = line.split(/(\*\*.*?\*\*|\*.*?\*|~~.*?~~)/g); // Split by bold (**text**), italic (*text*), and strikethrough (~~text~~)

      textElements.forEach((element) => {
        if (element.startsWith('**') && element.endsWith('**')) {
          // Bold text
          pdf.setFont("helvetica", "bold");
          const boldText = element.replace(/\*\*/g, ''); // Remove '**'
          const boldLines = pdf.splitTextToSize(boldText, 190);

          boldLines.forEach(boldLine => {
            if (position + 10 > pageHeight) {
              pdf.addPage(); // Create a new page
              position = 10; // Reset position
            }
            pdf.text(boldLine, 10, position);
            position += 10; // Move down for the next line
          });
        } else if (element.startsWith('*') && element.endsWith('*')) {
          // Italic text
          pdf.setFont("helvetica", "italic");
          const italicText = element.replace(/\*/g, ''); // Remove '*'
          const italicLines = pdf.splitTextToSize(italicText, 190);

          italicLines.forEach(italicLine => {
            if (position + 10 > pageHeight) {
              pdf.addPage(); // Create a new page
              position = 10; // Reset position
            }
            pdf.text(italicLine, 10, position);
            position += 10; // Move down for the next line
          });
        } else if (element.startsWith('~~') && element.endsWith('~~')) {
          // Strikethrough text
          pdf.setFont("helvetica", "normal");
          const strikeText = element.replace(/~~/g, ''); // Remove '~~'
          const strikeLines = pdf.splitTextToSize(strikeText, 190);

          strikeLines.forEach(strikeLine => {
            if (position + 10 > pageHeight) {
              pdf.addPage(); // Create a new page
              position = 10; // Reset position
            }
            pdf.text(strikeLine, 10, position);
            position += 10; // Move down for the next line
          });
        } else if (element.trim() !== '') {
          // Regular text
          pdf.setFont("helvetica", "normal");
          const textLines = pdf.splitTextToSize(element, 190); // Split lines for wrapping

          textLines.forEach(textLine => {
            if (position + 10 > pageHeight) {
              pdf.addPage(); // Create a new page
              position = 10; // Reset position
            }
            pdf.text(textLine, 10, position);
            position += 10; // Move down for the next line
          });
        }
      });
    });

    // Save the PDF
    pdf.save('exoplanet_report.pdf');
  };

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
            <div
              className="text-white max-w-md p-5 rounded-lg"
              style={{ height: 'auto' }} // Set a max height and add vertical scroll if content exceeds
            >
              <div className="bg-[#393D41] text-white max-w-md p-5 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">{planet.name}</h2>
                <div className="grid grid-cols-3 gap-4 "> {/* Align fields to the right */}
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between flex flex-col items-start justify-start	">
                    <div className="text-sm">Discovery Year:</div>
                    <div className="text-lg">{planet?.disc_year}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Discovery Method:</div>
                    <div className="text-lg">{planet?.discover_method}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Right Ascension (RA):</div>
                    <div className="text-lg">{planet?.ra}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Declination (Dec):</div>
                    <div className="text-lg">{planet?.dec}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Radius (Earth units):</div>
                    <div className="text-lg">{planet?.pl_rade}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Radius (Jupiter units):</div>
                    <div className="text-lg">{planet?.pl_radj}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Mass (Earth units):</div>
                    <div className="text-lg">{planet?.pl_masse}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Mass (Jupiter units):</div>
                    <div className="text-lg">{planet?.pl_massj}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Equilibrium Temperature:</div>
                    <div className="text-lg">{planet?.pl_eqt} K</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Orbital Period (days):</div>
                    <div className="text-lg">{planet?.pl_orbper}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Angular Separation:</div>
                    <div className="text-lg">{planet?.pl_angsep}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Density:</div>
                    <div className="text-lg">{planet?.pl_dens}</div>
                  </div>
                  <div className="border-b border-gray-500 pb-2 flex flex-col items-start justify-between">
                    <div className="text-sm">Radial Velocity Amplitude:</div>
                    <div className="text-lg">{planet?.pl_rvamp || 'No information'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '300px', minHeight: '300px' }}>
                <PlanetSphere radius={1.05} color={temperatureToColor(planet?.pl_eqt)} width={250} height={250} />
              </Box>
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
              <Button
                onClick={savePDF}
                size="small"
                sx={{
                  padding: '10px',
                  bgcolor: report ? 'rgb(78,132,89)' : 'transparent', // Change color based on report readiness
                  color: 'white',
                  border: '1px solid white',
                  marginTop: '10px',
                  '&:hover': {
                    bgcolor: report ? 'rgb(78,132,89)' : 'rgba(0, 0, 0, 0.1)', // Adjust hover background
                  },
                }}
                disabled={!report} // Disable button if report is not ready
              >
                Download an AI-Report as PDF
              </Button>
            </div>
          </div>
        </div>
      </ThemeProvider>
    ) : (
      <p>No planet information available.</p>
    )
  );
}

export default ExoplanetInfoPage;
