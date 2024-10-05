import { ThemeProvider } from '@emotion/react';
import { CssBaseline, Pagination, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { darkTheme } from '../constants';
import PlanetCard from './PlanetCard';
import Grid from '@mui/material/Grid';
import spaceBackground from '../assets/betterspace.jpg'; // Import your space image
import { useTexture } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';

function PlanetView() {
	const [queryResult, setQueryResult] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const apiUrl = `${import.meta.env.VITE_API_URL}/getPlanets`;
	const itemsPerPage = 6;
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(apiUrl, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				});
				const data = await response.json();
				setQueryResult(data);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	const filteredPlanets = queryResult
		? queryResult.filter(planet =>
			planet.name.toLowerCase().includes(searchQuery.toLowerCase())
		)
		: [];

	const indexOfLastPlanet = currentPage * itemsPerPage;
	const indexOfFirstPlanet = indexOfLastPlanet - itemsPerPage;
	const currentPlanets = filteredPlanets.slice(indexOfFirstPlanet, indexOfLastPlanet);

	const handlePageChange = (event, value) => {
		setCurrentPage(value);
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
		setCurrentPage(1); // Reset to first page on search
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<div
				style={{
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					minHeight: '100vh',
					padding: '20px',
					backgroundImage: `url(${spaceBackground})`, // Adding the background image
					overflowY: 'auto', // Enable vertical scrolling
					maxHeight: '80vh', // Limit height of the scrollable area
				}}
			>
				{/* Search Bar */}
				<TextField
					label="Search Planets"
					variant="outlined"
					fullWidth
					value={searchQuery}
					onChange={handleSearchChange}
					InputProps={{
						style: { backgroundColor: 'black', color: 'white' }, // Set background and text color
					}}
					style={{ marginBottom: '20px' }} // Adjust margin if needed
				/>

				<Grid
					container
					spacing={{ xs: 2, md: 3 }}
					columns={{ xs: 4, sm: 8, md: 12 }}
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: 20,
					}}
				>
					{currentPlanets.map(planetData => (
						<Grid
							item
							xs={2}
							sm={4}
							md={4}
							key={planetData.name}
						>
							<PlanetCard data={planetData} />
						</Grid>
					))}
				</Grid>

				{/* Add pagination controls */}
				{filteredPlanets.length > 0 && (
					<Pagination
						count={Math.ceil(filteredPlanets.length / itemsPerPage)}
						page={currentPage}
						onChange={handlePageChange}
						color="primary"
						style={{
							marginTop: '20px',
							display: 'flex',
							justifyContent: 'center',
						}}
					/>
				)}
			</div>
		</ThemeProvider>
	);
}

export default PlanetView;