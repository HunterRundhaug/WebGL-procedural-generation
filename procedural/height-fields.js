
class Vector2{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Vector3{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class BaseHeightField {
    // Public memebers
    horizontalExtents;
    verticalExtents;
    bboxMin;
    bboxMax;
    nx;
    ny;

    constructor(horizontalExtents, verticalExtents, nx, ny){
        this.horizontalExtents = horizontalExtents;
        this.verticalExtents = verticalExtents;
        this.bboxMin = new Vector2(
            -this.horizontalExtents.x / 2.0,
            -this.horizontalExtents.y / 2.0
        );
        this.bboxMax = new Vector2(
            this.horizontalExtents.x / 2.0,
            this.horizontalExtents.y / 2.0
        );
        this.nx = nx;
        this.ny = ny;
    }

    Elevation(p){
        return 0;
    }

    Vertex(i, j, nx, ny){
        let cellDiagonal = new Vector2(
            this.horizontalExtents.x / (nx - 1),
            this.horizontalExtents.y / (ny - 1),
        );
        let p = new Vector2(
            this.bboxMin.x + i * cellDiagonal.x,
            this.bboxMin.y + j * cellDiagonal.y
        );
        return new Vector3(
            p.x,
            this.Elevation(i, j),
            p.y
        );
    }
}

class ProceduralHeightField extends BaseHeightField {
    // these values are used in the perlin noise generation
    grids; // grid used for gradient field in perlin noise.
    base_grid_w;
    base_grid_h;
    seed; // random seed for grid creation
    max_octives;
    octives;
    persistance;
    amplitude;
    constructor(horizontalExtents, verticalExtents, nx, ny){
        super(horizontalExtents, verticalExtents, nx, ny);
        this.max_octives = 8;
        this.base_grid_w = 10;
        this.base_grid_h = 10;
        this.seed = 67;
        this.grids = [];
        this.octives = 4;
        this.persistance = 0.1;
        this.amplitude = 0.6;
        this.CreateOctives();
    }

    setPersistance(newP){
        this.persistance = newP;
    }

    setAmplitude(newA){
        this.amplitude = newA;
    }

    setOctives(newO){
        if(newO > this.max_octives){
            this.octives = this.max_octives;
        }
        else{
            this.octives = newO;
        }
    }

    setSeed(newS){
        this.seed = newS;
        this.grids = [];
        this.CreateOctives();
    }

    getAmplitude(){
        return this.amplitude;
    }

    getPersistance(){
        return this.persistance;
    }

    getOctives(){
        return this.octives;
    }

    getSeed(){
        return this.seed;
    }


    CreateOctives(){    
        for(let i = 0; i < this.max_octives; i++){
            let gw = this.base_grid_w * (2 ** i);
            let gh = this.base_grid_h  * (2 ** i);
            this.grids.push(
                {
                    grid: initalizeGrid(gw, gh, this.seed),
                    grid_w: gw,
                    grid_h: gh,
                });
        }
    }
    
    getDataObject(grid_i){
        return {
            grid: this.grids[grid_i].grid,
            grid_w: this.grids[grid_i].grid_w,
            grid_h: this.grids[grid_i].grid_h,
            texture_w: this.nx,
            texture_h: this.ny,
            octives: this.octives,
        }; 
    }

    // Compute the altitude of a 2D point procedurally
    Elevation(x, y) {
        // return Math.cos(p.x) + Math.cos(p.y);
        let maxy = 2;
        let amp = this.amplitude;

        let value = 0;
        for(let i = 0; i < this.octives; i++){
            let dataObject = this.getDataObject(i)
            value += getGridPointValue(x, y, dataObject) * amp;
            amp *= this.persistance;
        }

        if(value > maxy){
            value = maxy;
        }
        else if(value < -maxy){
            value = -maxy;
        }

        return value;
         
    }
}