@import ../common/classicnoise2D;

uniform sampler2D random;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(texturePosition, uv).xyz;
    float random = texture2D(random, uv).x;

//    vec3 velocity = vec3(cnoise(vec2(pos.z + time / 3.0, 50)), cnoise(vec2(pos.x + time / 5.0, 50)), cnoise(vec2(pos.y + time / 7.0, 50)));
//    if (all(equal(vec3(0), velocity))) {
//        velocity = vec3(-1.0, -1.0, -1.0);
//    }
//    velocity = normalize(velocity);
    vec3 velocity = vec3(0, -1, 0);

    gl_FragColor = vec4(velocity, 1.0);
}

