@import ../common/classicnoise2D;

uniform sampler2D initialPositions;
uniform float timeToLive;
uniform bool respawnRandom;
uniform vec3 bounds;
uniform float boundaryScale;
uniform float simTime;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 tmpPos = texture2D(texturePosition, uv).xyz;
    vec3 initialPos = texture2D(initialPositions, uv).xyz;
    vec3 velocity = texture2D(textureVelocity, uv).xyz;
    float tmpLife = texture2D(texturePosition, uv).w;

    vec3 pos = tmpPos;
    float life = tmpLife + 1.0;

    pos = mix(pos, pos+velocity, 0.5);

    if (any(greaterThan(abs(pos), bounds * boundaryScale)) || timeToLive > 0.0 && life > timeToLive) {
        if (respawnRandom == true) {
            pos = vec3(cnoise(vec2(pos.z + simTime, 1)), cnoise(vec2(pos.x + simTime, 1)), cnoise(vec2(pos.y + simTime, 1))) * bounds;
        } else {
            pos = initialPos;
        }

        life = cnoise(vec2(life + simTime, 100)) * timeToLive;
    }


    gl_FragColor = vec4(pos, life);
}

