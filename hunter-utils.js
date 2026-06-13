


function calculateNormalFromTriangle(triangle){
    let edge1 = m4.subtractVectors(triangle[1], triangle[0]);
    let edge2 = m4.subtractVectors(triangle[2], triangle[0]);
    let normal = m4.normalize(m4.cross(edge1, edge2));
    return normal;
}

function calculateNormalData(positionData){ 
    let normalData = new Float32Array(positionData.length); 

    for(let i = 0; i < positionData.length / 9; i++){
        let triangle = new Array(3);
        for(let k = 0; k < 3; k++){
            let vertex = new Float32Array(3);
            for(let h = 0; h < 3; h++){
                vertex[h] = positionData[i*9 + k*3 + h];
            }
            triangle[k] = vertex;
        }
        let normal = calculateNormalFromTriangle(triangle);
        for(let g = 0; g < 3; g++){
            for(let f = 0; f < 3; f++){
                normalData[i*9 + g*3 + f] = normal[f];
            }
        }
    }

    return normalData;

}


function meshToPositionBufferData(mesh){
    var vertices = mesh.vertices;
    var triangles = mesh.triangles;
    var positionData = new Float32Array(triangles.length * 3);

    for(var i = 0; i < triangles.length; i++){
        var index = triangles[i];
        positionData[i*3 + 0] = vertices[index].x;
        positionData[i*3 + 1] = vertices[index].y;
        positionData[i*3 + 2] = vertices[index].z;
    }

    return positionData;
}