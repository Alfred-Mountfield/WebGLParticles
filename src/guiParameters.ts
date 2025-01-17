import {GUI} from "dat.gui";

export enum startingShapes {
    "random",
    "noise_1.jpg",
    "noise_2.jpg",
    "noise_3.jpg",
    "noise_4.png"
}

export enum simulations {
    "gravity",
    "aizawaAttractor",
    "dadrasAttractor",
    "dequanAttractor",
    "lorenzAttractor",
    "lorenzModTwoAttractor",
    "thomasAttractor",
    "threeScrollAttractor",
}

export const parameters = {
    // dynamically changeable
    "Time Step": 0.1,
    "Normalize Factor": 0.0,
    "Movement": false,
    "Point Size": 2.0,
    "Boundary Scale": 3.0,
    "Particle Time to Live": 1200.0,
    "Random New Particles": false,

    // requires simulation restart
    "Simulation Type": `${simulations.thomasAttractor}`,
    "Texture Size (Particles)": "256", // Drop-down input coerces it to string, so set it to string by default to avoid bugs
    "Maximum Value": 7,
    "Render with Triangles": false,
    "Triangles Scale": 1,
    "Starting Shape": `${startingShapes["noise_4.png"]}` // Drop-down input coerces it to string, so set it to string by default to avoid bugs
}

// inspired by https://github.com/mrdoob/three.js/blob/master/examples/webgl_gpgpu_protoplanet.html
export function initGUI(onChange: () => void, restartSimulation: () => void, resetCamera: () => void) {
    const gui = new GUI({width: 400})

    const resetCameraButton = {
        "Reset Camera": () => resetCamera()
    }

    gui.add(resetCameraButton, "Reset Camera")

    const dynamicFolder = gui.addFolder("Dynamic Parameters")
    dynamicFolder.add(parameters, "Normalize Factor", 0.0, 1, 0.01).onChange(onChange)
    dynamicFolder.add(parameters, "Time Step", 0.01, 1, 0.001).onChange(onChange)
    dynamicFolder.add(parameters, "Movement").onChange(onChange).listen()
    dynamicFolder.add(parameters, "Point Size", 1.0, 10.0, 1).onChange(onChange)
    dynamicFolder.add(parameters, "Boundary Scale", 0.1, 200.0, 0.1).onChange(onChange)
    dynamicFolder.add(parameters, "Particle Time to Live", 0, 60*30, 5).onChange(onChange)
    dynamicFolder.add(parameters, "Random New Particles").onChange(onChange)

    const staticFolder = gui.addFolder("Static Parameters (Requires Simulation Restart)")
    staticFolder.add(parameters,"Simulation Type", {
        "Gravity": simulations.gravity,
        "Aizawa Attractor": simulations.aizawaAttractor,
        "Dadras Attractor": simulations.dadrasAttractor,
        "Dequan Attractor": simulations.dequanAttractor,
        "Lorenz Attractor": simulations.lorenzAttractor,
        "Lorenz Mod Two Attractor": simulations.lorenzModTwoAttractor,
        "Thomas Attractor": simulations.thomasAttractor,
        "Three Scroll Unified Chaotic System Attractor": simulations.threeScrollAttractor,
    })
    staticFolder.add(parameters, "Texture Size (Particles)", {
        "1": 1,
        "4": 2,
        "16": 4,
        "128^2 (16,384)": 128,
        "256^2 (65,536)": 256,
        "512^2 (262,144)": 512,
        "1024^2 (1,048,576)": 1024,
        "2048^2 (4,194,304)": 2048,
        "4096^2 (16,777,216)": 4096,
        "8192^2 (67,108,864)": 8192
    })
    staticFolder.add(parameters, "Maximum Value", -100, 100, 0.01)
    staticFolder.add(parameters, "Render with Triangles")
    staticFolder.add(parameters, "Triangles Scale", 0.1, 10, 0.1)
    staticFolder.add(parameters, 'Starting Shape', {
        "Random Box": startingShapes.random,
        "Perlin Noise": startingShapes["noise_1.jpg"], // todo update
        "Simplex Noise": startingShapes["noise_2.jpg"],
        "Watery Noise": startingShapes["noise_3.jpg"],
        "Water Drops": startingShapes["noise_4.png"]
    })

    const restartButton = {
        "Restart Simulation": () => restartSimulation()
    }
    staticFolder.add( restartButton, 'Restart Simulation' )

    staticFolder.open()
    dynamicFolder.open()
}


