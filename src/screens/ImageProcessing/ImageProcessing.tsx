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
const { ImageProcessor } = NativeModules;

const ImageProcessing = ({ route }: { route: any }) => {
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

  const process = async (uri: string, tones: number) => {
    try {
      console.log('Processing image with tones:', tones);
      const processedUri = await ImageProcessor.processImage(uri, tones);
      console.log('Processed URI:', processedUri);
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
    process(imageUri, values[0]);
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
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
      }}
    >
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
            key={processedImageUri + '?t=' + Date.now()}
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
          customMarker={e => (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 12, marginBottom: 4 }}>
                {e.currentValue}
              </Text>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'blue',
                }}
              />
            </View>
          )}
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
});

export default ImageProcessing;
