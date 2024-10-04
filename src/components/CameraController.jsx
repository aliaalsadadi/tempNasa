import { useThree, useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { Euler, Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';

function CameraController() {
	const { camera, gl } = useThree();
	const controlsRef = useRef();
	const lastPosition = useRef(new Vector3(550, 200, 0));
	const lastRotation = useRef(
		new Euler(
			0.15392281267247743,
			1.5514108922629914,
			-0.15389434637465207,
		),
	);
	useFrame(() => {
		if (controlsRef.current) {
			const controls = controlsRef.current;

			// Check if position has changed
			if (!camera.position.equals(lastPosition.current)) {
				console.log('Camera position changed:', {
					x: camera.position.x,
					y: camera.position.y,
					z: camera.position.z,
				});
				lastPosition.current.copy(camera.position);
			}

			// Check if rotation has changed
			if (!camera.rotation.equals(lastRotation.current)) {
				console.log('Camera rotation changed:', {
					x: camera.rotation.x,
					y: camera.rotation.y,
					z: camera.rotation.z,
				});
				lastRotation.current.copy(camera.rotation);
			}

			controls.update();
		}
	});

	return (
		<OrbitControls
			ref={controlsRef}
			enableRotate={false}
			enablePan={true}
			enableZoom={true}
			zoomSpeed={1}
		/>
	);
}

export default CameraController;
