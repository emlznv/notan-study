import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

const Home = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const theme = useTheme();

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to take photos',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      // TODO: error handling
      console.warn(error);
      return false;
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera access is required to take photos.',
      );
      return;
    }

    try {
      // TODO: change UI colors to use the theme ones
      const image = await ImagePicker.openCamera({
        cropping: true,
        includeBase64: false,
        freeStyleCropEnabled: false,
        avoidEmptySpaceAroundImage: false,
      });

      handleProcessImage(image);
    } catch (error) {
      // TODO: error handling
      console.log('Camera cancelled or failed', error);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      // TODO: change UI colors to use the theme ones
      const image = await ImagePicker.openPicker({
        cropping: true,
        includeBase64: false,
        freeStyleCropEnabled: false,
        avoidEmptySpaceAroundImage: false,
      });

      handleProcessImage(image);
    } catch (error) {
      // TODO: error handling
      console.log('Gallery cancelled or failed', error);
    }
  };

  const handleProcessImage = (image: ImageOrVideo) => {
    if (image?.path) {
      navigation.navigate('ImageProcessing', { imageUri: image.path });
    }
  };

  return (
    <>
      <Text style={styles.title}>Select an image you want to study</Text>
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
