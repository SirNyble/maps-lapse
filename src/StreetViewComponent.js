import React from 'react';
import * as THREE from 'three';
import axios from 'axios';
const OrbitControls = require('three-orbit-controls')(THREE)

var load = require('google-panorama-equirectangular')
const GOOGLE_API_KEY = 'AIzaSyA8AxDTe-ds-ZNV3omvTcm9fXUtEyv0Z0k';
/**
 * A counter button: tap the button to increase the count.
 */
class StreetViewComponent extends React.Component {
  constructor(props) {

    super(props);

    this.zoom = 1.0;
    this.panoNumCols = Math.pow(2, this.zoom);
    this.panoNumRows = Math.pow(2, this.zoom - 1);

    this.animate = this.animate.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getStreetViewTexture = this.getStreetViewTexture.bind(this);
    this.createPanoramaTiles = this.createPanoramaTiles.bind(this);
    this.createPanorama = this.createPanorama.bind(this);

      // window.renderMap = this.renderMap.bind(this);
      // var api = 'AIzaSyCllUWAbg1ZHiimQm5nfp4Z5JvJ7lRhknU';
      // var s = document.createElement('script');
      // s.src = '//maps.googleapis.com/maps/api/js?key=' + api + '&callback=renderMap';
      // s.type = 'text/javascript';
      // s.id = 'gmaps-api';
      // document.getElementsByTagName("head")[0].appendChild(s);

    this.streetViewSphereTexture = null;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.skybox = null;
  }

  renderMap() {
    // var berkeley = {lat:44.672682, lng:  -63.610158};
    // var sv = new google.maps.StreetViewService();
    // console.log(sv);
    // //const panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));

    // Set up the map.
    // map = new google.maps.Map(document.getElementById('map'), {
    //   center: berkeley,
    //   zoom: 16,
    //   streetViewControl: false
    // });
    //
    // // Set the initial Street View camera to the center of the map
    // sv.getPanorama({location: berkeley, radius: 150}, (panData, svStatus) => {
    //   console.log(panData.tiles);
    //   console.log("-asdfsadf-s-----------");
    //   console.log(panData.location.pano);
    //   load(panData.location.pano, { zoom: 2 })
    //   .on('start', function (data) {
    //     console.log('canvas size: ', data.width, data.height)
    //   })
    //   .on('progress', function (ev) {
    //     console.log('progress: ', ev.count / ev.total)
    //   })
    //   .on('complete', function (image) {
    //     document.body.appendChild(image)
    //     console.log('canvas image: ', image)
    //     image.setAttribute('crossOrigin', 'Anonymous');
    //     const blah = image.toDataURL();
    //     console.log(blah);
    //
    //     let canvas = document.createElement('canvas');
    //     let ctx = canvas.getContext('2d');
    //     ctx.drawImage(image, image.width, image.height);
    //
    //     this.streetViewSphereTexture = new THREE.Texture(canvas);
    //     this.streetViewSphereTexture.needsUpdate = true;
    //
    //     let sphereGeom = new THREE.SphereGeometry(10, 32, 32);
    //     let sphereMat = new THREE.MeshBasicMaterial({map: this.streetViewSphereTexture, side: THREE.DoubleSide});
    //     this.sphere = new THREE.Mesh(sphereGeom, sphereMat);
    //     //this.streetViewSphereTexture.needsUpdate = true;
    //     this.scene.add(this.sphere);
    //             console.log(this.sphere);


        // const dataURL = image.toDataURL();
        // let img = new Image();
        // img.on('load', function() {
        //   this.streetViewSphereTexture = new THREE.Texture(image);
        //   this.streetViewSphereTexture.needsUpdate = true;
        //
        //   let sphereGeom = new THREE.SphereGeometry(10, 32, 32);
        //   let sphereMat = new THREE.MeshBasicMaterial({map: this.streetViewSphereTexture, side: THREE.DoubleSide});
        //   this.sphere = new THREE.Mesh(sphereGeom, sphereMat);
        //   //this.streetViewSphereTexture.needsUpdate = true;
        //   this.scene.add(this.sphere);
        //           console.log(this.sphere);
        // }.bind(this));
        // img.setAttribute('crossOrigin', 'anonymous');
        // img.src = dataURL;

        //this.sphere.material.needsUpdate = true; this.sphere.material.needsUpdate = true
    //
    //   }.bind(this))
    // });

    // Look for a nearby Street View panorama when the map is clicked.
    // getPanoramaByLocation will return the nearest pano when the
    // given radius is 50 meters or less.
    // map.addListener('click', function(event) {
    //   sv.getPanorama({location: event.latLng, radius: 50}, processSVData);
    // });

  }

