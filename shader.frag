precision mediump float;

uniform vec2  iResolution;
uniform float iGlobalTime;
uniform sampler2D uWaveform;

vec2 doModel(vec3 p);

#pragma glslify: raytrace  = require('glsl-raytrace', map = doModel, steps = 10)
#pragma glslify: getNormal = require('glsl-sdf-normal', map = doModel)
#pragma glslify: smin      = require('glsl-smooth-min')
#pragma glslify: camera    = require('glsl-turntable-camera')
#pragma glslify: noise     = require('glsl-noise/simplex/4d')
#pragma glslify: audio     = require('gl-audio-analyser')

vec2 doModel(vec3 p) {
  float amplitude = audio(uWaveform, gl_FragCoord.x / iResolution.x) * 3.;

  float r  = 1.0 - noise(vec4(iGlobalTime, p)) * 0.75 * amplitude;
  float d  = length(p) - r;
  float id = 2.0;

  return vec2(d, id);
}

void main() {
  float amplitude = audio(uWaveform, gl_FragCoord.x / iResolution.x) * 3.;
  float amp2 = gl_FragCoord.x / iResolution.x;
  float amp3 = gl_FragCoord.y / iResolution.y;
  float amp4 = gl_FragCoord.y / iResolution.x;
  vec3 color = vec3(sin(fract(iGlobalTime)*0.0002 ), sin(fract(iGlobalTime)*0.02000001),sin(mix(iGlobalTime*0.345, amplitude, amp2)));
  vec3 ro, rd;
  // vec3 color = vec3(0.0);
  float rotation = iGlobalTime * 0.8;
  float height   = 0.0;
  float dist     = 4.0;
  camera(rotation, cos(iGlobalTime)+height, sin(amplitude)+dist, iResolution.xy, ro, rd);

  vec2 t = raytrace(ro, rd);
  if (t.x > -0.5) {
    vec3 pos = ro + rd * t.x;
    vec3 nor = getNormal(pos);
    
    float fnoise = noise(vec4(iGlobalTime, vec3(amplitude*iGlobalTime)));

    // color = vec3(sin(iGlobalTime), cos(iGlobalTime), sin(iGlobalTime)) * 0.5 + 0.5;
    color = cos(log(iGlobalTime)*log2(nor)*exp(nor)) * 0.5 +0.5;
  }

  gl_FragColor.rgb = color;
  gl_FragColor.a   = 1.0;
}