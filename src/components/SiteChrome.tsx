import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../data/portfolioData';

interface SiteChromeProps {
  activeSection: string;
  motionEnabled: boolean;
  onToggleMotion: () => void;
}

const SOUND_ASSET = '/assets/audio/portfolio-loop.wav';

export function SiteChrome({ activeSection, motionEnabled, onToggleMotion }: SiteChromeProps) {
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [soundTitle, setSoundTitle] = useState<string | undefined>(undefined);

  const socialRailRef = useRef<HTMLElement | null>(null);
  const mediaControlsRef = useRef<HTMLDivElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const bufferPromiseRef = useRef<Promise<AudioBuffer> | null>(null);
  const fadeTimerRef = useRef<number>(0);
  const soundWantedRef = useRef(false);

  const syncSoundUI = useCallback(() => {
    const ctx = audioCtxRef.current;
    const playing =
      soundWantedRef.current && !!sourceNodeRef.current && ctx?.state === 'running';
    setSoundPlaying(playing);
  }, []);

  const loadSoundBuffer = useCallback((ctx: AudioContext) => {
    if (!bufferPromiseRef.current) {
      bufferPromiseRef.current = fetch(SOUND_ASSET)
        .then((response) => {
          if (!response.ok) throw new Error(`Audio unavailable (${response.status})`);
          return response.arrayBuffer();
        })
        .then((data) => ctx.decodeAudioData(data))
        .catch((error) => {
          bufferPromiseRef.current = null;
          throw error;
        });
    }
    return bufferPromiseRef.current;
  }, []);

  const startSound = useCallback(async () => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      soundWantedRef.current = false;
      setSoundTitle('Audio unsupported in this browser');
      syncSoundUI();
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        ctx.addEventListener('statechange', syncSoundUI);
        const gain = ctx.createGain();
        gain.gain.value = 0;
        gain.connect(ctx.destination);
        gainNodeRef.current = gain;
      }

      const ctx = audioCtxRef.current;
      await ctx.resume().catch(() => {});
      const buffer = await loadSoundBuffer(ctx);
      if (!soundWantedRef.current) return;

      if (!sourceNodeRef.current && gainNodeRef.current) {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(gainNodeRef.current);
        source.start();
        sourceNodeRef.current = source;
      }

      if (gainNodeRef.current) {
        const now = ctx.currentTime;
        gainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
        gainNodeRef.current.gain.linearRampToValueAtTime(0.18, now + 0.4);
      }
      syncSoundUI();
    } catch {
      soundWantedRef.current = false;
      syncSoundUI();
      setSoundTitle('Audio unavailable');
      audioCtxRef.current?.suspend().catch(() => {});
    }
  }, [loadSoundBuffer, syncSoundUI]);

  const handleToggleSound = () => {
    const ctx = audioCtxRef.current;
    const currentlyPlaying =
      soundWantedRef.current && !!sourceNodeRef.current && ctx?.state === 'running';
    window.clearTimeout(fadeTimerRef.current);

    if (currentlyPlaying && ctx && gainNodeRef.current) {
      soundWantedRef.current = false;
      syncSoundUI();
      const now = ctx.currentTime;
      gainNodeRef.current.gain.cancelScheduledValues(now);
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
      gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.4);
      fadeTimerRef.current = window.setTimeout(() => {
        if (!soundWantedRef.current) audioCtxRef.current?.suspend().catch(() => {});
      }, 450);
    } else {
      soundWantedRef.current = true;
      setSoundTitle(undefined);
      void startSound();
    }
  };

  useEffect(() => {
    const onVisibilityChange = () => {
      if (!document.hidden && soundWantedRef.current) {
        audioCtxRef.current?.resume().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.clearTimeout(fadeTimerRef.current);
      try {
        sourceNodeRef.current?.stop();
      } catch {
        // ignore if already stopped
      }
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  useEffect(() => {
    let clearanceFrame = 0;
    const positionControls = () => {
      clearanceFrame = 0;
      const marqueeTrack = document.querySelector('.closing-marquee-track');
      if (!marqueeTrack) return;
      const marqueeTop = marqueeTrack.getBoundingClientRect().top;
      const controls = [socialRailRef.current, mediaControlsRef.current].filter(
        (el): el is HTMLElement => el !== null
      );
      for (const control of controls) {
        const previousShift = Number(control.dataset.marqueeClearance || 0);
        const appliedTransform = new DOMMatrixReadOnly(getComputedStyle(control).transform);
        const naturalBottom = control.getBoundingClientRect().bottom - appliedTransform.m42;
        const neededShift = Math.max(0, Math.ceil(naturalBottom - marqueeTop + 16));
        if (neededShift !== previousShift) {
          control.style.setProperty('--marquee-clearance', `${neededShift}px`);
          control.dataset.marqueeClearance = String(neededShift);
        }
      }
    };

    const queue = () => {
      if (!clearanceFrame) clearanceFrame = requestAnimationFrame(positionControls);
    };

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    document.fonts?.ready.then(queue).catch(() => {});
    queue();

    return () => {
      cancelAnimationFrame(clearanceFrame);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Shubh Jain home">
          <svg className="brand-art" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <defs>
              <clipPath id="brand-disc-clip">
                <circle cx="50" cy="50" r="49" />
              </clipPath>
            </defs>
            <circle className="brand-base" cx="50" cy="50" r="49" />
            <circle className="brand-sweep" cx="50" cy="50" r="49" clipPath="url(#brand-disc-clip)" />
            <circle className="brand-interior" cx="50" cy="50" r="39" />
            <circle className="brand-ring" cx="50" cy="50" r="43" />
          </svg>
          <span className="brand-initials" aria-hidden="true">
            S.J
          </span>
        </a>

        <nav aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={isActive ? 'active' : undefined}
                aria-current={isActive ? 'location' : undefined}
              >
                <span>{item.label}</span>
                <span aria-hidden="true">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </header>

      <aside className="social-rail" ref={socialRailRef} aria-label="Social links">
        <a
          className="social-kk"
          href="https://shubhjain.carrd.co/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Arcitic Website"
        >
          <svg className="social-orbit" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <circle cx="24" cy="24" r="21" />
          </svg>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3.5 9h17M3.5 15h17" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </a>

        <a
          className="social-kk"
          href="https://www.linkedin.com/in/shubh-jain-ai"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <svg className="social-orbit" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <circle cx="24" cy="24" r="21" />
          </svg>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.98 3.5a2.48 2.48 0 1 0 0 4.96 2.48 2.48 0 0 0 0-4.96ZM3 9h4v12H3zm6 0h3.83v1.64h.06c.53-1.01 1.84-2.08 3.79-2.08 4.05 0 4.8 2.66 4.8 6.11V21h-4v-5.61c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" />
          </svg>
        </a>

        <a
          className="social-kk"
          href="mailto:business.shubhjain@gmail.com"
          aria-label="Send email to business.shubhjain@gmail.com"
        >
          <svg className="social-orbit" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <circle cx="24" cy="24" r="21" />
          </svg>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M3 5h18v14H3zM3 5l9 8 9-8" />
          </svg>
        </a>

        <a
          className="resume-rail social-kk"
          href="/assets/aistudio/Profile__4__9bd7f008.pdf"
          download="Shubh-Jain-Resume.pdf"
          aria-label="Download résumé"
        >
          <svg className="social-orbit" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <circle cx="24" cy="24" r="21" />
          </svg>
          <span>CV</span>
        </a>
      </aside>

      <div className="media-controls" ref={mediaControlsRef}>
        <button
          className="motion-toggle"
          aria-pressed={motionEnabled}
          type="button"
          onClick={onToggleMotion}
        >
          Motion <span className="motion-state">{motionEnabled ? 'on' : 'off'}</span>
        </button>
        <button
          className="sound-toggle"
          aria-pressed={soundPlaying}
          type="button"
          title={soundTitle}
          onClick={handleToggleSound}
        >
          Sound <span className="sound-state">{soundPlaying ? 'on' : 'off'}</span>
        </button>
      </div>
    </>
  );
}
