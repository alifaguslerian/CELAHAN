import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('public/artwork', { recursive: true });
const sources = [
  { name: 'hero-mobile', path: 'design/mobile/v1/01-home-hero.png', crop: { left: 0, top: 905, width: 887, height: 735 }, width: 760 },
  { name: 'overview', path: 'design/desktop/v1/01-home-overview.png', crop: { left: 0, top: 545, width: 605, height: 350 }, width: 605 },
] as const;
for (const item of sources) {
  const info = await sharp(item.path).extract(item.crop).resize({ width: item.width, withoutEnlargement: true }).webp({ quality: 86, effort: 6 }).toFile(`public/artwork/${item.name}.webp`);
  console.log(item.name, info.width, info.height, info.size);
}

// Keep the original doorway and every foreground step in one coordinate space.
// The alpha envelope excludes baked UI; the clean opposite pillar supplies its obscured face.
const sceneWidth = 1672, sceneHeight = 885;
const scene = await sharp('design/references/home-hero-desktop-approved-v1.png')
  .extract({ left: 0, top: 0, width: sceneWidth, height: sceneHeight }).removeAlpha().raw().toBuffer();
const originalScene = Buffer.from(scene);
const smooth = (from: number, to: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
const sceneAlpha = Buffer.alloc(sceneWidth * sceneHeight);
for (let y = 0; y < sceneHeight; y++) for (let x = 0; x < sceneWidth; x++) {
  const archRadius = Math.hypot((x - 982) / 245, Math.min(0, y - 248) / 215);
  const arch = 1 - smooth(.94, 1, archRadius);
  const navClearance = Math.max(smooth(74, 86, y), 1 - smooth(1115, 1120, x));
  const doorway = arch * navClearance;
  const foreground = smooth(610, 655, y);
  const edge = smooth(0, 55, x) * (1 - smooth(1617, 1672, x)) * (1 - smooth(855, 885, y));
  sceneAlpha[y * sceneWidth + x] = Math.round(255 * Math.max(doorway, foreground) * edge);
  const opening = 1 - smooth(.97, 1.03, Math.hypot((x - 980) / 143, Math.min(0, y - 248) / 146));
  const stone = doorway * (1 - opening) * (1 - smooth(580, 645, y));
  for (let channel = 0; channel < 3; channel++) {
    const pixel = (y * sceneWidth + x) * 3 + channel;
    // The reference's headline crosses its left pillar. Reuse the clean opposite
    // stone face there, keeping both pillars full-width without baked lettering.
    const pillar = x >= 730 && x <= 840 ? smooth(230, 255, y) * (1 - smooth(610, 645, y)) : 0;
    const opposite = (y * sceneWidth + 1960 - x) * 3 + channel;
    const color = scene[pixel] * (1 - pillar) + (pillar ? originalScene[opposite] * pillar : 0);
    scene[pixel] = Math.min(255, Math.round(color + stone * (color * .35 + [9, 8, 6][channel])));
  }
}
const sceneInfo = await sharp(scene, { raw: { width: sceneWidth, height: sceneHeight, channels: 3 } }).joinChannel(sceneAlpha, { raw: { width: sceneWidth, height: sceneHeight, channels: 1 } })
  .webp({ quality: 88, alphaQuality: 100, effort: 6 }).toFile('public/artwork/hero-desktop.webp');
console.log('hero-desktop', sceneInfo.width, sceneInfo.height, sceneInfo.size);
for (const name of ['scout', 'warden', 'nexus', 'atlas']) {
  const source = `design/mascots/concepts/${name}-v1.png`;
  // Remove the source matte's isolated fringe pixels before downsampling onto the dark site.
  const matte = await sharp(source).extractChannel('alpha').png().toBuffer();
  const { data: alpha, info: mask } = await sharp(matte).threshold(240).dilate(3).greyscale().raw().toBuffer({ resolveWithObject: true });
  const rgb = await sharp(source).removeAlpha().png().toBuffer();
  const cleaned = await sharp(rgb).joinChannel(alpha, { raw: { width: mask.width, height: mask.height, channels: 1 } }).png().toBuffer();
  const info = await sharp(cleaned).trim({ threshold: 8 }).resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true }).webp({ quality: 84, alphaQuality: 95, effort: 6 }).toFile(`public/artwork/${name}.webp`);
  console.log(name, info.width, info.height, info.size);
}
