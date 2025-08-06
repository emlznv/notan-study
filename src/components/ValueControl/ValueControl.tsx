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
  label,
  snapped = false,
  sliderLength = 200,
}: ValueControlProps) => {
  const renderCustomMarker = (currentValue: number) => (
    <View style={styles.markerContainer}>
      <Text style={styles.markerText}>{currentValue}</Text>
      <View style={styles.markerCircle} />
    </View>
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.sliderLabel}>{label}</Text>}
      <MultiSlider
        key={label}
        sliderLength={sliderLength}
        snapped={snapped}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
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
  sliderLabel: {
    fontSize: 13,
    margin: 0,
    padding: 0,
    textAlign: 'left',
    marginRight: 10,
  },
});

export default ValueControl;
