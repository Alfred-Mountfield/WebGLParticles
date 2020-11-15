uniform sampler2D random;
uniform float timestep;
uniform float normalizeFactor;

// Thomas Attractor parameters
float a = 0.15;

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

    float dx = - a * x + sin(y);
    float dy = - a * y + sin(z);
    float dz = - a * z + sin(x);

    velocity = vec3(dx, dy, dz) * timestep;
    velocity = mix(velocity, normalize(velocity), normalizeFactor);

    gl_FragColor = vec4(velocity, 1.0);
}

