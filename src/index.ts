import {WEBGL} from "three/examples/jsm/WebGL"
import {start} from "./main";

function createRandomPositionsData(height, width) {
    let len = height * width * 4
    const randomData = new Float32Array(len)

    while (len--) {
        randomData[len] = ( Math.random() * 2 - 1 ) * 256
    }

    return randomData
}

if (WEBGL.isWebGLAvailable()) {
    const [particleBufferHeight, particleBufferWidth] = [512, 512]
    const positions = createRandomPositionsData(particleBufferHeight, particleBufferWidth)
    start(positions, particleBufferHeight, particleBufferWidth)
} else {
    const warning = WEBGL.getWebGLErrorMessage()
    document.body.appendChild(warning)
}

