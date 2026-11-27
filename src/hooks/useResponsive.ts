import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export interface ResponsiveMetrics {
  width: number;
  height: number;
  isTablet: boolean;
  isLargeTablet: boolean;
  numColumns: number;
  horizontalPadding: number;
  maxContentWidth: number;
  heroHeight: number;
  categoryCardSize: number;
  typeScale: number;
  scaleFont: (baseSize: number) => number;
}

export function useResponsive(): ResponsiveMetrics {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isTablet = width >= 768;
    const isLargeTablet = width >= 1024;
    const numColumns = isLargeTablet ? 4 : isTablet ? 3 : 2;
    const horizontalPadding = isTablet ? 24 : 16;
    const maxContentWidth = 1080;
    const heroHeight = isTablet ? 520 : 410;
    const categoryCardSize = isTablet ? 140 : 112;
    const typeScale = isLargeTablet ? 1.18 : isTablet ? 1.12 : 1;

    const scaleFont = (baseSize: number) =>
      Math.round(baseSize * typeScale);

    return {
      width,
      height,
      isTablet,
      isLargeTablet,
      numColumns,
      horizontalPadding,
      maxContentWidth,
      heroHeight,
      categoryCardSize,
      typeScale,
      scaleFont,
    };
  }, [width, height]);
}
