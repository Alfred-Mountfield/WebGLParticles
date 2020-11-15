import {Fog, PerspectiveCamera, Scene, TOUCH, Vector3, WebGLRenderer} from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import * as points from "./particles/points"
import * as triangles from "./particles/triangles"
import * as gpuCompute from "./gpuCompute"
import * as Stats from 'stats.js'
import {WEBGL} from "three/examples/jsm/WebGL";
import {initGUI, parameters, startingShapes} from "./guiParameters";
import {loadImage, randomPositions} from "./startingPositions";

let particles: typeof points | typeof triangles
let stats
let renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, width, height
let particlesLoaded = false
let sceneReady = false
let loading = true

export function init() {
    if (WEBGL.isWebGLAvailable()) {
        stats = new Stats()
        document.body.appendChild(stats.dom)

        initGUI(onChange, restartSimulation, resetCamera)

        try {
            // @ts-ignore declaration is missing failIfMajorPerformanceCaveat for some reason
            renderer = new WebGLRenderer({antialias: true, failIfMajorPerformanceCaveat: true})
        } catch (err) {
            console.error("Appropriate Hardware Requirements weren't met")
            // todo
            return
        }

        width = window.innerWidth
        height = window.innerHeight

        window.addEventListener('resize', onWindowResize)
        window.addEventListener('orientationchange', onWindowResize)

        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setClearColor('#1E272C')

        renderer.sortObjects = false

        document.body.appendChild(renderer.domElement)

        scene = new Scene()
        scene.fog = new Fog('#1E272C', 0.0016)

        camera = new PerspectiveCamera(60, width / height, 0.00001, 100_000_000)
        camera.position.copy(new Vector3(50, 150, 250))

        const controls = new OrbitControls(camera, renderer.domElement)
        // TODO tweak
        controls.enablePan = true
        controls.rotateSpeed = 0.5
        controls.enableDamping = true
        controls.dampingFactor = 0.9
        controls.touches = {ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN}
        controls.update()

        startFromParams()


    } else {
        const warning = WEBGL.getWebGLErrorMessage()
        document.body.appendChild(warning)
    }

}

export function startFromParams() {
    switch (Number(parameters["Starting Shape"])) {
        case startingShapes.random:
            const randomStartingPositions = randomPositions(Number(parameters["Texture Size (Particles)"]), Number(parameters["Texture Size (Particles)"]), parameters["Maximum Value"])
            const randomBounds = new Float32Array(3)
            randomBounds[0] = randomBounds[1] = randomBounds[2] = 2 * parameters["Maximum Value"]
            start(randomStartingPositions, Number(parameters["Texture Size (Particles)"]), Number(parameters["Texture Size (Particles)"]), randomBounds)
            break
        default:
            const callback = (pos, width, height, bounds) => start(pos, width, height, bounds)
            loadImage(`src/textures/${startingShapes[parameters["Starting Shape"]]}`, parameters["Maximum Value"], callback)
            break
    }

}

function start(initialPositions: Float32Array, particleBufferWidth: number, particleBufferHeight: number, bounds: Float32Array) {
    const renderWithTriangles = parameters["Render with Triangles"]
    particles = renderWithTriangles ? triangles : points

    gpuCompute.init(renderer, particleBufferWidth, particleBufferHeight, initialPositions, bounds)
    particles.init(particleBufferWidth, particleBufferHeight, renderWithTriangles ? parameters["Triangles Scale"] : undefined)
        .then(_ => {
            particlesLoaded = true
        })

    setTimeout(() => {
        parameters["Movement"] = true
        onChange()
    }, 2000)

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
    loading = (!particlesLoaded)
    if (!loading && !sceneReady) {
        scene.add(particles.mesh)
        sceneReady = true
    }
}

function onChange() {
    gpuCompute.updateParameters()
    particles.updateParameters()
}

function resetCamera() {
    camera.position.copy(new Vector3(50, 150, 250))
    camera.lookAt(0, 0, 0)
}

function restartSimulation() {
    scene.remove(particles.mesh)

    particlesLoaded = false
    sceneReady = false

    particles.dispose()
    gpuCompute.dispose()

    startFromParams()
}

function onWindowResize() {
    width = window.innerWidth
    height = window.innerHeight

    renderer.setSize(width, height)

    camera.aspect = width / height
    camera.updateProjectionMatrix()
}

init()
