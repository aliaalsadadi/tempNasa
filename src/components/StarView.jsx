/* eslint-disable react/no-unknown-property */
import {
	Button,
	ButtonGroup,
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
import StarInfoCard from './StarInfoCard';

function StarView() {
	const [activeStar, setActiveStar] = useState(null);
	const [constellating, setConstellating] = useState(false);
	const [queryResult, setQueryResult] = useState(null);
	const [error, setError] = useState(null);
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

	return (
		<div>
			{error && <p>Error: {error}</p>}

			{/* Canvas Container */}
			<div className="canvas-container">
				{queryResult ? (
					<>
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
									<ThemeProvider theme={darkTheme}>
										<ButtonGroup
											size="large"
											aria-label="Large button group"
											variant="contained"
											color="secondary"
										>
											{buttons}
										</ButtonGroup>
									</ThemeProvider>
								</div>
							</Html>
							<ambientLight intensity={0.5} />
							<Stars
								data={queryResult}
								setActiveStar={setActiveStar}
								constellating={constellating}
							/>

							<OrbitControls
								enablePan={false}
								enableRotate={false}
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
									<StarInfoCard
										activeStar={activeStar}
									></StarInfoCard>
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
