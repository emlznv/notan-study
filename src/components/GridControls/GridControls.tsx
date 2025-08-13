import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { GridControlsProps } from './GridControls.types';
import { GridType } from '../../screens/ImageProcessing/ImageProcessing';

const GRID_OPTIONS = [
  { value: GridType.None, label: 'None' },
  { value: GridType.Thirds, label: 'Thirds' },
  { value: GridType.Golden, label: 'Golden' },
  { value: GridType.Square, label: 'Square' },
  { value: GridType.Diagonals, label: 'Diagonals' },
];

const GridControls = ({ selected, onChange }: GridControlsProps) => (
  <View style={styles.container}>
    <Picker
      selectedValue={selected}
      onValueChange={onChange}
      style={styles.picker}
      placeholder="Select grid type"
      mode="dropdown"
      dropdownIconColor={'gray'}
    >
      {GRID_OPTIONS.map(opt => (
        <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
      ))}
    </Picker>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderColor: 'lightgray',
    borderRadius: 20,
    width: '100%',
  },
  picker: {
    color: 'black',
    fontSize: 12,
    height: 55,
  },
});

export default GridControls;
