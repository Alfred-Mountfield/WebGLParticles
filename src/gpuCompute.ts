import {GPUComputationRenderer, Variable} from "three/examples/jsm/misc/GPUComputationRenderer"
import {DataTexture, HalfFloatType, RepeatWrapping, Texture, WebGLRenderer, WebGLRenderTarget} from "three"

import sim_static_frag from "./glsl/sim/sim.position.fs.glsl"
import sim_gravity_frag from "./glsl/sim/sim.velocity.fs.glsl"
import {parameters} from "./guiParameters";

let gpuCompute: GPUComputationRenderer,
    dtPosition: Texture, dtInitialPosition: Texture, dtVelocity: Texture,
    positionVariable: Variable, velocityVariable:Variable,
    positionUniforms, velocityUniforms
let time = 0

export function init(webGLRenderer: WebGLRenderer, bufferWidth, bufferHeight, initialPositions: Float32Array, bounds) {
    gpuCompute = new GPUComputationRenderer(bufferWidth, bufferHeight, webGLRenderer)

    if (isSafari()) {
        gpuCompute.setDataType(HalfFloatType)
    }

    dtPosition = gpuCompute.createTexture()
    dtInitialPosition = gpuCompute.createTexture()
    dtVelocity = gpuCompute.createTexture()

    fillTextures(dtPosition, initialPositions)
    fillTextures(dtInitialPosition, initialPositions)

    positionVariable = gpuCompute.addVariable("texturePosition", sim_static_frag, dtPosition)
    positionVariable.wrapS = RepeatWrapping
    positionVariable.wrapT = RepeatWrapping

    positionUniforms = positionVariable.material.uniforms
    positionUniforms["initialPositions"] = {value: dtInitialPosition}
    positionUniforms["velocityScale"] = {value: parameters["Velocity Scale"]}
    positionUniforms["time"] = {value: time}
    positionUniforms["bounds"] = {value: bounds}
    positionUniforms["move"] = {value: parameters["Movement"]}

    velocityVariable = gpuCompute.addVariable("textureVelocity", sim_gravity_frag, dtVelocity)
    velocityVariable.wrapS = RepeatWrapping
    velocityVariable.wrapT = RepeatWrapping

    const randomVals = new Float32Array(bufferWidth * bufferHeight) // give each particle a random seed
    for (let i = 0; i < bufferWidth * bufferHeight; i++) {
        randomVals[i] = Math.random() - 0.5
    }

    velocityUniforms = velocityVariable.material.uniforms
    velocityUniforms["random"] = {value: randomVals}

    gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] )
    gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] )

    const error = gpuCompute.init()
    if (error !== null) {
        console.error( error )
    }
}

// @ts-ignore
export const getPositionTexture = () => gpuCompute.getCurrentRenderTarget(positionVariable).texture

export function update() {
    time += 1
    positionUniforms["time"] = {value: time}
    gpuCompute.compute()
}

export function updateParameters() {
    positionUniforms["velocityScale"] = {value: parameters["Velocity Scale"]}
    positionUniforms["move"] = {value: parameters["Movement"]}
}

export function dispose() {
    positionVariable.renderTargets.forEach((rt: WebGLRenderTarget) => {
        rt.texture.dispose()
        rt.dispose()
    })
    dtPosition.dispose()
}

function fillTextures(dtPosition: DataTexture, initialPositions: Float32Array) {
    const posArray = dtPosition.image.data
    if (posArray.length !== dtPosition.image.data.length) throw Error("Starting Positions array is malformed")

    for (let i = 0; i < posArray.length; i++) {
        posArray[i] = initialPositions[i]
    }

}

function isSafari() {
    return !!navigator.userAgent.match(/Safari/i) && !navigator.userAgent.match(/Chrome/i)
}
