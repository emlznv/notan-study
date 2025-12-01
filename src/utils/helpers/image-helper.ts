import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Image } from 'react-native';

export const saveImageToGallery = async (imageUri: string) => {
  try {
    const fileName = `notan-study_${Date.now()}.png`;
    const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    await RNFS.copyFile(imageUri, destPath);
    await CameraRoll.saveAsset(`file://${destPath}`, { type: 'photo' });
    Alert.alert('Saved!', 'Image saved to gallery.');
  } catch (err) {
    console.error('Failed to save image', err);
    Alert.alert('Error', 'Failed to save image.');
  }
};

export const getImageSize = (uri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (err) => reject(err),
    );
  });
};
