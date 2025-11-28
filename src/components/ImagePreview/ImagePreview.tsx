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
        <>
          <Image
            source={{
              uri:
                viewMode === ViewMode.Processed
                  ? `file://${processedImageUri}`
                  : imageUri,
            }}
            style={[styles.image]}
          ></Image>
          {gridType !== GridType.None && <GridOverlay type={gridType} />}
        </>
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
});

export default ImagePreview;
