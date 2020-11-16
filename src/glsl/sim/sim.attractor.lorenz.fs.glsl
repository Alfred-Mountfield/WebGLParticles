// inspired from https://fusefactory.github.io/openfuse/strange%20attractors/particle%20system/Strange-Attractors-GPU/

uniform float normalizeFactor;
uniform sampler2D random;
uniform float timestep;

// Lorenz Attractor parameters
float a = 10.0;
float b = 28.0;
float c = 2.6666666667;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(texturePosition, uv).xyz;

    // Previous positions
    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx = (a * (y - x));
    float dy = (x * (b - z) - y);
    float dz = ((x * y) - (c * z));

    vec3  velocity = vec3(dx, dy, dz) * timestep * 0.1;
    velocity = mix(velocity, normalize(velocity), normalizeFactor);

    gl_FragColor = vec4(velocity, 1.0);
}

