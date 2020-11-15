// inspired from https://fusefactory.github.io/openfuse/strange%20attractors/particle%20system/Strange-Attractors-GPU/

uniform sampler2D random;
uniform bool move;

// Lorenz Attractor parameters
float a = 10.0;
float b = 28.0;
float c = 2.6666666667;

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

    float dx = (a * (y - x))   * life;
    float dy = (x * (b-z) - y) * life;
    float dz = (x*y - c*z)     * life;

    velocity = vec3(dx, dy, dz) * 0.00001;

    gl_FragColor = vec4(velocity, 1.0);
}

