// inspired from https://fusefactory.github.io/openfuse/strange%20attractors/particle%20system/Strange-Attractors-GPU/

uniform float normalizeFactor;
uniform sampler2D random;
uniform float timestep;

// Lorenz Mod 2 Attractor parameters
float a = 0.9;
float b = 5.0;
float c = 9.9;
float d = 1.0;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(texturePosition, uv).xyz;

    // Previous positions
    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx = (- (a * x) + (y * y) - (z * z) + (a * c)) * timestep;
    float dy = (x * (y - (b * z)) + d)  * timestep;
    float dz = (-z + x * ((b * y) + z))  * timestep;

    vec3 velocity = vec3(dx, dy, dz) * timestep * 0.1;
    velocity = mix(velocity, normalize(velocity), normalizeFactor);

    gl_FragColor = vec4(velocity, 1.0);
}

