/* eslint-disable react/no-unknown-property */
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router and Route components
import StarView from './components/StarView';
import PlanetView from './components/PlanetView';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/stars/:ra/:dec" element={<StarView />} />
				<Route path="/" element={<PlanetView />} />
			</Routes>
		</Router>
	);
}

export default App;
