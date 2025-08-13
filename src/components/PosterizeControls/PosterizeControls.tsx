import { View } from 'react-native';
import ValueControl from '../ValueControl/ValueControl';
import { PosterizeControlsProps } from './PosterizeControls.types';

const PosterizeControls = ({
  toneValues,
  simplicity,
  focusBlur,
  onToneChange,
  onToneFinish,
  onSimplicityChange,
  onSimplicityFinish,
  onFocusBlurChange,
  onFocusBlurFinish,
}: PosterizeControlsProps) => {
  return (
    <View>
      <ValueControl
        values={toneValues}
        onChange={onToneChange}
        onSlidingComplete={onToneFinish}
        min={2}
        max={10}
        step={1}
        label="Tone values"
      />
      <ValueControl
        values={simplicity}
        onChange={onSimplicityChange}
        onSlidingComplete={onSimplicityFinish}
        min={0}
        max={10}
        step={1}
        label="Simplicity"
      />
      <ValueControl
        values={focusBlur}
        onChange={onFocusBlurChange}
        onSlidingComplete={onFocusBlurFinish}
        min={0}
        max={20}
        step={1}
        label="Focus/Blur"
      />
    </View>
  );
};

export default PosterizeControls;
