import {WEBGL} from "three/examples/jsm/WebGL"
import {start} from "./main";

if (WEBGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    start()
} else {
    const warning = WEBGL.getWebGLErrorMessage()
    document.body.appendChild(warning)
}

