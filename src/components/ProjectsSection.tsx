import { useEffect, useRef, useState } from 'react';
import { PROJECTS_DATA, type ProjectActionLink, type ProjectCaseStudy } from '../data/portfolioData';

function ActionIcon({ icon }: { icon: ProjectActionLink['icon'] }) {
  if (icon === 'arrow') {
    return (
      <span className="glass-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </span>
    );
  }
  if (icon === 'github') {
    return (
      <span className="glass-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-4.5 1.3-4.5-2.5-6.5-2.5M9 21v-3.1c-3.1-.6-5-2.5-5-5.4 0-1.3.5-2.4 1.3-3.3-.3-.9-.2-1.9.1-2.8 1.2 0 2.3.5 3.2 1.1a11 11 0 0 1 6.8 0c.9-.6 2-1.1 3.2-1.1.3.9.4 1.9.1 2.8.8.9 1.3 2 1.3 3.3 0 2.9-1.9 4.8-5 5.4V21" />
        </svg>
      </span>
    );
  }
  if (icon === 'playstore') {
    return (
      <span className="glass-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 3 14 9L5 21V3Zm0 0 8 9-8 9" />
        </svg>
      </span>
    );
  }
  return (
    <span className="glass-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 6 9 6-9 6V6Z" />
      </svg>
    </span>
  );
}

