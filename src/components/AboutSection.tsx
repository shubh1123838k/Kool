import { useEffect, useRef } from 'react';
import { createLanyard } from '../utils/lanyardEngine';

export function AboutSection() {
  const lanyardHostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = lanyardHostRef.current;
    if (!host) return;

    let cancelled = false;
    let cleanupLanyard: (() => void) | undefined;

    async function mountBadge() {
      if (!host) return;
      const portrait = new Image();
      portrait.src = '/assets/aistudio/vk_cf40c240.png';
      await portrait.decode();
      if (cancelled) return;

      const face = document.createElement('canvas');
      face.width = 1024;
      face.height = 1440;
      const ctx = face.getContext('2d');
      if (!ctx) {
        host.classList.add('lanyard-failed');
        return;
      }

      const cardBackground = ctx.createLinearGradient(0, 0, 1024, 1440);
      cardBackground.addColorStop(0, '#d6d0c4');
      cardBackground.addColorStop(0.55, '#c5beb2');
      cardBackground.addColorStop(1, '#afa89d');
      ctx.fillStyle = cardBackground;
      ctx.fillRect(0, 0, 1024, 1440);

      const topOffset = 175;
      const portraitHeight = 1440 - topOffset;
      const portraitWidth = (portraitHeight * portrait.width) / portrait.height;
      ctx.drawImage(portrait, (1024 - portraitWidth) / 2, topOffset, portraitWidth, portraitHeight);

      const front = face.toDataURL('image/png');
      cleanupLanyard = createLanyard(host, {
        frontImage: front,
        backImage: front,
        imageFit: 'contain',
        cardColor: '#c8c1b5',
        strapColor: '#25231f',
        size: 0.9,
        strapLength: 0.01,
        strapWidth: 0.55,
        finish: 'matte',
        metal: 'silver',
        damping: 0.5,
        elasticity: 0.5,
        breeze: 0.5,
        intro: false,
      });

      if (cancelled) {
        cleanupLanyard?.();
        return;
      }

      if (!cleanupLanyard) {
        host.classList.add('lanyard-failed');
        return;
      }

      host.classList.add('lanyard-ready');
    }

    mountBadge().catch(() => {
      if (!cancelled && host) {
        host.classList.add('lanyard-failed');
      }
    });

    return () => {
      cancelled = true;
      cleanupLanyard?.();
      host.classList.remove('lanyard-ready', 'lanyard-failed');
    };
  }, []);

  return (
    <section id="about" className="about content-section" aria-labelledby="about-title">
      <div className="content-wrap">
        <h2 className="section-label about-title" id="about-title" data-mask data-alt="WHO AM I">
          ABOUT
        </h2>

        <div className="about-main">
          <div className="about-copy">
            <h3 className="about-headline" data-mask tabIndex={0}>
              <span data-alt="QUIET MIND.">QUIET MIND.</span>
              <em data-alt="LOUD IDEAS.">LOUD IDEAS.</em>
            </h3>
            <p className="about-intro">
              I'm Shubh Jain, Founder at Arcitic based in Bengaluru, India, with a deep interest in
              Python programming, AI/ML, and Data Science.
            </p>
            <p className="about-description">
              I love turning real-world data into actionable insights with NumPy, Pandas, and
              Matplotlib—building Weather Data Analyzers, Telegram Bots, and Chat Assistants in VS
              Code as I grow into a full-stack AI developer.
            </p>
          </div>

          <div
            className="about-lanyard"
            id="about-lanyard"
            ref={lanyardHostRef}
            aria-label="Shubh Jain identity card; draggable 3D portrait"
          >
            <figure className="about-photo-card">
              <img
                src="/assets/aistudio/vk_cf40c240.png"
                width={440}
                height={440}
                loading="eager"
                referrerPolicy="no-referrer"
                alt="Portrait on Shubh Jain identity card"
              />
            </figure>
          </div>
        </div>

        <div className="about-notes">
          <div>
            <h4 className="about-detail-label">Experience</h4>
            <p>
              Founder @Arcitic
              <span className="about-detail-secondary">
                March 2025 – Present · Prompt Engineering &amp; Practical AI
              </span>
            </p>
          </div>
          <div className="about-education">
            <h4 className="about-detail-label">Education</h4>
            <p>
              Central Board of Secondary Education
              <span className="about-detail-secondary">10th · 2025 · State Tournament Award</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
