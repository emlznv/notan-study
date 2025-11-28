import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { ImagePreviewProps } from './ImagePreview.types';
import GridOverlay from '../GridOverlay/GridOverlay';
import { GridType, ViewMode } from '../../utils/constants/constants';

const ImagePreview = ({
  imageUri,
  processedImageUri,
  imageSize,
  gridType,
  viewMode,
}: ImagePreviewProps) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // add option to enlarge image fully
  const containerWidth = screenWidth * 0.9;
  const isPortrait = imageSize.height > imageSize.width;
  const maxHeight = isPortrait ? screenHeight * 0.55 : screenHeight * 0.9;

  const aspectRatio = isPortrait
    ? imageSize.width / imageSize.height
    : imageSize.height / imageSize.width;

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
        <Image
          source={{
            uri:
              viewMode === ViewMode.Processed
                ? `file://${processedImageUri}`
                : imageUri,
          }}
          style={styles.image}
        />
        {gridType !== GridType.None && <GridOverlay type={gridType} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previewWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default ImagePreview;
