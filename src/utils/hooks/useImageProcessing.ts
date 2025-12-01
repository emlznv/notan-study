import { useState } from 'react';
import { NativeModules } from 'react-native';

const { ImageProcessor } = NativeModules;

export const useImageProcessing = (imageUri: string) => {
  const [processedImageUri, setProcessedImageUri] = useState<string | null>(null);

  const processImage = async (tones: number, simplicity: number, focusBlur: number) => {
    try {
      const uri = await ImageProcessor.processImage(imageUri, tones, simplicity, focusBlur);
      setProcessedImageUri(uri);
      return uri;
    } catch (err) {
      console.error('Processing failed:', err);
      return null;
    }
  };

  const applyThreshold = async (thresholds: number[]) => {
    try {
      const uri = await ImageProcessor.applyThreshold(imageUri, thresholds);
      setProcessedImageUri(uri);
      return uri;
    } catch (err) {
      console.error('Threshold processing failed:', err);
      return null;
    }
  };

  const getHistogram = async () => {
    try {
      const histogram: number[] = await ImageProcessor.getHistogram(imageUri);
      return histogram;
    } catch (err) {
      console.error('Failed to get histogram', err);
      return [];
    }
  };

  return { processedImageUri, processImage, applyThreshold, getHistogram };
};
