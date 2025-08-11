import { GridType } from "../../screens/ImageProcessing/ImageProcessing";

export interface GridControlsProps {
    selected: GridType;
    onChange: (type: GridType) => void;
}