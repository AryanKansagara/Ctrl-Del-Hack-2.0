declare module "face-api.js" {
  export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  export interface FaceDetection {
    box: Box;
    score: number;
  }
  export interface FaceLandmarks68 {}
  export interface WithFaceDescriptor<T> {
    descriptor: Float32Array;
    detection: T;
  }
  export class TinyFaceDetectorOptions {
    constructor(options?: { inputSize?: number; scoreThreshold?: number });
  }
  export function detectAllFaces(input: HTMLImageElement | HTMLVideoElement, options?: TinyFaceDetectorOptions): {
    withFaceLandmarks: () => { withFaceDescriptors: () => Promise<Array<WithFaceDescriptor<FaceDetection> & { detection: { box: Box }; descriptor: Float32Array }>> };
  };
  export function detectSingleFace(input: HTMLImageElement | HTMLVideoElement, options?: TinyFaceDetectorOptions): {
    withFaceLandmarks: () => { withFaceDescriptor: () => Promise<(WithFaceDescriptor<FaceDetection> & { detection: { box: Box }; descriptor: Float32Array }) | undefined> };
  };
  export const nets: {
    tinyFaceDetector: { loadFromUri: (url: string) => Promise<void> };
    faceLandmark68Net: { loadFromUri: (url: string) => Promise<void> };
    faceRecognitionNet: { loadFromUri: (url: string) => Promise<void> };
  };
}
