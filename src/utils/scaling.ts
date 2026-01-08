import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/*
// Base dimensions for scaling (iPhone 12/13 dimensions)
const baseWidth = 390;
const baseHeight = 844;

// Scale utility functions
const scale = (size: number): number => (width / baseWidth) * size;
const verticalScale = (size: number): number => (height / baseHeight) * size;
const moderateScale = (size: number, factor: number = 0.5): number => size + (scale(size) - size) * factor;

// Responsive dimension utilities
const moderateVerticalScale = (size: number, factor: number = 0.5): number => size + (verticalScale(size) - size) * factor;
*/
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const scale = (size: number): number => shortDimension / guidelineBaseWidth * size;
const verticalScale = (size: number): number => longDimension / guidelineBaseHeight * size;
const moderateScale = (size: number, factor: number = 0.5): number => size + (scale(size) - size) * factor;
const moderateVerticalScale = (size: number, factor: number = 0.5): number => size + (verticalScale(size) - size) * factor;
// Common scaling factors for different elements
const scaleFont = moderateScale; // Font scaling uses moderate scale
const scaleSize = scale; // General size scaling
const scaleHeight = verticalScale; // Height scaling uses vertical scale
const scaleWidth = scale; // Width scaling uses regular scale

export {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  scaleFont,
  scaleSize,
  scaleHeight,
  scaleWidth,
  width,
  height,
  guidelineBaseWidth,
  guidelineBaseHeight,
};
