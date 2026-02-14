/**
 * Face recognition using face-api.js (browser only).
 * Load models from /models (see README for model files).
 */
import * as faceApi from "face-api.js";
import type { PersonForRecognition } from "./api";

const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights";
// Larger inputSize (416) helps detect smaller/distant faces (e.g. on a phone screen).
// Lower scoreThreshold (0.3) keeps detections that would otherwise be dropped.
const DETECTION_OPTIONS = new faceApi.TinyFaceDetectorOptions({
  inputSize: 416,
  scoreThreshold: 0.3,
});
// Slightly relaxed so different angles/lighting (e.g. from a screen) still match.
const MATCH_THRESHOLD = 0.65;

let modelsLoaded = false;

export async function loadFaceApiModels(): Promise<boolean> {
  if (modelsLoaded) return true;
  try {
    await Promise.all([
      faceApi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceApi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceApi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
    return true;
  } catch (e) {
    console.error("Face API models failed to load:", e);
    return false;
  }
}

export function isModelsLoaded(): boolean {
  return modelsLoaded;
}

export type FaceMatch = {
  personId: number;
  name: string;
  relationship: string;
  box: { x: number; y: number; width: number; height: number };
};

function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

/**
 * Find best matching person for a descriptor from the list of people with descriptors.
 * Returns null if no match above threshold.
 */
function findBestMatch(
  descriptor: Float32Array,
  people: PersonForRecognition[]
): { person: PersonForRecognition; distance: number } | null {
  let best: { person: PersonForRecognition; distance: number } | null = null;
  const desc = Array.from(descriptor);
  for (const person of people) {
    const d = person.face_descriptor;
    if (!d || d.length !== 128) continue;
    const distance = euclideanDistance(desc, d);
    if (distance < MATCH_THRESHOLD && (best === null || distance < best.distance)) {
      best = { person, distance };
    }
  }
  return best;
}

export type UnknownFace = {
  box: { x: number; y: number; width: number; height: number };
};

export type DetectionResult = {
  matches: FaceMatch[];
  unknownFaces: UnknownFace[];
  unknownCount: number;
};

/**
 * Detect faces in video element and match against people with descriptors.
 */
export async function detectAndMatch(
  video: HTMLVideoElement,
  people: PersonForRecognition[]
): Promise<DetectionResult> {
  const peopleWithDesc = people.filter((p) => p.face_descriptor && p.face_descriptor.length === 128);
  const detections = await faceApi
    .detectAllFaces(video, DETECTION_OPTIONS)
    .withFaceLandmarks()
    .withFaceDescriptors();

  const matches: FaceMatch[] = [];
  const unknownFaces: UnknownFace[] = [];

  for (const det of detections) {
    const box = det.detection.box;
    const match = findBestMatch(det.descriptor, peopleWithDesc);
    if (match) {
      matches.push({
        personId: match.person.id,
        name: match.person.name,
        relationship: match.person.relationship,
        box: { x: box.x, y: box.y, width: box.width, height: box.height },
      });
    } else {
      unknownFaces.push({
        box: { x: box.x, y: box.y, width: box.width, height: box.height },
      });
    }
  }

  return {
    matches,
    unknownFaces,
    unknownCount: unknownFaces.length,
  };
}

/**
 * Get face descriptor from a single image (for adding a new person).
 */
export async function getDescriptorFromImage(img: HTMLImageElement): Promise<Float32Array | null> {
  const det = await faceApi
    .detectSingleFace(img, DETECTION_OPTIONS)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return det?.descriptor ?? null;
}
