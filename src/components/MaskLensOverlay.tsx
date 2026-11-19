import { useEffect, useRef } from 'react';

interface MaskLensOverlayProps {
  motionEnabled: boolean;
}

export function MaskLensOverlay({ motionEnabled }: MaskLensOverlayProps) {
  const maskRef = useRef<HTMLDivElement | null>(null);
  const maskCopyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mask = maskRef.current;
    const maskCopy = maskCopyRef.current;
    if (!mask || !maskCopy) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 701px)');
    let activeMask: Element | null = null;
    let maskFrame = 0;
    let maskLastFrame = 0;
    let pointerActive = false;
    let pointer = { x: -1000, y: -1000 };
    const lens = { x: -1000, y: -1000, radius: 0 };
    let pointerKnown = false;
    let scrollingCursor = false;
    let scrollCursorTimer = 0;

    const hoverClasses = [
      'skills-title-hover',
      'about-title-hover',
      'projects-title-hover',
      'contact-title-hover',
      'motto-title-hover',
      'hero-title-hover',
    ];

    const positionMaskCopy = () => {
      if (!activeMask) return;
      const rect = activeMask.getBoundingClientRect();
      if (activeMask.id === 'hero-title') {
        const hero = document.querySelector('.hero');
        const firstChild = maskCopy.firstElementChild as HTMLElement | null;
        if (firstChild) {
          const typography = getComputedStyle(activeMask);
          const props = [
            'fontFamily',
            'fontSize',
            'fontWeight',
            'lineHeight',
            'letterSpacing',
            'textAlign',
            'textTransform',
          ] as const;
          props.forEach((prop) => {
            firstChild.style[prop] = typography[prop];
          });
        }
        const name = hero?.querySelector('.hero-name');
        const nameCopy = maskCopy.querySelector<HTMLElement>('.hero-mask-name');
        if (name && nameCopy) {
          const nameRect = name.getBoundingClientRect();
          nameCopy.style.left = `${nameRect.left - rect.left}px`;
          nameCopy.style.top = `${nameRect.top - rect.top}px`;
          nameCopy.style.width = `${nameRect.width}px`;
          const nameStyle = getComputedStyle(name);
          const props = [
            'fontFamily',
            'fontSize',
            'fontWeight',
            'lineHeight',
            'letterSpacing',
            'textAlign',
            'textTransform',
          ] as const;
          props.forEach((prop) => {
            nameCopy.style[prop] = nameStyle[prop];
          });
          nameCopy.style.setProperty('padding-left', nameStyle.paddingLeft, 'important');
        }
      }
      if (activeMask.classList.contains('projects-title')) {
        mask.style.setProperty('--project-lens-bottom', `${rect.bottom + 12}px`);
      }
      maskCopy.style.left = `${rect.left}px`;
      maskCopy.style.top = `${rect.top}px`;
      maskCopy.style.width = `${rect.width}px`;
    };

    const setMaskTarget = (target: Element | null) => {
      if (target === activeMask) return;
      activeMask = target;
      maskCopy.replaceChildren();
      const motto = document.querySelector('.motto');
      document.body.classList.toggle('skills-title-hover', !!target?.classList.contains('skills-title'));
      document.body.classList.toggle('about-title-hover', !!target?.classList.contains('about-title'));
      document.body.classList.toggle('projects-title-hover', !!target?.classList.contains('projects-title'));
      document.body.classList.toggle('contact-title-hover', !!target?.classList.contains('contact-title'));
      document.body.classList.toggle('motto-title-hover', !!motto && target === motto);
      document.body.classList.toggle('hero-title-hover', target?.id === 'hero-title');
      if (!target) return;

      const clone = target.cloneNode(true) as HTMLElement;
      clone.removeAttribute('id');
      clone.removeAttribute('data-mask');
      if (clone.dataset.alt) clone.textContent = clone.dataset.alt;
      clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
      clone.querySelectorAll<HTMLElement>('[data-alt]').forEach((el) => {
        if (el.dataset.alt) el.textContent = el.dataset.alt;
      });
      if (target.id === 'hero-title') {
        clone.classList.add('hero-mask-title');
        clone.removeAttribute('tabindex');
        clone.removeAttribute('aria-label');
        clone.querySelector('.hero-before')?.remove();
      }
      maskCopy.append(clone);

      if (target.id === 'hero-title') {
        const heroName = document.querySelector('.hero .hero-name');
        if (heroName) {
          const nameCopy = heroName.cloneNode(true) as HTMLElement;
          nameCopy.classList.add('hero-mask-name');
          maskCopy.append(nameCopy);
        }
      }
      positionMaskCopy();
    };

    const isPointerOverMottoHeading = () => {
      const motto = document.querySelector('.motto');
      const heading = motto?.querySelector('h2');
      if (!motto || !heading) return false;
      const bounds = heading.getBoundingClientRect();
      return (
        pointer.x >= bounds.left &&
        pointer.x < bounds.right &&
        pointer.y >= bounds.top &&
        pointer.y < bounds.bottom &&
        document.elementFromPoint(pointer.x, pointer.y)?.closest('.motto') === motto
      );
    };

    const isPointerOverHeroWords = () => {
      const hero = document.querySelector('.hero');
      if (!hero) return false;
      return [...hero.querySelectorAll('.hero-before .hero-line > span, .hero-name')].some((line) => {
        const range = document.createRange();
        range.selectNodeContents(line);
        return [...range.getClientRects()].some(
          (rect) =>
            pointer.x >= rect.left &&
            pointer.x <= rect.right &&
            pointer.y >= rect.top &&
            pointer.y <= rect.bottom
        );
      });
    };

    const animateMask = (now: number) => {
      maskFrame = 0;
      if (!pointerActive || !motionEnabled || !finePointer.matches || document.hidden) return;
      const motto = document.querySelector('.motto');
      if (motto && activeMask === motto && !isPointerOverMottoHeading()) setMaskTarget(null);

      const elapsed = maskLastFrame ? Math.min(now - maskLastFrame, 50) : 16.7;
      maskLastFrame = now;
      const ease = 1 - Math.exp(-elapsed / 85);
      const mottoHeading =
        motto && activeMask === motto ? motto.querySelector('h2')?.getBoundingClientRect() ?? null : null;
      const targetX = mottoHeading ? mottoHeading.left + mottoHeading.width / 2 : pointer.x;
      const targetY = mottoHeading ? mottoHeading.top + mottoHeading.height / 2 : pointer.y;

      lens.x += (targetX - lens.x) * ease;
      lens.y += (targetY - lens.y) * ease;

      const desiredRadius = mottoHeading
        ? Math.hypot(mottoHeading.width, mottoHeading.height) / 2 + 32
        : activeMask?.classList.contains('about-description')
          ? Math.min(110, window.innerWidth * 0.11)
          : activeMask
            ? Math.min(225, window.innerWidth * 0.18)
            : 16;

      lens.radius += (desiredRadius - lens.radius) * (1 - Math.exp(-elapsed / (activeMask ? 105 : 60)));
      mask.style.setProperty('--x', `${lens.x}px`);
      mask.style.setProperty('--y', `${lens.y}px`);
      mask.style.setProperty('--radius', `${lens.radius}px`);

      if (activeMask) positionMaskCopy();
      if (
        Math.abs(targetX - lens.x) + Math.abs(targetY - lens.y) + Math.abs(desiredRadius - lens.radius) >
        0.1
      ) {
        maskFrame = requestAnimationFrame(animateMask);
      }
    };

    const hideMask = () => {
      pointerActive = false;
      document.body.classList.remove('pointer-ready');
      cancelAnimationFrame(maskFrame);
      maskFrame = 0;
      maskLastFrame = 0;
      lens.radius = 0;
      setMaskTarget(null);
    };

    const syncMaskWithPointer = () => {
      if (!pointerActive) return;
      const hit = document.elementFromPoint(pointer.x, pointer.y);
      if (hit?.closest('.site-header nav, .media-controls')) {
        hideMask();
        return;
      }
      if (scrollingCursor) {
        setMaskTarget(null);
        if (!maskFrame) maskFrame = requestAnimationFrame(animateMask);
        return;
      }
      if (
        !hit ||
        (hit.closest('.projects-intro') && !hit.closest('.projects-title')) ||
        hit.closest('.message-composer, .about-lanyard, .about-intro, .brand, .social-rail, .skill-disclosure')
      ) {
        hideMask();
        return;
      }
      let target = hit.closest('[data-mask]');
      const hero = document.querySelector('.hero');
      if (hit.closest('.hero') && hero) {
        target = isPointerOverHeroWords() ? hero.querySelector('#hero-title') : null;
      }
      const motto = document.querySelector('.motto');
      setMaskTarget(motto && target === motto && !isPointerOverMottoHeading() ? null : target);
      if (!maskFrame) maskFrame = requestAnimationFrame(animateMask);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !finePointer.matches || !motionEnabled) return;
      pointer = { x: e.clientX, y: e.clientY };
      pointerKnown = true;
      if (!pointerActive) {
        lens.x = pointer.x;
        lens.y = pointer.y;
      }
      pointerActive = true;
      document.body.classList.add('pointer-ready');
      syncMaskWithPointer();
    };

    const onScroll = () => {
      if (!pointerKnown || !finePointer.matches || !motionEnabled || document.hidden) return;
      const hit = document.elementFromPoint(pointer.x, pointer.y);
      if (!hit || hit.closest('.site-header nav, .media-controls')) return;
      scrollingCursor = true;
      window.clearTimeout(scrollCursorTimer);
      if (!pointerActive) {
        lens.x = pointer.x;
        lens.y = pointer.y;
      }
      pointerActive = true;
      document.body.classList.add('pointer-ready');
      setMaskTarget(null);
      if (!maskFrame) maskFrame = requestAnimationFrame(animateMask);
      scrollCursorTimer = window.setTimeout(() => {
        scrollingCursor = false;
        syncMaskWithPointer();
      }, 180);
    };

    const onLeaveOrReset = () => {
      pointerKnown = false;
      scrollingCursor = false;
      hideMask();
    };

    const onResize = () => {
      positionMaskCopy();
      syncMaskWithPointer();
    };

    const onVisibility = () => {
      if (document.hidden) hideMask();
    };

    if (!motionEnabled) {
      hideMask();
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeaveOrReset);
    document.addEventListener('pointercancel', onLeaveOrReset);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onLeaveOrReset);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    finePointer.addEventListener('change', hideMask);

    return () => {
      hideMask();
      window.clearTimeout(scrollCursorTimer);
      hoverClasses.forEach((cls) => document.body.classList.remove(cls));
      document.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onLeaveOrReset);
      document.removeEventListener('pointercancel', onLeaveOrReset);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onLeaveOrReset);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      finePointer.removeEventListener('change', hideMask);
    };
  }, [motionEnabled]);

  return (
    <div id="mask-layer" ref={maskRef} aria-hidden="true" inert>
      <div id="mask-copy" ref={maskCopyRef} />
    </div>
  );
}
