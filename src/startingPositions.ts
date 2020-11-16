// random 3D co-ordinates
export function randomPositions(width: number, height: number, maxVal: number): Float32Array {
    let len = width *  height * 4
    const randomData = new Float32Array(len)

    while (len--) {
        randomData[len] = (Math.random() * 2 - 1) * maxVal
    }

    return randomData
}

// implemented from https://github.com/nicoptere/FBO/blob/master/image.html
export function loadImage(imagePath = 'src/textures/noise_4.png', bufferWidth, bufferHeight, maxVal, callback: (positions, width, height, bounds) => void) {
    const img = new Image()
    img.onload = () => {
        const positions = getPositionsFromGreyScaleImage(null, img, bufferWidth, bufferHeight, maxVal)
        const bounds = new Float32Array(3)
        bounds[0] = bounds[1] = bounds[2] = 2 * Math.max(bufferWidth, bufferHeight, maxVal)

        callback(positions, bufferWidth, bufferHeight, bounds)
    }
    img.src = imagePath
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

function getPositionsFromGreyScaleImage(canvas, img, bufferWidth, bufferHeight, elevation) {
    const ctx = getContext(canvas, bufferWidth, bufferHeight)
    ctx.drawImage(img, 0, 0, bufferWidth, bufferHeight)

    const data = ctx.getImageData(0, 0, bufferWidth, bufferHeight).data

    let len = bufferWidth * bufferHeight


    const positions = new Float32Array(len * 4)
    for (let i = 0; i < len; i++) {
        const i4 = i * 4

        positions[i4] = ((i % bufferWidth) - bufferWidth * .5)
        positions[i4 + 1]  = ( data[i4] / 0xFF * 0.299 +data[i4+1]/0xFF * 0.587 + data[i4+2] / 0xFF * 0.114 ) * elevation * 10
        positions[i4 + 2]  = ( ( i / bufferWidth ) - bufferHeight * .5 )
        positions[i4 + 3] = 0
    }

    return positions
}
