import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';

function StarInfoCard({ activeStar }) {
	return (
		<Card
			sx={{
				minWidth: 250,
				maxWidth: 275,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
			}}
			variant="outlined"
		>
			<CardContent>
				<Typography variant="h5" component="div" gutterBottom>
					Star Information
				</Typography>
				<Typography
					color="text.secondary"
					variant="body2"
					sx={{
						textAlign: 'center',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					Designation: {activeStar?.designation}
					<br />
					Source id: {activeStar?.id}
					<br />
					Parallax: {activeStar?.parallax}
					<br />
					Right ascension: {activeStar?.ra}
					<br />
					Declination: {activeStar?.dec}
					<br />
					Temperature: {activeStar?.temp} &deg;K
				</Typography>
			</CardContent>
		</Card>
	);
}

export default StarInfoCard;
