


const vertex_shader_1 = `
    
    attribute vec4 a_position;
    attribute vec4 a_color;
    attribute vec4 a_normal;

    uniform mat4 u_matrix;
    

    varying vec4 v_color;

    void main(){
        gl_Position = u_matrix * a_position;

        v_color = vec4(a_normal.xyz * 0.5 + 0.5 + vec3(0.05), 1.0);

    }       
`

const fragment_shader_1 = `

    precision mediump float;

    varying vec4 v_color;

    void main() {

        gl_FragColor = v_color;
    }
        
`