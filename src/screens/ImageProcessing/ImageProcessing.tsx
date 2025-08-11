import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { NativeModules } from 'react-native';
import { RootStackParamList } from '../../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImagePreview from '../../components/ImagePreview/ImagePreview';
import PosterizeControls from '../../components/PosterizeControls/PosterizeControls';
import ThresholdControls from '../../components/ThresholdControls/ThresholdControls';
import GridControls from '../../components/GridControls/GridControls';
const { ImageProcessor } = NativeModules;

const BOTTOM_APPBAR_HEIGHT = 70;

enum MenuItems {
  Posterize = 0,
  Threshold = 1,
  Grid = 2,
}

export enum GridType {
  None = 'none',
  Thirds = 'thirds',
  Golden = 'golden',
  Square = 'square',
  Diagonals = 'diagonals',
}

export enum ViewMode {
  Original = 'original',
  Processed = 'processed',
  Both = 'both',
}

const ImageProcessing = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'ImageProcessing'>) => {
  const { imageUri } = route.params;
  const { bottom } = useSafeAreaInsets();

  const [processedImageUri, setProcessedImageUri] = useState(null);
  const [toneValues, setToneValues] = useState(3);
  const [simplicity, setSimplicity] = useState(0);
  const [histogram, setHistogram] = useState<number[]>([]);
  const [thresholdValues, setThresholdValues] = useState<number[]>([85, 170]);
  const [selectedAction, setSelectedAction] = useState<number | null>(
    MenuItems.Posterize,
  );
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Processed);
  const [gridType, setGridType] = useState<GridType>(GridType.None);

  useEffect(() => {
    calculateImageSize();
    processImage(imageUri, toneValues, simplicity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (imageUri) {
      ImageProcessor.getHistogram(imageUri)
        .then((hist: number[]) => {
          setHistogram(hist);
        })
        .catch((e: any) => {
          console.error('Failed to load histogram', e);
        });
    }
  }, [imageUri]);

  useEffect(() => {
    const steps = toneValues - 1;
    const stepSize = Math.floor(256 / toneValues);
    const newThresholds = Array.from(
      { length: steps },
      (_, i) => (i + 1) * stepSize,
    );
    setThresholdValues(newThresholds);
  }, [toneValues]);

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

  const handleThresholdSliderChange = (values: number[]) => {
    setThresholdValues(values);
    //  processImage(imageUri, toneValues, values[0], simplicity);
  };

  const handleThresholdSliderFinish = async (values: number[]) => {
    setThresholdValues(values);

    try {
      // If your native module expects an array, pass values directly
      const processedUri = await ImageProcessor.applyThreshold(
        imageUri,
        values,
      );
      if (!processedUri) {
        console.warn('Warning: Processed URI is null or undefined');
      }
      setProcessedImageUri(processedUri);
    } catch (error) {
      console.error('Threshold processing failed:', error);
    }
  };

  const handleGridTypeChange = (type: GridType) => setGridType(type);

  if (!imageUri) return null;
  if (!imageSize) return <Text>Loading image...</Text>;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: BOTTOM_APPBAR_HEIGHT + bottom },
      ]}
    >
      <View style={styles.topBar}>
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
      </View>
      <View style={styles.imagePreviewWrapper}>
        <ImagePreview
          imageUri={imageUri}
          processedImageUri={processedImageUri ?? ''}
          viewMode={viewMode}
          imageSize={imageSize}
          gridType={gridType}
        />
      </View>
      {viewMode !== ViewMode.Original && (
        <View style={styles.controlsContainer}>
          {selectedAction === MenuItems.Posterize && (
            <PosterizeControls
              toneValues={[toneValues]}
              simplicity={[simplicity]}
              onToneChange={handleToneValueSliderChange}
              onToneFinish={handleToneValueSliderFinish}
              onSimplicityChange={handleSimplicitySliderChange}
              onSimplicityFinish={handleSimplicitySliderFinish}
            />
          )}
          {selectedAction === MenuItems.Threshold && (
            <ThresholdControls
              histogram={histogram}
              threshold={thresholdValues}
              onThresholdChange={handleThresholdSliderChange}
              onThresholdFinish={handleThresholdSliderFinish}
            />
          )}
          {selectedAction === MenuItems.Grid && (
            <GridControls selected={gridType} onChange={handleGridTypeChange} />
          )}
        </View>
      )}
      {viewMode !== ViewMode.Original && (
        <Appbar
          style={[
            styles.bottom,
            {
              height: BOTTOM_APPBAR_HEIGHT + bottom,
              // backgroundColor: theme.colors.elevation.level2,
            },
          ]}
          safeAreaInsets={{ bottom }}
        >
          <Appbar.Action
            icon="image-filter-black-white"
            style={styles.appBarButton}
            iconColor={
              selectedAction === MenuItems.Posterize ? 'orange' : 'gray'
            }
            onPress={() => setSelectedAction(MenuItems.Posterize)}
          />
          <Appbar.Action
            icon="sine-wave"
            style={styles.appBarButton}
            iconColor={
              selectedAction === MenuItems.Threshold ? 'orange' : 'gray'
            }
            onPress={() => setSelectedAction(MenuItems.Threshold)}
          />
          <Appbar.Action
            icon="grid"
            style={styles.appBarButton}
            iconColor={selectedAction === MenuItems.Grid ? 'orange' : 'gray'}
            onPress={() => setSelectedAction(MenuItems.Grid)}
          />
        </Appbar>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topBar: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  imagePreviewWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    width: '100%',
    alignSelf: 'stretch',
    padding: 12,
    alignItems: 'center',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  appBarButton: {
    marginRight: 15,
    borderRadius: 24,
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
  },
});

export default ImageProcessing;
