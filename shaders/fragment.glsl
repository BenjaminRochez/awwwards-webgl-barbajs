uniform sampler2D uTexture;
varying vec2 vUv;

void main(){
    vec4 myimage = texture(uTexture, vUv);
    gl_FragColor = vec4(1., 1., 0., 1.);
    gl_FragColor = myimage;
}