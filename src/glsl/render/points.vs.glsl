// currently copied from http://barradeau.com/blog/?p=621

//float texture containing the positions of each particle
uniform sampler2D positions;
uniform float pointSize;

void main() {

    //the mesh is a normalized square so the uvs = the xy positions of the vertices
    vec3 pos = texture2D( positions, position.xy ).xyz;

    //pos now contains the position of a point in space taht can be transformed
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

    gl_PointSize = pointSize;
}

