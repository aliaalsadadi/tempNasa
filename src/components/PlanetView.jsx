import { ThemeProvider } from '@emotion/react';
import { CssBaseline, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { darkTheme } from '../constants';
import PlanetCard from './PlanetCard';
import Grid from '@mui/material/Grid2';

function PlanetView() {
	const [queryResult, setQueryResult] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const apiUrl = 'http://127.0.0.1:8000/getPlanets';
	const itemsPerPage = 5;

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

	// Calculate the current planets to display based on the current page
	const indexOfLastPlanet = currentPage * itemsPerPage;
	const indexOfFirstPlanet = indexOfLastPlanet - itemsPerPage;
	const currentPlanets = queryResult
		? queryResult.slice(indexOfFirstPlanet, indexOfLastPlanet)
		: [];

	const handlePageChange = (event, value) => {
		setCurrentPage(value);
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<div
				style={{
					height: '500px', // Set the height of the scrollable container
					overflowY: 'auto', // Enable vertical scrolling
				}}
			>
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
						<Grid item xs={2} sm={4} md={4} key={planetData.name}>
							<PlanetCard data={planetData} />
						</Grid>
					))}
				</Grid>
			</div>
			{/* Add pagination controls */}
			{queryResult && (
				<Pagination
					count={Math.ceil(queryResult.length / itemsPerPage)}
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
		</ThemeProvider>
	);
}

export default PlanetView;
