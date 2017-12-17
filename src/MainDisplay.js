import React from 'react';
import * as THREE from 'three';

/**
 * A counter button: tap the button to increase the count.
 */
class MainDisplay extends React.Component {
  constructor() {
    console.log("CONSTRUCT");
    super();
    this.state = {
      count: 0,
    };
    this.animate = this.animate.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.sphere = null;
    this.plane = null;
    this.camera = null;
    this.scene = null;
    this.mesh = null;
    this.light = null;
    this.renderer = null;
    this.velocity = 0.03;
  }
  animate() {
    console.log("ANIMATING");
      requestAnimationFrame( this.animate );

      if(this.mesh) {

        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
      }

      if(this.sphere.position.y > 10.0 || this.sphere.position.y < -10.0 )
        this.velocity = -this.velocity;

      this.sphere.position.y += this.velocity;
      this.sphere.rotation.y += 0.01;

      this.renderer.render( this.scene, this.camera );
  }
  componentDidMount() {
    this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.01, 1000 );
    this.camera.position.z = 50;
    //this.camera.position.x = -10;

    this.scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry( 2, 2, 2 );
    const material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.position.z = 4;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    this.scene.add( this.mesh );

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMapEnabled = true;
    // to antialias the shadow
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

    //Create a sphere that cast shadows (but does not receive them)
    const sphereGeometry = new THREE.SphereBufferGeometry( 2, 32, 32 );
    const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    this.sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    this.sphere.position.z = 10;
    this.sphere.castShadow = true; //default is false
    this.sphere.receiveShadow = false; //default
    this.scene.add( this.sphere );

    //Create a plane that receives shadows (but does not cast them)
    const planeGeometry = new THREE.PlaneBufferGeometry( 20, 20, 32, 32 );
    const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
    this.plane = new THREE.Mesh( planeGeometry, planeMaterial );
    this.plane.receiveShadow = true;
    this.scene.add( this.plane );
    //sphere.castShadow = true;
    this.plane.receiveShadow = true;

    this.light = new THREE.DirectionalLight(0xffffff, 4.0, 3000);
    this.light.position.y = 10;
    this.light.position.z = 100;
    this.light.castShadow = true;
    this.light.target = this.plane;
    this.light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(100, 1, 1, 1000));
    this.light.shadow.bias = 0.001;
    this.light.shadow.mapSize.width = 2048 * 2;
    this.light.shadow.mapSize.height = 2048 * 2;

    this.scene.add(this.light);

    const container = document.getElementById( 'webgl-mount' );
    container.appendChild( this.renderer.domElement );
    this.animate();
  }

  handleClick(e) {
    console.log(e);
  }


  render() {
    return (
      <div id="webgl-mount" onClick={this.handleClick}></div>
    );
  }
}
export default MainDisplay;
