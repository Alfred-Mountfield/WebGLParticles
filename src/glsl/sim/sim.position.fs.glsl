uniform sampler2D initialPositions;
uniform float velocityScale;
uniform float time;
uniform vec3 bounds;
uniform bool move;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(texturePosition, uv).xyz;
    vec3 position = pos;

    if (move) {
        vec3 initialPos = texture2D(initialPositions, uv).xyz;
        vec3 velocity = texture2D(textureVelocity, uv).xyz;

        position += velocity * velocityScale;
        if (any(greaterThan(abs(position), bounds))) {
            position = initialPos;
        }
    }

    gl_FragColor = vec4(position, 1.0);
}

