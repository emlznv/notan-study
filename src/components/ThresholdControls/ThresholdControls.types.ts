export interface ThresholdControlProps {
    histogram: number[];
    threshold: number[];
    onThresholdChange: (value: number[]) => void;
    onThresholdFinish: (value: number[]) => void;
}