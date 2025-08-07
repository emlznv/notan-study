import {
  Dimensions,
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import { ImagePreviewProps } from './ImagePreview.types';
import { ViewMode } from '../../screens/ImageProcessing/ImageProcessing';
import { useEffect, useState } from 'react';

const ImagePreview = ({
  imageUri,
  processedImageUri,
  viewMode,
  imageSize,
}: ImagePreviewProps) => {
  const [fadeAnim] = useState(new Animated.Value(1));
  const [currentUri, setCurrentUri] = useState<string>(imageUri);
  const [nextUri, setNextUri] = useState<string | null>(null);

  useEffect(() => {
    if (viewMode === ViewMode.Processed && processedImageUri) {
      const uri = `file://${processedImageUri}`;
      if (uri !== currentUri) {
        setNextUri(uri);
        fadeAnim.setValue(1);
      }
    } else if (viewMode === ViewMode.Original) {
      if (imageUri !== currentUri) {
        setNextUri(imageUri);
        fadeAnim.setValue(1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedImageUri, imageUri, viewMode]);

  const handleImageLoad = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }).start(() => {
      if (nextUri) {
        setCurrentUri(nextUri);
        setNextUri(null);
        fadeAnim.setValue(1);
      }
    });
  };

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
        {(viewMode === ViewMode.Original ||
          viewMode === ViewMode.Processed) && (
          <>
            <Image
              source={{ uri: currentUri }}
              style={[styles.image, { position: 'absolute' }]}
            />
            {nextUri && (
              <Animated.Image
                source={{ uri: nextUri }}
                style={[styles.image, { opacity: fadeAnim }]}
                onLoad={handleImageLoad}
              />
            )}
          </>
        )}
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
