// const VS_CODE = `
// void main()	{
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `;

// const FS_CODE = `
// uniform vec3 vec3Faces[86];
// uniform vec2 screenUV;

// void main()	{
//   int l = 86;
//   for (int i = 0; i < l; i++) {
//     float distance = sqrt( pow(vec3Faces[i].x - gl_FragCoord.x, 2.) + pow(gl_FragCoord.y - vec3Faces[i].y, 2.));
//     float i_float = float(i);

//     float r = 0.;
//     float g = 0.;
//     float b = 0.;

//     //りんかく
//     r = (i>=0&&i<=16)?1.0/15. * (16. - i_float):r;
//     g = (i>=0&&i<=16)?1.0/15. * (16. - i_float):g;
//     b = (i>=0&&i<=16)?1.0/15. * (16. - i_float):b;

//     //まゆ
//     r = (i>=17&&i<=21)?1.0/5. * (i_float - 17.):0.0;
//     g = (i>=22&&i<=26)?1.0/5. * (i_float - 22.):0.0;

//     //め
//     r = (i>=36&&i<=41)?1.0/5. * (i_float-36.):r;
//     g = (i>=42&&i<=46)?1.0/5. * (i_float-42.):g;

//     //はな
//     r = (i>=27&&i<=35)?1.0/9. * (i_float-26.):r;

//     //くち
//     r = (i>=48&&i<=67)?1.0/19. * (i_float-48.):r;
//     g = (i>=48&&i<=67)?1.0/19. * (67. - i_float):g;

//     //追加
//     r = (i>=68&&i<=85)?1.0/27. * (95. - i_float):r;
//     g = (i>=68&&i<=85)?1.0/27. * (95. - i_float):g;
//     b = (i>=68&&i<=85)?1.0/27. * (95. - i_float):b;

//     if(distance < 5.) {
//       gl_FragColor = vec4(r,g,b,1.);
//     }
//   }
// }
// `;

// const FS_CODE = `
// void main()	{
//   gl_FragColor = vec4(0.5,0.5,0.5,0.5);
// }
// `;

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
