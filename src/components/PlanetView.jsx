import { ThemeProvider } from '@emotion/react';
import { CssBaseline, Pagination, TextField, Button } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { darkTheme } from '../constants';
import PlanetCard from './PlanetCard';
import Grid from '@mui/material/Grid';
import spaceBackground from '../assets/betterspace.jpg'; // Import your space image
import { useNavigate } from 'react-router-dom';
import StarBackground from './StarBackground'; // Import the StarBackground component
function PlanetView() {
	const navigate = useNavigate();

	const [queryResult, setQueryResult] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const apiUrl = `${import.meta.env.VITE_API_URL}/getPlanets`;
	// console.log(apiUrl);
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
	const goToMorePlanets = () => {
		navigate('/more-planets'); // Navigate to the More Planets page
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<div className="w-full h-full min-h-screen absolute z-[-1]">
				<StarBackground /> {/* Render the starry background */}
			</div>
			<div id='planet-view'
				style={{
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					height: '100vh', // Set height to fill the viewport
					overflowY: 'auto', // Enable vertical scrolling for the whole page
					padding: '20px',
					zIndex: 9999, // Ensure the content is above the background
				}}
			>
				{/* Centered Image at the Top */}
				<div
					style={{
						margin: '0 auto',
						maxWidth: '1000px', // Maximum width for larger screens
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						padding: '20px',
						zIndex: 2
					}}
				>
					<img
						src="Skylify.png" // Replace with your image URL
						alt="Hero"
						style={{
							width: '100%',
							height: 'auto',
							objectFit: 'cover',
						}}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginBottom: '20px',
					}}
				>
					<Button
						variant="outlined"
						style={{
							color: 'white', // Text color
							backgroundColor: 'black', // Button background color
							border: '2px solid lightgray', // Light white border
							borderRadius: '20px',
							'&:hover': {
								backgroundColor: 'grey', // Maintain background on hover
								border: '2px solid white', // Change border color on hover
							},
						}}
						onClick={scrollToPlanets}
					>
						Explore Planets
					</Button>
				</div>
				{/* Description Paragraph */}
				<div
					style={{
						color: 'white',
						marginBottom: '20px',
						fontSize: '18px',
						maxWidth: '100%',
						margin: '0 100px',
						textAlign: 'center',
						padding: '10px 20px',
					}}
				>
					At Skylify, embark on a journey through the cosmos and
					explore the mysteries of exoplanets. Our platform provides
					insights into distant worlds, revealing their unique
					characteristics and potential for hosting life. Experience
					the beauty of the universe as you gaze at the stars from the
					surface of selected planets. As passionate university
					students, we aim to ignite your curiosity and deepen your
					understanding of the cosmos. Join us in exploring the
					wonders of space and the infinite possibilities beyond our
					planet.{' '}
				</div>
				<br />
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						marginBottom: '20px',
					}}
				>
					<TextField
						label="Search Planets"
						variant="outlined"
						value={searchQuery}
						onChange={handleSearchChange}
						InputProps={{
							style: {
								backgroundColor: 'black',
								color: 'white',
								textAlign: 'center',
								borderColor: 'transparent',
								borderRadius: '25px', // Increased border radius
							},
						}}
						InputLabelProps={{
							style: {
								color: 'white',
							},
						}}
						sx={{
							width: '300px',
							'& .MuiOutlinedInput-root': {
								borderRadius: '25px', // Ensure the outline is also rounded
								'& fieldset': {
									borderColor: 'rgba(255, 255, 255, 0.23)', // Light border color
								},
								'&:hover fieldset': {
									borderColor: 'rgba(255, 255, 255, 0.5)', // Lighter border on hover
								},
								'&.Mui-focused fieldset': {
									borderColor: 'white', // White border when focused
								},
							},
							marginRight: '10px',
						}}
					/>
					<Button
						variant="contained"
						style={{
							color: 'white',
							backgroundColor: 'black',
							borderRadius: '20px',
							border: '2px solid white',
							'&:hover': {
								backgroundColor: 'grey',
							},
						}}
						onClick={goToMorePlanets}
					>
						More Planets
					</Button>
				</div>
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

export default PlanetView;
