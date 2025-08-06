import {
  Dimensions,
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
} from 'react-native';
import { ImagePreviewProps } from './ImagePreview.types';
import { ViewMode } from '../../screens/ImageProcessing/ImageProcessing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BOTTOM_APPBAR_HEIGHT = 70;

const ImagePreview = ({
  imageUri,
  processedImageUri,
  viewMode,
  imageSize,
}: ImagePreviewProps) => {
  const { bottom } = useSafeAreaInsets();

  const renderImage = (isProcessed: boolean, style?: StyleProp<ImageStyle>) => {
    const uri = isProcessed ? `file://${processedImageUri}` : imageUri;
    return <Image source={{ uri }} style={[styles.image, style]} />;
  };

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
  return (
    <View
      style={[
        {
          width: containerWidth,
          height: isPortrait ? containerHeight : '60%',
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
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ImagePreview;
