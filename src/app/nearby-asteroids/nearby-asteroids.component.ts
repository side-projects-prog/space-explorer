import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import TextSprite from '@seregpie/three.text-sprite';
import * as dat from 'dat.gui';
import OrbitControls from 'orbit-controls-es6';
import { LineSegments } from 'three';

@Component({
	selector: 'app-nearby-asteroids',
	templateUrl: './nearby-asteroids.component.html',
	styleUrls: ['./nearby-asteroids.component.css']
})
export class NearbyAsteroidsComponent implements OnInit {

	constructor() { }

	ngOnInit(): void {

		let scene = this.getScene();
		let camera = this.getCamera();
		let cameraMovements = this.getCameraMovements(camera);
		let pointLight = this.getPointLight(2);
		let renderer = new THREE.WebGL1Renderer();
		
		let interactions = new Interaction(renderer, scene, camera);

		let earth = this.getEarth(2.5);
		let sun = this.getSun(0.5);
		let meteoride = this.getMeteoride(0.5);
		let description = this.getMeteorideDescription();
		let line = this.getLine();
		let lineDescription = this.getMissedByDescription();
		let stars = this.getStars();

		this.eventRegisterer(camera, renderer, meteoride, description, line, lineDescription);

		pointLight.add(sun);
		
		scene.add(earth);
		scene.add(pointLight);
		scene.add(meteoride);
		scene.add(cameraMovements);
		scene.add(description);
		scene.add(line);
		scene.add(lineDescription);
		scene.add(stars);
		
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		renderer.render(scene, camera);
		let orbitControl = new OrbitControls(camera, renderer.domElement);

		this.updateScene(renderer, scene, camera, orbitControl);
	}

	private getScene() {
		let scene = new THREE.Scene();
		return scene;
	}

	private getCamera() {
		let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		return camera;
	}

	private getPointLight(intensity) {
		let pointLight = new THREE.PointLight('0xffffff', intensity);
		pointLight.position.z = 100;
		return pointLight;
	}

	private getCameraMovements(camera) {

		let cameraXPosition = new THREE.Group();
		let cameraYPosition = new THREE.Group();
		let cameraZPosition = new THREE.Group();
		let cameraXRotation = new THREE.Group();
		let cameraYRotation = new THREE.Group();
		let cameraZRotation = new THREE.Group();

		cameraXPosition.name = 'camxpos';
		cameraYPosition.name = 'camypos';
		cameraZPosition.name = 'camzpos';
		cameraXRotation.name = 'camxrot';
		cameraYRotation.name = 'camyrot';
		cameraZRotation.name = 'camzrot';

		cameraZPosition.position.z = 20;
		cameraYPosition.position.y = 6;
		cameraXRotation.rotation.x = -0.2;

		cameraXPosition.add(camera);
		cameraYPosition.add(cameraXPosition);
		cameraZPosition.add(cameraYPosition);
		cameraXRotation.add(cameraZPosition);
		cameraYRotation.add(cameraXRotation);
		cameraZRotation.add(cameraYRotation);

		return cameraZRotation;
	}

	private updateScene(renderer, scene, camera, controls) {

		renderer.render(
			scene,
			camera
		);

		this.meteorideAnimation(scene, 0.09);
		this.cameraAnimation(scene);
		this.earthAnimation(scene);
		controls.update();

		requestAnimationFrame(() => {
			this.updateScene(renderer, scene, camera, controls);
		});

	}

	private getEarth(radius) {

		let earth = new THREE.SphereGeometry(radius, 50, 50);
		let material = new THREE.MeshLambertMaterial({
			color: 'rgb(120, 120, 120)'
		});

		let earthTexture = new THREE.TextureLoader();
		material.map = earthTexture.load('../../assets/earth-texture-map.jpg');

		var earthMesh = new THREE.Mesh(
			earth,
			material
		);

		earthMesh.name = 'earth';
		earthMesh.position.x = -2.5;
		earthMesh.position.z = 0;

		return earthMesh;
	}

	private getSun(radius) {
		
		let sun = new THREE.SphereGeometry(radius, 50, 50);
		let material = new THREE.MeshBasicMaterial({
			color: 'rgb(250, 250, 250)'
		});

		var sunMesh = new THREE.Mesh(
			sun,
			material
		);

		return sunMesh;
	}

