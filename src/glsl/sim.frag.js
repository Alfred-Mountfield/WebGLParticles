// currently copied from http://barradeau.com/blog/?p=621
export default /* glsl */`
//basic simulation: displays the particles in place.
uniform sampler2D positions;
varying vec2 vUv;
void main() {

    vec3 pos = texture2D( positions, vUv ).rgb;
    gl_FragColor = vec4( pos,1.0 );
}
`
