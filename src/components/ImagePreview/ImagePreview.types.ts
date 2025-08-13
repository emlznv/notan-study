import { GridType, ViewMode } from "../../utils/constants/constants";

export interface ImagePreviewProps {
    imageUri: string;
    processedImageUri: string;
    viewMode: ViewMode;
    imageSize: { width: number; height: number };
    gridType: GridType;
}