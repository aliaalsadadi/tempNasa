import { useThree, useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { Euler, Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';

function CameraController({ constellating }) {
	const { camera, gl } = useThree();
	const controlsRef = useRef();
	const initialPosition = new Vector3(
		-721.88397014864,
		72.82023321025686,
		356.86871261626015,
	);
	const initialRotation = new Euler(
		-2.000452096625266,
		-1.3362104891742985,
		-2.0110641671611633,
	);

	useFrame(() => {
		if (controlsRef.current) {
			const controls = controlsRef.current;

			// Reset camera rotation to the initial values
			camera.rotation.copy(initialRotation);

			// Optional: Log camera position and rotation
			// console.log('Camera position:', camera.position);
			// console.log('Camera rotation:', camera.rotation);
		}
	});

	useEffect(() => {
		if (controlsRef.current) {
			controlsRef.current.enabled = !constellating;
		}
	}, [constellating]);

	return (
		<>
			<OrbitControls
				ref={controlsRef}
				args={[camera, gl.domElement]}
				enableRotate={false} // Disabling rotation
				enablePan={!constellating} // Allow panning only when not constellating
				enableZoom={!constellating} // Allow zooming only when not constellating
				zoomSpeed={1}
			/>
		</>
	);
}

export default CameraController;
// Camera position changed: {x: -721.88397014864, y: 72.82023321025686, z: 356.86871261626015}
// CameraController.jsx:40 Camera rotation changed: {x: -2.000452096625266, y: -1.3362104891742985, z: -2.0110641671611633}
