/* eslint-disable react/no-unknown-property */
import {
	Button,
	Card,
	CardContent,
	CssBaseline,
	ThemeProvider,
	Typography,
} from '@mui/material';
import { OrbitControls, Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Stars from './Stars';
import { darkTheme } from '../constants';
function StarView() {
	const [activeStar, setActiveStar] = useState(null);
	const [constellating, setConstellating] = useState(false);
	const [queryResult, setQueryResult] = useState(null);
	const [error, setError] = useState(null);

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

	return (
		<div>
			{error && <p>Error: {error}</p>}

			{/* Canvas Container */}
			<div className="canvas-container">
				{queryResult ? (
					<>
						<Button onClick={() => console.log('test')}>
							Constellates
						</Button>
						<Canvas
							camera={{ position: [0, 0, 5] }}
							style={{
								background: 'black',
								height: '100vh',
								width: '100vw',
							}}
						>
							<ambientLight intensity={0.5} />
							<Stars
								data={queryResult}
								setActiveStar={setActiveStar}
							/>

							<OrbitControls
								enablePan={!constellating}
								enableRotate={!constellating}
							/>
							<Html
								as="div"
								style={{
									position: 'absolute',
									top: -300,
									right: 450,
								}}
							>
								<ThemeProvider theme={darkTheme}>
									<CssBaseline />
									<Card
										sx={{
											minWidth: 275,
											maxWidth: 275,
											maxHeight: 275,
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											textAlign: 'center',
										}}
										variant="outlined"
									>
										<CardContent>
											<Typography
												variant="h5"
												component="div"
												gutterBottom
											>
												Star Information
											</Typography>
											<Typography
												color="text.secondary"
												variant="body2"
												sx={{
													textAlign: 'center',
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												Designation:{' '}
												{activeStar?.designation}
												<br />
												Source id: {activeStar?.id}
												<br />
												Parallax: {activeStar?.parallax}
												<br />
												Right ascension:{' '}
												{activeStar?.ra}
												<br />
												Declination: {activeStar?.dec}
												<br />
												Temperature: {
													activeStar?.temp
												}{' '}
												&deg;K
											</Typography>
										</CardContent>
									</Card>
								</ThemeProvider>
							</Html>
						</Canvas>
					</>
				) : (
					<h1>Loading...</h1>
				)}
			</div>
		</div>
	);
}

export default StarView;
