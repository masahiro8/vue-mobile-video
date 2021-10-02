const VS_CODE = `
varying vec2 vUv;

void main()	{
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FS_CODE = `
uniform sampler2D uTex;
varying vec2 vUv;
uniform float r;
uniform float g;
uniform float b;

void main()	{
  vec4 color = texture2D( uTex, vUv ).rgba;
  gl_FragColor = vec4(r,g,b,color.a);
}
`;
export { VS_CODE, FS_CODE };
