precision highp float;

varying vec2 vUv;
uniform sampler2D uTex1;
uniform float time;

void main() {
  vec4 texture1 = texture2D(uTex1, vec2(vUv.x, vUv.y));

  gl_FragColor = texture1;
 
}
