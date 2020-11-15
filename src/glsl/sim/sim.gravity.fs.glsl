@import ../common/classicnoise2D;

uniform sampler2D random;
uniform float timestep;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(texturePosition, uv).xyz;
    float random = texture2D(random, uv).x;

    vec3 velocity = vec3(0, -9.8, 0) * timestep;

    gl_FragColor = vec4(velocity, 1.0);
}

