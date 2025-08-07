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

const ImagePreview = ({
  imageUri,
  processedImageUri,
  viewMode,
  imageSize,
}: ImagePreviewProps) => {
  const renderImage = (isProcessed: boolean, style?: StyleProp<ImageStyle>) => {
    const uri = isProcessed ? `file://${processedImageUri}` : imageUri;
    return <Image source={{ uri }} style={[styles.image, style]} />;
  };

  const screenWidth = Dimensions.get('window').width;
  const containerWidth = screenWidth * 0.9;
  const isPortrait = imageSize.height > imageSize.width;

  const aspectRatio = isPortrait
    ? imageSize.width / imageSize.height
    : imageSize.height / imageSize.width;

  const maxHeight = Math.min(containerWidth / aspectRatio, 550);
  return (
    <View style={styles.previewWrapper}>
      <View
        style={[
          styles.imageContainer,
          {
            width: containerWidth,
            aspectRatio,
            maxHeight,
          },
        ]}
      >
        {viewMode === ViewMode.Original && renderImage(false)}
        {viewMode === ViewMode.Processed &&
          processedImageUri &&
          renderImage(true)}
        {viewMode === ViewMode.Both && (
          <View
            style={[
              styles.imageBothContainer,
              isPortrait ? styles.containerRow : styles.containerColumn,
            ]}
          >
            {renderImage(false, styles.imageBoth)}
            {processedImageUri && renderImage(true, styles.imageBoth)}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previewWrapper: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  imageContainer: {
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageBothContainer: {
    flex: 1,
    width: '100%',
    gap: 10,
  },
  containerRow: {
    flexDirection: 'row',
  },
  containerColumn: {
    flexDirection: 'column',
  },
  imageBoth: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
});

export default ImagePreview;
