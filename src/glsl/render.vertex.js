// currently copied from http://barradeau.com/blog/?p=621
export default /* glsl */`
//float texture containing the positions of each particle
uniform sampler2D positions;


void main() {

    //the mesh is a nomrliazed square so the uvs = the xy positions of the vertices
    vec3 pos = texture2D( positions, position.xy ).xyz;

    //pos now contains the position of a point in space taht can be transformed
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

    gl_PointSize = 3.0;
}
`
