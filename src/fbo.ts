import {
    BufferAttribute,
    BufferGeometry,  DataTexture,
    FloatType,
    Mesh,
    NearestFilter,
    NoBlending,
    OrthographicCamera,
    RGBAFormat,
    Scene,
    ShaderMaterial,
    WebGLRenderer,
    WebGLRenderTarget
} from "three"

import through_vert from './glsl/through.vs.glsl'
import through_frag from './glsl/through.fs.glsl'
// import sim_frag from "./glsl/sim.static.fs.glsl"
import sim_frag from "./glsl/sim.moving.fs.glsl"
import sim_vertex from "./glsl/sim.vs.glsl"

let width, height, scene, camera, renderer, rtt, rtt2, copyShader, simulationMaterial, mesh
let time = 0

export async function init(webGLRenderer: WebGLRenderer, initialPositions, bufferHeight, bufferWidth, bounds) {
    return new Promise(resolve => {
        height = bufferHeight
        width = bufferWidth
        renderer = webGLRenderer
        scene = new Scene()
        camera = new OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1)

        const duckPositionsTarget = wrapPositionsInTexture(initialPositions)

        setupShaders(duckPositionsTarget.texture, bounds)

        const simGeometry = new BufferGeometry()
        const positionVertices = new Float32Array(
            [
                -1,-1,0,
                1,-1,0,
                1,1,0,
                -1,-1, 0,
                1, 1, 0,
                -1,1,0
            ]
        )
        const uvVertices = new Float32Array(
            [
                0,1,
                1,1,
                1,0,
                0,1,
                1,0,
                0,0
            ]
        )
        simGeometry.setAttribute('position', new BufferAttribute(positionVertices, 3))
        simGeometry.setAttribute('uv', new BufferAttribute(uvVertices, 2))

        mesh = new Mesh(simGeometry, copyShader)
        mesh.frustumCulled = false
        scene.add(mesh)

        rtt = new WebGLRenderTarget(height, width, {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            format: RGBAFormat,
            type: FloatType
        })

        rtt2 = rtt.clone()
        copyTexture(duckPositionsTarget, rtt)
        copyTexture(rtt, rtt2)

        resolve(true)
    })
}

export function update() {
    time += 1

    const tmp = rtt
    rtt = rtt2
    rtt2 = tmp

    mesh.material = simulationMaterial
    simulationMaterial.uniforms.positions.value = rtt2.texture
    simulationMaterial.uniforms.time.value = time

    renderer.setRenderTarget(rtt)
    renderer.clear()
    renderer.render(scene, camera)
    renderer.setRenderTarget(null)
}

function setupShaders(positions, bounds) {
    const randomVals = new Float32Array(height * width)
    for (let i = 0; i < height * width; i++) {
        randomVals[i] = Math.random() - 0.5
    }

    simulationMaterial = new ShaderMaterial({
        uniforms: {
            positions: {
                value: positions
            },
            initialPositions: {
                value: positions
            },
            bounds: {
                value: bounds
            },
            time: {
                value: 0.0
            },
            random: {
                value: randomVals
            }
        },
        vertexShader: sim_vertex,
        fragmentShader: sim_frag,
        blending: NoBlending,
        transparent: false,
        fog: false,
        lights: false,
        depthWrite: false,
        depthTest: false
    })
    
    copyShader = new ShaderMaterial( {
        uniforms: {
            positions: {
                value: positions
            }
        },
        vertexShader: through_vert,
        fragmentShader: through_frag,
        fog: false,
        lights: false,
        depthWrite: false,
        depthTest: false
    } );
}

function wrapPositionsInTexture(positions: Float32Array) {
    const duckRtt = {texture: undefined} // duck-typed RenderTarget
    duckRtt.texture = new DataTexture(positions, height, width, RGBAFormat, FloatType)
    duckRtt.texture.minFilter = NearestFilter
    duckRtt.texture.magFilter = NearestFilter
    duckRtt.texture.needsUpdate = true
    duckRtt.texture.generateMipmaps = false
    duckRtt.texture.flipY = false

    return duckRtt
}


function copyTexture(inRenderTarget, outRenderTarget) {
    mesh.material = copyShader
    copyShader.uniforms.positions.value = inRenderTarget.texture

    renderer.setRenderTarget(outRenderTarget)
    renderer.render(scene, camera)
    renderer.setRenderTarget(null)
}

export {rtt}
