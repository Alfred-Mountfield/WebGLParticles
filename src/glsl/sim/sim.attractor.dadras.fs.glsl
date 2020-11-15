// inspired from https://fusefactory.github.io/openfuse/strange%20attractors/particle%20system/Strange-Attractors-GPU/

uniform sampler2D random;
uniform float timestep;
uniform float normalizeFactor;

// Dadras Attractor parameters
float a = 3.0;
float b = 2.7;
float c = 1.7;
float d = 2.0;
float e = 9.0;


void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(texturePosition, uv).xyz;
    vec3 vel = texture2D(textureVelocity, uv).xyz;
    float life = texture2D(texturePosition, uv).w;
    float random = texture2D(random, uv).x;

    vec3 velocity = vel;

    // Previous positions
    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx = (y - (a * x) + (b * y * z)) * timestep;
    float dy = ((c * y) - (x * z) + z) * timestep;
    float dz = ((d * x *y ) - (e*z)) * timestep;

    velocity = vec3(dx, dy, dz) * timestep;
    velocity = mix(velocity, normalize(velocity), normalizeFactor);

    gl_FragColor = vec4(velocity, 1.0);
}

