import {Fog, PerspectiveCamera, Scene, TOUCH, Vector3, WebGLRenderer} from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import * as points from "./particles/points"
import * as triangles from "./particles/triangles"
import * as gpuCompute from "./gpuCompute"
import * as Stats from 'stats.js'

let particles: typeof points | typeof triangles
let stats
let renderer, scene, camera, width, height
let particlesLoaded = false
let sceneReady = false
let loading = true

export function start(initialPositions: Float32Array, particleBufferWidth: number, particleBufferHeight: number, bounds: Float32Array, meshes=false) {
    particles = meshes ? triangles : points

    try {
        // @ts-ignore declaration is missing failIfMajorPerformanceCaveat for some reason
        renderer = new WebGLRenderer( {antialias: true, failIfMajorPerformanceCaveat: true})
    } catch (err) {
        console.error("Appropriate Hardware Requirements weren't met")
        // todo
        return
    }

    stats = new Stats()

    width = window.innerWidth
    height = window.innerHeight

    window.addEventListener('resize', onWindowResize)
    window.addEventListener('orientationchange', onWindowResize)

    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor('#1E272C')

    renderer.sortObjects = false

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stats.dom)

    scene = new Scene()
    scene.fog = new Fog('#1E272C', 0.0016)

    camera = new PerspectiveCamera(60, width / height, 0.1, 100_000)
    camera.position.copy(new Vector3(50, 150, 250))

    const controls = new OrbitControls(camera, renderer.domElement)
    // TODO tweak
    controls.enablePan = false
    controls.rotateSpeed = 0.5
    controls.enableDamping = true
    controls.dampingFactor = 0.04
    controls.touches = {ONE: undefined, TWO: TOUCH.DOLLY_ROTATE}
    controls.update()

    gpuCompute.init(renderer, particleBufferWidth, particleBufferHeight, initialPositions, bounds)
    particles.init(particleBufferWidth, particleBufferHeight).then(_ => {
        particlesLoaded = true
    })

    play()
}

function play() {
    renderer.setAnimationLoop(() => {

        onLoad()

        if (sceneReady) {
            stats.begin()

            gpuCompute.update()
            particles.update(gpuCompute.getPositionTexture())
            renderer.setRenderTarget(null)
            renderer.render(scene, camera)

            stats.end()
        }
    })
}

function onLoad() {
    loading = ( !particlesLoaded )
    if ( !loading && !sceneReady ) {
        scene.add(particles.mesh)
        sceneReady = true
    }
}

function onWindowResize() {
    width = window.innerWidth
    height = window.innerHeight

    renderer.setSize(width, height)

    camera.aspect = width / height
    camera.updateProjectionMatrix()
}
