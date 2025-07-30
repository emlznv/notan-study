import MultiSlider from '@ptomasroos/react-native-multi-slider';
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
const { ImageProcessor } = NativeModules;

const ImageProcessing = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'ImageProcessing'>) => {
  const { imageUri } = route.params;
  const [processedImageUri, setProcessedImageUri] = useState(null);
  const [toneValues, setToneValues] = useState(2);

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

  const handleSliderChange = (values: number[]) => {
    setToneValues(values[0]);
  };

  const handleSliderFinish = (values: number[]) => {
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

  const renderCustomMarker = (currentValue: number) => (
    <View style={styles.markerContainer}>
      <Text style={styles.markerText}>{currentValue}</Text>
      <View style={styles.markerCircle} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContentContainer}>
      <View
        style={[
          {
            width: containerWidth,
            height: containerHeight,
            alignItems: 'center',
          },
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
        <MultiSlider
          values={[toneValues]}
          min={2}
          max={10}
          step={1}
          // snapped={true}
          onValuesChange={handleSliderChange}
          onValuesChangeFinish={handleSliderFinish}
          selectedStyle={{ backgroundColor: 'blue' }}
          unselectedStyle={{ backgroundColor: 'lightgray' }}
          markerStyle={{ backgroundColor: 'blue' }}
          customMarker={({ currentValue }) => renderCustomMarker(currentValue)}
        />
      </View>
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
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
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
    backgroundColor: 'blue',
  },
});

export default ImageProcessing;
