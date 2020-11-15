// inspired from https://fusefactory.github.io/openfuse/strange%20attractors/particle%20system/Strange-Attractors-GPU/

uniform sampler2D random;
uniform bool move;

// Aizawa Attractor parameters
float a = 0.95;
float b = 0.7;
float c = 0.6;
float d = 3.5;
float e = 0.25;
float f = 0.1;

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

    float dx = ((z-b) * x - d*y) * life;
    float dy = (d * x + (z-b) * y) *life;
    float dz = (c + a*z - ((z*z*z) / 3.0) - (x*x) + f * z * (x*x*x)) * life;

    velocity = vec3(dx, dy, dz) * 0.00001;

    gl_FragColor = vec4(velocity, 1.0);
}

