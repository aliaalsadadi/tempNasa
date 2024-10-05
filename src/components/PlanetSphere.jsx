import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function PlanetSphere({ radius = 1, color = 0xAA8844 }) {
	const canvasRef = useRef(null);

	useEffect(() => {
		// Set up the scene, camera, and renderer
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 1000); // Aspect ratio set to 1 for square canvas
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas: canvasRef.current,
		});
		renderer.setSize(150, 150); // Set canvas size

		// Create a sphere geometry
		const geometry = new THREE.SphereGeometry(radius, 32, 32); // Radius 1, 32 segments
		const material = new THREE.MeshBasicMaterial({ color: color }); // Light blue color
		const sphere = new THREE.Mesh(geometry, material);

		scene.add(sphere);

		// Position the camera
		camera.position.z = 3;

		// Animation loop
		const animate = function () {
			requestAnimationFrame(animate);

			// Rotate the sphere for some basic animation
			sphere.rotation.x += 0.01;
			sphere.rotation.y += 0.01;

			renderer.render(scene, camera);
		};

		animate();

		// Clean up on unmount
		return () => {
			renderer.dispose();
		};
	}, []);

	return <canvas ref={canvasRef}></canvas>;
}

export default PlanetSphere;
