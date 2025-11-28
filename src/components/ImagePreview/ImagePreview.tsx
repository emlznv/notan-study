import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { ImagePreviewProps } from './ImagePreview.types';
import GridOverlay from '../GridOverlay/GridOverlay';
import { GridType, ViewMode } from '../../utils/constants/constants';
import { IconButton } from 'react-native-paper';
import { useState } from 'react';

const ImagePreview = ({
  imageUri,
  processedImageUri,
  imageSize,
  gridType,
}: ImagePreviewProps) => {
  const [viewMode, setViewMode] = useState(ViewMode.Processed);
  const screenWidth = Dimensions.get('window').width;
  const containerWidth = screenWidth * 0.9;
  const isPortrait = imageSize.height > imageSize.width;

  const aspectRatio = isPortrait
    ? imageSize.width / imageSize.height
    : imageSize.height / imageSize.width;

  const maxHeight = Math.min(containerWidth / aspectRatio, 550);

  const handleChangeViewMode = () => {
    if (viewMode === ViewMode.Original) {
      setViewMode(ViewMode.Processed);
    } else {
      setViewMode(ViewMode.Original);
    }
  };

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
          <IconButton
            iconColor="black"
            style={{ position: 'absolute', top: 0, right: 0, zIndex: 1000 }}
            icon="eye"
            size={20}
            onPress={handleChangeViewMode}
          />
          <Image
            source={{
              uri:
                viewMode === ViewMode.Processed
                  ? `file://${processedImageUri}`
                  : imageUri,
            }}
            style={[styles.image]}
          />
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
