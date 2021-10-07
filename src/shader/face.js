const VS_CODE = `
varying vec2 vUv;

void main()	{
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FS_CODE = `
varying vec2 vUv;
uniform sampler2D defaultTexture;
uniform sampler2D cheekTexture;
uniform sampler2D lipTexture;
uniform sampler2D eyeshadowTexture1;
uniform vec3 defaultColor;
uniform vec3 lipColor;
uniform vec3 cheekColor;
uniform vec3 eyeshadowColor;
uniform float lipOpacity;
uniform float cheekOpacity;
uniform float eyeshadowOpacity;

void main()	{

  vec4 defaultTex = texture2D( defaultTexture, vUv ).rgba;
  vec4 lipTex = texture2D( lipTexture, vUv ).rgba;
  vec4 cheekTex = texture2D( cheekTexture, vUv ).rgba;
  vec4 eyeshadowTex = texture2D( eyeshadowTexture1, vUv ).rgba;

  vec4 eyeshadow = vec4(eyeshadowColor,eyeshadowTex.a) * eyeshadowOpacity;
  vec4 cheek = vec4(cheekColor,cheekTex.a) * cheekOpacity;
  vec4 lip = vec4(lipColor,lipTex.a) * lipOpacity;

  vec4 isEyeshadow = vec4(1.0) - step(vec4(eyeshadowTex.a),vec4(0));
  vec4 isCheek = vec4(1.0) - step(vec4(cheekTex.a),vec4(0));
  vec4 isLip = vec4(1.0) - step(vec4(lipTex.a),vec4(0));

  gl_FragColor = mix(mix(mix(vec4(0),lip,isLip),cheek,isCheek),eyeshadow,isEyeshadow);
}
`;
export { VS_CODE, FS_CODE };
