// currently copied from http://barradeau.com/blog/?p=621

attribute vec2 reference;
//float texture containing the positions of each particle
uniform sampler2D texturePosition;

void main() {
    vec3 pos = texture2D( texturePosition, reference ).xyz; // position of the particle
    vec3 newPosition = position; // position of the triangle's vertex

    newPosition = mat3( modelMatrix ) * newPosition;

    newPosition += pos; // move the triangle according to the position of the particle
    gl_Position = projectionMatrix * viewMatrix * vec4( newPosition, 1.0 );

}

