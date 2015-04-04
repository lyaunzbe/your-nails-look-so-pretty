var Analyser    = require('gl-audio-analyser');
var canvas   = document.body.appendChild(document.createElement('canvas'))
var fit      = require('canvas-fit')

// var gl = require('gl-context')(canvas, render);

// var scale = window.devicePixelRatio || 1;

// window.addEventListener('resize', require('canvas-fit')(canvas, null, scale), false);

// var analyser = Analyser(gl, audio);
// var start  = Date.now();

// var POINTS = 25000 *4;
// var data   = new Float32Array(POINTS);

// var nails = VAO(gl, [{
//   buffer: Buffer(gl, data), 
//   size: 2.0, 
//   type: gl.FLOAT
// }]);

// var shader = glslify({
//     vert: './shader.vert', 
//     frag: './shader.frag'
// })(gl);
var gl  = require('gl-context')(canvas, render);

var audio    = new Audio();
var analyser = Analyser(gl, audio);
require('soundcloud-badge')({
  client_id: 'ded451c6d8f9ff1c62f72523f49dab68',
  song: 'https://soundcloud.com/hokosounds/hot-sugar-your-nails-look-so-pretty-hs018',
  getFonts: true,
  dark: false
}, function(err, src, data) {
  if (err){
    throw err;
  }
  audio.src  = src;
  audio.loop = true;
  audio.addEventListener('canplay', function() {
    audio.play();
  }, false);
});

var triangle = require('a-big-triangle')
var Shader = require('gl-shader')
var glslify   = require('glslify');

var start = Date.now();
window.addEventListener('resize', fit(canvas, window, window.devicePixelRatio*.55), false);


var shader = Shader(gl, 
  glslify('./shader.vert'),
  glslify('./shader.frag')
);


function render() {
  var width = gl.drawingBufferWidth;
  var height = gl.drawingBufferHeight;
  gl.viewport(0, 0, width, height);

  shader.bind();
  shader.uniforms.iResolution = [gl.drawingBufferWidth, gl.drawingBufferHeight];
  shader.uniforms.iGlobalTime = (Date.now() - start) / 1000;
  shader.uniforms.uWaveform   = analyser.bindWaveform(0);
  console.log(shader.uniforms.uWaveform );

  triangle(gl);
}