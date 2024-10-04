import React from 'react';
import {
	Card,
	CardContent,
	Typography,
	CardActions,
	Button,
	Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlanetSphere from './PlanetSphere'; // Import the PlanetSphere component

function PlanetCard({ data }) {
	const navigate = useNavigate();
	return (
		<Card
			variant="outlined"
			sx={{ height: 'auto', display: 'flex', flexDirection: 'column' }}
		>
			<CardContent sx={{ flexGrow: 1 }}>
				{/* Flex container for planet details and sphere */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					{/* Left side: Planet details */}
					<Box>
						<Typography variant="h5" component="div" gutterBottom>
							Planet Name: {data?.name}
						</Typography>
						<Typography variant="body2">
							Discovery Year: {data?.disc_year}
						</Typography>
						<Typography variant="body2">
							Discovery Method: {data?.discover_method}
						</Typography>
						<Typography variant="body2">
							Planet Radius (in units of radius of Earth):{' '}
							{data?.pl_rade} 🌍
						</Typography>
						<Typography variant="body2">
							Planet Mass (in units of masses of Earth):{' '}
							{data?.pl_masse} 🌍
						</Typography>
					</Box>
					{/* Right side: Planet Sphere */}
					<Box sx={{ ml: 2 }}>
						<PlanetSphere /> {/* Render the 3D sphere here */}
					</Box>
				</Box>
			</CardContent>
			<CardActions>
				<Button
					onClick={() => {
						navigate(`/stars/${data.ra}/${data.dec}`);
					}}
					size="small"
				>
					See Sky
				</Button>
			</CardActions>
		</Card>
	);
}

export default PlanetCard;
