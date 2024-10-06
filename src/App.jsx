/* eslint-disable react/no-unknown-property */
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router and Route components
import StarView from './components/StarView';
import PlanetView from './components/PlanetView';
import ExoplanetInfoPage from './components/ExoplanetInfoPage';
import MorePlanetView from './components/MorePlanets';
import AnimatedCursor from 'react-animated-cursor';
import ChatBot from './components/Chatbot';
import { useEffect } from 'react';

function App() {
	const playClickSfx = () => {
		new Audio('/src/assets/star-click-sfx.mp3').play();
	};

	useEffect(() => {
		const backgroundAudio = new Audio('/src/assets/engine-humming-sfx.mp3');
		backgroundAudio.loop = true;

		const playBackgroundAudio = () => {
			backgroundAudio.play().catch(error => {
				console.error('Audio play failed:', error);
			});
			// Remove the event listener after first interaction
			document.removeEventListener('mousemove', playBackgroundAudio);
		};

		// Add event listener for user interaction via mouse move for background sound
		document.addEventListener('mousemove', playBackgroundAudio);

		// Add event listener for click sound effect
		document.addEventListener('click', playClickSfx);

		return () => {
			backgroundAudio.pause();
			document.removeEventListener('mousemove', playBackgroundAudio);
			document.removeEventListener('click', playClickSfx);
		};
	}, []);

	return (
		<div className="App">
			{/* <AnimatedCursor></AnimatedCursor> */}
			<Router>
				<Routes>
					<Route path="/stars/:ra/:dec" element={<StarView />} />
					<Route
						path="/exoplanet/:planetName/"
						element={<ExoplanetInfoPage />}
					/>
					<Route path="/" element={<PlanetView />} />
					<Route path="/more-planets" element={<MorePlanetView />} />
				</Routes>
			</Router>
			<ChatBot></ChatBot>
		</div>
	);
}

export default App;
