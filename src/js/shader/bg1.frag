#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 vUv;
uniform sampler2D texture;

const float PI  = 3.141592653589793;
const float PI2 = PI * 2.;

//円の距離関数
float circle(vec2 p) {
   return length(p);
}

//正方形の距離関数
float square(vec2 p){
	return max(abs(p.x),abs(p.y));
}

//正方形の距離関数
float square2(vec2 p){
	return abs(p.x) + abs(p.y);
}

//多角形の距離関数(星の形状でも利用する)
float lPolygon(vec2 p,int n){
  float a = atan(p.x,p.y)+PI;
  float r = PI2/float(n);
  return cos(floor(.5+a/r)*r-a)*length(p);
}

//星の距離関数
mat2 mRotate(float a){
 float c=cos(a);
 float s=sin(a);
 return mat2(c,-s,s,c);
}

float lStarPolygon(vec2 p,int n,float o){
 return (lPolygon(p,n) - lPolygon(p * mRotate(PI2 / float(n) / 2.),n) * o) / (1.-o);
}

//リングの距離関数
float ring(vec2 p, float radius, float width) {
  return abs(length(p) - radius * 0.5) - width;
}

float getShape(vec2 p, int i) {
    if (i == 0) {
        return circle(p);
    } else if (i == 1) {
        return square(p);
    } else if (i == 2) {
        return lStarPolygon(p,5,.6)* 1.5;
    } else if (i == 3) {
        return square2(p);
    } else {
        return lPolygon(p,3) * 1.5;
    }
}

void main() {
   vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    float t0 = mod(time , 5.0);
    float t1 = mod(time + 1.0, 5.0);
    int i0 = int(floor(t0));
    int i1 = int(floor(t1));
    float f = fract(t0);

   float d = mix(getShape(p,i0), getShape(p,i1), f);
   vec3 color = vec3(smoothstep(0.5,0.51,d*1.5));
   gl_FragColor = vec4(color, 1.0);
}






