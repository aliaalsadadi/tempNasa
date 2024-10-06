import { useTexture } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import textureJPG from '../../public/high-mass.jpg';

function PlanetSphere({
	radius = 1,
	color = 0xaa8844,
	path = 'low-mass.jpg',
	width = 150,
	height = 150,
	orbitalPeriod,
}) {
	const canvasRef = useRef(null);
	const colormap = useLoader(THREE.TextureLoader, textureJPG);

	useEffect(() => {
		// Set up the scene, camera, and renderer
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas: canvasRef.current,
		});
		renderer.setSize(width, height);

		// Create a sphere geometry
		const geometry = new THREE.IcosahedronGeometry(radius, 8);
		const material = new THREE.MeshStandardMaterial({
			map: colormap,
			color: color,
			flatShading: true,
		});
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);

		// Add lighting
		const ambientLight = new THREE.AmbientLight(0x404040);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(5, 5, 5);
		scene.add(directionalLight);

		// Position the camera
		camera.position.z = 3;

		// Calculate rotation speed based on orbital period
		const baseRotationSpeed = 0.001;
		const earthOrbitalPeriod = 365.25; // Earth's orbital period in days
		const rotationSpeed =
			baseRotationSpeed * (earthOrbitalPeriod / orbitalPeriod);

		// Animation loop
		const animate = function () {
			requestAnimationFrame(animate);
			sphere.rotation.y += 0.01;
			sphere.rotation.x += 0.01;
			renderer.render(scene, camera);
		};

		animate();

		// Clean up on unmount
		return () => {
			renderer.dispose();
		};
	}, [width, height, radius, color, colormap, orbitalPeriod]);

	return (
		<canvas
			ref={canvasRef}
			style={{ display: 'block', zIndex: 998 }}
		></canvas>
	);
}

export default PlanetSphere;
