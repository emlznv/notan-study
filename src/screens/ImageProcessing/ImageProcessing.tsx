import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { NativeModules } from 'react-native';
import { RootStackParamList } from '../../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Appbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ValueControl from '../../components/ValueControl/ValueControl';
const { ImageProcessor } = NativeModules;

const BOTTOM_APPBAR_HEIGHT = 70;

enum ProcessingActions {
  Posterize = 0,
  Threshold = 1,
}

enum ViewMode {
  Original = 'original',
  Processed = 'processed',
  Both = 'both',
}

const ImageProcessing = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'ImageProcessing'>) => {
  const { imageUri } = route.params;
  const [processedImageUri, setProcessedImageUri] = useState(null);
  const [toneValues, setToneValues] = useState(3);
  const [simplicity, setSimplicity] = useState(0);
  const [selectedAction, setSelectedAction] = useState<number | null>(
    ProcessingActions.Posterize,
  );
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Processed);

  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

  useEffect(() => {
    calculateImageSize();
    processImage(imageUri, toneValues, simplicity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const calculateImageSize = () => {
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
  };

  const processImage = async (
    uri: string,
    tones: number,
    simplicity: number,
  ) => {
    try {
      const processedUri = await ImageProcessor.processImage(
        uri,
        tones,
        simplicity,
      );
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
    processImage(imageUri, values[0], simplicity);
  };

  const handleSimplicitySliderChange = (values: number[]) => {
    setSimplicity(values[0]);
  };

  const handleSimplicitySliderFinish = (values: number[]) => {
    processImage(imageUri, toneValues, values[0]);
  };

  if (!imageUri) return null;
  if (!imageSize) return <Text>Loading image...</Text>;

  const screenWidth = Dimensions.get('window').width;
  const containerWidth = screenWidth * 0.9;

  const aspectRatio = imageSize.width / imageSize.height;
  const screenHeight = Dimensions.get('window').height;
  const availableHeight = screenHeight - (BOTTOM_APPBAR_HEIGHT + bottom + 180);

  const containerHeight = Math.min(
    containerWidth / aspectRatio,
    availableHeight,
  );

  const isPortrait = imageSize.height > imageSize.width;

  const renderImage = (isProcessed: boolean, style?: StyleProp<ImageStyle>) => {
    const uri = isProcessed ? `file://${processedImageUri}` : imageUri;
    return <Image source={{ uri }} style={[styles.image, style]} />;
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={viewMode}
        density="small"
        style={{ width: 50, justifyContent: 'center', marginTop: 20 }}
        onValueChange={value => setViewMode(value)}
        buttons={[
          {
            value: ViewMode.Original,
            icon: 'image',
          },
          {
            value: ViewMode.Processed,
            icon: 'image-edit',
          },
          {
            value: ViewMode.Both,
            icon: 'compare',
          },
        ]}
      />

      <View
        style={[
          {
            width: containerWidth,
            height: isPortrait ? containerHeight : '70%',
          },
          styles.imageContainer,
        ]}
      >
        {viewMode === ViewMode.Original && renderImage(false)}
        {viewMode === ViewMode.Processed &&
          processedImageUri &&
          renderImage(true)}
        {viewMode === ViewMode.Both && (
          <View
            style={[
              {
                flex: 1,
                gap: 10,
                width: '100%',
                flexDirection: isPortrait ? 'row' : 'column',
              },
            ]}
          >
            {renderImage(
              false,
              isPortrait ? styles.imageBothColumn : styles.imageBothRow,
            )}
            {processedImageUri &&
              renderImage(
                true,
                isPortrait ? styles.imageBothColumn : styles.imageBothRow,
              )}
          </View>
        )}
        {selectedAction === ProcessingActions.Posterize &&
          viewMode !== ViewMode.Original && (
            <View>
              <ValueControl
                values={[toneValues]}
                onChange={handleToneValueSliderChange}
                onSlidingComplete={handleToneValueSliderFinish}
                min={2}
                max={10}
                step={1}
                label="Tone values"
              />
              <ValueControl
                values={[simplicity]}
                onChange={handleSimplicitySliderChange}
                onSlidingComplete={handleSimplicitySliderFinish}
                min={0}
                max={10}
                step={1}
                label="Simplicity"
              />
            </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageBothColumn: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  imageBothRow: {
    flex: 1,
    height: '100%',
    resizeMode: 'contain',
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
