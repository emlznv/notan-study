import { GridType } from "../../utils/constants/constants";

export interface GridControlsProps {
    selected: GridType;
    onChange: (type: GridType) => void;
}