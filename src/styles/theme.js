const pixelToRem = (size) => `${size / 16}rem`;

const fontSizes = {
  xs: pixelToRem(12),
  sm: pixelToRem(14),
  md: pixelToRem(16),
  lg: pixelToRem(18),
  xl: pixelToRem(20),
  xxl: pixelToRem(24),
  xxxl: pixelToRem(32),
};

const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// ${({ theme }) => theme.colors.ANTIQUE_WHITE};

const colors = {
  BONE: '#d6c6b2',
  BONE2: '#dfd8cd',
  TEA_GREEN: '#c9dbaa',
  SHEEN_GREEN: '#96d01c',
  LIZARD_GREEN: '#a2ee00',
  ANTIQUE_WHITE: '#f5ebda',
  FLORAL_WHITE: '#fff8ed',
  FLORAL_WHITE2: '#fffaf0',
  DARK_LAVA: '#4e473f',
  COYOTE_BROWN: '#8c643f',
  DIM_GRAY: '#746b5f',
  DIM_GRAY2: '#6a6a6a',
  DAVYS_GRAY: '#5d5d5d',
  PLATINUM: '#e9e9e9',
  WHITE: '#ffffff',
  BLACK: '#000000',
  YELLOW_ORANGE: '#ffb743',
  YELLOW_GREEN: '#0db11e',
  BLUE: '#48aff9cc',
  DEEP_BLUE: '#1290cb',
  SAPPHIRE: '#0f668e',
  PAKISTAN_GREEN: '#036c22',
  RUSSIAN_GREEN: '#58946a',
  SHAMROK: '#6cad80',
  SILVER: '#a5a5a5',
  // RED: '#ef5e51',
};

const common = {
  flexCenter: `
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  flexCenterColumn: `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  flexBetween: `
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  absoluteCenter: `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
};

const theme = {
  fontSizes,
  fontWeight,
  colors,
  common,
};

export default theme;
