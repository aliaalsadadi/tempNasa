import {
	useEffect,
	useRef,
	useMemo,
	useState,
	forwardRef,
	useImperativeHandle,
} from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Star } from '@mui/icons-material';
import React from 'react';

const Stars = forwardRef(({ data, setActiveStar, constellating }, ref) => {
	const groupRef = useRef();
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	const [lines, setLines] = useState([]);

	const { camera, scene } = useThree();
	useImperativeHandle(ref, () => ({
		deleteLines,
	}));

	// State to track the stars clicked for constellating
	const [selectedStars, setSelectedStars] = useState([]);

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

	const distanceScalingFactor = 5; // Adjust as necessary

	// Create stars
	const stars = useMemo(() => {
		if (!data || data.length === 0) return [];

		return data.map(starData => {
			const coreGeometry = new THREE.SphereGeometry(1, 24, 24);
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

			// Store star information for use in starInfo card
			starGroup.userData = {
				designation: starData.designation,
				id: starData.source_id,
				ra: starData.ra,
				dec: starData.dec,
				distance: starData.distance,
				parallax: starData.parallax,
				temp: starData.temp,
				position: new THREE.Vector3(x, y, z), // Add position for later use
			};
			starGroup.position.set(x, y, z);
			starGroup.add(coreStar);
			starGroup.add(glowMesh);

			return starGroup;
		});
	}, [data, glowMaterial]);

	// Add stars to the group
	useEffect(() => {
		if (groupRef?.current) {
			groupRef.current?.clear();
			stars.forEach(star => {
				groupRef?.current?.add(star);
			});
		}
	}, [stars]);

	// Play background audio on component mount
	// useEffect(() => {
	// 	const backgroundAudio = new Audio('/src/assets/engine-humming-sfx.mp3');
	// 	backgroundAudio.loop = true;

	// 	const playAudio = () => {
	// 		backgroundAudio.play().catch(error => {
	// 			console.error('Audio play failed:', error);
	// 		});
	// 		// Remove the event listener after first interaction
	// 		document.removeEventListener('click', playAudio);
	// 	};

	// 	// Add event listener for user interaction
	// 	document.addEventListener('click', playAudio);

	// 	return () => {
	// 		backgroundAudio.pause();
	// 		document.removeEventListener('click', playAudio);
	// 	};
	// }, []);

	// useEffect(() => {
	// 	if (!groupRef.current || stars.length === 0) return;

	// 	let centerX = 0;
	// 	let centerY = 0;
	// 	let centerZ = 0;

	// 	stars.forEach(star => {
	// 		centerX += star.position.x;
	// 		centerY += star.position.y;
	// 		centerZ += star.position.z;
	// 	});

	// 	const starCount = stars.length;
	// 	centerX /= starCount;
	// 	centerY /= starCount;
	// 	centerZ /= starCount;

	// 	// Update camera position based on stars' center
	// 	camera.lookAt(centerX, centerY, centerZ);
	// 	// Update camera rotation if needed
	// }, []);

	// const playClickSfx = () => {
	// 	new Audio('/src/assets/star-click-sfx.mp3').play();
	// };
	const deleteLines = () => {
		lines.forEach(line => {
			scene.remove(line);
		});
		setLines([]);
	};
	const drawLineBetweenStars = (star1, star2) => {
		const geometry = new THREE.BufferGeometry().setFromPoints([
			star1.position,
			star2.position,
		]);
		const material = new THREE.LineBasicMaterial({ color: 0xffffff });
		const line = new THREE.Line(geometry, material);

		// Add the line to the scene
		scene.add(line);

		// Store the line for later deletion
		setLines(prevLines => [...prevLines, line]);
	};

	const handleClick = event => {
		// Convert mouse coordinates to normalized device coordinates (-1 to +1)
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		// Update the raycaster with the camera and mouse position
		raycaster.setFromCamera(mouse, camera);
		// Calculate objects intersecting the picking ray
		const intersects = raycaster.intersectObjects(
			groupRef?.current?.children,
		);

		if (intersects.length > 0) {
			const clickedStar = intersects[0].object.parent; // Access the parent group
			const starData = clickedStar.userData;

			if (!constellating) {
				// If not constellating, show star information
				setActiveStar(starData);
			} else {
				// If constellating, track the clicked stars and draw a line
				setSelectedStars(prevStars => {
					if (prevStars.length === 0) {
						// First star clicked
						return [clickedStar];
					} else if (prevStars.length === 1) {
						// Second star clicked, draw a line
						const secondStar = clickedStar;
						drawLineBetweenStars(prevStars[0], secondStar);

						// Reset the selected stars
						return [];
					}
					return prevStars;
				});
			}
		}
	};

	// Add event listener for clicks
	useEffect(() => {
		window.addEventListener('click', handleClick);
		return () => {
			window.removeEventListener('click', handleClick);
		};
	}, [constellating]);

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
});
Stars.displayName = 'Stars';
export default Stars;
