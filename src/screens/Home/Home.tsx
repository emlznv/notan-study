import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Button, Snackbar, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useCamera } from '../../utils/hooks/useCamera';
import { SNACKBAR_TIMEOUT } from '../../utils/constants/constants';

const Home = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const theme = useTheme();
  const { takePhoto, pickFromGallery, error, clearError } = useCamera();

  const handleTakePhoto = async () => {
    const image = await takePhoto();
    if (image?.path) {
      navigation.navigate('ImageProcessing', { imageUri: image.path });
    }
  };

  const handlePickFromGallery = async () => {
    const image = await pickFromGallery();
    if (image?.path) {
      navigation.navigate('ImageProcessing', { imageUri: image.path });
    }
  };

  return (
    <>
      <Text style={styles.title}>Start your image study</Text>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handlePickFromGallery}
          style={{
            ...styles.uploadContainer,
            borderColor: theme.colors.tertiary,
          }}
        >
          <Image
            source={require('../../assets/image-upload.png')}
            style={styles.image}
          />
          <Text>Tap to upload</Text>
        </TouchableOpacity>
        <Text>OR</Text>
        <Button
          icon="camera"
          textColor={theme.colors.background}
          buttonColor={theme.colors.primary}
          mode="contained"
          onPress={handleTakePhoto}
          style={styles.takePhotoButton}
        >
          Take photo
        </Button>
        <Snackbar
          visible={!!error}
          onDismiss={() => clearError()}
          duration={SNACKBAR_TIMEOUT}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 50,
  },
  uploadContainer: {
    alignItems: 'center',
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 20,
    paddingBottom: 10,
    marginBottom: 40,
  },
  image: {
    width: 270,
    height: 270,
  },
  takePhotoButton: {
    marginTop: 30,
  },
  addIcon: {
    marginRight: 5,
    marginTop: 5,
  },
});

export default Home;
