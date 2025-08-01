import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { ValueControlProps } from './ValueControl.types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ValueControl = ({
  values,
  min,
  max,
  step,
  onChange,
  onSlidingComplete,
}: ValueControlProps) => {
  const renderCustomMarker = (currentValue: number) => (
    <View style={styles.markerContainer}>
      <Text style={styles.markerText}>{currentValue}</Text>
      <View style={styles.markerCircle} />
    </View>
  );

  return (
    <MultiSlider
      values={values}
      min={min}
      max={max}
      step={step}
      onValuesChange={onChange}
      onValuesChangeFinish={onSlidingComplete}
      selectedStyle={styles.selectedArea}
      unselectedStyle={styles.unselectedArea}
      customMarker={({ currentValue }) => renderCustomMarker(currentValue)}
    />
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  markerText: {
    fontSize: 12,
    marginBottom: 4,
  },
  markerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'orange',
  },
  selectedArea: {
    backgroundColor: 'orange',
  },
  unselectedArea: {
    backgroundColor: 'lightgray',
  },
});

export default ValueControl;
