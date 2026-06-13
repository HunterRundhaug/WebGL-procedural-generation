

// basic 3D triangle mesh data structure
class Mesh{
    vertices = null;
    normals = null;
    triangles = null;

    constructor(vertices, normals, triangles){
        this.vertices = vertices;
        this.normals = normals;
        this.triangles = triangles;
    }
}

// Create and return a 3D mesh representing a heightField
function CreateHeightFieldMesh(hf, nx, ny) {
    var vertices = [];

    // Create vertices
    for(var i = 0; i < nx; i++){
        for(var j = 0; j < ny; j++){
            vertices.push(hf.Vertex(i, j, nx, ny));
            // push normals maybe in future
        }
    }

    var triangles = [];
    // Compute triangle indices
    for (var i = 0; i < nx - 1; i++) {
        for (var j = 0; j < ny - 1; j++) {
            // Triangle 1
            triangles.push(i * ny + j);
            triangles.push((i + 1) * ny + j + 1);
            triangles.push((i + 1) * ny + j);

            triangles.push(i * ny + j);
            triangles.push(i * ny + j + 1);
            triangles.push((i + 1) * ny + j + 1);
        }
    }

    return new Mesh(vertices, null, triangles);
}