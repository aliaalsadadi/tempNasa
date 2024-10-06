import { ThemeProvider } from '@emotion/react';
import { CssBaseline, Pagination, TextField, Button } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { darkTheme } from '../constants';
import PlanetCard from './PlanetCard';
import Grid from '@mui/material/Grid';
import spaceBackground from '../assets/betterspace.jpg'; // Import your space image
import { useNavigate } from 'react-router-dom';

function MorePlanetView() {
	const navigate = useNavigate();

	const [queryResult, setQueryResult] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const apiUrl = `${import.meta.env.VITE_API_URL}/getPlanets`;
	const itemsPerPage = 6;

	const planetCardsRef = useRef(null); // Reference for scrolling

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
				planet.name.toLowerCase().includes(searchQuery.toLowerCase()),
		  )
		: [];

	const indexOfLastPlanet = currentPage * itemsPerPage;
	const indexOfFirstPlanet = indexOfLastPlanet - itemsPerPage;
	const currentPlanets = filteredPlanets.slice(
		indexOfFirstPlanet,
		indexOfLastPlanet,
	);

	const handlePageChange = (event, value) => {
		setCurrentPage(value);
	};

	const handleSearchChange = event => {
		setSearchQuery(event.target.value);
		setCurrentPage(1); // Reset to first page on search
	};

	const scrollToPlanets = () => {
		if (planetCardsRef.current) {
			planetCardsRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<div
				style={{
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					height: '100vh', // Set height to fill the viewport
					overflowY: 'auto', // Enable vertical scrolling for the whole page
					padding: '20px',
				}}
			>
				{/* Centered Image at the Top */}

				<div
					style={{
						display: 'flex',
						justifyContent: 'center', // Center horizontally
						marginBottom: '20px', // Space below the input
					}}
				>
					<TextField
						label="Search Planets"
						variant="outlined"
						value={searchQuery} // Ensure value is set correctly
						onChange={handleSearchChange} // Update state on change
						InputProps={{
							style: {
								backgroundColor: 'black',
								color: 'white',
								textAlign: 'center', // Center the text
								borderColor: 'transparent',
							},
						}}
						InputLabelProps={{
							style: {
								color: 'white', // Color for the label
							},
						}}
						style={{
							width: '300px', // Set a specific width
							borderRadius: '20px', // Make it less square
						}}
					/>
				</div>
				{/* Explore Planets Button */}

				{/* Container for the planet cards */}
				<Grid
					container
					spacing={{ xs: 2, md: 3 }}
					columns={{ xs: 4, sm: 8, md: 12 }}
					ref={planetCardsRef} // Attach the reference here
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: -30,
					}}
				>
					{currentPlanets.map(planetData => (
						<Grid item xs={2} sm={4} md={4} key={planetData.name}>
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
						color="grey"
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

export default MorePlanetView;