export function ProjectsSection() {
  const [questionRevealed, setQuestionRevealed] = useState(false);
  const [activeCase, setActiveCase] = useState<ProjectCaseStudy | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const slideRequestRef = useRef(0);

  const openCase = (project: ProjectCaseStudy, slideIndex: number, trigger: HTMLElement | null) => {
    returnFocusRef.current = trigger;
    slideRequestRef.current += 1;
    setActiveCase(project);
    setActiveSlideIndex(slideIndex);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeCase) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.documentElement.classList.add('project-case-open');
      dialog.scrollTop = 0;
      closeButtonRef.current?.focus();

      const slide = activeCase.slides[activeSlideIndex];
      if (slide?.type === 'video') {
        requestAnimationFrame(() => {
          const video = dialog.querySelector<HTMLVideoElement>(
            `.case-slide[data-slide="${activeSlideIndex}"] video`
          );
          video?.play().catch(() => {});
        });
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [activeCase, activeSlideIndex]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('project-case-open');
    };
  }, []);

  const handleCloseDialog = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    slideRequestRef.current += 1;
    dialog.querySelectorAll('video').forEach((video) => video.pause());
    document.documentElement.classList.remove('project-case-open');
    setActiveCase(null);
    returnFocusRef.current?.focus({ preventScroll: true });
  };

  const handleSelectSlide = async (targetIndex: number) => {
    const dialog = dialogRef.current;
    if (!dialog || !activeCase) return;
    const reqId = ++slideRequestRef.current;
    const nextImg = dialog.querySelector<HTMLImageElement>(
      `.case-slide[data-slide="${targetIndex}"] img`
    );
    if (nextImg) {
      await nextImg.decode().catch(() => {});
    }
    if (reqId !== slideRequestRef.current || !dialog.open) return;

    dialog.querySelectorAll('video').forEach((video) => video.pause());
    setActiveSlideIndex(targetIndex);
  };

  return (
    <section id="work" className="projects content-section" aria-labelledby="work-title">
      <div className="content-wrap projects-intro">
        <h2 className="section-label projects-title" id="work-title" data-mask data-alt="THE PROOF">
          PROJECTS
        </h2>
        <div className="projects-description">
          <button
            className={`projects-question${questionRevealed ? ' is-revealed' : ''}`}
            type="button"
            aria-pressed={questionRevealed}
            aria-label={questionRevealed ? 'Engineered. Show imagined.' : 'Imagined. Reveal engineered.'}
            onClick={() => setQuestionRevealed((prev) => !prev)}
          >
            <span className="question-front" aria-hidden="true">
              IMAGINED.
            </span>
            <span className="question-answer" aria-hidden="true">
              ENGINEERED.
            </span>
          </button>
        </div>
      </div>

      <div className="showcase-grid content-wrap">
        {PROJECTS_DATA.map((project) => (
          <article
            key={project.id}
            className="showcase-item reveal"
            data-project-card={project.id}
            aria-labelledby={`${project.id}-title`}
          >
            <button
              className="showcase-media"
              type="button"
              data-case={project.id}
              aria-label={`View ${project.title} case study`}
              onClick={(e) => openCase(project, 0, e.currentTarget)}
            >
              <span className="showcase-figure">
                <img
                  src={project.coverSrc}
                  alt={project.coverAlt}
                  width={1440}
                  height={900}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </span>
            </button>

            <div className="showcase-copy">
              <h3 id={`${project.id}-title`}>
                <button
                  type="button"
                  data-case={project.id}
                  aria-label={`View ${project.title} case study`}
                  onClick={(e) => openCase(project, 0, e.currentTarget)}
                >
                  {project.title}
                </button>
              </h3>
              <p className="showcase-description">{project.description}</p>
              <div className="showcase-links showcase-actions">
                {project.actions.map((action) =>
                  action.type === 'external' && action.href ? (
                    <a
                      key={`${project.id}-${action.label}`}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={action.ariaLabel}
                    >
                      <ActionIcon icon={action.icon} />
                      {action.label}
                    </a>
                  ) : (
                    <button
                      key={`${project.id}-${action.label}`}
                      type="button"
                      data-case={project.id}
                      data-video-slide={action.videoSlide}
                      aria-label={action.ariaLabel}
                      onClick={(e) => openCase(project, action.videoSlide ?? 0, e.currentTarget)}
                    >
                      <ActionIcon icon={action.icon} />
                      {action.label}
                    </button>
                  )
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="case-dialog"
        id="project-case-dialog"
        aria-labelledby="case-title"
        onClose={handleCloseDialog}
        onClick={(e) => {
          const dialog = dialogRef.current;
          if (!dialog || e.target !== dialog) return;
          const r = dialog.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          ) {
            dialog.close();
          }
        }}
      >
        <div className="case-toolbar">
          <span>SELECTED WORK</span>
          <button
            ref={closeButtonRef}
            type="button"
            className="case-close"
            aria-label="Close case study"
            onClick={() => dialogRef.current?.close()}
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>

        <div id="project-case-content">
          {activeCase && (
            <>
              <div className="case-gallery">
                {activeCase.slides.map((slide, idx) => {
                  const isHidden = idx !== activeSlideIndex;
                  return (
                    <div
                      key={`${activeCase.id}-slide-${slide.id}`}
                      className="case-slide"
                      data-slide={slide.id}
                      hidden={isHidden}
                    >
                      <figure className="case-figure">
                        {slide.type === 'image' ? (
                          <img
                            src={slide.src}
                            alt={slide.alt}
                            width={1440}
                            height={900}
                            loading="eager"
                            decoding="async"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <video
                            controls
                            playsInline
                            preload="none"
                            poster={slide.poster}
                            aria-label={slide.alt}
                          >
                            <source src={slide.src} />
                          </video>
                        )}
                        <figcaption>{slide.caption}</figcaption>
                      </figure>
                    </div>
                  );
                })}

                <div className="case-gallery-controls" aria-label={`${activeCase.title} media`}>
                  {activeCase.slides.map((slide, idx) => (
                    <button
                      key={`${activeCase.id}-tab-${slide.id}`}
                      type="button"
                      data-slide-select={slide.id}
                      aria-pressed={idx === activeSlideIndex}
                      aria-label={
                        slide.type === 'video'
                          ? `Show ${activeCase.title} demo video`
                          : `Show ${activeCase.title} ${slide.tabLabel}`
                      }
                      onClick={() => void handleSelectSlide(idx)}
                    >
                      {slide.tabNumber} <span>{slide.tabLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              <header className="case-header">
                <h2 id="case-title">{activeCase.title}</h2>
                <p className="case-intro">{activeCase.description}</p>
              </header>

              <div className="case-copy">
                <section>
                  <h3>The idea</h3>
                  {activeCase.ideaParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </section>
                <section>
                  <h3>Technical approach</h3>
                  <p>{activeCase.technicalApproach}</p>
                </section>
                <section className="case-details">
                  <h3>Key details</h3>
                  <ul>
                    {activeCase.keyDetails.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </section>
                <section className="case-stack">
                  <h3>Built with</h3>
                  <p>{activeCase.builtWith}</p>
                </section>
              </div>

              <footer className="case-footer showcase-links">
                {activeCase.footerLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </footer>
            </>
          )}
        </div>
      </dialog>
    </section>
  );
}
