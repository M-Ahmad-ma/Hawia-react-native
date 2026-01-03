import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;

export const isTablet = () => {
  const shortestSide = Math.min(width, height);
  return shortestSide >= 600 || (width >= 1000 && aspectRatio < 1.6);
};