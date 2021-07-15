varying vec2 vUv;
uniform float time;
uniform float uProgress;
uniform vec4 uCorners;
uniform vec2 uResolution;
uniform vec2 uQuadSize;

varying vec2 vSize;
void main(){
    vUv = uv;

    float PI = 3.1415926;
    float sine = sin(PI*uProgress);
    float waves = sine * 0.1 * sin(5. * length(uv) + 5. * uProgress);
    vec4 defaultState = modelMatrix*vec4( position, 1.0 );
    vec4 fullScreenState = vec4(position, 1.0);

    fullScreenState.x *= uResolution.x/uQuadSize.x;
    fullScreenState.y *= uResolution.y/uQuadSize.y;

    float cornersProgress = mix(

        mix(uCorners.z, uCorners.w, uv.x),
        mix(uCorners.x, uCorners.y, uv.x),
        uv.y
        );

    vec4 finalState = mix(defaultState, fullScreenState, cornersProgress);
    //calculate the size of the model
    vSize = mix(uQuadSize, uResolution, uProgress);

    gl_Position = projectionMatrix * viewMatrix * finalState;
}