import type { PackageId } from '@/lib/routing';

type Region = { x: number; y: number; rx: number; ry: number };
type MotionParts = {
  width: number; height: number; ink: string;
  eyes: readonly [Region, Region]; mouth: Region;
  hand: Region;
  skin: { x: number; y: number; width: number; height: number };
  glint: string;
};

// Coordinates refer to the unchanged, trimmed runtime artwork, not a new character drawing.
export const petMotionParts: Record<PackageId, MotionParts> = {
  scout: {
    width: 512, height: 490, ink: '#625d36',
    eyes: [{ x: 209, y: 137, rx: 31, ry: 40 }, { x: 362, y: 182, rx: 29, ry: 38 }],
    mouth: { x: 275, y: 204, rx: 42, ry: 23 },
    hand: { x: 480, y: 335, rx: 68, ry: 88 },
    skin: { x: 267, y: 119, width: 28, height: 24 },
    glint: 'M71 179 Q76 155 97 153',
  },
  warden: {
    width: 512, height: 431, ink: '#34483b',
    eyes: [{ x: 170, y: 121, rx: 33, ry: 41 }, { x: 346, y: 123, rx: 32, ry: 41 }],
    mouth: { x: 256, y: 166, rx: 46, ry: 24 },
    hand: { x: 478, y: 275, rx: 70, ry: 76 },
    skin: { x: 241, y: 91, width: 28, height: 24 },
    glint: 'M177 223 Q250 202 328 221',
  },
  nexus: {
    width: 466, height: 512, ink: '#284b53',
    eyes: [{ x: 143, y: 242, rx: 28, ry: 34 }, { x: 249, y: 277, rx: 28, ry: 34 }],
    mouth: { x: 184, y: 294, rx: 31, ry: 20 },
    hand: { x: 407, y: 409, rx: 62, ry: 72 },
    skin: { x: 186, y: 184, width: 24, height: 24 },
    glint: 'M271 419 Q292 412 304 395',
  },
  atlas: {
    width: 512, height: 297, ink: '#594036',
    eyes: [{ x: 186, y: 161, rx: 25, ry: 32 }, { x: 354, y: 162, rx: 25, ry: 32 }],
    mouth: { x: 270, y: 190, rx: 36, ry: 18 },
    hand: { x: 487, y: 201, rx: 53, ry: 57 },
    skin: { x: 252, y: 137, width: 28, height: 24 },
    glint: 'M270 61 Q278 84 296 91 M270 61 L266 78',
  },
};
