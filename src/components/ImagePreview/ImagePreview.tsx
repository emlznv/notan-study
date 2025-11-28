import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import GridOverlay from '../GridOverlay/GridOverlay';
import { GridType, ViewMode } from '../../utils/constants/constants';
import { ImagePreviewProps } from './ImagePreview.types';

const ImagePreview = ({
  imageUri,
  processedImageUri,
  imageSize,
  gridType,
  viewMode,
}: ImagePreviewProps) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const { width: imgWidth, height: imgHeight } = imageSize;

  const maxWidth = screenWidth * 0.9;
  const isPortrait = imageSize.height > imageSize.width;

  const maxHeight = isPortrait ? screenHeight * 0.57 : screenHeight * 0.5;

  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 });

  let width = maxWidth;
  let height = (imgHeight / imgWidth) * width;

  if (height > maxHeight) {
    height = maxHeight;
    width = (imgWidth / imgHeight) * height;
  }

  return (
    <View style={[styles.imageContainer, { width, height }]}>
      <Image
        source={{
          uri:
            viewMode === ViewMode.Processed
              ? `file://${processedImageUri}`
              : imageUri,
        }}
        style={styles.image}
        onLayout={e => {
          const { width: rw, height: rh } = e.nativeEvent.layout;
          setRenderedSize({ width: rw, height: rh });
        }}
      />
      {gridType !== GridType.None && (
        <GridOverlay
          type={gridType}
          width={renderedSize.width}
          height={renderedSize.height}
          thickness={1}
          color="orange"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  previewWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
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
