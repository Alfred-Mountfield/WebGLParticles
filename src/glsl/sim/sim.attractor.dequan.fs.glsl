// inspired from https://fusefactory.github.io/openfuse/strange%20attractors/particle%20system/Strange-Attractors-GPU/

uniform sampler2D random;
uniform float timestep;
uniform float normalizeFactor;

// Dequan Attractor parameters
float a = 40.0;
float b = 1.833;
float c = 0.16;
float d = 0.65;
float e = 55.0;
float f = 20.0;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(texturePosition, uv).xyz;

    // Previous positions
    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx = (a * (y - x) + (c * x * z)) * timestep;
    float dy = ((e * x) + (f * y) - (x * z)) * timestep;
    float dz = ((b * z) + (x * y) - (d * x * x)) * timestep;

    vec3  velocity = vec3(dx, dy, dz) * timestep;
    velocity = mix(velocity, normalize(velocity), normalizeFactor);

    gl_FragColor = vec4(velocity, 1.0);
}

