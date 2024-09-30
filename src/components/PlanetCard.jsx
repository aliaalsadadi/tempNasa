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
						RA: {data?.ra || 'N/A'}
					</Typography>
					<Typography variant="body2">
						Dec: {data?.dec || 'N/A'}
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
