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
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import { Grid, Html } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Stars from './Stars';
import { darkTheme } from '../constants';
import StarInfoCard from './StarInfoCard';
import CloseIcon from '@mui/icons-material/Close';
import { Euler, GridHelper, PlaneGeometry } from 'three';
import CameraController from './CameraController';
import loading from '../assets/loading.gif';
import { color } from 'three/webgpu';

function StarView() {
	const screenRef = useRef(null);
	const canvasRef = useRef(null); // Ref for Canvas
	const getImage = async () => {
		// Capture the screenshot of the WebGL canvas
		const canvas = document.querySelector('canvas');
		console.log(canvas);
		console.log('Screenshot with stars:', canvas.toDataURL('image/png')); // Log the screenshot

		// Return the image
		return canvas.toDataURL('image/png');
	};
	const [activeStar, setActiveStar] = useState(null);
	const [constellating, setConstellating] = useState(false);
	const [queryResult, setQueryResult] = useState(null);
	const [error, setError] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
	const [gridFlag, setgridFlag] = useState(false);
	const childRef = useRef(null);
	const buttons = [
		<Button
			key="one"
			disabled={!constellating}
			onClick={() => {
				// Clear the lines state
				childRef.current.deleteLines();
				setConstellating(false);
			}}
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
		<Button
			key="three"
			disabled={!constellating}
			onClick={async () => {
				const img = canvasRef.current.toDataURL('image/png'); // Capture the image
				const link = document.createElement('a');
				link.href = img;
				link.download = 'stars.png'; // Set the download filename
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setConstellating(false);
			}}
		>
			Download
		</Button>,
	];

	const { ra, dec } = useParams(); // Get ra and dec from URL params
	// Adjust the GridHelper size dynamically
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
	const handleStarClick = star => {
		if (!constellating) {
			// Only allow clicks when not constellating
			setActiveStar(star);
			setDialogOpen(true); // Open dialog when a star is clicked
		}
	};

	const handleCloseDialog = () => {
		setDialogOpen(false); // Close dialog when needed
	};
	return (
		<div>
			{error && <p>Error: {error}</p>}
			<div ref={screenRef} className="canvas-container">
				{queryResult ? (
					<div style={{ position: 'relative' }}>
						<div
							style={{
								background: 'white',
								borderRadius: '5px',
								position: 'absolute',
								top: 5,
								left: '50%',
								transform: 'translateX(-50%)',
								zIndex: 999,
							}}
						>
							<ButtonGroup
								size="large"
								aria-label="Large button group"
								variant="contained"
								color="secondary"
							>
								{buttons}
								<FormControlLabel
									control={
										<Checkbox
											checked={gridFlag} // Boolean flag controlling checked state
											onChange={(event, checked) =>
												setgridFlag(checked)
											} // Handle checkbox toggle
											color="primary"
										/>
									}
									label="Equatorial Grid" // Label for the checkbox
								/>
							</ButtonGroup>
						</div>
						<Canvas
							ref={canvasRef}
							style={{
								background: 'black',
								height: '100vh',
								width: '100vw',
							}}
							gl={{ preserveDrawingBuffer: true }}
							camera={{
								position: [
									-721.88397014864, 72.82023321025686,
									356.86871261626015,
								],
								rotation: [
									-2.000452096625266, -1.3362104891742985,
									-2.0110641671611633,
								],
							}}
							orthographic={true}
						>
							<CameraController constellating={constellating} />
							<ambientLight intensity={0.5} />
							{gridFlag && (
								<gridHelper
									position={[0, 0, 0]}
									rotation={[
										Math.PI + 1,
										Math.PI / 4,
										Math.PI / 2,
									]}
									args={[5000, 100]}
								/>
							)}
							<Stars
								data={queryResult}
								setActiveStar={handleStarClick} // Update function here
								constellating={constellating}
								ref={childRef}
							/>
						</Canvas>

						{/* Conditionally render Dialog for StarInfoCard only when not constellating */}
						{!constellating && (
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
											<StarInfoCard
												activeStar={activeStar}
											/>
										)}
									</DialogContent>
								</Dialog>
							</ThemeProvider>
						)}
					</div>
				) : (
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
						<img src={loading} alt="Loading..." />
					</div>
				)}
			</div>
		</div>
	);
}

export default StarView;
