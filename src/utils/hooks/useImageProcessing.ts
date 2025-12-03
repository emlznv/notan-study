import { useState } from 'react';
import { NativeModules } from 'react-native';

const { ImageProcessor } = NativeModules;

const errorMessage = "Image processing failed. Please, try again."

export const useImageProcessing = (imageUri: string) => {
  const [processedImageUri, setProcessedImageUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null)

  const processImage = async (tones: number, simplicity: number, focusBlur: number) => {
    try {
      const uri = await ImageProcessor.processImage(imageUri, tones, simplicity, focusBlur);
      setProcessedImageUri(uri);
      return uri;
    } catch {
      setError(errorMessage)
      return null;
    }
  };

  const applyThreshold = async (thresholds: number[]) => {
    try {
      const uri = await ImageProcessor.applyThreshold(imageUri, thresholds);
      setProcessedImageUri(uri);
      return uri;
    } catch {
      setError(errorMessage)
      return null;
    }
  };

  const getHistogram = async () => {
    try {
      const histogram: number[] = await ImageProcessor.getHistogram(imageUri);
      return histogram;
    } catch {
      setError(errorMessage)
      return [];
    }
  };

  const clearError = () => setError(null);

  return { processedImageUri, error, clearError, processImage, applyThreshold, getHistogram };
};
