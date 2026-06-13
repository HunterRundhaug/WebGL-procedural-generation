
function normalize2D(vector){
    let length = vector.x * vector.x + vector.y * vector.y;
    if (length > 0.00001){
        vector.x = vector.x / length;
        vector.y = vector.y / length;
    }
    return vector;
} 

function dot2D(vec1, vec2){
    return vec1.x * vec2.x + vec1.y * vec2.y;
}

function fade(t) {
	return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
	let r = a + (b - a) * t;
    return r;
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function createRandomUnitVector(rand){

    let vector = {
        x: (rand() * 2 - 1),
        y: (rand() * 2 - 1),
    };

    vector = normalize2D(vector);

    return vector;
}

function initalizeGrid(grid_w, grid_h, seed){

    let rand = mulberry32(seed);

    let grid = [];
    for(let y = 0; y <= grid_h; y++){
        let row = []
        for(let x = 0; x <= grid_w; x++){
            row.push(createRandomUnitVector(rand));
        }
        grid.push(row);
    }
    return grid;
}

function getGridPointValue(x, y, dataObject){

    // texture to grid space coordinates
    let gx = (x / dataObject.texture_w) * dataObject.grid_w;
    let gy = (y / dataObject.texture_h) * dataObject.grid_h;

    // coordinates for 4 vectors in cell
    let x0 = Math.floor(gx);
    let y0 = Math.floor(gy);
    let x1 = x0 + 1;
    let y1 = y0 + 1;

    let grid = dataObject.grid;
    // get gradient vectors from grid
    let g00 = grid[y0][x0];
    let g10 = grid[y0][x1];
    let g01 = grid[y1][x0];
    let g11 = grid[y1][x1];

    // points local position inside cell 
    let sx = gx - x0;
    let sy = gy - y0;

    // compute distance vectors from each gradient vector in cell
    let d00 = {x: sx, y: sy};
    let d10 = {x: sx - 1, y: sy};
    let d01 = {x: sx, y: sy - 1};
    let d11 = {x: sx - 1, y: sy - 1};

    // dot distances with gradients
    let n00 = dot2D(g00, d00);
    let n10 = dot2D(g10, d10);
    let n01 = dot2D(g01, d01);
    let n11 = dot2D(g11, d11);

    // interpolate horizontally on top row and bottom row, then interpolate vertically
    let u = fade(sx);
    let v = fade(sy);
    let nx0 = lerp(n00, n10, u);
    let nx1 = lerp(n01, n11, u);
    let value = lerp(nx0, nx1, v);
    return value;
}

function createNoiseTexture(dataObject){
    let imageData = dataObject.imageData.data;
    for(let i = 0; i < dataObject.texture_w; i++){
        for(let j = 0; j < dataObject.texture_h; j++){
            // map p(x, y) to grid space and calculate rgba color value.
            let base = (i * dataObject.texture_w + j) * 4;
            let value = getGridPointValue(j, i, dataObject);
            let color = Math.floor((value * 0.5 + 0.5) * 255);
            imageData[base] = color;
            imageData[base + 1] = color;
            imageData[base + 2] = color;
            imageData[base + 3] = 255;
        }
    }
}

function addNoiseToTexture(dataObject){
    let imageData = dataObject.imageData.data;
    for(let i = 0; i < dataObject.texture_w; i++){
        for(let j = 0; j < dataObject.texture_h; j++){
            // map p(x, y) to grid space and calculate rgba color value.
            let base = (i * dataObject.texture_w + j) * 4;
            let value = getGridPointValue(j, i, dataObject);
            let color = Math.floor((value * 0.5 + 0.5) * 255);
            imageData[base] += color * dataObject.persistance;
            imageData[base + 1] += color * dataObject.persistance;
            imageData[base + 2] += color * dataObject.persistance;
            imageData[base + 3] = 255;
        }
    }
}

function main(){
    // vector grid
    var grid = [];
    const grid_w = 5;
    const grid_h = 5;

    const texture_w = 500;
    const texture_h = 500;

    let canvas = document.getElementById("c");
    let ctx = canvas.getContext('2d');
    let imageData = ctx.createImageData(texture_w, texture_h);
    canvas.width = texture_w;
    canvas.height = texture_h;

    let seed = 67;

    // First initalize the random vector grid
    grid = initalizeGrid(grid_w, grid_h, seed);

    let dataObject = {
        grid: grid,
        grid_w: grid_w,
        grid_h: grid_h,
        texture_w: texture_w,
        texture_h: texture_h,
        imageData: imageData,
    };
    createNoiseTexture(dataObject);

    var octives = 4;
    var persistance = 0.3;
    dataObject.persistance = persistance;
    for(let i = 0; i < octives - 1; i++){
        dataObject.grid_w = dataObject.grid_w * (i + 2);
        dataObject.grid_h = dataObject.grid_h  * (i + 2);
        dataObject.grid = initalizeGrid(dataObject.grid_w, dataObject.grid_h, seed);
        addNoiseToTexture(dataObject);
        dataObject.persistance *= persistance;
    }
    

    ctx.putImageData(imageData, 0, 0);

}





main();