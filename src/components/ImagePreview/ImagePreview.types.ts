import { ViewMode } from "../../screens/ImageProcessing/ImageProcessing";

export interface ImagePreviewProps {
    imageUri: string;
    processedImageUri: string;
    viewMode: ViewMode;
    imageSize: { width: number; height: number };
}