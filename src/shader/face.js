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
void main()	{
  vec4 tColor = texture2D(uTex, vUv);
  gl_FragColor = tColor;
  // gl_FragColor = vec4(0.5,0.5,0.5,0.5);
}
`;
export { VS_CODE, FS_CODE };
