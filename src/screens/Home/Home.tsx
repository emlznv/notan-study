import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { Button } from 'react-native-paper';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

const Home = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
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
        freeStyleCropEnabled: true,
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
        freeStyleCropEnabled: true,
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
    <View style={styles.container}>
      <Text>Lorem Ipsum Title</Text>
      <View style={styles.uploadContainer}>
        <Image
          style={styles.image}
          source={require('../../assets/image-upload.png')}
        />
        <Button mode="contained" onPress={handlePickFromGallery}>
          Upload image
        </Button>
      </View>
      <Text>or</Text>
      <Button
        icon="camera"
        textColor="black"
        mode="outlined"
        onPress={handleTakePhoto}
      >
        Take photo
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'purple',
    borderStyle: 'dotted',
    padding: 30,
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Home;
