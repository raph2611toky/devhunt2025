export const getRandomThemeColor = (
  theme: 'light' | 'dark' = 'light',
  parentBg?: string
) => {
  let color;
  do {
    color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  } while (
    !isValidThemeColor(color, theme) ||
    (parentBg && areColorsSimilar(color, parentBg))
  );
  return color;
};

const isValidThemeColor = (hex: string, theme: 'light' | 'dark') => {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  if (theme === 'light') {
    return luminance < 0.9;
  } else {
    return luminance > 0.1;
  }
};

const areColorsSimilar = (color1: string, color2: string) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return false;

  const diff =
    Math.abs(rgb1.r - rgb2.r) +
    Math.abs(rgb1.g - rgb2.g) +
    Math.abs(rgb1.b - rgb2.b);
  return diff < 50;
};

const hexToRgb = (hex: string) => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
      }
    : null;
};
