import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { GridOverlayProps } from './GridOverlayProps.types';
import { GridType } from '../../utils/constants/constants';

const GridOverlay = ({
  type = GridType.None,
  color = 'orange',
  thickness = 1,
}: GridOverlayProps) => {
  if (type === GridType.None) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {type === GridType.Thirds && (
        <>
          <View
            style={[
              styles.line,
              styles.thirdsV1,
              { backgroundColor: color, width: thickness },
            ]}
          />
          <View
            style={[
              styles.line,
              styles.thirdsV2,
              { backgroundColor: color, width: thickness },
            ]}
          />
          <View
            style={[
              styles.line,
              styles.thirdsH1,
              { backgroundColor: color, height: thickness },
            ]}
          />
          <View
            style={[
              styles.line,
              styles.thirdsH2,
              { backgroundColor: color, height: thickness },
            ]}
          />
        </>
      )}
      {type === GridType.Square && (
        <>
          <View
            style={[
              styles.line,
              styles.squareV1,
              { backgroundColor: color, width: thickness },
            ]}
          />
          <View
            style={[
              styles.line,
              styles.squareV2,
              { backgroundColor: color, width: thickness },
            ]}
          />
          <View
            style={[
              styles.line,
              styles.squareV3,
              { backgroundColor: color, width: thickness },
            ]}
          />
          <View
            style={[
              styles.line,
              styles.squareH1,
              { backgroundColor: color, height: thickness },
            ]}
          />
          <View
            style={[
              styles.line,
              styles.squareH2,
              { backgroundColor: color, height: thickness },
            ]}
          />
          <View
            style={[
              styles.line,
              styles.squareH3,
              { backgroundColor: color, height: thickness },
            ]}
          />
        </>
      )}
      {type === GridType.Diagonals && (
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Line
            x1="0"
            y1="0"
            x2="100%"
            y2="100%"
            stroke={color}
            strokeWidth={thickness}
          />
          <Line
            x1="100%"
            y1="0"
            x2="0"
            y2="100%"
            stroke={color}
            strokeWidth={thickness}
          />
        </Svg>
      )}
      {/* Golden Ratio */}
      {type === GridType.Golden && (
        <>
          <View
            style={[
              styles.line,
              styles.goldenV,
              { backgroundColor: color, width: thickness },
            ]}
          />
          <View
            style={[
              styles.line,
              styles.goldenH,
              { backgroundColor: color, height: thickness },
            ]}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
  },
  // Rule of Thirds
  thirdsV1: { left: '33.33%', height: '100%' },
  thirdsV2: { left: '66.66%', height: '100%' },
  thirdsH1: { top: '33.33%', width: '100%' },
  thirdsH2: { top: '66.66%', width: '100%' },
  // Square Grid
  squareV1: { left: '25%', height: '100%' },
  squareV2: { left: '50%', height: '100%' },
  squareV3: { left: '75%', height: '100%' },
  squareH1: { top: '25%', width: '100%' },
  squareH2: { top: '50%', width: '100%' },
  squareH3: { top: '75%', width: '100%' },
  // Golden Ratio
  goldenV: { left: '61.8%', height: '100%' },
  goldenH: { top: '61.8%', width: '100%' },
});

export default GridOverlay;
