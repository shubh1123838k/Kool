import { useEffect, useRef, useState } from 'react';
import { computeTearedProgressPercent } from '../utils/portfolioLogic';

interface TearIntroProps {
  active: boolean;
  onComplete: () => void;
}

const SEAM_PATH =
  'M70 0 110 58 32 119 108 184 24 253 116 322 30 389 104 454 22 524 112 592 29 661 118 730 28 798 106 865 34 934 72 1000';

export function TearIntro({ active, onComplete }: TearIntroProps) {
  const [percent, setPercent] = useState(0);
  const [opening, setOpening] = useState(false);
  const [fast, setFast] = useState(false);
  const seamPathRef = useRef<SVGPathElement | null>(null);
  const openingRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    const body = document.body;
    root.classList.add('intro-active');
    body.classList.add('intro-scroll-locked');

    const seamPath = seamPathRef.current;
    const seamLength = seamPath ? seamPath.getTotalLength() : 2000;
    if (seamPath) {
      seamPath.style.strokeDasharray = `${seamLength} ${seamLength}`;
      seamPath.style.strokeDashoffset = String(seamLength);
    }

    const appMain = document.querySelector('main');
    const appHeader = document.querySelector('.site-header');
    const appAside = document.querySelector('.social-rail');
    const appControls = document.querySelector('.media-controls');
    const appFooter = document.querySelector('.final-frame');
    const appMarquee = document.querySelector('.closing-marquee');
    const inertTargets = [appMain, appHeader, appAside, appControls, appFooter, appMarquee].filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    );
    inertTargets.forEach((el) => {
      if (!el.inert) {
        el.dataset.introInert = '';
        el.inert = true;
      }
    });

    let frame = 0;
    let finishTimer = 0;
    let openDelayTimer = 0;
    let failsafeTimer = 0;

    const reveal = (isFast = false, focusHero = false) => {
      if (openingRef.current) return;
      openingRef.current = true;
      cancelAnimationFrame(frame);
      clearTimeout(openDelayTimer);
      clearTimeout(failsafeTimer);
      window.removeEventListener('keydown', dismissOnEscape);

      root.classList.remove('intro-active');
      setOpening(true);
      if (isFast) setFast(true);

      finishTimer = window.setTimeout(() => {
        inertTargets.forEach((el) => {
          if (el.dataset.introInert !== undefined) {
            el.inert = false;
            delete el.dataset.introInert;
          }
        });
        body.classList.remove('intro-scroll-locked');
        onCompleteRef.current();
        if (focusHero) {
          const heading = document.querySelector<HTMLElement>('#hero-title');
          if (heading) {
            heading.focus({ preventScroll: true });
          }
        }
      }, isFast ? 420 : 950);
    };

    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') reveal(true, true);
    };
    window.addEventListener('keydown', dismissOnEscape);

    const motionPref = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) reveal(true, false);
    };
    motionPref.addEventListener('change', onMotionChange);

    const duration = 2450;
    const started = performance.now();

    const step = (now: number) => {
      if (openingRef.current) return;
      const elapsed = now - started;
      const nextPercent = computeTearedProgressPercent(elapsed, duration);
      setPercent(nextPercent);
      if (seamPath) {
        seamPath.style.strokeDashoffset = String(seamLength * (1 - nextPercent / 100));
      }
      if (elapsed < duration) {
        frame = requestAnimationFrame(step);
      } else {
        openDelayTimer = window.setTimeout(() => reveal(false, false), 160);
      }
    };

    frame = requestAnimationFrame(step);
    failsafeTimer = window.setTimeout(() => reveal(true, false), 4450);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(openDelayTimer);
      clearTimeout(finishTimer);
      clearTimeout(failsafeTimer);
      window.removeEventListener('keydown', dismissOnEscape);
      motionPref.removeEventListener('change', onMotionChange);
      root.classList.remove('intro-active');
      body.classList.remove('intro-scroll-locked');
      inertTargets.forEach((el) => {
        if (el.dataset.introInert !== undefined) {
          el.inert = false;
          delete el.dataset.introInert;
        }
      });
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className={`tear-intro${opening ? ' is-opening' : ''}${fast ? ' is-fast' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Opening Shubh Jain portfolio"
    >
      <div className="tear-panel tear-panel-left" aria-hidden="true" />
      <div className="tear-panel tear-panel-right" aria-hidden="true" />
      <svg className="tear-seam" viewBox="0 0 140 1000" preserveAspectRatio="none" aria-hidden="true">
        <path ref={seamPathRef} d={SEAM_PATH} />
      </svg>
      <div className="tear-loader" aria-hidden="true" />
      <div className="tear-progress" aria-hidden="true">
        <span className="tear-progress-number">{String(percent).padStart(2, '0')}</span>
        <span className="tear-progress-percent">%</span>
      </div>
    </div>
  );
}
