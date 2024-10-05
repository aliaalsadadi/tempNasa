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
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

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
						<PlanetSphere
							radius={data?.pl_rade / 21}
							color={temperatureToColor(data?.pl_eqt)}
							path={getFilePath(categorizeStar(data?.pl_rade, data?.pl_eqt, data?.pl_masse))}
						/>					</Box>
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
					Visit the Sky
				</Button>
				<Button
					onClick={() => navigate(`/exoplanet/${data.name}`)}
					size="small"
					sx={{
						bgcolor: 'transparent',
						color: 'white',
						border: '1px solid white',
						'&:hover': {
							bgcolor: 'rgba(0, 0, 0, 0.1)', // Adjust hover background as needed
						},
					}}
				>
					Show details
				</Button>
			</CardActions>
		</Card>
	);
}


function categorizeStar(radius, temperature, mass) {
	const categories = {
		radius: '',
		mass: ''
	};

	// Categorize radius
	if (radius < 5) {
		categories.radius = 'low';
	} else if (radius <= 10) {
		categories.radius = 'medium';
	} else {
		categories.radius = 'high';
	}

	// Categorize mass
	if (mass < 100) {
		categories.mass = 'low';
	} else if (mass <= 500) {
		categories.mass = 'medium';
	} else {
		categories.mass = 'high';
	}

	return categories;
}

function getFilePath(categories) {
	let { radius, mass } = categories;
	if (radius == "high") {
		mass = "high";
	}

	// Construct the file path based on categories
	let filePath = 'texture';

	// Append radius category
	filePath += `/${radius}-radius`;

	// Append temperature category

	// Append mass category
	filePath += `/${mass}-mass`;
	// Return the complete file path
	return filePath + '.jpg'; // Assuming the files are PNG images
}


function temperatureToColor(temperatureKelvin) {
	// Define temperature thresholds
	const coldThreshold = 150;   // Lower threshold for cold (blue)
	const hotThreshold = 600;    // Upper threshold for hot (red)

	// Clamp the temperature to avoid extreme values
	const clampedTemp = Math.max(coldThreshold, Math.min(temperatureKelvin, hotThreshold));

	// Map temperature to color values
	const normalizedTemp = (clampedTemp - coldThreshold) / (hotThreshold - coldThreshold);

	// Calculate RGB values with more emphasis on different ranges
	let r, g, b;

	if (normalizedTemp < 0.33) {
		// Transition from blue to green
		r = Math.floor(255 * (normalizedTemp * 3)); // Red increases from 0 to 255
		g = 0; // Green starts from 0
		b = 255; // Blue stays at 255
	} else if (normalizedTemp < 0.66) {
		// Transition from green to yellow
		r = 255; // Red is fully on
		g = Math.floor(255 * ((normalizedTemp - 0.33) * 3)); // Green increases from 0 to 255
		b = 0; // Blue decreases to 0
	} else {
		// Transition from yellow to red
		r = 255; // Red stays fully on
		g = Math.floor(255 * (1 - ((normalizedTemp - 0.66) * 3))); // Green decreases to 0
		b = 0; // Blue stays at 0
	}

	// Convert RGB to hexadecimal
	return (r << 16) | (g << 8) | b; // Combine RGB into a single number
}

export default PlanetCard;