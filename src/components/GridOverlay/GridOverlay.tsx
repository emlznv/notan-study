import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { GridOverlayProps } from './GridOverlayProps.types';
import { GridType } from '../../utils/constants/constants';
import { useTheme } from 'react-native-paper';

interface DynamicGridOverlayProps extends GridOverlayProps {
  width: number;
  height: number;
}

const GridOverlay = ({
  type = GridType.None,
  color,
  thickness = 2,
  width = 0,
  height = 0,
}: DynamicGridOverlayProps) => {
  const theme = useTheme();
  if (!width || !height || type === GridType.None) return null;

  // Generate dynamic styles based on width/height
  const styles = createGridStyles({
    width,
    height,
    thickness,
    color: theme.colors.primary,
  });

  switch (type) {
    case GridType.Thirds:
      return (
        <>
          <View style={styles.thirdsV1} />
          <View style={styles.thirdsV2} />
          <View style={styles.thirdsH1} />
          <View style={styles.thirdsH2} />
        </>
      );

    case GridType.Square:
      return (
        <>
          <View style={styles.squareV1} />
          <View style={styles.squareV2} />
          <View style={styles.squareV3} />
          <View style={styles.squareH1} />
          <View style={styles.squareH2} />
          <View style={styles.squareH3} />
        </>
      );

    case GridType.Diagonals:
      return (
        <Svg width={width} height={height} style={styles.svg}>
          <Line
            x1={0}
            y1={0}
            x2={width}
            y2={height}
            stroke={color}
            strokeWidth={thickness}
          />
          <Line
            x1={width}
            y1={0}
            x2={0}
            y2={height}
            stroke={color}
            strokeWidth={thickness}
          />
        </Svg>
      );

    case GridType.Golden:
      return (
        <>
          <View style={styles.goldenV} />
          <View style={styles.goldenH} />
        </>
      );

    default:
      return null;
  }
};

// Helper to generate dynamic styles based on width/height
const createGridStyles = ({
  width,
  height,
  thickness,
  color,
}: {
  width: number;
  height: number;
  thickness: number;
  color: string;
}) =>
  StyleSheet.create({
    line: {
      position: 'absolute',
      backgroundColor: color,
    },
    svg: {
      position: 'absolute',
      top: 0,
      left: 0,
    },

    // Rule of Thirds
    thirdsV1: {
      left: width / 3,
      top: 0,
      width: thickness,
      height,
      ...{ position: 'absolute', backgroundColor: color },
    },
    thirdsV2: {
      left: (2 * width) / 3,
      top: 0,
      width: thickness,
      height,
      ...{ position: 'absolute', backgroundColor: color },
    },
    thirdsH1: {
      top: height / 3,
      left: 0,
      width,
      height: thickness,
      ...{ position: 'absolute', backgroundColor: color },
    },
    thirdsH2: {
      top: (2 * height) / 3,
      left: 0,
      width,
      height: thickness,
      ...{ position: 'absolute', backgroundColor: color },
    },

    // Square grid
    squareV1: {
      left: width / 4,
      top: 0,
      width: thickness,
      height,
      ...{ position: 'absolute', backgroundColor: color },
    },
    squareV2: {
      left: width / 2,
      top: 0,
      width: thickness,
      height,
      ...{ position: 'absolute', backgroundColor: color },
    },
    squareV3: {
      left: (3 * width) / 4,
      top: 0,
      width: thickness,
      height,
      ...{ position: 'absolute', backgroundColor: color },
    },
    squareH1: {
      top: height / 4,
      left: 0,
      width,
      height: thickness,
      ...{ position: 'absolute', backgroundColor: color },
    },
    squareH2: {
      top: height / 2,
      left: 0,
      width,
      height: thickness,
      ...{ position: 'absolute', backgroundColor: color },
    },
    squareH3: {
      top: (3 * height) / 4,
      left: 0,
      width,
      height: thickness,
      ...{ position: 'absolute', backgroundColor: color },
    },

    // Golden ratio
    goldenV: {
      left: width * 0.618,
      top: 0,
      width: thickness,
      height,
      ...{ position: 'absolute', backgroundColor: color },
    },
    goldenH: {
      top: height * 0.618,
      left: 0,
      width,
      height: thickness,
      ...{ position: 'absolute', backgroundColor: color },
    },
  });

export default GridOverlay;
