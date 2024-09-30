import { ThemeProvider } from '@emotion/react';
import { CssBaseline, Box, Paper, Grid2 } from '@mui/material';
import { useEffect, useState } from 'react';
import { darkTheme } from '../constants';
import PlanetCard from './PlanetCard';
import Grid from '@mui/material/Grid2';

function PlanetView() {
	const [queryResult, setQueryResult] = useState(null);
	const apiUrl = 'http://127.0.0.1:8000/getPlanets';

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
	console.log(queryResult);
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Grid
				container
				spacing={{ xs: 2, md: 3 }}
				columns={{ xs: 4, sm: 8, md: 12 }}
			>
				{queryResult &&
					queryResult.map((planetData, index) => (
						<Grid
							size={{ xs: 2, sm: 4, md: 4 }}
							key={planetData.name}
						>
							<PlanetCard data={planetData} />
						</Grid>
					))}
			</Grid>
		</ThemeProvider>
	);
}

export default PlanetView;
