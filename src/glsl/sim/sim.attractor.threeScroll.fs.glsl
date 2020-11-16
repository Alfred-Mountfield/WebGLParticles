// inspired from https://fusefactory.github.io/openfuse/strange%20attractors/particle%20system/Strange-Attractors-GPU/

uniform float normalizeFactor;
uniform sampler2D random;
uniform float timestep;

// Three Scroll Unified Chaotic System Attractor parameters
float a = 40.0;
float b = 0.833;
float c = 20.0;
float d = 0.5;
float e = 0.65;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(texturePosition, uv).xyz;

    // Previous positions
    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx = (a * (y - x) + (d * x * z)) * timestep * 0.1 ;
    float dy = ((c * y) - (x * z) ) * timestep * 0.1 ;
    float dz = ((b * z) + (x * y) - (e * x * x)) * timestep * 0.1 ;

    vec3  velocity = vec3(dx, dy, dz) * timestep * 0.1;
    velocity = mix(velocity, normalize(velocity), normalizeFactor);

    gl_FragColor = vec4(velocity, 1.0);
}

