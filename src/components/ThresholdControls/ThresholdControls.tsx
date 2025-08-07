import { Dimensions, StyleSheet, View } from 'react-native';
import { ThresholdControlProps } from './ThresholdControls.types';
import ValueControl from '../ValueControl/ValueControl';

const ThresholdControls = ({
  histogram,
  threshold,
  onThresholdChange,
  onThresholdFinish,
}: ThresholdControlProps) => {
  const screenWidth = Dimensions.get('window').width;
  const histogramWidth = screenWidth * 0.9;
  const barCount = histogram.length;
  const barWidth = histogramWidth / barCount;
  const maxBarHeight = 80;
  const maxValue = Math.max(...histogram, 1); // avoid division by zero

  // Clamp values so each threshold is at least 1 apart
  const clampThresholds = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] <= sorted[i - 1]) {
        sorted[i] = sorted[i - 1] + 1;
      }
    }
    // Clamp to max
    return sorted.map(v => Math.max(0, Math.min(255, v)));
  };

  const handleChange = (values: number[]) => {
    onThresholdChange(clampThresholds(values));
  };
  const handleFinish = (values: number[]) => {
    onThresholdFinish(clampThresholds(values));
  };

  return (
    <>
      <View
        style={[
          styles.histogramRow,
          { width: histogramWidth, height: maxBarHeight },
        ]}
      >
        {histogram.map((value, index) => {
          const barHeight = (value / maxValue) * maxBarHeight;
          const isThreshold = threshold.includes(index);
          const barColor = isThreshold
            ? 'orange'
            : `rgb(${index},${index},${index})`;
          return (
            <View
              key={index}
              style={{
                width: barWidth,
                height: barHeight,
                backgroundColor: barColor,
                borderRadius: 2 as number,
              }}
            />
          );
        })}
      </View>
      <ValueControl
        values={threshold}
        min={0}
        max={255}
        step={1}
        onChange={handleChange}
        onSlidingComplete={handleFinish}
        showThumbWithValue={false}
      />
    </>
  );
};
export default ThresholdControls;

const styles = StyleSheet.create({
  histogramRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 10,
  },
});
