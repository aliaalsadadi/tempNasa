/* eslint-disable react/no-unknown-property */
import {
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
	const [queryResult, setQueryResult] = useState(null);
	const [error, setError] = useState(null);

	const { ra, dec } = useParams(); // Get ra and dec from URL params

	useEffect(() => {
		const fetchData = async () => {
			fetch('http://127.0.0.1:8000/getStars', {
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
						<OrbitControls />
						<Html
							as="div"
							style={{
								position: 'relative',
								top: -350, // Adjust top position
								right: 500, // Adjust left position
								padding: 10,
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
										position: 'absolute',
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
											Right ascension: {activeStar?.ra}
											<br />
											Declination: {activeStar?.dec}
											<br />
											Temperature: {activeStar?.temp}{' '}
											&deg;K
										</Typography>
									</CardContent>
								</Card>
							</ThemeProvider>
						</Html>
					</Canvas>
				) : (
					<h1>Loading...</h1>
				)}
			</div>
		</div>
	);
}

export default StarView;
