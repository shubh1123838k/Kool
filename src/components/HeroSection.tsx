import { useEffect, useRef } from 'react';

interface HeroSectionProps {
  motionEnabled: boolean;
}

export function HeroSection({ motionEnabled }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const heroMediaRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const heroMedia = heroMediaRef.current;
    const glassCanvas = canvasRef.current;
    if (!hero || !heroMedia || !glassCanvas) return;

    const glassContext = glassCanvas.getContext('2d', { alpha: true });
    if (!glassContext) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 701px)');
    let glassWidth = 0;
    let glassHeight = 0;
    let glassFrame = 0;
    let glassLastPaint = 0;
    let glassInView = true;
    let heroScrolling = false;
    let heroScrollTimer = 0;
    let heroPointerFrame = 0;
    const glassPointer = { x: 0, y: 0, strength: 0, target: 0 };

    const paintHeroGlass = (time: number) => {
      if (!glassWidth || !glassHeight) return;
      const ctx = glassContext;
      const w = glassWidth;
      const h = glassHeight;
      ctx.clearRect(0, 0, w, h);
      glassPointer.strength += (glassPointer.target - glassPointer.strength) * 0.11;
      const phase = time * 0.001;
      const ribWidth = w < 700 ? 15 : 19;

      for (let x = -ribWidth, i = 0; x < w + ribWidth; x += ribWidth, i++) {
        const center = Math.exp(-Math.pow((x - w * 0.5) / (w * 0.38), 2));
        const edge = Math.min(1, x / (w * 0.14), (w - x) / (w * 0.14));
        const alpha = Math.max(0, edge) * (0.022 + center * 0.09);
        if (alpha < 0.002) continue;
        const positions: Array<[number, number]> = [];
        for (let y = 0; y <= h + 24; y += 24) {
          const dx = (x - glassPointer.x) / (w * 0.17);
          const dy = (y - glassPointer.y) / (h * 0.23);
          const touch = glassPointer.strength * Math.exp(-dx * dx - dy * dy);
          const flow =
            Math.sin(phase * 1.45 + y * 0.011 + i * 0.3) * (1.4 + center * 3.8) +
            Math.sin(phase * 0.83 - y * 0.018 + i * 0.17) * (1 + center * 2.1);
          const bend = touch * Math.sin(phase * 2.1 + y * 0.019 + i * 0.54) * 12;
          positions.push([x + flow + bend, y]);
        }
        ctx.beginPath();
        positions.forEach(([px, py], index) => (index ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
        ctx.strokeStyle =
          i % 5 === 0 ? `rgba(227,142,105,${alpha * 1.15})` : `rgba(240,226,207,${alpha})`;
        ctx.lineWidth = ribWidth * 0.3;
        ctx.stroke();

        ctx.beginPath();
        positions.forEach(([px, py], index) =>
          index ? ctx.lineTo(px + ribWidth * 0.25, py) : ctx.moveTo(px + ribWidth * 0.25, py)
        );
        ctx.strokeStyle = `rgba(0,0,0,${alpha * 1.8})`;
        ctx.lineWidth = ribWidth * 0.17;
        ctx.stroke();
      }
    };

    const animateHeroGlass = (time: number) => {
      if (!motionEnabled || document.hidden || !glassInView || heroScrolling) {
        glassFrame = 0;
        return;
      }
      glassFrame = requestAnimationFrame(animateHeroGlass);
      if (time - glassLastPaint < 42) return;
      glassLastPaint = time;
      paintHeroGlass(time);
    };

    const syncHeroGlass = () => {
      if (motionEnabled && !document.hidden && glassInView && !heroScrolling) {
        if (!glassFrame) glassFrame = requestAnimationFrame(animateHeroGlass);
      } else {
        cancelAnimationFrame(glassFrame);
        glassFrame = 0;
        glassPointer.target = 0;
        paintHeroGlass(0);
      }
    };

    const sizeHeroGlass = () => {
      const bounds = hero.getBoundingClientRect();
      glassWidth = bounds.width;
      glassHeight = bounds.height;
      if (!glassWidth || !glassHeight) return;
      const scale = Math.min(1, 1200 / glassWidth, 750 / glassHeight);
      glassCanvas.width = Math.round(glassWidth * scale);
      glassCanvas.height = Math.round(glassHeight * scale);
      glassContext.setTransform(scale, 0, 0, scale, 0, 0);
      glassPointer.x = glassWidth / 2;
      glassPointer.y = glassHeight / 2;
      if (!motionEnabled) paintHeroGlass(0);
    };

    const resizeObserver = new ResizeObserver(sizeHeroGlass);
    resizeObserver.observe(hero);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      glassInView = entry.isIntersecting;
      syncHeroGlass();
    });
    intersectionObserver.observe(hero);

    const onScroll = () => {
      if (!glassInView || !motionEnabled) return;
      if (!heroScrolling) {
        heroScrolling = true;
        hero.classList.add('hero-scrolling');
        cancelAnimationFrame(glassFrame);
        glassFrame = 0;
      }
      window.clearTimeout(heroScrollTimer);
      heroScrollTimer = window.setTimeout(() => {
        heroScrolling = false;
        hero.classList.remove('hero-scrolling');
        syncHeroGlass();
      }, 180);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!motionEnabled || document.hidden || !finePointer.matches) return;
      if (heroPointerFrame) cancelAnimationFrame(heroPointerFrame);
      heroPointerFrame = requestAnimationFrame(() => {
        heroPointerFrame = 0;
        const bounds = hero.getBoundingClientRect();
        const x = Math.max(-5, Math.min(5, ((event.clientX - bounds.left) / bounds.width - 0.5) * 10));
        const y = Math.max(-5, Math.min(5, ((event.clientY - bounds.top) / bounds.height - 0.5) * 10));
        heroMedia.style.setProperty('--hero-bg-x', `${x * 1.6}px`);
        heroMedia.style.setProperty('--hero-bg-y', `${y * 1.6}px`);
        heroMedia.style.setProperty('--hero-bg-x-soft', `${x * 0.8}px`);
        heroMedia.style.setProperty('--hero-bg-y-soft', `${y * 0.8}px`);
        glassPointer.x = event.clientX - bounds.left;
        glassPointer.y = event.clientY - bounds.top;
        glassPointer.target = 1;
      });
    };

    const onPointerLeave = () => {
      cancelAnimationFrame(heroPointerFrame);
      heroPointerFrame = 0;
      glassPointer.target = 0;
      for (const name of ['--hero-bg-x', '--hero-bg-y', '--hero-bg-x-soft', '--hero-bg-y-soft']) {
        heroMedia.style.removeProperty(name);
      }
    };

    const onVisibility = () => syncHeroGlass();

    if (!motionEnabled) {
      for (const name of ['--hero-bg-x', '--hero-bg-y', '--hero-bg-x-soft', '--hero-bg-y-soft']) {
        heroMedia.style.removeProperty(name);
      }
    }

    sizeHeroGlass();
    syncHeroGlass();

    window.addEventListener('scroll', onScroll, { passive: true });
    hero.addEventListener('pointermove', onPointerMove);
    hero.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(glassFrame);
      cancelAnimationFrame(heroPointerFrame);
      window.clearTimeout(heroScrollTimer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [motionEnabled]);

  return (
    <section id="home" className="hero" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero-media" ref={heroMediaRef} aria-hidden="true">
        <div className="hero-aurora hero-aurora-one" />
        <div className="hero-aurora hero-aurora-two" />
        <div className="hero-aurora-light" />
        <div className="hero-fluted-glass">
          <canvas className="hero-glass-canvas" ref={canvasRef} />
        </div>
        <div className="hero-grain" />
      </div>

      <div className="hero-copy">
        <p className="hero-name">Shubh Jain</p>
        <h1
          id="hero-title"
          data-mask
          tabIndex={0}
          aria-label="I build what doesn’t exist. On hover or focus: It didn’t. Now it does."
        >
          <span className="hero-state hero-before" aria-hidden="true">
            <span className="hero-line">
              <span>I</span>
            </span>
            <span className="hero-line red">
              <span>BUILD</span>
            </span>
            <span className="hero-line red">
              <span>WHAT</span>
            </span>
            <span className="hero-line">
              <span>DOESN’T</span>
            </span>
            <span className="hero-line">
              <span>EXIST.</span>
            </span>
          </span>
          <span className="hero-state hero-after" aria-hidden="true">
            <span className="hero-line">
              <span>IT</span>
            </span>
            <span className="hero-line red">
              <span>DIDN’T.</span>
            </span>
            <span className="hero-line red">
              <span>NOW</span>
            </span>
            <span className="hero-line">
              <span>IT</span>
            </span>
            <span className="hero-line">
              <span>DOES.</span>
            </span>
          </span>
        </h1>
      </div>

      <a className="scroll-cue" href="#about" aria-label="Go to about section">
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
