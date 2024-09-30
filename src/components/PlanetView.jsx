import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import { darkTheme } from '../constants';

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
		</ThemeProvider>
	);
}

export default PlanetView;
