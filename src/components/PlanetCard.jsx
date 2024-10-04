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
import { Star } from '@mui/icons-material'; // Example icon import

function PlanetCard({ data }) {
	const navigate = useNavigate();

	return (
		<Card
			variant="outlined"
			sx={{
				width: 480, // Fixed width
				height: 240, // Fixed height
				display: 'flex',
				flexDirection: 'column',
				bgcolor: '#1d1f21',
				color: '#ffffff',
				boxShadow: 3,
				borderRadius: 2,
				p: 2,
				m: 1,
				transition: '0.3s',
				'&:hover': {
					boxShadow: 6,
				},
			}}
		>
			<CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: '1fr 150px', // Fixed column for sphere
						gap: 2,
						alignItems: 'center',
					}}
				>
					{/* Left side: Planet details */}
					<Box>
						<Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
							{data?.name}
						</Typography>

						{/* Discovery Year */}
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
							<Star fontSize="small" />
							<Typography variant="body2" color="text.secondary" sx={{ ml: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
								Discovery Year: {data?.disc_year}
							</Typography>
						</Box>

						{/* Discovery Method */}
						<Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
							Discovery Method: {data?.discover_method}
						</Typography>

						{/* Planet Radius */}
						<Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
							Radius: {data?.pl_rade} 🌍
						</Typography>

						{/* Planet Mass */}
						<Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
							Mass: {data?.pl_masse} 🌍
						</Typography>
					</Box>

					{/* Right side: Planet Sphere */}
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<PlanetSphere /> {/* Render the 3D sphere here */}
					</Box>
				</Box>
			</CardContent>
			<CardActions>
				<Button
					onClick={() => navigate(`/stars/${data.ra}/${data.dec}`)}
					size="small"
					sx={{
						bgcolor: '#007bff',
						color: 'white',
						'&:hover': {
							bgcolor: '#0056b3',
						},
					}}
				>
					See Sky
				</Button>
			</CardActions>
		</Card>
	);
}

export default PlanetCard;