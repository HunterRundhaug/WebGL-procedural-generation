
var xSlider = document.getElementById("x-slider");
var ySlider = document.getElementById("y-slider");
var rotZSlider = document.getElementById("rot-z-slider");
var scaleXSlider = document.getElementById("scale-x-slider");
var scaleYSlider = document.getElementById("scale-y-slider");
var colorRSlider = document.getElementById("color-r-slider");
var colorGSlider = document.getElementById("color-g-slider");
var colorBSlider = document.getElementById("color-b-slider");

var camRotHorizontal = document.getElementById("cam-rot");
var camRotVertical = document.getElementById("cam-rot-vert");
var camRad = document.getElementById("cam-rad");

var octives = document.getElementById("octives-slider");
var noiseAmplitude = document.getElementById("amplitude-slider");
var persistance = document.getElementById("persistance-slider");
var seed = document.getElementById("seed-input");
var terrainSize = document.getElementById("terrain-size-slider");

var sliderReadoutFormatters = {
  "terrain-size-slider": function (value) {
    return value + " x " + value;
  },
};

function formatSliderValue(input) {
  var value = Number(input.value);
  var formatter = sliderReadoutFormatters[input.id];

  if (formatter) {
    return formatter(Math.floor(value));
  }

  if (input.step && input.step !== "1") {
    return value.toFixed(2);
  }

  return String(Math.floor(value));
}

function setupSliderReadout(input) {
  if (!input) {
    return;
  }

  var row = input.closest(".slider-row");
  if (!row) {
    return;
  }

  var readout = row.querySelector(".value-readout");
  if (!readout) {
    readout = document.createElement("span");
    readout.className = "value-readout";
    row.appendChild(readout);
  }

  function updateReadout() {
    readout.textContent = formatSliderValue(input);
  }

  input.addEventListener("input", updateReadout);
  updateReadout();
}

function setupSliderReadouts() {
  var sliders = document.querySelectorAll('.slider-row input[type="range"]');
  sliders.forEach(setupSliderReadout);
}

window.initSliders = function initSliders(opts) {
  var canvas = opts.canvas;
  var translation = opts.translation;
  var rotation = opts.rotation;
  var scale = opts.scale;
  var drawScene = opts.drawScene;
  camera = opts.camera;
  var heightField = opts.heightField;
  var setTerrainSize = opts.setTerrainSize;
  var updateGeometryAndDrawScene = opts.updateGeometryAndDrawScene;
  var mesh_color = opts.mesh_color;

  let mouseDown = false;

  canvas.addEventListener("mousedown", () => {
      mouseDown = true;
  });

  canvas.addEventListener("mouseup", () => {
      mouseDown = false;
  });

  canvas.addEventListener("mousemove", (event) => {
    if (!mouseDown){
      return;
    }
    const rect = canvas.getBoundingClientRect();

    const middleX = rect.left + rect.width / 2;
    const middleY = rect.top + rect.height / 2;

    const x = event.clientX - middleX;
    const y = event.clientY - middleY;

    final_pos_x = 0.005 * -x;
    final_pos_y = 0.005 * y;
    
    camera.angleRadians[0] =  final_pos_x
    camera.angleRadians[1] =  final_pos_y
    camRotHorizontal.value = final_pos_x;
    camRotHorizontal.dispatchEvent(new Event("input", { bubbles: true }));
    camRotVertical.value = final_pos_y;
    camRotHorizontal.dispatchEvent(new Event("input", { bubbles: true }));
    drawScene();
  });


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

  if (colorRSlider) {
    colorRSlider.addEventListener("input", function (event) {
      mesh_color.r = Number(event.target.value);
      drawScene();
    });
  }

  if (colorGSlider) {
    colorGSlider.addEventListener("input", function (event) {
      mesh_color.g = Number(event.target.value);
      drawScene();
    });
  }

  if (colorBSlider) {
    colorBSlider.addEventListener("input", function (event) {
      mesh_color.b = Number(event.target.value);
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

  if (terrainSize && setTerrainSize) {
    terrainSize.addEventListener("input", function (event) {
      setTerrainSize(Math.floor(Number(event.target.value)));
    });
  }

  setupSliderReadouts();
};

function setSliders(values){
  let heightField = values.heightField;
  noiseAmplitude.value = heightField.getAmplitude();
  persistance.value = heightField.getPersistance();
  octives.value = heightField.getOctives();
  seed.value = heightField.getSeed();

  if (terrainSize) {
    terrainSize.value = values.terrainSize;
  }
}

