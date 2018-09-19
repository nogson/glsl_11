
varying vec2 vUv;

void main() {
  // 処理する頂点ごとのuv(テクスチャ)座標をそのままfragmentShaderに横流しする
  vUv = uv;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}