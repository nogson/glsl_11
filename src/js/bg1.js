import Utile from './utile.js';

const vert = require('./shader/bg1.vert');
const frag = require('./shader/bg1.frag');
const texture = require('../assets/images/texture1.png');
const THREE = require('three-js')([]);



//THREE.js用変数
let camera;
let scene;
let light;
let mesh;
let renderTarget;

//uniform変数
let uTime = 0;

let clock = new THREE.Clock();
let aspect;
let index = 0;
let utile = new Utile();

export default class Bg1 {

  constructor(renderer,windowW,windowH) {
    this.renderer = renderer;
    this.windowW = windowW;
    this.windowH = windowH;
    aspect = this.windowW / this.windowH;
    this.init();
  }

  //初期化
  init() {

    // scene作成
    scene = new THREE.Scene();

    light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    // camera作成
    camera = new THREE.PerspectiveCamera(75, this.windowW / this.windowH, 0.1, 1000);
    camera.position.z = 1;

    //オフスクリーンレンダリング用
    renderTarget = new THREE.WebGLRenderTarget(this.windowW, this.windowH, {
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping
    });

    this.create();
    this.render();

  }

  //オブジェクトを作成
  create() {

    //Geometryを作成
    let geometry = new THREE.BufferGeometry();

    //頂点座標
    let vertices = new Float32Array([-1.0 * aspect, 1.0, 0.0,
      1.0 * aspect, 1.0, 0.0, -1.0 * aspect, -1.0, 0.0,
      1.0 * aspect, -1.0, 0.0
    ]);

    //頂点インデックス
    let index = new Uint32Array([
      0, 2, 1,
      1, 2, 3
    ]);

    let uvs = new Float32Array([
      0.0, 1.0, //1つ目の頂点のUV座標
      1.0, 1.0, //2つ目の頂点のUV座標
      0.0, 0.0, //3つ目の頂点のUV座標
      1.0, 0.0 //4つ目の頂点のUV座標
    ]);

    //頂点座標
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    //テクスチャ座標
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    //頂点のつなげ順
    geometry.setIndex(new THREE.BufferAttribute(index, 1));

    //マテリアルを設定。シェーダーファイルや、uniform変数を指定
    let material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: uTime
        },
        texture: {
          type: 't',
          value: new THREE.TextureLoader().load(texture)
        },
        resolution:{
          type:'v2',
          value:new THREE.Vector2(this.windowW,this.windowH)
        }
      },
      vertexShader: vert,
      fragmentShader: frag,
      transparent:true
    });

    mesh = new THREE.Mesh(geometry, material);

    // Meshをシーンに追加
    scene.add(mesh);
  }
  
  set windowSize (size){
    this.windowH = size.windowH;
    this.windowW = size.windowW;
  }

  get texture(){
    return renderTarget.texture;
  }

  //レンダリング
  render() {
    uTime = clock.getElapsedTime();
    mesh.material.uniforms.time.value = uTime;
    this.renderer.render(scene, camera,renderTarget);
    requestAnimationFrame(this.render.bind(this));
  }

}