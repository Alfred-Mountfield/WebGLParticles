precision highp float;

uniform sampler2D positions;
varying vec2 vUv;

void main() {

	gl_FragColor = texture2D( positions, vUv );

}

