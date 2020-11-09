import {WEBGL} from "three/examples/jsm/WebGL"
import {start} from "./main";

function randomPositions() {
    const [particleBufferHeight, particleBufferWidth] = [512, 512]
    const positions = createRandomPositionsData(particleBufferHeight, particleBufferWidth)
    start(positions, particleBufferHeight, particleBufferWidth)
}

// implemented from https://github.com/nicoptere/FBO/blob/master/image.html
function loadImage(imagePath = 'src/images/noise_3.jpg') {
    const img = new Image()
    img.onload = () => {
        const height = img.height
        const width = img.width

        const elevation = 30
        const positions = getPositionsFromGreyScaleImage(null, img, height, width, elevation)


        start(positions, height, width)
    }
    img.src = imagePath
}

// random 3D co-ordinates
function createRandomPositionsData(height, width) {
    let len = height * width * 4
    const randomData = new Float32Array(len)

    while (len--) {
        randomData[len] = (Math.random() * 2 - 1) * 1024
    }

    return randomData
}

function getCanvas(h, w) {
    const canvas = document.createElement("canvas")
    canvas.height = h || 512
    canvas.width = w || 512
    return canvas
}

function getContext(canvas, h, w) {
    canvas = canvas || getCanvas(h, w)
    canvas.height = h || canvas.height
    canvas.width = w || canvas.width
    return canvas.getContext("2d")
}

function getPositionsFromGreyScaleImage(canvas, img, height, width, elevation) {
    const ctx = getContext(canvas, height, width)
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
    loadImage()
    // randomPositions()

} else {
    const warning = WEBGL.getWebGLErrorMessage()
    document.body.appendChild(warning)
}

