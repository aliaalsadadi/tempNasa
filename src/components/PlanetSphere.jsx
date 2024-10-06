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
		renderer.shadowMap.enabled = true; // Enable shadow mapping

		// Create a sphere geometry
		const geometry = new THREE.IcosahedronGeometry(radius, 8);
		const material = new THREE.MeshStandardMaterial({
			map: colormap,
			color: color,
			flatShading: true,
		});
		const sphere = new THREE.Mesh(geometry, material);
		sphere.castShadow = true; // Sphere casts shadow
		scene.add(sphere);

		// Create a ground plane to receive the shadow
		const planeGeometry = new THREE.PlaneGeometry(50, 50);
		const planeMaterial = new THREE.ShadowMaterial({
			opacity: 0.5, // Semi-transparent shadow
		});
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.rotation.x = -Math.PI / 2; // Rotate plane to lie flat
		plane.position.y = -radius - 0.5; // Position plane below the sphere
		plane.receiveShadow = true; // Plane receives shadows
		scene.add(plane);

		// Add lighting
		const ambientLight = new THREE.AmbientLight(0x404040);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(5, 5, 5);
		directionalLight.castShadow = true; // Light casts shadows
		scene.add(directionalLight);

		// Shadow properties for the light
		directionalLight.shadow.mapSize.width = 1024; // Shadow quality
		directionalLight.shadow.mapSize.height = 1024;
		directionalLight.shadow.camera.near = 0.5;
		directionalLight.shadow.camera.far = 50;

		// Position the camera
		camera.position.z = 3;

		// Animation loop
		const animate = function () {
			requestAnimationFrame(animate);
			sphere.rotation.x += 0.01;
			sphere.rotation.y += 0.01;
			renderer.render(scene, camera);
		};

		animate();

		// Clean up on unmount
		return () => {
			renderer.dispose();
		};
	}, [colormap, radius, color, width, height]);

	return (
		<canvas
			ref={canvasRef}
			style={{ display: 'block', zIndex: 998 }}
		></canvas>
	);
}

export default PlanetSphere;
