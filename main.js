"use strict";

// js init - - -
console.log("working...");
let canvas = document.getElementById("c");
let gl = canvas.getContext("webgl");
if (!gl) {
    console.log("NO WEB GL");
}

function main() {
    

    // create and compile shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_1);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_1);
    console.log("Compiled shaders.");

    // create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    console.log("Created program");

    // lookup position attrib location
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    // and color
    var colorLocation = gl.getAttribLocation(program, "a_color");
    // matrix 
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    // normal
    var normalAttribLocation = gl.getAttribLocation(program, "a_normal");
    // dynamic color
    var colorUniformLocation = gl.getUniformLocation(program, "u_color");
    // lighting/color mode (diffuse or visualize normals)
    var colorModeUniform = gl.getUniformLocation(program, "u_colorMode");
    // light position (used for lighting calculations)
    var lightPositionUniform = gl.getUniformLocation(program, "u_lightPosition");

    // Procedural setup
    let nx = 100; 
    let ny = 100;
    var heightField = new ProceduralHeightField(new Vector2(20, 20), new Vector2(-4, 4), nx, ny);
    var mesh = CreateHeightFieldMesh(heightField, nx, ny);
    var geometry = meshToPositionBufferData(mesh);

    var positionBuffer = gl.createBuffer();
    setPositionBuffer(positionBuffer, geometry);

    var normalBuffer = gl.createBuffer();
    setNormalBuffer(normalBuffer, geometry);

    var translation = [0, 0, -80];
    var rotation = [degToRad(0), degToRad(0), degToRad(0)];
    var scale = [10, 10, 10];
    //var color = [Math.random(), Math.random(), Math.random(), 1];

    var mesh_color = {
        r: 0.3,
        g: 0.6,
        b: 1.0,
        a: 1
    };

    var color_mode = {
        diffuse: true,
    };

    var lightPosition = {
        x: 100,
        y: 100,
        z: 10,
    }

    // camera                  
    let camera = new Camera([0, 0, 0], [0, 0, -80], 200, [0, 0.5], 
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        1, 2000,
    );
    var fieldOfViewRadians = degToRad(60);

    let sliderValues = {
        heightField: heightField,
        terrainSize: nx,
    };
    setSliders(sliderValues);

    if (window.initSliders) {
        window.initSliders({
            canvas: gl.canvas,
            translation: translation,
            rotation: rotation,
            scale: scale,
            drawScene: drawScene,
            camera: camera,
            heightField: heightField,
            setTerrainSize: setTerrainSize,
            updateGeometryAndDrawScene: updateGeometryAndDrawScene,
            mesh_color: mesh_color,
            color_mode: color_mode,
            lightPosition: lightPosition,
        });
    }

    function setPositionBuffer(positionBuffer, geometry){
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // put geometry data into buffer
        setGeometry(gl, geometry);
    }

    function setNormalBuffer(normalBuffer, geometry){
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        let normalData = calculateNormalData(geometry);
        gl.bufferData(gl.ARRAY_BUFFER, normalData, gl.DYNAMIC_DRAW);
    }

    function updateGeometryAndDrawScene(){
        var mesh = CreateHeightFieldMesh(heightField, nx, ny);
        geometry = meshToPositionBufferData(mesh);
        setPositionBuffer(positionBuffer, geometry);
        setNormalBuffer(normalBuffer, geometry);
        drawScene();
    }

    function setTerrainSize(size){
        nx = size;
        ny = size;
        heightField.nx = nx;
        heightField.ny = ny;
        updateGeometryAndDrawScene();
    }

    // drawScene() call at bottom so nothing can be undefined

    function drawScene() {

        //gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // tell webgl how to convert from clip space to screen space.
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // clear canvas
        gl.clearColor(0, 0, 1, 0.8);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // use our shader program
        gl.useProgram(program);

        // turn on position attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // bind the position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);


        // set color 
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        setColors(gl);

        if (colorLocation >= 0) {
            gl.enableVertexAttribArray(colorLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.vertexAttribPointer(
                colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0
            );
        }

        if (normalAttribLocation >= 0) {
            gl.enableVertexAttribArray(normalAttribLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            gl.vertexAttribPointer(
                normalAttribLocation, 3, gl.FLOAT, false, 0, 0
            );
        }

        // matrix math
        var modelMatrix = m4.identity();
        modelMatrix = m4.translate(modelMatrix, translation[0], translation[1], translation[2]);
        modelMatrix = m4.xRotate(modelMatrix, rotation[0]);
        modelMatrix = m4.yRotate(modelMatrix, rotation[1]);
        modelMatrix = m4.zRotate(modelMatrix, rotation[2]);
        modelMatrix = m4.scale(modelMatrix, scale[0], scale[1], scale[2]);

        var projectionMatrix = m4.perspective(fieldOfViewRadians, camera.aspect, camera.zNear, camera.zFar);

        var up = [0, 1, 0];
        camera.rotateCameraAroundLookat();
        var cameraMatrix = m4.lookAt(camera.position, camera.lookatPoint, up);
        var viewMatrix = m4.inverse(cameraMatrix);
        
        // transform objects to invserse of camera matrix
        var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
        var finalMatrix = m4.multiply(viewProjectionMatrix, modelMatrix);

        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, finalMatrix);

        var m_r = mesh_color.r;
        var m_g = mesh_color.g;
        var m_b = mesh_color.b;
        gl.uniform4f(colorUniformLocation, m_r, m_g, m_b, 1.0);

        gl.uniform1i(colorModeUniform, color_mode.diffuse);
        gl.uniform3f(lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = geometry.length / 3;
        gl.drawArrays(primitiveType, offset, count);
      
    }

    function degToRad(num){
        return num * Math.PI / 180;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    function createShader(gl, type, source) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    drawScene();
}

main();
