import {BoxGeometry, Fog, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from "three";

let renderer, scene, camera, width, height, cube

export function start() {
    try {
        // @ts-ignore declaration is missing failIfMajorPerformanceCaveat for some reason
        renderer = new WebGLRenderer( {antialias: true, failIfMajorPerformanceCaveat: true})
    } catch (err) {
        console.error("Appropriate Hardware Requirements weren't met")
        // todo
        return
    }

    width = window.innerWidth
    height = window.innerHeight

    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor('#1E272C')

    renderer.sortObjects = false

    document.body.appendChild(renderer.domElement)

    scene = new Scene()
    scene.fog = new Fog('#1E272C', 0.0016)

    camera = new PerspectiveCamera(60, width / height, 1, 10_000)
    camera.position.copy(new Vector3(0, 0, 5))

    const geometry = new BoxGeometry()
    const material = new MeshBasicMaterial({color: 0x00ff00})
    cube = new Mesh(geometry, material)

    scene.add(cube)

    update()
}

function update() {
    requestAnimationFrame(update)

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera)
}

function onWindowResize() {

}
