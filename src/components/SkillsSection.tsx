import { useRef, useState } from 'react';
import { SKILLS_DATA, type SkillItem } from '../data/portfolioData';
import { SKILL_LOGOS } from '../data/skillLogos';

function SkillDisclosureRow({ skill, index }: { skill: SkillItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const pinnedRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const rowId = index + 1;

  return (
    <div
      className={`skill-row skill-disclosure reveal${expanded ? ' is-expanded' : ''}`}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'touch') setExpanded(true);
      }}
      onPointerLeave={() => {
        if (!pinnedRef.current && document.activeElement !== triggerRef.current) {
          setExpanded(false);
        }
      }}
    >
      <div className="content-wrap skill-inner">
        <span className="skill-number" aria-hidden="true">
          {skill.number}
        </span>
        <h3>
          <button
            ref={triggerRef}
            className="skill-trigger"
            id={`skill-trigger-${rowId}`}
            type="button"
            aria-expanded={expanded}
            aria-controls={`skill-details-${rowId}`}
            onFocus={() => setExpanded(true)}
            onBlur={() => {
              if (!pinnedRef.current) setExpanded(false);
            }}
            onClick={() => {
              const next = !pinnedRef.current;
              pinnedRef.current = next;
              setExpanded(next);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                pinnedRef.current = false;
                setExpanded(false);
              }
            }}
          >
            {skill.title}
          </button>
        </h3>
        <p id={`skill-details-${rowId}`} className="skill-details" aria-hidden={!expanded}>
          {skill.details}
        </p>
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="skills content-section" aria-labelledby="skills-title">
      <div className="content-wrap">
        <h2 className="section-label skills-title" id="skills-title" data-mask data-alt="ARSENAL">
          SKILLS
        </h2>
      </div>

      {SKILLS_DATA.map((skill, index) => (
        <SkillDisclosureRow key={skill.number} skill={skill} index={index} />
      ))}

      <div className="skill-loop">
        <div className="skill-loop-window">
          <div className="skill-loop-track">
            <ul className="skill-logo-list" aria-label="Skills and technologies">
              {SKILL_LOGOS.map((item) => (
                <li key={`primary-${item.name}`} className="skill-logo">
                  {item.renderIcon('loop-a')}
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
            <ul className="skill-logo-list skill-logo-copy" aria-hidden="true">
              {SKILL_LOGOS.map((item) => (
                <li key={`copy-${item.name}`} className="skill-logo">
                  {item.renderIcon('loop-b')}
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
