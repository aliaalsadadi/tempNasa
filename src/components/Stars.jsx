import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Star } from '@mui/icons-material';

function Stars({ data, setActiveStar, constellating }) {
	const groupRef = useRef();
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	const { camera } = useThree();

	// Custom shader for the glowing effect
	const glowMaterial = useMemo(() => {
		return new THREE.ShaderMaterial({
			uniforms: {
				color: { value: new THREE.Color(0xffffff) },
				viewVector: { value: new THREE.Vector3() },
			},
			vertexShader: `
				uniform vec3 viewVector;
				varying float intensity;
				void main() {
					vec3 vNormal = normalize(normalMatrix * normal);
					vec3 vNormel = normalize(normalMatrix * viewVector);
					intensity = pow(0.7 - dot(vNormal, vNormel), 4.0);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 color;
				varying float intensity;
				void main() {
					vec3 glow = color * intensity;
					gl_FragColor = vec4(glow, 1.0);
				}
			`,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true,
		});
	}, []);

	const distanceScalingFactor = 10; // Adjust as necessary

	// Create stars
	const stars = useMemo(() => {
		if (!data || data.length === 0) return [];

		return data.map(starData => {
			const coreGeometry = new THREE.SphereGeometry(0.5, 24, 24);
			const coreMaterial = new THREE.MeshBasicMaterial({
				color: starData.hex_color,
			});
			const coreStar = new THREE.Mesh(coreGeometry, coreMaterial);

			const glowGeometry = new THREE.SphereGeometry(1, 32, 32);
			const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial.clone());
			const starGroup = new THREE.Group();

			// Convert RA/Dec to 3D position with scaling
			const raInRadians = THREE.MathUtils.degToRad(starData.ra);
			const decInRadians = THREE.MathUtils.degToRad(starData.dec);
			const distance = starData.distance; // Scale distance

			const x =
				(distance * Math.cos(decInRadians) * Math.cos(raInRadians)) /
				distanceScalingFactor;
			const y =
				distance *
				Math.cos(decInRadians) *
				Math.sin(raInRadians) *
				distanceScalingFactor;
			const z = distance * Math.sin(decInRadians) * distanceScalingFactor;

			starGroup.userData = {
				designation: starData.designation,
				id: starData.source_id,
				ra: starData.ra,
				dec: starData.dec,
				distance: starData.distance,
				parallax: starData.parallax,
				temp: starData.temp,
			};
			starGroup.position.set(x, y, z);
			starGroup.add(coreStar);
			starGroup.add(glowMesh);

			return starGroup;
		});
	}, [data, glowMaterial]);

	// Add stars to the group
	useEffect(() => {
		if (groupRef.current) {
			groupRef.current.clear();
			stars.forEach(star => {
				groupRef.current.add(star);
			});
		}
	}, [stars]);

	// Play background audio on component mount
	useEffect(() => {
		const backgroundAudio = new Audio('/src/assets/engine-humming-sfx.mp3');
		backgroundAudio.loop = true; // Set to loop if desired
		const handleClick = () => {
			backgroundAudio.play().catch(error => {
				console.error('Audio play failed:', error);
			});
		};

		// Adding an event listener for user interaction
		window.addEventListener('click', handleClick);

		return () => {
			window.removeEventListener('click', handleClick);
			backgroundAudio.pause(); // Pause audio on component unmount
		};
	}, []);

	const playClickSfx = () => {
		new Audio('/src/assets/star-click-sfx.mp3').play();
	};

	const handleClick = event => {
		// Convert mouse coordinates to normalized device coordinates (-1 to +1)
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		// Update the raycaster with the camera and mouse position
		raycaster.setFromCamera(mouse, camera);
		// Calculate objects intersecting the picking ray
		const intersects = raycaster.intersectObjects(
			groupRef.current.children,
		);

		if (intersects.length > 0) {
			const clickedStar = intersects[0].object.parent; // Access the parent group
			console.log('Clicked star ID:', clickedStar);
			setActiveStar(clickedStar?.userData);
			playClickSfx();
			// Here you can handle what happens when a star is clicked
			// For example, display more information about the star
		}
	};

	// Add event listener for clicks
	useEffect(() => {
		window.addEventListener('click', handleClick);
		return () => {
			window.removeEventListener('click', handleClick);
		};
	}, []);

	// Update view vector in animation loop
	useFrame(({ camera }) => {
		stars.forEach(starGroup => {
			const glowMesh = starGroup.children[1];
			const viewVector = new THREE.Vector3().subVectors(
				camera.position,
				starGroup.position,
			);
			glowMesh.material.uniforms.viewVector.value = viewVector;
		});
	});

	return <group ref={groupRef} />;
}

export default Stars;
