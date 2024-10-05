import { useTexture } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import textureJPG from '../../public/low-mass.jpg';

function PlanetSphere({ radius = 1, color = 0xAA8844, path ="low-mass.jpg", width = 150, height = 150 }) {

const canvasRef = useRef(null);
const colormap = useLoader(THREE.TextureLoader, path);
	useEffect(() => {
		// Set up the scene, camera, and renderer
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas: canvasRef.current,
		});
		renderer.setSize(width, height); // Set a larger canvas size

		// Create a sphere geometry
		
		const geometry = new THREE.IcosahedronGeometry(radius, 8); // Radius 1, 32 segments
		const material = new THREE.MeshStandardMaterial({ 
			map : colormap , color : color, flatShading: true });
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);

		// Add lighting
		const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
		directionalLight.position.set(5, 5, 5); // Position the light
		scene.add(directionalLight);

		// Position the camera
		camera.position.z = 3;

		// Animation loop
		const animate = function () {
			requestAnimationFrame(animate);
			sphere.rotation.x += 0.01; // Optional: Rotate the sphere
			sphere.rotation.y += 0.01; // Optional: Rotate the sphere
			renderer.render(scene, camera);
		};

		animate();

		// Clean up on unmount
		return () => {
			renderer.dispose();
		};
	}, []);

	return <canvas  ref={canvasRef} style={{ display: 'block', zIndex:998 }}></canvas>;
}

export default PlanetSphere;