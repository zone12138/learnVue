export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

export const getRandomColorArray = (length: number) => {
  const colors: string[] = [];
  for (let i = 0; i < length; i++) {
    colors.push(getRandomColor());
  }
  return colors;
};

export const getRandomColorArrayWithoutRepeat = (length: number) => {
  const colors: string[] = [];
  for (let i = 0; i < length; i++) {
    const color = getRandomColor();
    if (!colors.includes(color)) {
      colors.push(color);
    } else {
      i--;
    }
  }
  return colors;
};

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : {};
};
