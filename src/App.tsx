import { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ContactAndFooter } from './components/ContactAndFooter';
import { HeroSection } from './components/HeroSection';
import { MaskLensOverlay } from './components/MaskLensOverlay';
import { ProjectsSection } from './components/ProjectsSection';
import { SiteChrome } from './components/SiteChrome';
import { SkillsSection } from './components/SkillsSection';
import { TearIntro } from './components/TearIntro';
import { NAV_ITEMS } from './data/portfolioData';
import { computeActiveSectionId } from './utils/portfolioLogic';

function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export default function App() {
  const [introActive, setIntroActive] = useState<boolean>(() => !shouldSkipIntro());
  const [motionEnabled, setMotionEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const motionPref = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionPrefChange = (event: MediaQueryListEvent) => {
      setMotionEnabled(!event.matches);
    };
    motionPref.addEventListener('change', onMotionPrefChange);
    return () => motionPref.removeEventListener('change', onMotionPrefChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('motion-off', !motionEnabled);
  }, [motionEnabled]);

  // Reveal observer
  useEffect(() => {
    if (!motionEnabled || !('IntersectionObserver' in window)) {
      document.body.classList.remove('motion-ready');
      return;
    }

    document.body.classList.add('motion-ready');
    const markRevealed = (el: Element) => {
      el.classList.add('in-view');
      el.setAttribute('data-revealed', '1');
    };

    const reveals = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markRevealed(entry.target);
            reveals.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04 }
    );

    const checkViewportReveals = () => {
      document.querySelectorAll('.reveal:not([data-revealed="1"])').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
          markRevealed(el);
          reveals.unobserve(el);
        }
      });
    };

    document.querySelectorAll('.reveal').forEach((el) => reveals.observe(el));
    checkViewportReveals();
    window.addEventListener('scroll', checkViewportReveals, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkViewportReveals);
      reveals.disconnect();
      document.body.classList.remove('motion-ready');
    };
  }, [motionEnabled]);

  // Scroll-spy for nav active state
  useEffect(() => {
    let queued = false;
    const updateSection = () => {
      queued = false;
      const metrics = NAV_ITEMS.map((item) => {
        const el = document.getElementById(item.id);
        return {
          id: item.id,
          top: el ? el.getBoundingClientRect().top : Number.POSITIVE_INFINITY,
        };
      });
      setActiveSection(computeActiveSectionId(metrics, window.innerHeight));
    };

    const onScrollOrResize = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(updateSection);
      }
    };

    updateSection();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return (
    <>
      <TearIntro active={introActive} onComplete={() => setIntroActive(false)} />

      <SiteChrome
        activeSection={activeSection}
        motionEnabled={motionEnabled}
        onToggleMotion={() => setMotionEnabled((prev) => !prev)}
      />

      <main id="main">
        <HeroSection motionEnabled={motionEnabled} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactAndFooter motionEnabled={motionEnabled} />
      </main>

      <MaskLensOverlay motionEnabled={motionEnabled} />
    </>
  );
}
