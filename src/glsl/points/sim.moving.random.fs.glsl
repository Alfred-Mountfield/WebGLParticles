@import ./classicnoise2D;

varying vec2 vUv;
uniform sampler2D positions;
uniform sampler2D initialPositions;
uniform sampler2D random;

uniform vec3 bounds;
uniform float time;

void main() {

    vec3 pos = texture2D(positions, vUv).xyz;
    vec3 initialPos = texture2D(initialPositions, vUv).xyz;
    float random = texture2D(random, vUv).x;

    vec3 velocity = vec3(cnoise(vec2(pos.z + time / 3.0, 50)), cnoise(vec2(pos.x + time / 5.0, 50)), cnoise(vec2(pos.y + time / 7.0, 50)));
    if (all(equal(vec3(0), velocity))) {
        velocity = vec3(-1.0, -1.0, -1.0);
    }
    velocity = normalize(velocity);

    pos += velocity * 0.1;

    if (any(greaterThan(abs(pos), bounds))) {
        pos = initialPos;
    }

    gl_FragColor = vec4(pos, 1.0);
}

