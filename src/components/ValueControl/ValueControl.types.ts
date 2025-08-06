export interface ValueControlProps {
    values: number[];
    onChange: (values: number[]) => void;
    onSlidingComplete?: (values: number[]) => void;
    min: number;
    max: number;
    step: number;
    label?: string
    snapped?: boolean;
    sliderLength?: number;
}