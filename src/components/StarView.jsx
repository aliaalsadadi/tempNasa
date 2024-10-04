/* eslint-disable react/no-unknown-property */
import {
	Button,
	ButtonGroup,
	Card,
	CardContent,
	CssBaseline,
	Dialog,
	DialogContent,
	DialogTitle,
	ThemeProvider,
	Typography,
	IconButton,

} from '@mui/material';
import { OrbitControls, Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Stars from './Stars';
import { darkTheme } from '../constants';
import StarInfoCard from './StarInfoCard';
import CloseIcon from '@mui/icons-material/Close';

function StarView() {
	const [activeStar, setActiveStar] = useState(null);
	const [constellating, setConstellating] = useState(false);
	const [queryResult, setQueryResult] = useState(null);
	const [error, setError] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility

	const buttons = [
		<Button
			key="one"
			disabled={!constellating}
			onClick={() => setConstellating(false)}
		>
			Cancel
		</Button>,
		<Button
			key="two"
			onClick={() => {
				setConstellating(!constellating);
			}}
			disabled={constellating}
		>
			Constellate
		</Button>,
		<Button key="three" disabled={!constellating}>
			Publish
		</Button>,
	];
	const { ra, dec } = useParams(); // Get ra and dec from URL params

	useEffect(() => {
		const fetchData = async () => {
			fetch(`${import.meta.env.VITE_API_URL}/getStars`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					ra: parseFloat(ra), // Use ra from URL param
					dec: parseFloat(dec), // Use dec from URL param
				}),
			})
				.then(response => response.json())
				.then(data => {
					setQueryResult(data);
				})
				.catch(error => console.error('Error:', error));
		};
		try {
			fetchData();
		} catch (error) {
			setError(error);
		}
	}, [ra, dec]); // Trigger fetch when ra or dec changes

	// Function to handle click on a star/planet
	const handleStarClick = (star) => {
		setActiveStar(star);
		setDialogOpen(true); // Open dialog when a star is clicked
	};

	const handleCloseDialog = () => {
		setDialogOpen(false); // Close dialog when needed
	};

	return (
		<div>
			{error && <p>Error: {error}</p>}

			/* Canvas Container */
						<div className="canvas-container" >
							{queryResult ? (
								<div style={{ position: 'relative' }}>
									<div style={{background:'white', borderRadius: '5px', position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', zIndex: 999 }}>
										<ButtonGroup
											size="large"
											aria-label="Large button group"
											variant="contained"
											color="secondary"
										>
											{buttons}
										</ButtonGroup>
									</div>
									<Canvas
										camera={{ position: [0, 0, 5] }}
										style={{
											background: 'black',
											height: '100vh',
											width: '100vw',
										}}
									>
										<Html>
											<div
												style={{
													position: 'absolute',
													display: 'flex',
													top: -350,
													justifyContent: 'center',
													marginTop: '20px',
												}}
											>

											</div>
										</Html>
										<ambientLight intensity={0.5} />
										<Stars
											data={queryResult}
											setActiveStar={handleStarClick} // Pass handleStarClick to setActiveStar
								constellating={constellating}
							/>

							<OrbitControls
								enablePan={false}
								enableRotate={false}
							/>
						</Canvas>

						{/* Dialog for StarInfoCard */}
						<ThemeProvider theme={darkTheme}>
							<Dialog
								open={dialogOpen}
								onClose={handleCloseDialog}
								maxWidth="md"

							>
								<IconButton
									aria-label="close"
									onClick={handleCloseDialog}
									style={{
										position: 'absolute',
										right: 8,
										top: 8,
										color: '#fff',
									}}
								>
									<CloseIcon />
								</IconButton>
								<DialogTitle>Star Details</DialogTitle>
								<DialogContent>
									<CssBaseline />
									{activeStar && (
										<StarInfoCard activeStar={activeStar} />
									)}
								</DialogContent>
							</Dialog>
						</ThemeProvider>

					</div>
				) : (
					<h1>Loading...</h1>
				)}
			</div>
		</div >
	);
}

export default StarView;
