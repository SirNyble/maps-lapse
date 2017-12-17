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
    this.camera = null;
    this.scene = null;
    this.mesh = null;
    this.renderer = null;
  }
  animate() {
    console.log("ANIMATING");
      requestAnimationFrame( this.animate );

      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.02;

      this.renderer.render( this.scene, this.camera );
  }
  componentDidMount() {
    console.log("woo");
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh( geometry, material );
    this.scene.add( this.mesh );

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    const container = document.getElementById( 'webgl-mount' );
    container.appendChild( this.renderer.domElement );
    this.animate();
  }



  render() {
    return (
      <div id="webgl-mount"></div>
    );
  }
}
export default MainDisplay;