  animate() {
    //this.sphere.material.needsUpdate = true;
    requestAnimationFrame( this.animate );
    this.renderer.render( this.scene, this.camera );
  }

  componentDidMount() {
    const container = document.getElementById( 'webgl-mount' );

    this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 1000 );
    this.camera.position.set(0, 0, 15.1);
    this.camera.lookAt(new THREE.Vector3());

    this.controls = new OrbitControls(this.camera);
    this.controls.update();
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.getStreetViewTexture();

    // console.log((640.0 * ( window.innerWidth / window.innerHeight)));
    // let urlPrefix = "https://maps.googleapis.com/maps/api/streetview?key=" + GOOGLE_API_KEY + "&size=640x" + Math.floor(640.0 * ( window.innerWidth / window.innerHeight)) + "&location=44.651070,-63.582687&fov=90";
    // let urls = [  urlPrefix + "&heading=270", urlPrefix + "&heading=90", // posx, negx
    //   "obsolete.jpg", "obsolete.jpg",//urlPrefix + "&heading=180&pitch=90", urlPrefix + "&heading=180&pitch=-90", //posy, negy
    //   urlPrefix + "&heading=180", urlPrefix + "&heading=0" ]; //posz, negz
    //
    // let skyboxMaterialArray = [];
    // let textureLoader = new THREE.TextureLoader();
    // // textureLoader.setCrossOrigin("anonymous");
    // for(let i = 0; i < urls.length; i++) {
    //
    //   skyboxMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffffff, map: textureLoader.load( urls[i] ) } ) ); //"./obsolete.jpg"
    //   skyboxMaterialArray[i].side = THREE.BackSide;
    // }
    // // var skyboxMaterial = new THREE.MeshFaceMaterial( skyboxMaterialArray );
    // var skyboxGeom = new THREE.CubeGeometry( 10, 10, 10, 1, 1, 1 );
    // this.skybox = new THREE.Mesh( skyboxGeom, skyboxMaterialArray );
    // this.scene.add( this.skybox );

    //this.streetViewSphereTexture.needsUpdate = true;
    // let sphereGeom = new THREE.SphereGeometry(10, 32, 32);
    // let sphereMat = new THREE.MeshBasicMaterial({map: this.streetViewSphereTexture, side: THREE.DoubleSide});
    // this.sphere = new THREE.Mesh(sphereGeom, sphereMat);
    // //this.streetViewSphereTexture.needsUpdate = true;
    // this.scene.add(this.sphere);

    container.appendChild( this.renderer.domElement );
    this.animate();
  }

  getStreetViewTexture() {
    const lat = 44.672696;
    const long = -63.610197;
    axios.get('http://maps.google.com/cbk?output=json&ll=' + lat + ',' + long + '&dm=0')
    .then(res => {
      console.log(res.data.Location.panoId);
      this.createPanoramaTiles(res.data.Location.panoId);
    }).catch(err => {
        console.log(err);
    });
  }

  createPanoramaTiles(panoId){
    const totalImages = this.panoNumCols * this.panoNumRows;
    let imagesLoaded = 0;
    let imageArr = [];
    for(let y = 0; y < this.panoNumRows; y++) {
      for(let x = 0; x < this.panoNumCols; x++) {
        axios.get('http://maps.google.com/cbk?output=tile&panoid=' + panoId + '&zoom=' + this.zoom + '&x=' + x + '&y=' + y,
          {
            responseType: 'arraybuffer'
          })
        .then(response => new Buffer(response.data, 'binary').toString('base64'))
        .then(tile => {
          console.log(tile);
          let img = new Image();
          img.onload = function() {
            console.log('tile loaded!');
            imagesLoaded++;
            imageArr.push({
              img: img,
              x: x,
              y: y,
            });
            if(imagesLoaded == totalImages) {
              console.log('done loading');
              this.createPanorama(imageArr);
            }
            document.body.appendChild(img);
          }.bind(this)
          img.src = 'data:image/png;base64,' + tile;

        })
      }
    }
  }

  createPanorama(imgArr) {
    let canvas = document.getElementById('panorama');
    let ctx = canvas.getContext('2d');
    canvas.width = 416 * this.panoNumCols;
    canvas.height = 416 * this.panoNumRows;
    console.log(imgArr);
    console.log("FSDF");
    for(let imgTile = 0; imgTile < imgArr.length; imgTile++){
      console.log(imgArr[imgTile].img);
      ctx.drawImage(imgArr[imgTile].img, imgArr[imgTile].x * 512, imgArr[imgTile].y * 512);
    }
  }


  handleClick(e) {
    console.log(e);
  }


  render() {
    return (
      <div>
        <div id="webgl-mount" onClick={this.handleClick}></div>
        <canvas id="panorama" />
      </div>
    );
  }
}

export default StreetViewComponent;
