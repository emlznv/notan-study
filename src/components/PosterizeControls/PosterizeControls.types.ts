export interface PosterizeControlsProps {
    toneValues: number;
    simplicity: number;
    onToneChange: (values: number[]) => void;
    onToneFinish: (values: number[]) => void;
    onSimplicityChange: (values: number[]) => void;
    onSimplicityFinish: (values: number[]) => void;
}