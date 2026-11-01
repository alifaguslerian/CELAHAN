'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { PackageId } from '@/lib/routing';

const dimensions = { scout: [512, 490], warden: [512, 431], nexus: [466, 512], atlas: [512, 297] } as const;

export function Pet({ id, eager = false }: { id: PackageId; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="pet-fallback">{id.toUpperCase()}</span>;
  return <Image src={`/artwork/${id}.webp`} alt="" width={dimensions[id][0]} height={dimensions[id][1]} unoptimized loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />;
}
