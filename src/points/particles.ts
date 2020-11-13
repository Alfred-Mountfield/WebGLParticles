import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Points,
    ShaderMaterial,
    Texture,
} from "three";
import render_vertex from "../glsl/points/render.vs.glsl";
import render_frag from "../glsl/common/render.fs.glsl";

let mesh, renderMaterial

export async function init(width, height) {
    setupShaders()

    const particleVertices = new Float32Array((width * height) * 3)
    for (let i = 0; i < (width * height); i++) {
        particleVertices[i * 3] = (i % width) / width
        particleVertices[i * 3 + 1] = (i / width) / height
    }

    const particleGeometry = new BufferGeometry()
    particleGeometry.setAttribute('position', new BufferAttribute(particleVertices, 3))

    mesh = new Points(particleGeometry, renderMaterial)
}

export function update(newPositions: Texture) {
    mesh.material.uniforms.positions.value = newPositions
}

function setupShaders() {
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
}

export {mesh}
