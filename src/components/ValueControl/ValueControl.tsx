import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { ValueControlProps } from './ValueControl.types';

const ValueControl = ({
  values,
  min,
  max,
  step,
  onChange,
  onSlidingComplete,
  label = '',
  showThumbWithValue = true,
}: ValueControlProps) => (
  <View style={styles.container}>
    {label && <Text style={styles.sliderLabel}>{label}</Text>}
    <View style={{ width: label ? '70%' : '100%' }}>
      <Slider
        key={label}
        value={values}
        onValueChange={onChange}
        onSlidingComplete={onSlidingComplete}
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumTrackTintColor="orange"
        maximumTrackTintColor="lightgray"
        animateTransitions={true}
        renderThumbComponent={() => (
          <View style={styles.thumbWithValue}>
            {showThumbWithValue && (
              <Text style={styles.thumbText}>{values}</Text>
            )}
          </View>
        )}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerText: {
    fontSize: 12,
    marginBottom: 4,
  },
  thumbWithValue: {
    width: 25,
    height: 25,
    borderRadius: 16,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  thumbText: {
    color: '#fff',
    fontSize: 11,
  },
  selectedArea: {
    backgroundColor: 'orange',
  },
  unselectedArea: {
    backgroundColor: 'green',
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
