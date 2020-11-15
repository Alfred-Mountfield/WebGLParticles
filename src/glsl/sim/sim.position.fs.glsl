uniform sampler2D initialPositions;
uniform float velocityScale;
uniform vec3 bounds;
uniform float boundaryScale;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 tmpPos = texture2D(texturePosition, uv).xyz;
    vec3 initialPos = texture2D(initialPositions, uv).xyz;
    vec3 velocity = texture2D(textureVelocity, uv).xyz;
    float tmpLife = texture2D(texturePosition, uv).w;

    vec3 pos = tmpPos;
    float life = tmpLife + 1.0;

    pos += velocity * velocityScale;
    if (any(greaterThan(abs(pos), bounds * boundaryScale))) {
        pos = initialPos;
        life = 0.0;
    }


    gl_FragColor = vec4(pos, life);
}

