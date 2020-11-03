import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    DataTexture,
    FloatType,
    Mesh,
    NearestFilter,
    NoBlending,
    OrthographicCamera,
    Points,
    RawShaderMaterial,
    RGBAFormat,
    Scene,
    ShaderMaterial,
    WebGLRenderer,
    WebGLRenderTarget
} from "three"

import quad_vert from './glsl/quad.vertex.js';
import through_frag from './glsl/through.frag.js';
import sim_frag from "./glsl/sim.frag.js"
import sim_vertex from "./glsl/sim.vertex.js"
import render_frag from "./glsl/render.frag.js"
import render_vertex from "./glsl/render.vertex.js"

const OPTIONS = {
    WIDTH: 256,
    HEIGHT: 256,
}

let scene, camera, renderer, rtt, rtt2, copyShader, renderMaterial, simulationMaterial, mesh, particleMesh

export async function init(webGlRenderer: WebGLRenderer) {
    return new Promise(resolve => {
        renderer = webGlRenderer
        scene = new Scene()
        camera = new OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1)

        setupShaders()

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

        rtt = new WebGLRenderTarget(OPTIONS.HEIGHT, OPTIONS.WIDTH, {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            format: RGBAFormat,
            type: FloatType
        })

        rtt2 = rtt.clone()
        copyTexture(getRandomDataTexture(), rtt)
        copyTexture(rtt, rtt2)

        const particleVertices = new Float32Array((OPTIONS.HEIGHT * OPTIONS.WIDTH) * 3)
        for (let i = 0; i < (OPTIONS.HEIGHT * OPTIONS.WIDTH); i++) {
            particleVertices[i * 3] = (i % OPTIONS.WIDTH) / OPTIONS.WIDTH
            particleVertices[i * 3 + 1] = (i / OPTIONS.WIDTH) / OPTIONS.HEIGHT
        }

        const particleGeometry = new BufferGeometry()
        particleGeometry.setAttribute('position', new BufferAttribute(particleVertices, 3))

        particleMesh = new Points(particleGeometry, renderMaterial)

        resolve(true)
    })
}

export function update() {
    const tmp = rtt
    rtt = rtt2
    rtt2 = tmp

    mesh.material = renderMaterial
    renderMaterial.uniforms.positions.value = rtt2.texture

    renderer.setRenderTarget(rtt)
    renderer.clear()
    renderer.render(scene, camera)
    renderer.setRenderTarget(null)

    particleMesh.material.uniforms.positions.value = rtt.texture
}

function setupShaders() {
    const positions = getRandomDataTexture().texture

    simulationMaterial = new ShaderMaterial({
        uniforms: {
            positions: {
                value: positions
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

    renderMaterial = new ShaderMaterial({
        uniforms: {
            positions: {
                value: null,
            }
        },
        vertexShader: render_vertex,
        fragmentShader: render_frag,
        blending: AdditiveBlending,
        transparent: true,
        fog: false,
        lights: false,
        depthWrite: false,
        depthTest: false
    })

    copyShader = new RawShaderMaterial( {
        uniforms: {
            positions: {
                value: positions
            }
        },
        vertexShader: quad_vert,
        fragmentShader: through_frag,
        fog: false,
        lights: false,
        depthWrite: false,
        depthTest: false
    } );
}

function copyTexture(inRenderTarget, outRenderTarget) {
    mesh.material = copyShader
    copyShader.uniforms.positions.value = inRenderTarget.texture

    renderer.setRenderTarget(outRenderTarget)
    renderer.render(scene, camera)
    renderer.setRenderTarget(null)
}

function getRandomDataTexture() {
    let len = OPTIONS.HEIGHT * OPTIONS.WIDTH * 4
    const randomData = new Float32Array(len)

    while (len--) {
        randomData[len] = ( Math.random() * 2 - 1 ) * 256
    }

    const duckRtt = {texture: undefined} // duck-typed RenderTarget
    duckRtt.texture = new DataTexture(randomData, OPTIONS.HEIGHT, OPTIONS.WIDTH, RGBAFormat, FloatType)
    duckRtt.texture.minFilter = NearestFilter
    duckRtt.texture.magFilter = NearestFilter
    duckRtt.texture.needsUpdate = true
    duckRtt.texture.generateMipmaps = false
    duckRtt.texture.flipY = false

    return duckRtt
}

export {rtt, particleMesh}
