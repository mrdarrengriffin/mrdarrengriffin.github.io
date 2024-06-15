import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export default class Car {
    constructor() {
        this.elemWrapper = document.querySelector('.car-wrapper');
        if(!this.elemWrapper){
            return;
        }
        this.elem = this.elemWrapper.querySelector('#car');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        


        this.camera.position.z = 2;
        this.camera.position.x = 0;
        this.camera.position.y = 1;
        this.renderer.setSize(this.elem.clientWidth, this.elem.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.elem.appendChild(this.renderer.domElement);

        var ambientLight = new THREE.AmbientLight('white', 0.5);
        this.scene.add(ambientLight);

        this.loader = new GLTFLoader();
        this.loader.load('models/trackmania-car/fb393c63b0394e618971ebca7dbbc303_Textured.gltf', (gltf) => {
            this.car = gltf.scene;

            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    if (child.name.startsWith('TIRE')){
                        child.material.metalness = 0;
                        child.material.roughness = 1;
                    } else {
                        child.material.metalness = 0.9;
                        child.material.roughness = 0.2;
                        child.castShadow = true;
                    }
                }else{
                    console.log(child);
                }
            });

            this.car.scale.set(2,2,2);
            this.car.position.y = 0.015;
            this.scene.add(this.car);
        });

        // Add a floor. I want the light to light it up but also receive shadows
        var groundGeo = new THREE.PlaneGeometry(100, 100);
        var groundMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.65
        });
        groundMat.color.setHex(0xe000000);

        var ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;


        this.scene.add(ground);
        ground.receiveShadow = true;

        this.lightGroup();

        this.camera.lookAt(0, 0, 0);

        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    lightGroup() {
        const bulb1Geometry = new THREE.SphereGeometry(.5, .5, 10);
        this.bulb1 = new THREE.PointLight(0xffffff, 1, 100, 1);
        this.bulb1.add(new THREE.Mesh(bulb1Geometry));
        this.bulb1.position.set(1, 1, -1);
        this.bulb1.power = 100;
        this.bulb1.castShadow = true;
        this.bulb1.children[0].visible = false;
        this.bulb1.shadow.mapSize.width = 2024;
        this.bulb1.shadow.mapSize.height = 2024;


        this.scene.add(this.bulb1);

        const bulb2Geometry = new THREE.SphereGeometry(.5, .5, 10);
        this.bulb2 = new THREE.PointLight(0xffffff, 1, 100, 1);
        this.bulb2.add(new THREE.Mesh(bulb2Geometry));
        this.bulb2.position.set(-1, 1, -1);
        this.bulb2.power = 100;
        this.bulb2.castShadow = true;
        this.bulb2.children[0].visible = false;

        this.scene.add(this.bulb2);

        const bulb3Geometry = new THREE.SphereGeometry(.5, .5, 10);

        this.bulb3 = new THREE.PointLight(0xffffff, 1, 100, 1);
        this.bulb3.add(new THREE.Mesh(bulb3Geometry));
        this.bulb3.position.set(0, 5, -1);
        this.bulb3.power = 100;
        this.bulb3.castShadow = true;
        this.bulb3.children[0].visible = false;

        this.scene.add(this.bulb3);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
       
        const style = getComputedStyle(this.elemWrapper);
        const maxDelta = parseInt(style.getPropertyValue('--dsap-max-scroll-delta'));
        const delta = parseInt(style.getPropertyValue('--dsap-scroll-delta'));

        // move the camera based on the scroll delta
        this.camera.position.y = delta / maxDelta;
        this.camera.position.z = 1;
        this.camera.position.x = -0.5 + (delta / maxDelta);

        this.camera.lookAt(0, 0, 0);
        this.renderer.render(this.scene, this.camera);
    }
}