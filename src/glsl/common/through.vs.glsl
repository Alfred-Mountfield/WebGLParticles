precision highp float;

varying vec2 vUv;

void main() {
    vUv = vec2(uv.x, uv.y);
	gl_Position = vec4( position, vec2(1.0) );

}
