import lottie, { type AnimationItem } from 'lottie-web';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { IDLE_TYPEWRITER_LINES, TYPEWRITER_ROWS } from '../data/portfolioData';
import {
  calculatePaperFeed,
  editNoteValue,
  formatMachineCounter,
} from '../utils/portfolioLogic';

interface ContactAndFooterProps {
  motionEnabled: boolean;
}

const KEY_LABELS: Record<string, string> = {
  Tab: 'TAB',
  Caps: 'CAPS',
  Shift: '⇧',
  Backspace: '⌫',
  Enter: '↵',
  ' ': 'SPACE',
  ArrowLeft: '←',
  ArrowDown: '↓',
  ArrowUp: '↑',
  ArrowRight: '→',
};

const KEY_ICON_PATHS: Record<string, string> = {
  Shift: 'M12 3 4 11h4v9h8v-9h4L12 3Z',
  Backspace: 'M9 5h11v14H9l-6-7 6-7Zm2 4 6 6m0-6-6 6',
  Enter: 'M19 5v9H5m0 0 4-4m-4 4 4 4',
  ArrowLeft: 'M19 12H5m0 0 5-5m-5 5 5 5',
  ArrowRight: 'M5 12h14m0 0-5-5m5 5-5 5',
  ArrowUp: 'M12 19V5m0 0-5 5m5-5 5 5',
  ArrowDown: 'M12 5v14m0 0-5-5m5 5 5-5',
};

const KEY_ARIA_LABELS: Record<string, string> = {
  Backspace: 'Backspace',
  Enter: 'New line',
  ' ': 'Space',
  ArrowLeft: 'Move cursor left',
  ArrowRight: 'Move cursor right',
  ArrowUp: 'Move cursor to start',
  ArrowDown: 'Move cursor to end',
};

function getKeyClassNames(key: string): string {
  const classes = ['writer-key'];
  if (key === ' ') classes.push('key-space-label', 'key-space');
  else if (/^[a-z]$/i.test(key)) classes.push('key-letter-label');
  else if (/^[0-9]$/.test(key)) classes.push('key-number-label');
  else if (['Tab', 'Caps', 'Shift', 'Backspace', 'Enter'].includes(key)) classes.push('key-function-label');
  else classes.push('key-symbol-label');

  if (['Tab', 'Caps', 'Shift', 'Backspace'].includes(key) || key.startsWith('Arrow')) {
    classes.push('key-modifier');
  }
  if (['Tab', 'Caps', 'Shift', 'Backspace', 'Enter'].includes(key)) {
    classes.push('key-wide');
  }
  if (key === 'Enter') {
    classes.push('key-accent');
  }
  if (KEY_ICON_PATHS[key]) {
    classes.push('key-icon');
  }
  return classes.join(' ');
}

