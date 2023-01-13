const pixelToRem = (size) => `${size / 16}rem`;

const fontSizes = {
  // title: pixelToRem(28),
  // subtitle: pixelToRem(20),
  // paragraph: pixelToRem(14),
};

const colors = {};

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
  colors,
  common,
};

export default theme;
