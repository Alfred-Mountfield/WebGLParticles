import {GPUComputationRenderer, Variable} from "three/examples/jsm/misc/GPUComputationRenderer"
import {DataTexture, HalfFloatType, RepeatWrapping, Texture, WebGLRenderer, WebGLRenderTarget} from "three"

import {parameters, simulations} from "./guiParameters";
import positionSimFragShader from "./glsl/sim/sim.position.fs.glsl"
import gravitySimFragShader from "./glsl/sim/sim.gravity.fs.glsl"
import lorenzAttractorSimFragShader from "./glsl/sim/sim.lorenzAttractor.fs.glsl"
import aizawaAttractorSimFragShader from "./glsl/sim/sim.aizawaAttractor.fs.glsl"
import thomasAttractorSimFragShader from "./glsl/sim/sim.thomasAttractor.fs.glsl"

let gpuCompute: GPUComputationRenderer,
    dtPosition: Texture, dtInitialPosition: Texture, dtVelocity: Texture,
    positionVariable: Variable, velocityVariable:Variable,
    positionUniforms, velocityUniforms
let simTime = 0

export function init(webGLRenderer: WebGLRenderer, bufferWidth, bufferHeight, initialPositions: Float32Array, bounds) {
    let velocityShader = getVelocityShader()

    gpuCompute = new GPUComputationRenderer(bufferWidth, bufferHeight, webGLRenderer)

    if (isSafari()) {
        gpuCompute.setDataType(HalfFloatType)
    }

    dtPosition = gpuCompute.createTexture() // (x,y,z) pos + (w) time of life of particle
    dtInitialPosition = gpuCompute.createTexture()
    dtVelocity = gpuCompute.createTexture()

    fillPositionTextures(dtPosition, initialPositions)
    fillPositionTextures(dtInitialPosition, initialPositions)

    positionVariable = gpuCompute.addVariable("texturePosition", positionSimFragShader, dtPosition)
    positionVariable.wrapS = RepeatWrapping
    positionVariable.wrapT = RepeatWrapping

    positionUniforms = positionVariable.material.uniforms
    positionUniforms["initialPositions"] = {value: dtInitialPosition}
    positionUniforms["timeToLive"] = {value: parameters["Particle Time to Live"]}
    positionUniforms["respawnRandom"] = {value: parameters["Random New Particles"]}
    positionUniforms["simTime"] = {value: simTime}
    positionUniforms["bounds"] = {value: bounds}
    positionUniforms["boundaryScale"] = {value: parameters["Boundary Scale"]}

    velocityVariable = gpuCompute.addVariable("textureVelocity", velocityShader, dtVelocity)
    velocityVariable.wrapS = RepeatWrapping
    velocityVariable.wrapT = RepeatWrapping

    const randomVals = new Float32Array(bufferWidth * bufferHeight) // give each particle a random seed
    for (let i = 0; i < bufferWidth * bufferHeight; i++) {
        randomVals[i] = Math.random() - 0.5
    }

    velocityUniforms = velocityVariable.material.uniforms
    velocityUniforms["random"] = {value: randomVals}
    velocityUniforms["timestep"] = {value: parameters["Time Step"]}
    velocityUniforms["normalizeFactor"] = {value: parameters["Normalize Factor"]}

    gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] )
    gpuCompute.setVariableDependencies( velocityVariable, [ velocityVariable, positionVariable ] )

    const error = gpuCompute.init()
    if (error !== null) {
        console.error( error )
    }

    gpuCompute.compute()
}

// @ts-ignore
export const getPositionTexture = () => gpuCompute.getCurrentRenderTarget(positionVariable).texture

export function update() {
    if (parameters["Movement"]) {
        simTime += 1

        positionUniforms["simTime"] = {value: simTime}

        gpuCompute.compute()
    }
}

export function updateParameters() {
    positionUniforms["timeToLive"] = {value: parameters["Particle Time to Live"]}
    positionUniforms["respawnRandom"] = {value: parameters["Random New Particles"]}
    positionUniforms["boundaryScale"] = {value: parameters["Boundary Scale"]}

    velocityUniforms["timestep"] = {value: parameters["Time Step"]}
    velocityUniforms["normalizeFactor"] = {value: parameters["Normalize Factor"]}
}

export function dispose() {
    simTime = 0
    positionVariable.renderTargets.forEach((rt: WebGLRenderTarget) => {
        rt.texture.dispose()
        rt.dispose()
    })
    velocityVariable.renderTargets.forEach((rt: WebGLRenderTarget) => {
        rt.texture.dispose()
        rt.dispose()
    })
    dtPosition.dispose()
    dtVelocity.dispose()
}

function fillPositionTextures(dtPosition: DataTexture, initialPositions: Float32Array) {
    const posArray = dtPosition.image.data
    if (posArray.length !== dtPosition.image.data.length) throw Error("Starting Positions array is malformed")

    for (let i = 0; i < posArray.length; i++) {
        if ((i + 1) % 4) {
            posArray[i] = initialPositions[i]
        } else {
            posArray[i] = Math.random() * 1000
        }
    }

}

function getVelocityShader() {
    switch(parameters["Simulation Type"]) {
        case `${simulations.gravity}`:
            return gravitySimFragShader
        case `${simulations.lorenzAttractor}`:
            return lorenzAttractorSimFragShader
        case `${simulations.aizawaAttractor}`:
            return aizawaAttractorSimFragShader
        case `${simulations.thomasAttractor}`:
            return thomasAttractorSimFragShader
        default:
            throw Error("Unknown Simulation Type")
    }
}

function isSafari() {
    return !!navigator.userAgent.match(/Safari/i) && !navigator.userAgent.match(/Chrome/i)
}
