import { useCallback, useState } from 'react';
import { PermissionsAndroid } from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';

export const useCamera = () => {
  const [error, setError] = useState<string | null>(null);
  const clearError = useCallback(() => setError(null), []);

  const requestCameraPermission = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to take photos.',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      setError(`An error occured. ${err}`);
      return false;
    }
  }, []);

  const takePhoto = useCallback(async (): Promise<ImageOrVideo | null> => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      setError('Permission denied. Camera access is required to take photos.')
      return null;
    }

    try {
      return await ImagePicker.openCamera({
        cropping: true,
        includeBase64: false,
        freeStyleCropEnabled: false,
        avoidEmptySpaceAroundImage: false,
      });
    } catch (err) {
      setError(`An error occured. ${err}`);
      return null;
    }
  }, [requestCameraPermission]);

  const pickFromGallery = useCallback(async (): Promise<ImageOrVideo | null> => {
    try {
      return await ImagePicker.openPicker({
        cropping: true,
        includeBase64: false,
        freeStyleCropEnabled: false,
        avoidEmptySpaceAroundImage: false,
      });
    } catch (err) {
      setError(`An error occured. ${err}`);
      return null;
    }
  }, []);

  return {
    takePhoto,
    pickFromGallery,
    error,
    clearError,
  };
};
