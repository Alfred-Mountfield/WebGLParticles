import {GPUComputationRenderer, Variable} from "three/examples/jsm/misc/GPUComputationRenderer"
import {DataTexture, HalfFloatType, RepeatWrapping, WebGLRenderer} from "three"

import sim_frag from "./glsl/points/sim.static.fs.glsl"
// import sim_frag from "./glsl/points/sim.moving.random.fs.glsl"

let gpuCompute: GPUComputationRenderer, positionVariable: Variable, positionUniforms
let time = 0

export function init(webGLRenderer: WebGLRenderer, bufferWidth, bufferHeight, initialPositions, bounds) {
    gpuCompute = new GPUComputationRenderer(bufferWidth, bufferHeight, webGLRenderer)

    if (isSafari()) {
        gpuCompute.setDataType(HalfFloatType)
    }

    const dtPosition = gpuCompute.createTexture()
    // const dtVelocity = gpuCompute.createTexture()

    fillTextures(dtPosition, initialPositions)

    // const velocityVariable = gpuCompute.addVariable("textureVelocity", )
    positionVariable = gpuCompute.addVariable("texturePosition", sim_frag, dtPosition)

    positionVariable.wrapS = RepeatWrapping
    positionVariable.wrapT = RepeatWrapping

    const randomVals = new Float32Array(bufferWidth * bufferHeight)
    for (let i = 0; i < bufferWidth * bufferHeight; i++) {
        randomVals[i] = Math.random() - 0.5
    }

    positionUniforms = positionVariable.material.uniforms
    positionUniforms["textureInitialPosition"] = {value: initialPositions}
    positionUniforms["time"] = {value: time}
    positionUniforms["bounds"] = {value: bounds}
    positionUniforms["random"] = {value: randomVals}

    gpuCompute.setVariableDependencies( positionVariable, [ positionVariable ] )

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
