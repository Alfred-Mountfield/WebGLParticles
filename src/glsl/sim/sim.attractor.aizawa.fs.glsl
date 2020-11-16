// inspired from https://fusefactory.github.io/openfuse/strange%20attractors/particle%20system/Strange-Attractors-GPU/

uniform sampler2D random;
uniform float timestep;
uniform float normalizeFactor;

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

    // Previous positions
    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx = ((z-b) * x - d*y);
    float dy = (d * x + (z-b) * y);
    float dz = (c + a*z - (z*z*z) / 3.0) - (x*x + y*y)*(1.0+e*z) + f * z * (x*x*x);

    vec3 velocity = vec3(dx, dy, dz) * timestep;
    velocity = mix(velocity, normalize(velocity), normalizeFactor);

    gl_FragColor = vec4(velocity, 1.0);
}

