'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import type { PackageId } from '@/lib/routing';
import { Pet } from './pet';
import { petMotionParts } from './pet-motion-data';

export function PetMotion({ id, entrance = false }: { id: PackageId; entrance?: boolean }) {
  const root = useRef<HTMLSpanElement>(null);
  const unique = useId().replaceAll(':', '');
  const [ready, setReady] = useState(false);
  const parts = petMotionParts[id];
  const source = `/artwork/${id}.webp`;
  const regions = [...parts.eyes, parts.mouth];
  const lensMap = id === 'scout' ? '<defs><radialGradient id="lens"><stop stop-color="rgb(65,160,128)"/><stop offset="1" stop-color="rgb(128,128,128)"/></radialGradient></defs><ellipse cx="105" cy="184" rx="90" ry="155" fill="url(#lens)"/>' : '';
  const handMap = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${parts.width}" height="${parts.height}"><defs><radialGradient id="hand"><stop stop-color="rgb(144,235,128)"/><stop offset="1" stop-color="rgb(128,128,128)"/></radialGradient></defs><rect width="100%" height="100%" fill="rgb(128,128,128)"/><ellipse cx="${parts.hand.x}" cy="${parts.hand.y}" rx="${parts.hand.rx}" ry="${parts.hand.ry}" fill="url(#hand)"/>${lensMap}</svg>`)}`;

  useEffect(() => {
    const image = root.current?.querySelector('img');
    let disposed = false;
    if (image) void image.decode().then(() => { if (!disposed) setReady(true); }).catch(() => { /* Keep the ordinary artwork fallback. */ });
    return () => { disposed = true; };
  }, [id]);

  useEffect(() => {
    const element = root.current;
    if (!element || !ready) return;
    const host = element.closest('a, button') ?? element;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let animations: Animation[] = [], generation = 0, visible = false;
    const stop = () => {
      generation++; animations.forEach((animation) => animation.cancel()); animations = [];
      if (element.dataset.active === 'true') element.querySelectorAll<SVGAnimationElement>('animate').forEach((animation) => animation.endElement());
      delete element.dataset.active;
    };
    const greet = () => {
      if (reduced.matches || !visible || document.hidden || element.dataset.active === 'true') return;
      stop(); const current = generation; element.dataset.active = 'true';
      const animate = (selector: string, frames: Keyframe[], duration = 1400) => {
        element.querySelectorAll<SVGElement>(selector).forEach((part) => {
          animations.push(part.animate(frames.map((frame) => ({ ...frame, easing: 'cubic-bezier(.23, 1, .32, 1)' })), { duration, easing: 'linear' }));
        });
      };
      animate('[data-part=body]', [{ transform: 'none' }, { transform: 'translateY(-3px) rotate(-.8deg)', offset: .35 }, { transform: 'none' }]);
      element.querySelectorAll<SVGAnimationElement>('animate').forEach((animation) => animation.beginElement());
      animate('[data-part=eye]', [{ transform: 'scaleY(1)', offset: 0 }, { transform: 'scaleY(1)', offset: .12 }, { transform: 'scaleY(.08)', offset: .17 }, { transform: 'scaleY(1)', offset: .23 }, { transform: 'scaleY(1)', offset: 1 }]);
      animate('[data-part=eyelid]', [{ opacity: 0 }, { opacity: 0, offset: .11 }, { opacity: 1, offset: .12 }, { opacity: 1, offset: .23 }, { opacity: 0, offset: .24 }, { opacity: 0 }]);
      animate('[data-part=mouth]', [{ transform: 'none' }, { transform: 'scale(1.05, 1.1)', offset: .45 }, { transform: 'none' }]);
      animate('[data-part=brow]', [{ opacity: 0, transform: 'none' }, { opacity: .6, transform: 'translateY(-4px)', offset: .35 }, { opacity: 0, transform: 'none' }]);
      animate('[data-part=glint]', [{ opacity: 0 }, { opacity: .7, offset: .35 }, { opacity: 0 }]);
      void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
        if (generation === current) stop();
      });
    };
    const hover = () => { if (fine.matches) greet(); };
    const hide = () => { if (document.hidden) stop(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) stop(); });
    observer.observe(element);
    host.addEventListener('pointerenter', hover); host.addEventListener('focusin', greet);
    if (host.matches('button')) host.addEventListener('click', greet);
    document.addEventListener('visibilitychange', hide); reduced.addEventListener('change', stop);
    const timer = entrance ? setTimeout(greet, 550) : undefined;
    return () => {
      clearTimeout(timer); stop(); observer.disconnect();
      host.removeEventListener('pointerenter', hover); host.removeEventListener('focusin', greet); host.removeEventListener('click', greet);
      document.removeEventListener('visibilitychange', hide); reduced.removeEventListener('change', stop);
    };
  }, [ready, entrance, id]);

  const image = <image href={source} width={parts.width} height={parts.height} />;
  const origin = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px` });
  return <span ref={root} className="pet-motion" data-pet={id} data-ready={ready} aria-hidden="true">
    <span className="pet-still"><Pet id={id} eager={entrance} /></span>
    <svg className="pet-art" viewBox={`0 0 ${parts.width} ${parts.height}`} preserveAspectRatio="xMidYMax meet" focusable="false" aria-hidden="true">
      <defs>
        {regions.map((region, index) => <clipPath key={index} id={`${unique}-region-${index}`}><ellipse cx={region.x} cy={region.y} rx={region.rx} ry={region.ry} /></clipPath>)}
        <filter id={`${unique}-hand`} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
          <feImage href={handMap} result="hand" x="0" y="0" width={parts.width} height={parts.height} />
          <feDisplacementMap in="SourceGraphic" in2="hand" scale="0" xChannelSelector="R" yChannelSelector="G">
            <animate attributeName="scale" values="0;24;-5;14;0" keyTimes="0;.24;.5;.7;1" calcMode="spline" keySplines=".23 1 .32 1;.77 0 .175 1;.77 0 .175 1;.23 1 .32 1" dur="1.4s" begin="indefinite" />
          </feDisplacementMap>
        </filter>
      </defs>
      <g data-part="body" style={origin(parts.width / 2, parts.height)}>
        <image href={source} width={parts.width} height={parts.height} filter={`url(#${unique}-hand)`} />
        {parts.eyes.map((region, index) => <g key={index} className="pet-layer" data-part="eyelid" clipPath={`url(#${unique}-region-${index})`}>
          <svg x={region.x - region.rx} y={region.y - region.ry} width={region.rx * 2} height={region.ry * 2} viewBox={`${parts.skin.x} ${parts.skin.y} ${parts.skin.width} ${parts.skin.height}`} preserveAspectRatio="none">{image}</svg>
        </g>)}
        {regions.map((region, index) => <g key={index} className="pet-layer" data-part={index === 2 ? 'mouth' : 'eye'} style={origin(region.x, region.y)}><g clipPath={`url(#${unique}-region-${index})`}>{image}</g></g>)}
        <g data-part="brow" opacity="0" fill="none" stroke={parts.ink} strokeWidth="5" strokeLinecap="round">
          {parts.eyes.map((eye, index) => <path key={index} d={`M${eye.x - 12} ${eye.y - eye.ry - 9} q12 -7 24 0`} />)}
        </g>
        <path data-part="glint" d={parts.glint} opacity="0" fill="none" stroke="#f5edd7" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  </span>;
}
