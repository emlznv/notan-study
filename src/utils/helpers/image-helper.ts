import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Image } from 'react-native';

export const saveImageToGallery = async (imageUri: string) => {
  try {
    const fileName = `notan-study_${Date.now()}.png`;
    const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    await RNFS.copyFile(imageUri, destPath);
    await CameraRoll.saveAsset(`file://${destPath}`, { type: 'photo' });
    return true
  } catch {
    return false
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