export function ContactAndFooter({ motionEnabled }: ContactAndFooterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');

  const [shiftActive, setShiftActive] = useState(false);
  const [capsActive, setCapsActive] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [isStriking, setIsStriking] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [paperFeed, setPaperFeed] = useState(0);
  const [machineStatus, setMachineStatus] = useState('A NOTE FOR SHUBH');
  const [machineCounter, setMachineCounter] = useState('000');

  const [idlePhrase, setIdlePhrase] = useState('');
  const [idleLayerHidden, setIdleLayerHidden] = useState(true);
  const [idleClearing, setIdleClearing] = useState(false);
  const [idleActive, setIdleActive] = useState(false);
  const [idleTyping, setIdleTyping] = useState(false);
  const [idleLineEnd, setIdleLineEnd] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [sendLabel, setSendLabel] = useState('SEND MESSAGE');
  const [helpText, setHelpText] = useState('');

  const [finalOpen, setFinalOpen] = useState(false);
  const [mottoVisible, setMottoVisible] = useState(false);
  const [signatureSigning, setSignatureSigning] = useState(false);

  const mottoRef = useRef<HTMLDivElement | null>(null);
  const handPlayerRef = useRef<HTMLDivElement | null>(null);
  const handAnimRef = useRef<AnimationItem | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);
  const writerRef = useRef<HTMLDivElement | null>(null);
  const writerBodyRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const signatureCardRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);

  const keyTimersRef = useRef<Map<string, number>>(new Map());
  const strikeTimerRef = useRef<number>(0);
  const releaseTimerRef = useRef<number>(0);
  const idleStoppedRef = useRef(false);
  const idleVisibleRef = useRef(false);
  const idleTimerRef = useRef<number | undefined>(undefined);
  const idleIndexRef = useRef(0);
  const idleCharRef = useRef(0);

  const valuesRef = useRef({ name, email, message });
  valuesRef.current = { name, email, message };
  const motionRef = useRef(motionEnabled);
  motionRef.current = motionEnabled;

  // Lottie hand setup + intersection control
  useEffect(() => {
    const mottoEl = mottoRef.current;
    const container = handPlayerRef.current;
    if (!mottoEl || !container) return;

    const anim = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      path: '/assets/animation/loading-hand.json',
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
    });
    anim.setSpeed(1.45);
    handAnimRef.current = anim;

    let visible = false;
    const syncHand = () => {
      if (!anim.isLoaded) return;
      if (motionRef.current && !document.hidden && visible) {
        anim.play();
      } else {
        anim.pause();
        if (!visible) anim.goToAndStop(0, true);
      }
    };

    anim.addEventListener('DOMLoaded', syncHand);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        setMottoVisible(visible);
        syncHand();
      },
      { threshold: 0.15 }
    );
    observer.observe(mottoEl);

    const onVisibility = () => syncHand();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      anim.removeEventListener('DOMLoaded', syncHand);
      anim.destroy();
      handAnimRef.current = null;
    };
  }, []);

  useEffect(() => {
    const anim = handAnimRef.current;
    if (!anim || !anim.isLoaded) return;
    if (motionEnabled && !document.hidden && mottoVisible) {
      anim.play();
    } else {
      anim.pause();
      if (!mottoVisible) anim.goToAndStop(0, true);
    }
  }, [motionEnabled, mottoVisible]);

  // Signature card intersection
  useEffect(() => {
    const card = signatureCardRef.current;
    if (!card) return;
    if (!('IntersectionObserver' in window)) {
      setSignatureSigning(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setSignatureSigning(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // Closing marquee sizing
  useEffect(() => {
    const marquee = marqueeRef.current;
    const track = marqueeTrackRef.current;
    if (!marquee || !track) return;

    const unitTemplate = track.querySelector('.closing-marquee-unit')?.cloneNode(true) as
      | HTMLElement
      | undefined;
    if (!unitTemplate) return;

    let lastWidth = 0;
    let resizeFrame = 0;

    const sizeClosingMarquee = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      marquee.classList.remove('is-ready');
      const group = document.createElement('div');
      group.className = 'closing-marquee-group';
      group.append(unitTemplate.cloneNode(true));
      track.replaceChildren(group);
      const unitWidth = group.getBoundingClientRect().width;
      if (!unitWidth) return;
      for (let i = 1; i < Math.ceil(lastWidth / unitWidth); i++) {
        group.append(unitTemplate.cloneNode(true));
      }
      track.append(group.cloneNode(true));
      const groupWidth = group.getBoundingClientRect().width;
      marquee.style.setProperty(
        '--marquee-duration',
        `${Math.min(40, Math.max(35, groupWidth / 90))}s`
      );
      marquee.classList.add('is-ready');
    };

    document.fonts?.ready.then(sizeClosingMarquee).catch(() => {});
    sizeClosingMarquee();

    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(sizeClosingMarquee);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const flashWriterKey = useCallback((rawKey: string) => {
    const normalized = rawKey.length === 1 ? rawKey.toLowerCase() : rawKey;
    const prevTimer = keyTimersRef.current.get(normalized);
    if (prevTimer) window.clearTimeout(prevTimer);

    setPressedKeys((prev) => ({ ...prev, [normalized]: true }));
    const timer = window.setTimeout(() => {
      setPressedKeys((prev) => {
        if (!prev[normalized]) return prev;
        const next = { ...prev };
        delete next[normalized];
        return next;
      });
    }, 140);
    keyTimersRef.current.set(normalized, timer);
  }, []);

  const syncNote = useCallback((currentMessage: string, animate = false) => {
    const textarea = messageRef.current;
    if (textarea) {
      textarea.style.height = '85px';
      const measured = Math.max(textarea.scrollHeight, 85);
      textarea.style.height = `${measured}px`;
      setPaperFeed(calculatePaperFeed(measured, 85, 24));
    }

    if (idleStoppedRef.current || currentMessage) {
      setMachineCounter(formatMachineCounter(currentMessage.length));
      setMachineStatus(currentMessage ? 'NOTE IN PROGRESS' : 'READY FOR YOUR NOTE');
    }

    if (animate && motionRef.current) {
      setIsStriking(false);
      requestAnimationFrame(() => {
        setIsStriking(true);
      });
      window.clearTimeout(strikeTimerRef.current);
      strikeTimerRef.current = window.setTimeout(() => setIsStriking(false), 150);
    }
  }, []);

  useEffect(() => {
    syncNote(message, false);
  }, [message, syncNote]);

  useEffect(() => {
    const onResize = () => syncNote(valuesRef.current.message, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [syncNote]);

  // Ambient idle ghost writing
  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== undefined) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = undefined;
    }
  }, []);

  const stopIdleWriting = useCallback(() => {
    idleStoppedRef.current = true;
    clearIdleTimer();
    setIdleLayerHidden(true);
    setIdleClearing(false);
    setIdlePhrase('');
    idleCharRef.current = 0;
    setIdleActive(false);
    setIdleTyping(false);
    setIdleLineEnd(false);
    const msg = valuesRef.current.message;
    setMachineStatus(msg ? 'NOTE IN PROGRESS' : 'READY FOR YOUR NOTE');
    setMachineCounter(formatMachineCounter(msg.length));
  }, [clearIdleTimer]);

  const canWriteIdle = useCallback(() => {
    const { name: n, email: e, message: m } = valuesRef.current;
    const activeEl = document.activeElement;
    return (
      !idleStoppedRef.current &&
      idleVisibleRef.current &&
      !document.hidden &&
      motionRef.current &&
      !n &&
      !e &&
      !m &&
      activeEl !== nameRef.current &&
      activeEl !== emailRef.current &&
      activeEl !== messageRef.current
    );
  }, []);

  const writeIdleCharacter = useCallback(() => {
    if (!canWriteIdle()) {
      clearIdleTimer();
      return;
    }
    const phrase = IDLE_TYPEWRITER_LINES[idleIndexRef.current];
    if (idleCharRef.current < phrase.length) {
      const nextCharIndex = idleCharRef.current + 1;
      idleCharRef.current = nextCharIndex;
      const nextText = phrase.slice(0, nextCharIndex);
      setIdlePhrase(nextText);
      setMachineStatus(nextText.toUpperCase());
      setMachineCounter(`${String(idleIndexRef.current + 1).padStart(2, '0')} / 03`);
      setIdleTyping(true);
      const ch = phrase[nextCharIndex - 1];
      const delay = /[,.!?]/.test(ch) ? 230 : ch === ' ' ? 125 : 65 + Math.random() * 85;
      clearIdleTimer();
      idleTimerRef.current = window.setTimeout(writeIdleCharacter, delay);
      return;
    }

    setIdleTyping(false);
    setIdleLineEnd(true);
    clearIdleTimer();
    idleTimerRef.current = window.setTimeout(() => {
      if (!canWriteIdle()) return;
      setIdleClearing(true);
      clearIdleTimer();
      idleTimerRef.current = window.setTimeout(() => {
        if (!canWriteIdle()) return;
        setIdlePhrase('');
        setMachineStatus('');
        setIdleLineEnd(false);
        idleCharRef.current = 0;
        idleIndexRef.current = (idleIndexRef.current + 1) % IDLE_TYPEWRITER_LINES.length;
        setIdleClearing(false);
        clearIdleTimer();
        idleTimerRef.current = window.setTimeout(writeIdleCharacter, 450);
      }, 240);
    }, 1700);
  }, [canWriteIdle, clearIdleTimer]);

  const updateIdleWriting = useCallback(() => {
    const { name: n, email: e, message: m } = valuesRef.current;
    const activeEl = document.activeElement;
    if (
      n ||
      e ||
      m ||
      activeEl === nameRef.current ||
      activeEl === emailRef.current ||
      activeEl === messageRef.current
    ) {
      stopIdleWriting();
      return;
    }
    idleStoppedRef.current = false;
    if (!idleVisibleRef.current || document.hidden || !motionRef.current) {
      clearIdleTimer();
      setIdleTyping(false);
      setIdleLayerHidden(true);
      setIdleActive(false);
      setIdleLineEnd(false);
      return;
    }
    setIdleLayerHidden(false);
    setIdleActive(true);
    setMachineCounter(`${String(idleIndexRef.current + 1).padStart(2, '0')} / 03`);
    if (idleTimerRef.current === undefined) {
      idleTimerRef.current = window.setTimeout(
        writeIdleCharacter,
        idleCharRef.current ? 150 : 650
      );
    }
  }, [clearIdleTimer, stopIdleWriting, writeIdleCharacter]);

  useEffect(() => {
    const writer = writerRef.current;
    if (!writer) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        idleVisibleRef.current = entry.isIntersecting;
        updateIdleWriting();
      },
      { threshold: 0.08 }
    );
    observer.observe(writer);

    const onVis = () => updateIdleWriting();
    document.addEventListener('visibilitychange', onVis);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      clearIdleTimer();
      window.clearTimeout(strikeTimerRef.current);
      window.clearTimeout(releaseTimerRef.current);
      keyTimersRef.current.forEach((t) => window.clearTimeout(t));
      keyTimersRef.current.clear();
    };
  }, [clearIdleTimer, updateIdleWriting]);

  useEffect(() => {
    updateIdleWriting();
  }, [motionEnabled, name, email, message, updateIdleWriting]);

  const handleOnscreenKeyClick = (key: string) => {
    flashWriterKey(key);
    if (key === 'Shift') {
      setShiftActive((s) => !s);
      return;
    }
    if (key === 'Caps') {
      setCapsActive((c) => !c);
      return;
    }

    const active = document.activeElement;
    let targetField: 'name' | 'email' | 'message' = 'message';
    let targetEl: HTMLInputElement | HTMLTextAreaElement | null = messageRef.current;
    if (active === nameRef.current && nameRef.current) {
      targetField = 'name';
      targetEl = nameRef.current;
    } else if (active === emailRef.current && emailRef.current) {
      targetField = 'email';
      targetEl = emailRef.current;
    }
    if (!targetEl) return;

    const start = targetEl.selectionStart ?? targetEl.value.length;
    const end = targetEl.selectionEnd ?? targetEl.value.length;

    if (key.startsWith('Arrow')) {
      const position =
        key === 'ArrowUp'
          ? 0
          : key === 'ArrowDown'
            ? targetEl.value.length
            : key === 'ArrowLeft'
              ? Math.max(0, start - 1)
              : Math.min(targetEl.value.length, end + 1);
      targetEl.focus({ preventScroll: true });
      targetEl.setSelectionRange(position, position);
      return;
    }

    if (key === 'Tab') {
      const nextEl =
        targetField === 'name'
          ? emailRef.current
          : targetField === 'email'
            ? messageRef.current
            : nameRef.current;
      nextEl?.focus();
      return;
    }

    if (key === 'Enter' && targetField !== 'message') {
      const nextEl = targetField === 'name' ? emailRef.current : messageRef.current;
      nextEl?.focus();
      return;
    }

    const character =
      key === 'Enter'
        ? '\n'
        : key.length === 1 && /[a-z]/i.test(key) && shiftActive !== capsActive
          ? key.toUpperCase()
          : key;

    const maxLimit = targetEl.maxLength > 0 ? targetEl.maxLength : 400;
    const result = editNoteValue(targetEl.value, start, end, character, maxLimit);

    if (targetField === 'name') setName(result.value);
    else if (targetField === 'email') setEmail(result.value);
    else {
      setMessage(result.value);
      syncNote(result.value, true);
    }

    requestAnimationFrame(() => {
      targetEl?.focus({ preventScroll: true });
      targetEl?.setSelectionRange(result.caret, result.caret);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (submitting || !form || !form.reportValidity()) return;

    setSubmitting(true);
    setSendLabel('SENDING NOTE...');
    setHelpText('Sending your note…');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 404) {
        throw new Error('Contact endpoint is unavailable right now.');
      }
      if (!response.ok) {
        throw new Error(result.error || 'Your note could not be sent. Please try again.');
      }

      setSendLabel('MESSAGE SENT ✓');
      setHelpText('Thank you. Your note has been sent.');
      if (motionEnabled) {
        setIsReleasing(false);
        requestAnimationFrame(() => setIsReleasing(true));
        window.clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = window.setTimeout(() => setIsReleasing(false), 950);
      }
      setName('');
      setEmail('');
      setMessage('');
      setWebsite('');
      syncNote('', false);
    } catch (error) {
      setHelpText(
        error instanceof Error ? error.message : 'Your note could not be sent. Please try again.'
      );
      setSendLabel('SEND MESSAGE');
    } finally {
      setSubmitting(false);
    }
  };

  const writerClassName = [
    'typewriter',
    isEditing ? 'is-editing' : '',
    isStriking ? 'is-striking' : '',
    isReleasing ? 'is-releasing' : '',
    idleActive ? 'is-idle-active' : '',
    idleTyping ? 'is-idle-typing' : '',
    idleLineEnd ? 'is-idle-line-end' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <section id="contact" className="contact content-section" aria-labelledby="contact-title">
        <div ref={mottoRef} className={`motto${mottoVisible ? ' is-visible' : ''}`} data-mask>
          <div className="motto-hand-position" aria-hidden="true">
            <div className="motto-hand-rotation">
              <div className="motto-hand-player" ref={handPlayerRef} />
            </div>
          </div>
          <p className="section-label">My approach</p>
          <h2>
            <span className="motto-curious" data-alt="LEARN.">
              CURIOUS.
            </span>
            <span data-alt="BUILD.">BY</span>
            <span data-alt="REPEAT.">DEFAULT.</span>
          </h2>
          <p className="motto-note">I learn by building things I wish existed.</p>
        </div>

        <div className="content-wrap">
          <h2
            id="contact-title"
            className="section-label contact-title"
            data-mask
            data-alt="LET’S TALK"
          >
            CONTACT
          </h2>
          <div className="contact-heading reveal">
            <p>
              LET’S MAKE
              <br />
              <em>SOMETHING HAPPEN.</em>
            </p>
          </div>
          <p className="contact-description reveal">Have an idea or an opportunity? Leave me a note.</p>
        </div>

        <div className="content-wrap contact-content">
          <form
            ref={formRef}
            id="contact-form"
            className="note-form message-composer"
            onSubmit={handleSubmit}
            onFocus={() => {
              setIsEditing(true);
              updateIdleWriting();
            }}
            onBlur={(e) => {
              if (!formRef.current?.contains(e.relatedTarget as Node | null)) {
                setIsEditing(false);
              }
              window.setTimeout(updateIdleWriting, 0);
            }}
          >
            <div className="typewriter-studio">
              <div className={writerClassName} id="typewriter" ref={writerRef}>
                <div className="paper-slot" style={{ ['--paper-feed' as string]: `${paperFeed}px` }}>
                  <div className="note-paper" style={{ ['--paper-feed' as string]: `${paperFeed}px` }}>
                    <div className="paper-heading">A NOTE FOR SHUBH</div>
                    <div className="paper-field paper-identity">
                      <label htmlFor="note-name">FROM</label>
                      <input
                        ref={nameRef}
                        id="note-name"
                        name="name"
                        autoComplete="name"
                        maxLength={60}
                        placeholder="Your name"
                        required
                        value={name}
                        onKeyDown={(e) => {
                          if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.nativeEvent.isComposing) {
                            flashWriterKey(e.key);
                          }
                        }}
                        onChange={(e) => {
                          setName(e.target.value);
                          syncNote(message, true);
                        }}
                      />
                    </div>
                    <div className="paper-field paper-identity">
                      <label htmlFor="note-email">REPLY TO</label>
                      <input
                        ref={emailRef}
                        id="note-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={120}
                        placeholder="Your email address"
                        required
                        value={email}
                        onKeyDown={(e) => {
                          if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.nativeEvent.isComposing) {
                            flashWriterKey(e.key);
                          }
                        }}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          syncNote(message, true);
                        }}
                      />
                    </div>
                    <label className="paper-salutation" htmlFor="note-message">
                      Hey Shubh,
                    </label>
                    <div className="paper-message-field">
                      <textarea
                        ref={messageRef}
                        id="note-message"
                        name="message"
                        maxLength={400}
                        placeholder="Write your note here…"
                        aria-describedby="note-count note-help"
                        required
                        value={message}
                        onKeyDown={(e) => {
                          if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.nativeEvent.isComposing) {
                            flashWriterKey(e.key);
                          }
                        }}
                        onChange={(e) => {
                          const nextVal = e.target.value;
                          const inputData = (e.nativeEvent as InputEvent).data;
                          if (inputData) Array.from(inputData).forEach(flashWriterKey);
                          setMessage(nextVal);
                          syncNote(nextVal, true);
                        }}
                      />
                      <span
                        className={`paper-idle-text${idleClearing ? ' is-clearing' : ''}`}
                        aria-hidden="true"
                        hidden={idleLayerHidden}
                      >
                        <span id="paper-idle-phrase">{idlePhrase}</span>
                        <span className="paper-idle-caret" />
                      </span>
                    </div>
                    <div className="paper-footer">
                      <span>A thought worth sharing.</span>
                      <span id="note-count">{message.length} / 400</span>
                    </div>
                  </div>
                </div>

                <div className="platen" aria-hidden="true">
                  <i />
                  <span />
                  <i />
                </div>

                <div
                  className="machine-body"
                  ref={writerBodyRef}
                  onPointerMove={(e) => {
                    if (!motionEnabled || e.pointerType === 'touch' || !writerBodyRef.current) return;
                    const rect = writerBodyRef.current.getBoundingClientRect();
                    writerBodyRef.current.style.setProperty(
                      '--light-x',
                      `${((e.clientX - rect.left) / rect.width) * 100}%`
                    );
                    writerBodyRef.current.style.setProperty(
                      '--light-y',
                      `${((e.clientY - rect.top) / rect.height) * 100}%`
                    );
                  }}
                  onPointerLeave={() => {
                    writerBodyRef.current?.style.removeProperty('--light-x');
                    writerBodyRef.current?.style.removeProperty('--light-y');
                  }}
                >
                  <div className="machine-display" aria-hidden="true">
                    <span id="machine-status">{machineStatus}</span>
                    <span id="machine-counter">{machineCounter}</span>
                  </div>
                  <div
                    id="typewriter-keys"
                    className="typewriter-keys"
                    role="group"
                    aria-label="Type with the onscreen keyboard"
                  >
                    {TYPEWRITER_ROWS.map((rowKeys, rowIndex) => (
                      <div key={rowIndex} className="key-row">
                        {rowKeys.map((key) => {
                          const normalized = key.length === 1 ? key.toLowerCase() : key;
                          const isPressedKey = !!pressedKeys[normalized];
                          const isToggle = key === 'Shift' || key === 'Caps';
                          const togglePressed =
                            key === 'Shift' ? shiftActive : key === 'Caps' ? capsActive : undefined;
                          const iconPath = KEY_ICON_PATHS[key];
                          const label = KEY_LABELS[key] || key.toUpperCase();
                          const ariaLabel = KEY_ARIA_LABELS[key] || label;

                          return (
                            <button
                              key={key}
                              type="button"
                              data-key={key}
                              className={`${getKeyClassNames(key)}${isPressedKey ? ' is-pressed' : ''}`}
                              aria-label={ariaLabel}
                              aria-pressed={isToggle ? togglePressed : undefined}
                              onPointerDown={(e) => {
                                if (e.pointerType === 'mouse') e.preventDefault();
                              }}
                              onClick={() => handleOnscreenKeyClick(key)}
                            >
                              {iconPath ? (
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                  focusable="false"
                                >
                                  <path d={iconPath} />
                                </svg>
                              ) : (
                                label
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="writer-action">
              <input
                className="contact-honeypot"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              <button className="note-send" type="submit" disabled={submitting}>
                <span className="note-send-label">{sendLabel}</span>
              </button>
              <p id="note-help" role="status" aria-live="polite">
                {helpText}
              </p>
            </div>
          </form>
        </div>
      </section>

      <footer className="final-frame content-wrap" aria-labelledby="final-frame-title">
        <div className="final-frame-copy reveal">
          <h2 id="final-frame-title">
            <button
              className={`final-frame-headline${finalOpen ? ' is-open' : ''}`}
              type="button"
              aria-label={finalOpen ? 'To be continued. Show the end.' : 'The end. Reveal to be continued.'}
              aria-pressed={finalOpen}
              onClick={() => setFinalOpen((prev) => !prev)}
            >
              <span className="final-frame-viewport" aria-hidden="true">
                <span className="final-frame-track">
                  <span className="final-frame-state">THE END.</span>
                  <span className="final-frame-state final-frame-continued">
                    <span>TO BE</span>
                    <span>CONTINUED.</span>
                  </span>
                </span>
              </span>
            </button>
          </h2>
          <p className="final-frame-note">The next idea is already taking shape.</p>
        </div>

        <div
          ref={signatureCardRef}
          className={`signature-card reveal${signatureSigning ? ' is-signing' : ''}`}
        >
          <div className="signature-card-top">
            <span>END OF TRANSMISSION</span>
            <span className="signature-mark" aria-hidden="true">
              ✳
            </span>
          </div>
          <div className="signature-card-main">
            <div className="signature-card-copy">
              <p className="signature-name">SHUBH JAIN.</p>
              <p className="signature-subtitle">Founder @Arcitic · Python, AI/ML &amp; Data Science.</p>
            </div>
            <svg
              className="signature-art"
              viewBox="0 0 1088 340"
              role="img"
              aria-label="Shubh Jain handwritten signature"
            >
              <g
                className="signature-vector"
                fill="none"
                stroke="#ebe1d0"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M126 112c-54 14-88 52-74 86 14 34 94 26 112 68 18 42-34 78-96 54-24-9-38-24-42-40" />
                <path d="M188 76c-12 72-24 146-30 212 18-48 44-86 68-86 22 0 18 52 12 80 18 8 42-34 54-72-12 36-16 70 2 76 18 6 42-30 56-68-8 34-10 66 8 72 22 6 52-42 66-92 14-50 20-112 12-116-8-4-28 54-36 122-8 68 14 82 40 66 26-16 32-56 12-66-18-8-42 22-36 52 16-42 46-138 66-148 14-7 10 38-6 106-10 44-16 86-14 112 16-40 42-78 66-78 18 0 16 42 12 72" />
                <path d="M624 98c44-12 114-18 168-14M716 92c-16 82-32 166-58 214-24 44-74 44-90 14-12-22 10-48 44-52" />
                <path d="M778 214c-26-4-48 22-48 48 0 22 18 32 36 18 16-12 28-40 34-62-8 26-8 62 12 66 18 4 38-26 48-64-8 28-8 62 10 66 16 4 34-28 46-64 10 20 8 46 6 62 14-30 34-60 54-58 18 2 14 38 12 60 12 6 36-18 52-44" />
                <circle cx="868" cy="158" r="6" fill="#ebe1d0" stroke="none" />
                <path d="M108 298c196-24 532-44 892-36" strokeWidth="7" opacity="0.72" />
              </g>
            </svg>
          </div>
          <div className="signature-card-bottom">
            <p>
              © <span id="footer-year">{new Date().getFullYear()}</span> SHUBH JAIN
            </p>
            <a href="#home">
              REWIND <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </footer>

      <div
        ref={marqueeRef}
        className="closing-marquee"
        role="region"
        tabIndex={0}
        aria-label="The cursor is still blinking. The story is still being written."
      >
        <div className="closing-marquee-track" ref={marqueeTrackRef} aria-hidden="true">
          <div className="closing-marquee-group">
            <span className="closing-marquee-unit">
              <span>THE CURSOR IS STILL BLINKING.</span>
              <span className="closing-marquee-star">✳</span>
              <span>THE STORY IS STILL BEING WRITTEN.</span>
              <span className="closing-marquee-star">✳</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
