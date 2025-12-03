import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
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
import { useNavigation } from '@react-navigation/native';
import { useImageProcessing } from '../../utils/hooks/useImageProcessing';
import {
  getImageSize,
  saveImageToGallery,
} from '../../utils/helpers/image-helper';

const enum SliderType {
  Tone,
  Simplicity,
  Focus,
  Threshold,
}

const ImageProcessing = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'ImageProcessing'>) => {
  const theme = useTheme();
  const { imageUri } = route.params;
  const { bottom } = useSafeAreaInsets();

  const {
    processImage,
    processedImageUri,
    applyThreshold,
    getHistogram,
    error,
    clearError,
  } = useImageProcessing(imageUri);
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
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    const calculateImageSize = async () => {
      const size = await getImageSize(imageUri);
      setImageSize(size);
    };
    calculateImageSize();
    processImage(toneValues, simplicity, focusBlur);
  }, []);

  useEffect(() => {
    const loadHistogram = async () => {
      const data = await getHistogram();
      setHistogram(data);
    };
    imageUri && loadHistogram();
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

  const handleSliderChange = (type: SliderType) => (values: number[]) => {
    switch (type) {
      case SliderType.Tone:
        setToneValues(values[0]);
        break;
      case SliderType.Simplicity:
        setSimplicity(values[0]);
        break;
      case SliderType.Focus:
        setFocusBlur(values[0]);
        break;
      case SliderType.Threshold:
        setThresholdValues(values);
        break;
    }
  };

  const handleSliderFinish = (type: SliderType) => (values: number[]) => {
    switch (type) {
      case SliderType.Tone:
        processImage(values[0], simplicity, focusBlur);
        break;
      case SliderType.Simplicity:
        processImage(toneValues, values[0], focusBlur);
        break;
      case SliderType.Focus:
        processImage(toneValues, simplicity, values[0]);
        break;
      case SliderType.Threshold:
        handleApplyThreshold(values);
        break;
    }
  };

  const handleApplyThreshold = async (values: number[]) => {
    setThresholdValues(values);
    applyThreshold(values);
  };

  const handleGridTypeChange = (type: GridType) => setGridType(type);

  const handleChangeViewMode = () => {
    if (viewMode === ViewMode.Original) {
      setViewMode(ViewMode.Processed);
    } else {
      setViewMode(ViewMode.Original);
    }
  };

  const handleSaveImage = async () => {
    processedImageUri && saveImageToGallery(processedImageUri);
  };

  const getSectionTitle = () => {
    if (selectedAction === MenuItems.Posterize) {
      return 'Detail & Focus';
    } else if (selectedAction === MenuItems.Threshold) {
      return 'Histogram';
    }
    return 'Grid Type';
  };

  const getMenuIconColor = (menuItem: MenuItems) => {
    if (menuItem === selectedAction) {
      return theme.colors.primary;
    }
    return theme.colors.tertiary;
  };

  if (!imageUri) return null;
  if (!imageSize)
    return <ActivityIndicator color={theme.colors.primary} size="small" />;

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="" />
        <Appbar.Action
          icon={
            viewMode === ViewMode.Processed ? 'eye-outline' : 'eye-off-outline'
          }
          onPress={handleChangeViewMode}
        />

        <Appbar.Action icon="content-save-outline" onPress={handleSaveImage} />
      </Appbar.Header>
      <View
        style={[
          styles.container,
          { paddingBottom: BOTTOM_APPBAR_HEIGHT + bottom },
        ]}
      >
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
              onToneChange={handleSliderChange(SliderType.Tone)}
              onToneFinish={handleSliderFinish(SliderType.Tone)}
              onSimplicityChange={handleSliderChange(SliderType.Simplicity)}
              onSimplicityFinish={handleSliderFinish(SliderType.Simplicity)}
              onFocusBlurChange={handleSliderChange(SliderType.Focus)}
              onFocusBlurFinish={handleSliderFinish(SliderType.Focus)}
            />
          )}
          {selectedAction === MenuItems.Threshold && (
            <ThresholdControls
              histogram={histogram}
              threshold={thresholdValues}
              onThresholdChange={handleSliderChange(SliderType.Threshold)}
              onThresholdFinish={handleSliderFinish(SliderType.Threshold)}
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
            iconColor={getMenuIconColor(MenuItems.Posterize)}
            onPress={() => setSelectedAction(MenuItems.Posterize)}
          />
          <Appbar.Action
            icon="sine-wave"
            style={styles.appBarButton}
            iconColor={getMenuIconColor(MenuItems.Threshold)}
            onPress={() => setSelectedAction(MenuItems.Threshold)}
          />
          <Appbar.Action
            icon="grid"
            style={styles.appBarButton}
            iconColor={getMenuIconColor(MenuItems.Grid)}
            onPress={() => setSelectedAction(MenuItems.Grid)}
          />
        </Appbar>
        <Snackbar
          visible={!!error}
          onDismiss={() => clearError()}
          duration={3000}
        >
          {error}
        </Snackbar>
      </View>
    </>
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
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 160,
    justifyContent: 'flex-start',
    marginTop: 10,
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
