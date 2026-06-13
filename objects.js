

class Camera{
    constructor(position, lookatPoint, radius, angleRadians ,aspect, zNear, zFar){
        this.position = position;
        this.lookatPoint = lookatPoint;
        this.radius = radius;
        this.aspect = aspect;
        this.zNear = zNear;
        this.zFar = zFar;
        this.angleRadians = angleRadians; // [2], used to calculate an orbit around the lookat
    }

    // orbits camera position around lookatPoint using spherical coords
    rotateCameraAroundLookat(){
        var radius = this.radius;
        var theta = this.angleRadians[0];  // horizontal
        var phi   = this.angleRadians[1];  // vertical

        this.position = [
            this.lookatPoint[0] + radius * Math.cos(phi) * Math.sin(theta),
            this.lookatPoint[1] + radius * Math.sin(phi),
            this.lookatPoint[2] + radius * Math.cos(phi) * Math.cos(theta),
        ];
    }
}
