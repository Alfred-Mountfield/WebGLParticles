import {WEBGL} from "three/examples/jsm/WebGL"
import {start} from "./points/main";

function randomPositions() {
    const [particleBufferWidth, particleBufferHeight] = [512, 512]
    const maxVal = 50
    const positions = createRandomPositionsData(particleBufferWidth, particleBufferHeight, maxVal)
    const bounds = new Float32Array(3)
    bounds[0] = bounds[1] = bounds[2] = 2 * maxVal
    start(positions, particleBufferWidth, particleBufferHeight, bounds)
}

// implemented from https://github.com/nicoptere/FBO/blob/master/image.html
function loadImage(imagePath = 'src/images/noise_4.png') {
    const img = new Image()
    img.onload = () => {
        const width = img.width
        const height = img.height

        const elevation = 30
        const positions = getPositionsFromGreyScaleImage(null, img, width, height, elevation)
        const bounds = new Float32Array(3)
        bounds[0] = bounds[1] = bounds[2] = 2 * Math.max(width, height, elevation)

        start(positions, width, height, bounds)
    }
    img.src = imagePath
}

// random 3D co-ordinates
function createRandomPositionsData(width: number, height: number, maxVal: number): Float32Array {
    let len = width *  height * 4
    const randomData = new Float32Array(len)

    while (len--) {
        randomData[len] = (Math.random() * 2 - 1) * maxVal
    }

    return randomData
}

function getCanvas(w, h) {
    const canvas = document.createElement("canvas")
    canvas.width = w || 512
    canvas.height = h || 512
    return canvas
}

function getContext(canvas, w, h) {
    canvas = canvas || getCanvas(w, h)
    canvas.width = w || canvas.width
    canvas.height = h || canvas.height
    return canvas.getContext("2d")
}

function getPositionsFromGreyScaleImage(canvas, img, width, height, elevation) {
    const ctx = getContext(canvas, width, height)
    ctx.drawImage(img, 0, 0)

    const data = ctx.getImageData(0, 0, width, height).data

    let l = (width * height)

    const positions = new Float32Array(l * 4)
    for (let i = 0; i < l; i++) {
        const i4 = i * 4
        positions[i4] = ((i % width) - width * .5)
        positions[i4 + 1]  = ( data[i4] / 0xFF * 0.299 +data[i4+1]/0xFF * 0.587 + data[i4+2] / 0xFF * 0.114 ) * elevation
        positions[i4 + 2]  = ( ( i / width ) - height * .5 )
        positions[i4 + 3] = 0
    }

    return positions
}


if (WEBGL.isWebGLAvailable()) {
    // loadImage()
    randomPositions()

} else {
    const warning = WEBGL.getWebGLErrorMessage()
    document.body.appendChild(warning)
}

