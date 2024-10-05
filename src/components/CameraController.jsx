import { useThree, useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { Euler, Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';

function CameraController() {
	const { camera, gl } = useThree();
	const controlsRef = useRef();
	const initialPosition = new Vector3(550, 200, 0);
	const initialRotation = new Euler(
		0.15392281267247743,
		1.5514108922629914,
		-0.15389434637465207,
	);

	const initRef = useRef(false);

	useEffect(() => {
		if (controlsRef.current && !initRef.current) {
			camera.position.copy(initialPosition);
			camera.rotation.copy(initialRotation);
			controlsRef.current.update();
			console.log('Camera initialized');
			initRef.current = true;
		}
	}, [camera, initialPosition, initialRotation]);

	// Keep the rotation constant while allowing panning and zooming
	useFrame(() => {
		if (controlsRef.current) {
			const controls = controlsRef.current;

			// Check if position has changed
			if (!camera.position.equals(initialPosition)) {
				// console.log('Camera position changed:', {
				// 	x: camera.position.x,
				// 	y: camera.position.y,
				// 	z: camera.position.z,
				// });
			}

			// Keep the camera's rotation fixed
			camera.rotation.copy(initialRotation);
			controls.update();
		}
	});

	return (
		<OrbitControls
			ref={controlsRef}
			args={[camera, gl.domElement]}
			enableRotate={false} // Disabling rotation
			enablePan={true} // Allow panning
			enableZoom={true} // Allow zooming
			zoomSpeed={2}
		/>
	);
}

export default CameraController;
