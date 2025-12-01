import { View, StyleSheet, Image } from 'react-native';
import { ImageSliderProps } from './ImageSlider.types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';

const SWIPE_THRESHOLD = 10;

const ImageSlider = ({ images, step, handleChangeStep }: ImageSliderProps) => {
  const theme = useTheme();
  const total = images.length;

  const handleNextStep = () => handleChangeStep((step + 1) % total);
  const handlePrevStep = () => handleChangeStep((step - 1 + total) % total);

  const panGesture = Gesture.Pan().onEnd(event => {
    const translationX = event.translationX;
    if (translationX < -SWIPE_THRESHOLD && step < total - 1) {
      handleNextStep();
    } else if (translationX > SWIPE_THRESHOLD && step > 0) {
      handlePrevStep();
    }
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.gestureContainer}>
        <View style={styles.imageWrapper}>
          <Image source={images[step]} style={styles.image} />
        </View>
        <View style={styles.dotContainer}>
          {Array.from({ length: total }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    step === index
                      ? theme.colors.primary
                      : theme.colors.tertiary,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  gestureContainer: {
    width: '100%',
    alignItems: 'center',
  },
  imageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 270,
    height: 270,
    resizeMode: 'contain',
    marginVertical: 30,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
});

export default ImageSlider;
