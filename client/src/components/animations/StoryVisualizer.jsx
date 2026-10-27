import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Sparkles, Eye, Volume2, VolumeX, ShieldAlert, Compass } from 'lucide-react';

const StoryVisualizer = ({ story, interactive = true }) => {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);
  const [stareActive, setStareActive] = useState(false);
  const [soundActive, setSoundActive] = useState(false);

  // Framer Motion Spring Values for Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Layer translations
  const bgTranslateX = useTransform(smoothX, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [-12, 12]);
  const bgTranslateY = useTransform(smoothY, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [-12, 12]);

  const midTranslateX = useTransform(smoothX, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [-25, 25]);
  const midTranslateY = useTransform(smoothY, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [-25, 25]);

  const fgTranslateX = useTransform(smoothX, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [20, -20]);
  const fgTranslateY = useTransform(smoothY, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [20, -20]);

  // Audio Context Ref (Never autoplay — strictly opt-in click)
  const audioCtxRef = useRef(null);

  const toggleSound = () => {
    if (!soundActive) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          data[i] *= 0.035;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(story?.visualEffect === 'flickering-lantern' ? 250 : 380, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();

        setSoundActive(true);
      } catch (e) {
        console.warn('Audio synthesis unavailable:', e);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setSoundActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const effect = story?.visualEffect || 'standard';
  const imgUrl = story?.heroImage?.url || '/images/artwork/cosmic_abyss.jpg';

  return (
    <div
      className="story-visualizer-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '920px',
        margin: '0 auto',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 175, 55, 0.12)',
        backgroundColor: '#05070a'
      }}
    >
      {/* Editorial Museum Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        backgroundColor: 'rgba(12, 17, 24, 0.98)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', letterSpacing: '0.08em' }}>
          <Compass size={15} />
          <span>LORE ARTIFACT — {story?.title?.toUpperCase()}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* User-Initiated Opt-In Ambient Sound Toggle (Never Autoplay) */}
          <button
            onClick={toggleSound}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: soundActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: soundActive ? 'var(--gold-primary)' : 'var(--text-muted)',
              fontSize: '0.75rem',
              padding: '0.25rem 0.6rem',
              border: '1px solid',
              borderColor: soundActive ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            title={soundActive ? 'Mute Atmosphere' : 'Listen to Atmospheric Sound (Click to Play)'}
          >
            {soundActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{soundActive ? 'Sound: Muted (Click to Stop)' : 'Sound: Muted (Click to Play)'}</span>
          </button>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'none' }} className="desktop-search">
            Pointer moves spatial depth
          </span>
        </div>
      </div>

      {/* Main Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setStareActive(!stareActive)}
        style={{
          position: 'relative',
          width: '100%',
          height: '460px',
          overflow: 'hidden',
          cursor: interactive ? 'crosshair' : 'default'
        }}
      >
        {/* Layer 1: Background Base Artwork */}
        <motion.div
          style={{
            position: 'absolute',
            top: '-6%',
            left: '-6%',
            width: '112%',
            height: '112%',
            backgroundImage: `url(${imgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            x: bgTranslateX,
            y: bgTranslateY,
            scale: 1.05,
            filter: stareActive ? 'contrast(1.25) brightness(0.85)' : 'none'
          }}
        />

        {/* Layer 2: Preset-Specific Atmospheric FX */}
        {effect === 'wendigo-parallax' && (
          <>
            {/* Skull Moon Volumetric Glow */}
            <motion.div
              style={{
                position: 'absolute',
                top: '9%',
                left: '21%',
                width: '135px',
                height: '135px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(235, 225, 200, 0.28) 0%, rgba(212, 175, 55, 0.12) 45%, transparent 70%)',
                filter: 'blur(9px)',
                x: midTranslateX,
                y: midTranslateY,
                pointerEvents: 'none'
              }}
            />

            {/* Glowing Feral Wendigo Eyes Tracking In Woods */}
            <motion.div
              style={{
                position: 'absolute',
                top: '43%',
                left: '68%',
                x: fgTranslateX,
                y: fgTranslateY,
                pointerEvents: 'none',
                display: 'flex',
                gap: '14px',
                opacity: isHovered || stareActive ? 1 : 0.4
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '8px',
                  backgroundColor: stareActive ? '#ff3b30' : '#e5c158',
                  borderRadius: '50%',
                  boxShadow: stareActive ? '0 0 16px #ff3b30, 0 0 30px #ff3b30' : '0 0 12px #e5c158, 0 0 25px rgba(229, 193, 88, 0.8)',
                  animation: 'flickerEye 3s infinite alternate'
                }}
              />
              <div
                style={{
                  width: '6px',
                  height: '8px',
                  backgroundColor: stareActive ? '#ff3b30' : '#e5c158',
                  borderRadius: '50%',
                  boxShadow: stareActive ? '0 0 16px #ff3b30, 0 0 30px #ff3b30' : '0 0 12px #e5c158, 0 0 25px rgba(229, 193, 88, 0.8)',
                  animation: 'flickerEye 3.5s infinite alternate'
                }}
              />
            </motion.div>
          </>
        )}

        {effect === 'spectral-glow' && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 40% 50%, rgba(142, 208, 129, 0.12) 0%, rgba(210, 168, 255, 0.08) 40%, transparent 70%)',
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              x: midTranslateX,
              y: midTranslateY
            }}
          />
        )}

        {effect === 'flickering-lantern' && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 55% 65%, rgba(255, 166, 87, 0.15) 0%, rgba(212, 175, 55, 0.08) 50%, transparent 75%)',
              pointerEvents: 'none',
              animation: 'flickerEye 2s infinite ease-in-out',
              x: fgTranslateX,
              y: fgTranslateY
            }}
          />
        )}

        {effect === 'abyssal-vortex' && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 35% 25%, rgba(121, 192, 255, 0.15) 0%, rgba(255, 123, 114, 0.08) 50%, transparent 70%)',
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              x: fgTranslateX,
              y: fgTranslateY
            }}
          />
        )}

        {/* Layer 3: Drifting Fog Mist Layer */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7, 10, 15, 0.92) 0%, rgba(7, 10, 15, 0.2) 60%, transparent 100%)',
            pointerEvents: 'none',
            x: fgTranslateX,
            y: fgTranslateY
          }}
        />

        {/* Interactive Notice on Click */}
        {stareActive && (
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(10, 15, 20, 0.95)',
              border: '1px solid var(--crimson-primary)',
              padding: '0.6rem 1.25rem',
              borderRadius: '6px',
              color: '#f0eae1',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 0 25px rgba(148, 43, 50, 0.5)',
              zIndex: 10
            }}
          >
            <ShieldAlert size={16} color="#ff3b30" />
            <span>The silence deepens... You sense the ancient entity attending to your presence.</span>
          </div>
        )}
      </div>

      {/* Museum Dossier Caption Bar */}
      <div style={{
        padding: '0.85rem 1.25rem',
        backgroundColor: 'rgba(8, 12, 16, 0.98)',
        borderTop: '1px solid rgba(212, 175, 55, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.8rem'
      }}>
        <div style={{ color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Cultural Lore:</strong> {story?.originCommunity || story?.country || 'Ancient Global Tradition'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-primary)' }}>
          <Eye size={14} />
          <span>Click canvas to toggle interactive focus</span>
        </div>
      </div>
    </div>
  );
};

export default StoryVisualizer;
