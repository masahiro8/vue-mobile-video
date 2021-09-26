const VERTEXS = [
  { pos: [218.28, 218.38], uv: [0, 0.13], norm: [0, 0, 1] },
  { pos: [218.8, 240.28], uv: [0, 0.18], norm: [0, 0, 1] },
  { pos: [221.43, 286.13], uv: [0.02, 0.31], norm: [0, 0, 1] },
  { pos: [227.39, 310.86], uv: [0.04, 0.37], norm: [0, 0, 1] },
  { pos: [236.3, 330.37], uv: [0.09, 0.42], norm: [0, 0, 1] },
  { pos: [260.61, 357.15], uv: [0.2, 0.49], norm: [0, 0, 1] },
  { pos: [272.8, 365.77], uv: [0.26, 0.51], norm: [0, 0, 1] },
  { pos: [301.2, 378.34], uv: [0.39, 0.55], norm: [0, 0, 1] },
  { pos: [321.2, 379.95], uv: [0.49, 0.55], norm: [0, 0, 1] },
  { pos: [341.3, 378.28], uv: [0.59, 0.55], norm: [0, 0, 1] },
  { pos: [370.22, 365.62], uv: [0.72, 0.51], norm: [0, 0, 1] },
  { pos: [382.58, 356.92], uv: [0.78, 0.49], norm: [0, 0, 1] },
  { pos: [407.77, 329.98], uv: [0.9, 0.42], norm: [0, 0, 1] },
  { pos: [417.15, 310.46], uv: [0.95, 0.37], norm: [0, 0, 1] },
  { pos: [423.69, 285.77], uv: [0.98, 0.3], norm: [0, 0, 1] },
  { pos: [427.3, 240.09], uv: [1, 0.18], norm: [0, 0, 1] },
  { pos: [428.22, 218.22], uv: [1, 0.13], norm: [0, 0, 1] },
  { pos: [237.91, 186.03], uv: [0.09, 0.04], norm: [0, 0, 1] },
  { pos: [247.42, 176.33], uv: [0.14, 0.02], norm: [0, 0, 1] },
  { pos: [261.85, 170.74], uv: [0.21, 0], norm: [0, 0, 1] },
  { pos: [280.53, 170.43], uv: [0.3, 0], norm: [0, 0, 1] },
  { pos: [301.92, 172.09], uv: [0.4, 0.01], norm: [0, 0, 1] },
  { pos: [345.75, 171.96], uv: [0.61, 0], norm: [0, 0, 1] },
  { pos: [367.15, 170.14], uv: [0.71, 0], norm: [0, 0, 1] },
  { pos: [385.71, 170.32], uv: [0.8, 0], norm: [0, 0, 1] },
  { pos: [399.9, 175.78], uv: [0.87, 0.01], norm: [0, 0, 1] },
  { pos: [409.1, 185.47], uv: [0.91, 0.04], norm: [0, 0, 1] },
  { pos: [323.45, 198.76], uv: [0.5, 0.08], norm: [0, 0, 1] },
  { pos: [323.28, 210.2], uv: [0.5, 0.11], norm: [0, 0, 1] },
  { pos: [323.04, 230.72], uv: [0.5, 0.16], norm: [0, 0, 1] },
  { pos: [322.69, 254.8], uv: [0.5, 0.22], norm: [0, 0, 1] },
  { pos: [294.96, 273.91], uv: [0.37, 0.27], norm: [0, 0, 1] },
  { pos: [310.17, 276.39], uv: [0.44, 0.28], norm: [0, 0, 1] },
  { pos: [322.39, 276.29], uv: [0.5, 0.28], norm: [0, 0, 1] },
  { pos: [334.8, 276.38], uv: [0.56, 0.28], norm: [0, 0, 1] },
  { pos: [350.1, 273.84], uv: [0.63, 0.27], norm: [0, 0, 1] },
  { pos: [255.32, 208.6], uv: [0.18, 0.1], norm: [0, 0, 1] },
  { pos: [265.84, 203.54], uv: [0.23, 0.09], norm: [0, 0, 1] },
  { pos: [281.47, 202.29], uv: [0.3, 0.08], norm: [0, 0, 1] },
  { pos: [296.98, 209.31], uv: [0.37, 0.1], norm: [0, 0, 1] },
  { pos: [283.15, 212.89], uv: [0.31, 0.11], norm: [0, 0, 1] },
  { pos: [267.59, 212.9], uv: [0.23, 0.11], norm: [0, 0, 1] },
  { pos: [364.93, 201.89], uv: [0.7, 0.08], norm: [0, 0, 1] },
  { pos: [380.56, 202.91], uv: [0.77, 0.09], norm: [0, 0, 1] },
  { pos: [391.18, 207.98], uv: [0.82, 0.1], norm: [0, 0, 1] },
  { pos: [378.86, 212.35], uv: [0.76, 0.11], norm: [0, 0, 1] },
  { pos: [363.24, 212.45], uv: [0.69, 0.11], norm: [0, 0, 1] },
  { pos: [349.71, 208.98], uv: [0.63, 0.1], norm: [0, 0, 1] },
  { pos: [271.34, 311.48], uv: [0.25, 0.37], norm: [0, 0, 1] },
  { pos: [290.11, 305.65], uv: [0.34, 0.36], norm: [0, 0, 1] },
  { pos: [310.21, 298.62], uv: [0.44, 0.34], norm: [0, 0, 1] },
  { pos: [322.1, 300.16], uv: [0.49, 0.34], norm: [0, 0, 1] },
  { pos: [334, 298.46], uv: [0.55, 0.34], norm: [0, 0, 1] },
  { pos: [354.1, 305.43], uv: [0.65, 0.36], norm: [0, 0, 1] },
  { pos: [372.94, 311.15], uv: [0.74, 0.37], norm: [0, 0, 1] },
  { pos: [352.79, 317.82], uv: [0.64, 0.39], norm: [0, 0, 1] },
  { pos: [333.55, 325.26], uv: [0.55, 0.41], norm: [0, 0, 1] },
  { pos: [321.9, 325.96], uv: [0.49, 0.41], norm: [0, 0, 1] },
  { pos: [310.27, 325.32], uv: [0.44, 0.41], norm: [0, 0, 1] },
  { pos: [291.3, 318], uv: [0.35, 0.39], norm: [0, 0, 1] },
  { pos: [286.68, 310.36], uv: [0.33, 0.37], norm: [0, 0, 1] },
  { pos: [304.67, 309.49], uv: [0.41, 0.37], norm: [0, 0, 1] },
  { pos: [322.02, 310.15], uv: [0.49, 0.37], norm: [0, 0, 1] },
  { pos: [339.44, 309.41], uv: [0.58, 0.37], norm: [0, 0, 1] },
  { pos: [357.89, 310.26], uv: [0.66, 0.37], norm: [0, 0, 1] },
  { pos: [340.49, 310.77], uv: [0.58, 0.37], norm: [0, 0, 1] },
  { pos: [322.09, 311.51], uv: [0.49, 0.37], norm: [0, 0, 1] },
  { pos: [303.82, 310.89], uv: [0.41, 0.37], norm: [0, 0, 1] },
  { pos: [309.84, 232.05], uv: [0.44, 0.16], norm: [0, 0, 1] },
  { pos: [296.66, 244.64], uv: [0.37, 0.2], norm: [0, 0, 1] },
  { pos: [289.06, 243.4], uv: [0.34, 0.19], norm: [0, 0, 1] },
  { pos: [281.28, 243.4], uv: [0.3, 0.19], norm: [0, 0, 1] },
  { pos: [275.14, 241.25], uv: [0.27, 0.19], norm: [0, 0, 1] },
  { pos: [256.62, 246.14], uv: [0.18, 0.2], norm: [0, 0, 1] },
  { pos: [256.88, 257.09], uv: [0.18, 0.23], norm: [0, 0, 1] },
  { pos: [258.2, 280.02], uv: [0.19, 0.29], norm: [0, 0, 1] },
  { pos: [261.17, 292.38], uv: [0.2, 0.32], norm: [0, 0, 1] },
  { pos: [343.81, 228.34], uv: [0.6, 0.15], norm: [0, 0, 1] },
  { pos: [342.25, 242.68], uv: [0.59, 0.19], norm: [0, 0, 1] },
  { pos: [349.91, 241.41], uv: [0.63, 0.19], norm: [0, 0, 1] },
  { pos: [356.67, 243.15], uv: [0.66, 0.19], norm: [0, 0, 1] },
  { pos: [364.48, 243.09], uv: [0.7, 0.19], norm: [0, 0, 1] },
  { pos: [389.16, 246.03], uv: [0.81, 0.2], norm: [0, 0, 1] },
  { pos: [388.7, 256.97], uv: [0.81, 0.23], norm: [0, 0, 1] },
  { pos: [386.9, 279.81], uv: [0.8, 0.29], norm: [0, 0, 1] },
  { pos: [383.63, 292.15], uv: [0.79, 0.32], norm: [0, 0, 1] },
];

