export interface PosterizeControlsProps {
    toneValues: number[];
    simplicity: number[];
    focusBlur: number[];
    onToneChange: (values: number[]) => void;
    onToneFinish: (values: number[]) => void;
    onSimplicityChange: (values: number[]) => void;
    onSimplicityFinish: (values: number[]) => void;
    onFocusBlurChange: (value: number[]) => void;
    onFocusBlurFinish: (value: number[]) => void;
}