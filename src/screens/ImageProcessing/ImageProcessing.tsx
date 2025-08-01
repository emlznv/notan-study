import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeModules } from 'react-native';
import { RootStackParamList } from '../../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Appbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ValueControl from '../../components/ValueControl/ValueControl';
const { ImageProcessor } = NativeModules;

const BOTTOM_APPBAR_HEIGHT = 80;

enum ProcessingActions {
  Posterize = 0,
  Threshold = 1,
}

const ImageProcessing = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'ImageProcessing'>) => {
  const { imageUri } = route.params;
  const [processedImageUri, setProcessedImageUri] = useState(null);
  const [toneValues, setToneValues] = useState(2);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);

  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

  useEffect(() => {
    if (selectedAction === ProcessingActions.Posterize && !processedImageUri) {
      posterizeImage(imageUri, toneValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAction]);

  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!imageUri) {
      setImageSize(null);
      return;
    }

    Image.getSize(
      imageUri,
      (width, height) => {
        setImageSize({ width, height });
      },
      error => {
        console.error('Failed to get image size:', error);
        setImageSize(null);
      },
    );
  }, [imageUri]);

  const posterizeImage = async (uri: string, tones: number) => {
    try {
      const processedUri = await ImageProcessor.processImage(uri, tones);
      if (!processedUri) {
        console.warn('Warning: Processed URI is null or undefined');
      }
      setProcessedImageUri(processedUri);
    } catch (error) {
      console.error('Processing failed:', error);
    }
  };

  const handleToneValueSliderChange = (values: number[]) => {
    setToneValues(values[0]);
  };

  const handleToneValueSliderFinish = (values: number[]) => {
    posterizeImage(imageUri, values[0]);
  };

  if (!imageUri) {
    return null;
  }

  if (!imageSize) {
    return <Text>Loading image...</Text>;
  }

  const screenWidth = Dimensions.get('window').width;
  const containerWidth = screenWidth * 0.9;

  const aspectRatio = imageSize.width / imageSize.height;
  const containerHeight = containerWidth / aspectRatio;

  return (
    <ScrollView contentContainerStyle={styles.scrollContentContainer}>
      <View
        style={[
          { width: containerWidth, height: containerHeight },
          styles.imageContainer,
        ]}
      >
        {processedImageUri ? (
          <Image
            source={{ uri: 'file://' + processedImageUri }}
            style={styles.image}
          />
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text>No image provided</Text>
        )}
        {selectedAction === ProcessingActions.Posterize && (
          <ValueControl
            values={[toneValues]}
            onChange={handleToneValueSliderChange}
            onSlidingComplete={handleToneValueSliderFinish}
            min={2}
            max={10}
            step={1}
          />
        )}
      </View>
      <Appbar
        style={[
          styles.bottom,
          {
            height: BOTTOM_APPBAR_HEIGHT + bottom,
            backgroundColor: theme.colors.elevation.level2,
          },
        ]}
        safeAreaInsets={{ bottom }}
      >
        <Appbar.Action
          icon="image-filter-black-white"
          iconColor={
            selectedAction === ProcessingActions.Posterize ? 'orange' : 'white'
          }
          onPress={() => setSelectedAction(ProcessingActions.Posterize)}
        />
        <Appbar.Action
          icon="sine-wave"
          iconColor={
            selectedAction === ProcessingActions.Threshold ? 'orange' : 'white'
          }
          onPress={() => setSelectedAction(ProcessingActions.Threshold)}
        />
      </Appbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
  },
  imageContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    backgroundColor: 'aquamarine',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ImageProcessing;
