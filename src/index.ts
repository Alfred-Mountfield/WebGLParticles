import {BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer} from "three"
import {WEBGL} from "three/examples/jsm/WebGL"

const width = window.innerWidth
const height = window.innerHeight

const scene = new Scene()
const camera = new PerspectiveCamera(60, width/height, 1, 10_000)
camera.position.z = 5

const renderer = new WebGLRenderer()
renderer.setSize(width, height)

document.body.appendChild(renderer.domElement)

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );

scene.add( cube )

const animate = () => {
    requestAnimationFrame(animate)
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    renderer.render(scene, camera)
}

if (WEBGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    animate()
} else {
    const warning = WEBGL.getWebGLErrorMessage()
    document.body.appendChild(warning)
}

