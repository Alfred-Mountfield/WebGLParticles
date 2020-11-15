import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Points,
    ShaderMaterial,
    Texture,
} from "three";
import render_vertex from "../glsl/render/points.vs.glsl";
import render_frag from "../glsl/render/fs.glsl";
import {parameters} from "../guiParameters";

let mesh: Points, renderMaterial: ShaderMaterial, geometry: BufferGeometry

export async function init(width, height) {
    setupShaders()

    // we have to supply a position array so might as well use it for references
    // create a normalized square so that x, y is the uv
    const references = new Float32Array((width * height) * 3)
    for (let i = 0; i < (width * height); i++) {
        references[i * 3] = (i % width) / width
        references[i * 3 + 1] = (i / width) / height
    }

    geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(references, 3))

    mesh = new Points(geometry, renderMaterial)
}

export function update(newPositions: Texture) {
    // @ts-ignore
    mesh.material.uniforms.texturePosition.value = newPositions
}

export function updateParameters() {
    renderMaterial.uniforms["pointSize"] = {value: parameters["Point Size"] * 1.0}
}

export function dispose() {
    geometry.dispose()
    renderMaterial.dispose()
}

function setupShaders() {
    renderMaterial = new ShaderMaterial({
        uniforms: {
            texturePosition: {
                value: null,
            },
            pointSize: {
                value: parameters["Point Size"] * 1.0
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