	private getMeteoride(radius) {
		
		let meteoride = new THREE.SphereGeometry(radius, 8, 6);
		let material = new THREE.MeshBasicMaterial({
			color: 'rgb(120, 120, 120)'
		});

		var meteorideMesh = new THREE.Mesh(
			meteoride,
			material
		);

		let meteorideTexture = new THREE.TextureLoader();
		material.map = meteorideTexture.load('../../assets/asteroid-texture.jpg');

		meteorideMesh.position.x = 1;
		meteorideMesh.position.y = 0.5;
		meteorideMesh.position.z = 20;	

		meteorideMesh.name = 'meteoride';

		return meteorideMesh;
	}

	private getStars() {

		let particleGeo = new THREE.Geometry();
		let particleMaterial = new THREE.PointsMaterial({
			color: 'rgb(255, 255, 255)',
			size: 0.5,
			map: new THREE.TextureLoader().load('../../assets/particle.png'),
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		});

		for (let i = 0; i < 10000; i++) {

			let posx = (Math.random() - 0.5) * 100;
			let posy = (Math.random() - 0.5) * 100;
			let posz = (Math.random() - 0.5) * 100;

			let particle = new THREE.Vector3(posx, posy, posz);

			particleGeo.vertices.push(particle);
		}

		let particles = new THREE.Points(
			particleGeo, 
			particleMaterial
		);

		return particles;
	}

	private meteorideAnimation(scene, horizontalMovement) {
		
		let meteoride = scene.getObjectByName("meteoride");

		if (meteoride.position.z > 2) {
			meteoride.position.z -= horizontalMovement;
		}

		meteoride.rotation.x += Math.PI / 200;
		meteoride.rotation.y += Math.PI	/ 200;
	}

	private cameraAnimation(scene) {

		let cameraXPosition = scene.getObjectByName('camxpos');
		let cameraYPosition = scene.getObjectByName('camypos');
		let cameraZPosition = scene.getObjectByName('camzpos');
		let cameraXRotation = scene.getObjectByName('camxrot');
		let cameraYRotation = scene.getObjectByName('camyrot');
		let cameraZRotation = scene.getObjectByName('camzrot');

		if (cameraXRotation.rotation.x < 0.25) {
			cameraXRotation.rotation.x += 0.005;
		}

		if (cameraXRotation.rotation.x >= 0.25 && cameraZPosition.position.z > 5) {
			cameraZPosition.position.z -= 0.1
		}

		if (cameraYPosition.position.y > 4) {
			cameraYPosition.position.y -= 0.1;
		}

	}

	private earthAnimation(scene) {
		let earth = scene.getObjectByName('earth');
		earth.rotation.y += Math.PI / 10000;
	}


	private getMeteorideDescription() {
		let description = new TextSprite({
			fontFamily: '"Lucida Console", Courier, monospace',
			fontSize: 0.1,
			fontStyle: 'italic',
			text: [
			  'Name : (2020 CA1)',
			  'Diameter (m) : 26.75',
			  'Hazardous : No',
			  'Close approach : 2020-Aug-15 03:53',
			  'Relative speed(Km/s) : 10.98'
			].join('\n'),
		  });

		  description.position.set(3, 1, 0);
		  description.visible = false;
		  return description;
	}

	private getMissedByDescription() {
		let description = new TextSprite({
			fontFamily: '"Lucida Console", Courier, monospace',
			fontSize: 0.1,
			fontStyle: 'italic',
			text: [
			  'Missed earth by (Km) : 61611205.45',
			].join('\n'),
		  });

		  description.position.set(3, 1, 0);
		  description.visible = false;
		  return description;
	}
	
	private toggleDescription(description) {
		description.visible = !description.visible;
	}

	private eventRegisterer(camera, renderer, meteoride, description, line, lineDescription) {
		meteoride.on('mouseover', (event) => this.toggleDescription(description));
		meteoride.on('mouseout', (event) => this.toggleDescription(description));
		meteoride.on('click', (event) => this.toggleDescription(description));
		line.on('mouseover', (event) => this.toggleDescription(lineDescription));
		line.on('mouseout', (event) => this.toggleDescription(lineDescription));
		line.on('click', (event) => this.toggleDescription(lineDescription));
		
	}

	private getLine() {

		let geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(-2.5, 0, 0));
		geometry.vertices.push(new THREE.Vector3(1, 0.5, 2));
		
		let lineMaterial = new THREE.LineBasicMaterial({ 
			color: 0x000000, 
			linewidth: 1,
			opacity: 0
		});

		lineMaterial.transparent = true;
		
		let line = new THREE.Line(geometry, lineMaterial,1);
		return line;
	}
}
