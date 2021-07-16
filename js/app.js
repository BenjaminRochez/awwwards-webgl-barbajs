import * as THREE from "three";
import ASScroll from '@ashthornton/asscroll'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import fragment from "../shaders/fragment.glsl";
import vertex from "../shaders/vertex.glsl";
import testTexture from '../img/texture.jpg'
import * as dat from 'dat.gui'
import gsap from 'gsap'
export default class Sketch {
  constructor(options) {
    this.time = 0;
    this.container = options.domElement;
    this.height = this.container.offsetHeight;
    this.width = this.container.offsetWidth;
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      1000
    );
    this.camera.position.z = 600;
    this.camera.fov = 2*(Math.atan((this.height / 2)/600) * 180/Math.PI);

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.asscroll = new ASScroll();
      this.asscroll.enable({
        horizontalScroll: true
      })

    this.setupSettings();
    this.resize();
    this.addObjects();
    this.render();

    this.setUpResize();
  }

  addObjects() {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        uProgress: {value: 0.0},
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uQuadSize: { value: new THREE.Vector2(300, 300) },
        uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
        uTexture: {value: new THREE.TextureLoader().load(testTexture)},
        uTextureSize: {value: new THREE.Vector2(100,100)}
      },
      vertexShader: vertex, 
      fragmentShader: fragment
    });

    this.tl = gsap.timeline()
        .to(this.material.uniforms.uCorners.value,{
            x: 1,
            duration: 1
        })
        .to(this.material.uniforms.uCorners.value,{
            y: 1,
            duration: 1
        }, 0.2)
        .to(this.material.uniforms.uCorners.value,{
            z: 1,
            duration: 1
        }, 0.4)
        .to(this.material.uniforms.uCorners.value,{
            w: 1,
            duration: 1
        }, 0.6)
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    //this.scene.add(this.mesh);
    this.mesh.position.x = 300;
    this.mesh.scale.set(300,300,1); 
    // this.mesh.rotation.z = 0.5;

    this.images = [...document.querySelectorAll('.js-image')];
    this.materials = [];

    this.imageStore = this.images.map(img =>{
      let bounds = img.getBoundingClientRect();
      let m = this.material.clone();
      this.materials.push(m);
      let texture = new THREE.Texture(img);
      m.uniforms.uTexture.value = texture;
      texture.needsUpdate = true;
      let mesh = new THREE.Mesh(this.geometry, m);
      this.scene.add(mesh);
      mesh.scale.set(bounds.width, bounds.height, 1);
      return{
        img: img,
        mesh: mesh,
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        left: bounds.left
      }
    })
  }

  render() {
    this.time += 0.05;
    requestAnimationFrame(this.render.bind(this));
    this.material.uniforms.uProgress.value = this.settings.progress;
    this.tl.progress(this.settings.progress)
    this.renderer.render(this.scene, this.camera);
  }
  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  setUpResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  
  setupSettings(){
      this.settings = {
          progress: 0
      }
      this.gui = new dat.GUI();
      this.gui.add(this.settings, "progress", 0,1,0.001);
  }
}

new Sketch({
  domElement: document.getElementById("container"),
});
