import {
	faGlobeAfrica,
	faGlobeAmericas,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Card,
	CardContent,
	Typography,
	CardActions,
	Button,
	Box,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function PlanetCard({ data }) {
	const navigate = useNavigate();
	return (
		<Card
			variant="outlined"
			sx={{ height: 'auto', display: 'flex', flexDirection: 'column' }}
		>
			<CardContent sx={{ flexGrow: 1 }}>
				<Typography variant="h5" component="div" gutterBottom>
					Planet Name: {data?.name}
				</Typography>
				<Box sx={{ mt: 2 }}>
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
						Planet Mass (in units of massess of Earth):{' '}
						{data?.pl_masse} 🌍
					</Typography>
					<Typography variant="body2">
						Planet Radius (in units of radius of Jupiter):{' '}
						{data?.pl_radj} 🪐
					</Typography>
					<Typography variant="body2">
						Planet Mass (in units of massess of Jupiter):{' '}
						{data?.pl_massj} 🪐
					</Typography>
					{/* Add more planet details here */}
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
