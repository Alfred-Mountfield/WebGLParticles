//basic simulation: displays the particles in place.

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(texturePosition, uv).xyz;
    gl_FragColor = vec4(pos, 1.0);
}

