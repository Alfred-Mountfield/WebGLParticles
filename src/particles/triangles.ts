import {BufferAttribute, BufferGeometry, DoubleSide, Mesh, ShaderMaterial, Texture,} from "three";
import render_vertex from "../glsl/triangles/render.vs.glsl";
import render_frag from "../glsl/common/render.fs.glsl";

let mesh: Mesh, renderMaterial: ShaderMaterial, geometry: BufferGeometry

export async function init(width, height, scale=1) {
    setupShaders()

    const triangles = (width * height)  // triangle per particle
    const points = triangles * 3 // three points per triangle

    const verticesLength = points * 3 // x,y,z coords per point
    const vertices = new Float32Array(verticesLength)

    for (let i = 0; i < triangles; i++) {
        const triangleVertices = [
            -1, -1, 1,
            1, -1, 1,
            1, 1, 1
        ]
        for (let j = 0; j < triangleVertices.length; j++) {
            vertices[i * triangleVertices.length + j] = triangleVertices[j]
        }
    }

    const referencesLength = points * 2
    const references = new Float32Array(referencesLength)

    for (let i = 0; i < triangles; i++) {
        const refX = (i % width) / width
        const refY = (i / width) / height
        const triangleIndex = i * 6
        for (let j = 0; j < 3; j++) { // for each point
            references[triangleIndex + (j * 2)] = refX
            references[triangleIndex + (j * 2) + 1] = refY
        }
    }

    geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(vertices, 3))
    geometry.setAttribute('reference', new BufferAttribute(references, 2))
    geometry.scale(scale / 10, scale / 10, scale / 10)

    geometry.rotateZ(Math.PI * (3/4))

    mesh = new Mesh(geometry, renderMaterial)
    mesh.matrixAutoUpdate = false
    mesh.updateMatrix()
}

export function update(newPositions: Texture) {
    // @ts-ignore
    mesh.material.uniforms.texturePosition.value = newPositions
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
            }
        },
        vertexShader: render_vertex,
        fragmentShader: render_frag,
        side: DoubleSide,
        // blending: AdditiveBlending,
        // transparent: true,
        // fog: false,
        // lights: false,
        // depthWrite: false,
        // depthTest: false
    })
}

export {mesh}
