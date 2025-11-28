import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { NativeModules } from 'react-native';
import { RootStackParamList } from '../../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImagePreview from '../../components/ImagePreview/ImagePreview';
import PosterizeControls from '../../components/PosterizeControls/PosterizeControls';
import ThresholdControls from '../../components/ThresholdControls/ThresholdControls';
import GridControls from '../../components/GridControls/GridControls';
import {
  BOTTOM_APPBAR_HEIGHT,
  GridType,
  MenuItems,
  ViewMode,
} from '../../utils/constants/constants';
const { ImageProcessor } = NativeModules;

const ImageProcessing = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'ImageProcessing'>) => {
  const theme = useTheme();
  const { imageUri } = route.params;
  const { bottom } = useSafeAreaInsets();

  const [processedImageUri, setProcessedImageUri] = useState(null);
  const [toneValues, setToneValues] = useState(3);
  const [simplicity, setSimplicity] = useState(0);
  const [focusBlur, setFocusBlur] = useState(0);
  const [histogram, setHistogram] = useState<number[]>([]);
  const [thresholdValues, setThresholdValues] = useState<number[]>([85, 170]);
  const [selectedAction, setSelectedAction] = useState<number | null>(
    MenuItems.Posterize,
  );
  const [gridType, setGridType] = useState<GridType>(GridType.None);
  const [viewMode, setViewMode] = useState(ViewMode.Processed);

  useEffect(() => {
    calculateImageSize();
    processImage(imageUri, toneValues, simplicity, focusBlur);
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
    simplicityValue: number,
    focusBlurValue: number,
  ) => {
    try {
      const processedUri = await ImageProcessor.processImage(
        uri,
        tones,
        simplicityValue,
        focusBlurValue,
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
    processImage(imageUri, values[0], simplicity, focusBlur);
  };

  const handleSimplicitySliderChange = (values: number[]) => {
    setSimplicity(values[0]);
  };

  const handleSimplicitySliderFinish = (values: number[]) => {
    processImage(imageUri, toneValues, values[0], focusBlur);
  };

  const handleThresholdSliderChange = (values: number[]) => {
    setThresholdValues(values);
  };

  const handleFocusBlurSliderChange = (values: number[]) => {
    setFocusBlur(values[0]);
  };

  const handleFocusBlurSliderFinish = (values: number[]) => {
    processImage(imageUri, toneValues, simplicity, values[0]);
  };

  const handleThresholdSliderFinish = async (values: number[]) => {
    setThresholdValues(values);

    try {
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

  const handleChangeViewMode = () => {
    if (viewMode === ViewMode.Original) {
      setViewMode(ViewMode.Processed);
    } else {
      setViewMode(ViewMode.Original);
    }
  };

  const getSectionTitle = () => {
    if (selectedAction === MenuItems.Posterize) {
      return 'Detail & Focus';
    } else if (selectedAction === MenuItems.Threshold) {
      return 'Histogram';
    }
    return 'Grid Type';
  };

  if (!imageUri) return null;
  if (!imageSize)
    return <ActivityIndicator color={theme.colors.primary} size="small" />;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: BOTTOM_APPBAR_HEIGHT + bottom },
      ]}
    >
      <Button
        icon={viewMode === ViewMode.Processed ? 'eye' : 'eye-off'}
        textColor="black"
        onPress={handleChangeViewMode}
        style={styles.viewModeButton}
      >
        View
      </Button>
      <View style={styles.imagePreviewWrapper}>
        <ImagePreview
          imageUri={imageUri}
          processedImageUri={processedImageUri ?? ''}
          imageSize={imageSize}
          gridType={gridType}
          viewMode={viewMode}
        />
      </View>
      <View style={styles.controlsContainer}>
        <Text style={styles.controlsTitle}>{getSectionTitle()}</Text>
        {selectedAction === MenuItems.Posterize && (
          <PosterizeControls
            toneValues={[toneValues]}
            simplicity={[simplicity]}
            focusBlur={[focusBlur]}
            onToneChange={handleToneValueSliderChange}
            onToneFinish={handleToneValueSliderFinish}
            onSimplicityChange={handleSimplicitySliderChange}
            onSimplicityFinish={handleSimplicitySliderFinish}
            onFocusBlurChange={handleFocusBlurSliderChange}
            onFocusBlurFinish={handleFocusBlurSliderFinish}
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
      <Appbar
        style={[
          styles.bottom,
          {
            height: BOTTOM_APPBAR_HEIGHT + bottom,
          },
        ]}
        safeAreaInsets={{ bottom }}
      >
        <Appbar.Action
          icon="image-filter-black-white"
          style={styles.appBarButton}
          iconColor={
            selectedAction === MenuItems.Posterize
              ? theme.colors.primary
              : theme.colors.tertiary
          }
          onPress={() => setSelectedAction(MenuItems.Posterize)}
        />
        <Appbar.Action
          icon="sine-wave"
          style={styles.appBarButton}
          iconColor={
            selectedAction === MenuItems.Threshold
              ? theme.colors.primary
              : theme.colors.tertiary
          }
          onPress={() => setSelectedAction(MenuItems.Threshold)}
        />
        <Appbar.Action
          icon="grid"
          style={styles.appBarButton}
          iconColor={
            selectedAction === MenuItems.Grid
              ? theme.colors.primary
              : theme.colors.tertiary
          }
          onPress={() => setSelectedAction(MenuItems.Grid)}
        />
      </Appbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
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
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 170,
    justifyContent: 'flex-start',
  },
  controlsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 'auto',
    marginBottom: 8,
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
  viewModeButton: {
    marginRight: 'auto',
  },
});

export default ImageProcessing;
