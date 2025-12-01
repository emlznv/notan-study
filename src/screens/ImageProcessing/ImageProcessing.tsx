import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import RNFS from 'react-native-fs';
import { useTheme } from 'react-native-paper';
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
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useNavigation } from '@react-navigation/native';
const { ImageProcessor } = NativeModules;

const ImageProcessing = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'ImageProcessing'>) => {
  const theme = useTheme();
  const { imageUri } = route.params;
  const { bottom } = useSafeAreaInsets();

  const [processedImageUri, setProcessedImageUri] = useState<string | null>(
    null,
  );
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

  const navigation = useNavigation();

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

  const handleSaveImage = async () => {
    if (!processedImageUri) return;

    try {
      // 1. Create a temporary public file path
      const fileName = `notan-study_${Date.now()}.png`;
      const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      // 2. Copy the private file to the temp path
      await RNFS.copyFile(processedImageUri, destPath);

      // 3. Save the temp file to the gallery
      const savedUri = await CameraRoll.saveAsset(`file://${destPath}`, {
        type: 'photo',
      });
      Alert.alert('Saved!', 'Image saved to gallery.');
      console.log('Saved URI:', savedUri);
    } catch (error) {
      console.error('Failed to save image:', error);
      Alert.alert('Error', 'Failed to save image.');
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
