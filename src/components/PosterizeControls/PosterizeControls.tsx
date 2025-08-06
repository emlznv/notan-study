import { View } from 'react-native';
import ValueControl from '../ValueControl/ValueControl';
import { PosterizeControlsProps } from './PosterizeControls.types';

const PosterizeControls = ({
  toneValues,
  simplicity,
  onToneChange,
  onToneFinish,
  onSimplicityChange,
  onSimplicityFinish,
}: PosterizeControlsProps) => {
  return (
    <View>
      <ValueControl
        values={[toneValues]}
        onChange={onToneChange}
        onSlidingComplete={onToneFinish}
        min={2}
        max={10}
        step={1}
        label="Tone values"
      />
      <ValueControl
        values={[simplicity]}
        onChange={onSimplicityChange}
        onSlidingComplete={onSimplicityFinish}
        min={0}
        max={10}
        step={1}
        label="Simplicity"
      />
    </View>
  );
};

export default PosterizeControls;