const ORDERS = [
  [0, 1, 73],
  [73, 1, 74],
  [74, 1, 2],
  [2, 75, 74],
  [2, 3, 75],
  [3, 76, 75],
  [3, 48, 76],
  [3, 4, 48],
  [4, 5, 48],
  [5, 59, 48],
  [5, 6, 59],
  [6, 58, 59],
  [6, 7, 58],
  [7, 57, 58],
  [7, 8, 57],
  [8, 56, 57],
  [8, 9, 56],
  [9, 55, 56],
  [9, 10, 55],
  [10, 54, 55],
  [10, 11, 54],
  [11, 12, 54],
  [12, 13, 54],
  [13, 85, 54],
  [13, 14, 84],
  [13, 84, 85],
  [14, 83, 84],
  [14, 15, 83],
  [15, 82, 83],
  [15, 16, 82],
  [16, 45, 82],
  [16, 26, 45],
  [26, 25, 45],
  [25, 44, 45],
  [25, 24, 44],
  [24, 43, 44],
  [24, 23, 43],
  [23, 42, 43],
  [23, 22, 42],
  [22, 27, 42],
  [22, 21, 27],
  [21, 39, 27],
  [21, 20, 39],
  [20, 38, 39],
  [20, 19, 38],
  [19, 37, 38],
  [19, 18, 37],
  [18, 36, 37],
  [18, 17, 36],
  [17, 0, 36],
  [0, 73, 36],
  [36, 73, 41],
  [73, 72, 41],
  [72, 40, 41],
  [72, 71, 40],
  [71, 70, 40],
  [70, 39, 40],
  [70, 69, 39],
  [69, 68, 39],
  [68, 27, 39],
  [68, 28, 27],
  [68, 29, 28],
  [28, 77, 27],
  [29, 77, 28],
  [77, 42, 27],
  [77, 78, 42],
  [78, 79, 42],
  [79, 47, 42],
  [79, 80, 47],
  [80, 81, 47],
  [81, 46, 47],
  [81, 82, 46],
  [82, 45, 46],
  [82, 35, 83],
  [83, 35, 84],
  [84, 35, 85],
  [85, 35, 54],
  [54, 35, 53],
  [53, 35, 34],
  [53, 34, 52],
  [52, 34, 33],
  [52, 33, 51],
  [51, 33, 50],
  [50, 33, 32],
  [50, 32, 49],
  [49, 32, 31],
  [49, 31, 48],
  [31, 76, 48],
  [31, 75, 76],
  [31, 74, 75],
  [31, 73, 74],
  [31, 72, 73],
  [31, 71, 72],
  [31, 70, 71],
  [31, 69, 70],
  [31, 68, 69],
  [31, 29, 68],
  [31, 30, 29],
  [31, 32, 30],
  [32, 33, 30],
  [33, 34, 30],
  [34, 35, 30],
  [35, 29, 30],
  [35, 77, 29],
  [35, 78, 77],
  [35, 79, 78],
  [35, 80, 79],
  [35, 81, 80],
  [35, 82, 81],
  [48, 60, 49],
  [60, 61, 49],
  [61, 50, 49],
  [61, 62, 50],
  [62, 51, 50],
  [62, 63, 51],
  [63, 52, 51],
  [63, 64, 52],
  [64, 53, 52],
  [64, 54, 53],
  [54, 65, 55],
  [65, 56, 55],
  [65, 57, 56],
  [65, 66, 57],
  [66, 58, 57],
  [66, 67, 58],
  [67, 59, 58],
  [67, 48, 59],
  [42, 43, 47],
  [47, 43, 44],
  [47, 44, 46],
  [46, 44, 45],
  [36, 37, 41],
  [41, 37, 38],
  [41, 38, 40],
  [40, 38, 39],
  [48, 60, 67],
  [67, 60, 61],
  [67, 61, 66],
  [66, 61, 62],
  [66, 62, 65],
  [65, 62, 63],
  [65, 63, 64],
  [65, 64, 54],
];

export { VERTEXS, ORDERS };