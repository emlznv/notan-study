import { Dimensions, View } from 'react-native';
import ValueControl from '../ValueControl/ValueControl';
import { ThresholdControlProps } from './ThresholdControls.types';

const ThresholdControls = ({
  histogram,
  threshold,
  onThresholdChange,
  onThresholdFinish,
}: ThresholdControlProps) => {
  const screenWidth = Dimensions.get('window').width;
  const histogramWidth = screenWidth * 0.9; // 90% of screen width
  const histogramBins = histogram.length; // Usually 256
  const barWidth = histogramWidth / histogramBins;

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          height: 100,
          marginVertical: 10,
          width: histogramWidth,
        }}
      >
        {histogram.map((value, index) => {
          const barHeight = Math.min(value / 1000, 100); // scale down to fit view
          return (
            <View
              key={index}
              style={{
                width: barWidth,
                height: barHeight,
                backgroundColor:
                  index === threshold
                    ? 'orange'
                    : `rgb(${index}, ${index}, ${index})`,
              }}
            />
          );
        })}
      </View>
      <ValueControl
        values={[threshold]}
        min={0}
        max={255}
        onChange={onThresholdChange}
        onSlidingComplete={onThresholdFinish}
        step={1}
        snapped
        sliderLength={histogramWidth}
      />
    </View>
  );
};
export default ThresholdControls;
