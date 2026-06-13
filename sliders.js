
var xSlider = document.getElementById("x-slider");
var ySlider = document.getElementById("y-slider");
var rotZSlider = document.getElementById("rot-z-slider");
var scaleXSlider = document.getElementById("scale-x-slider");
var scaleYSlider = document.getElementById("scale-y-slider");

var camRotHorizontal = document.getElementById("cam-rot");
var camRotVertical = document.getElementById("cam-rot-vert");
var camRad = document.getElementById("cam-rad");

var octives = document.getElementById("octives-slider");
var noiseAmplitude = document.getElementById("amplitude-slider");
var persistance = document.getElementById("persistance-slider");
var seed = document.getElementById("seed-input");

window.initSliders = function initSliders(opts) {
  var canvas = opts.canvas;
  var translation = opts.translation;
  var rotation = opts.rotation;
  var scale = opts.scale;
  var drawScene = opts.drawScene;
  camera = opts.camera;
  var heightField = opts.heightField;
  var updateGeometryAndDrawScene = opts.updateGeometryAndDrawScene;



  if (xSlider) {
    xSlider.addEventListener("input", function (event) {
      translation[0] = Number(event.target.value);
      drawScene();
    });
  }


  if (ySlider) {
    ySlider.max = String(Math.max(0, canvas.height - 30));
    ySlider.addEventListener("input", function (event) {
      translation[1] = Number(event.target.value);
      drawScene();
    });
  }


  if (rotZSlider) {
    rotZSlider.addEventListener("input", function (event) {
      rotation[1] = Number(event.target.value) * Math.PI / 180;
      drawScene();
    });
  }


  if (scaleXSlider) {
    scaleXSlider.addEventListener("input", function (event) {
      scale[0] = Number(event.target.value);
      drawScene();
    });
  }


  if (scaleYSlider) {
    scaleYSlider.addEventListener("input", function (event) {
      scale[1] = Number(event.target.value);
      drawScene();
    });
  }



  if (camRotHorizontal) {
    camRotHorizontal.addEventListener("input", function (event) {
      camera.angleRadians[0] = Number(event.target.value);
      drawScene();
    });
  }



  if (camRotVertical) {
    camRotVertical.addEventListener("input", function (event) {
      camera.angleRadians[1] = Number(event.target.value);
      drawScene();
    });
  }


  if (camRad) {
    camRad.max = String(Math.max(100, 600));
    camRad.addEventListener("input", function (event) {
      camera.radius = Number(event.target.value);
      drawScene();
    });
  }


  if (noiseAmplitude) {
    noiseAmplitude.addEventListener("input", function (event) {
      heightField.setAmplitude(Number(event.target.value));
      updateGeometryAndDrawScene();
    });
  }

  if (persistance) {
    persistance.addEventListener("input", function (event) {
      heightField.setPersistance(Number(event.target.value));
      updateGeometryAndDrawScene();
    });
  }


  if (octives) {
    octives.addEventListener("input", function (event) {
      heightField.setOctives(Math.floor(Number(event.target.value)));
      updateGeometryAndDrawScene();
    });
  }

  if (seed) {
    seed.addEventListener("input", function (event) {
      heightField.setSeed(Math.floor(Number(event.target.value)));
      updateGeometryAndDrawScene();
    });
  }
};

function setSliders(values){
  let heightField = values.heightField;
  noiseAmplitude.value = heightField.getAmplitude();
  persistance.value = heightField.getPersistance();
  octives.value = heightField.getOctives();
  seed.value = heightField.getSeed();
}

