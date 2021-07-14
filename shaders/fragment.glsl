uniform sampler2D uTexture;
uniform float uProgress;
varying vec2 vUv;

void main(){
    vec4 myimage = texture(uTexture, vUv);
    gl_FragColor = vec4(uProgress, 0., 0., 1.);
    gl_FragColor = myimage;
}