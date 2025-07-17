// import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
// import { NativeModules } from 'react-native';
// const { NotanProcessor } = NativeModules;

const ImageProcessing = ({ route }: { route: any }) => {
  const { imageUri } = route.params;

  // useEffect(() => {
  //   const processImage = async () => {
  //     const tones = 3; // for example
  //     const resultPath = await NotanProcessor.applyTonalSegmentation(
  //       imageUri,
  //       tones,
  //     );
  //     console.log('Segmented image path:', resultPath);
  //   };

  //   processImage();
  // }, [imageUri]);

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 300, height: 300, resizeMode: 'contain' }}
        />
      ) : (
        <Text>No image provided</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ImageProcessing;
