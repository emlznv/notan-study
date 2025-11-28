import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { GridControlsProps } from './GridControls.types';
import { GridType } from '../../utils/constants/constants';

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
        <Picker.Item
          style={{ fontSize: 14 }}
          key={opt.value}
          label={opt.label}
          value={opt.value}
        />
      ))}
    </Picker>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 20,
    width: '100%',
    marginTop: 20,
  },
  picker: {
    color: 'black',
  },
});

export default GridControls;
