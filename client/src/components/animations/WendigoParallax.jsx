import React, { useState, useRef, useEffect } from 'react';
import { Eye, Volume2, VolumeX, Sparkles, AlertTriangle } from 'lucide-react';

const WendigoParallax = ({ interactive = true }) => {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [stareActive, setStareActive] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState(false);

  // Web Audio API synthesized ambient cold wind when enabled
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  const toggleSound = () => {
    if (!ambientAudio) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Create pink noise buffer for winter blizzard wind
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
          data[i] *= 0.04;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNodeRef.current = gainNode;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();

        setAmbientAudio(true);
      } catch (e) {
        console.warn('Audio synthesis not supported:', e);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setAmbientAudio(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: x * 25, y: y * 25 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div 
      className="wendigo-interactive-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.15)',
        backgroundColor: '#05070a'
      }}
    >
      {/* Top Banner Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1.25rem',
        backgroundColor: 'rgba(12, 17, 23, 0.95)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)' }}>
          <Sparkles size={16} />
          <span>LIVING ARTIFACT — THE ALGONQUIAN WENDIGO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleSound}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'transparent',
              color: ambientAudio ? 'var(--gold-primary)' : 'var(--text-muted)',
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px'
            }}
            title={ambientAudio ? "Mute Winter Blizzard" : "Listen to Subarctic Taiga Wind"}
          >
            {ambientAudio ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{ambientAudio ? "Blizzard: Playing (Click to Mute)" : "Blizzard: Muted (Click to Listen)"}</span>
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Move pointer to shift parallax
          </span>
        </div>
      </div>

      {/* Main Parallax Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setStareActive(!stareActive)}
        style={{
          position: 'relative',
          width: '100%',
          height: '480px',
          overflow: 'hidden',
          cursor: 'crosshair'
        }}
      >
        {/* Layer 1: Background Forest & Skull Moon */}
        <div
          style={{
            position: 'absolute',
            top: '-5%',
            left: '-5%',
            width: '110%',
            height: '110%',
            backgroundImage: 'url(/images/artwork/wendigo_forest.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${offset.x * 0.4}px, ${offset.y * 0.4}px) scale(1.05)`,
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.8s ease',
            filter: stareActive ? 'contrast(1.2) brightness(0.85)' : 'none'
          }}
        />

        {/* Layer 2: Drifting Eerie Mist Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 45% 25%, rgba(212, 175, 55, 0.12) 0%, transparent 60%), linear-gradient(to top, rgba(5, 8, 11, 0.85) 0%, transparent 60%)',
            pointerEvents: 'none',
            mixBlendMode: 'screen',
            transform: `translate(${-offset.x * 0.6}px, ${-offset.y * 0.6}px)`,
            transition: 'transform 0.15s ease-out'
          }}
        />

        {/* Layer 3: Feral Wendigo Eyes in the Deep Shadows */}
        <div
          style={{
            position: 'absolute',
            top: '42%',
            left: '68%',
            transform: `translate(${offset.x * 0.8}px, ${offset.y * 0.8}px)`,
            pointerEvents: 'none',
            display: 'flex',
            gap: '14px',
            opacity: isHovered || stareActive ? 1 : 0.35,
            transition: 'opacity 0.4s ease'
          }}
        >
          {/* Left Eye */}
          <div
            style={{
              width: '6px',
              height: '8px',
              backgroundColor: stareActive ? '#ff3b30' : '#e5c158',
              borderRadius: '50%',
              boxShadow: stareActive 
                ? '0 0 16px #ff3b30, 0 0 30px #ff3b30' 
                : '0 0 12px #e5c158, 0 0 25px rgba(229, 193, 88, 0.8)',
              animation: 'flickerEye 3s infinite alternate'
            }}
          />
          {/* Right Eye */}
          <div
            style={{
              width: '6px',
              height: '8px',
              backgroundColor: stareActive ? '#ff3b30' : '#e5c158',
              borderRadius: '50%',
              boxShadow: stareActive 
                ? '0 0 16px #ff3b30, 0 0 30px #ff3b30' 
                : '0 0 12px #e5c158, 0 0 25px rgba(229, 193, 88, 0.8)',
              animation: 'flickerEye 3.5s infinite alternate'
            }}
          />
        </div>

        {/* Skull Moon Glow Enhancement */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '21%',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(230, 222, 203, 0.25) 0%, rgba(212, 175, 55, 0.1) 40%, transparent 70%)',
            pointerEvents: 'none',
            transform: `translate(${offset.x * 0.2}px, ${offset.y * 0.2}px)`,
            filter: 'blur(8px)'
          }}
        />

        {/* Ambient Overlay Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.95)',
            pointerEvents: 'none'
          }}
        />

        {/* Interactive Stare Notification */}
        {stareActive && (
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(10, 14, 18, 0.92)',
              border: '1px solid #8a252c',
              padding: '0.6rem 1.2rem',
              borderRadius: '6px',
              color: '#f0eae1',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 0 25px rgba(138, 37, 44, 0.5)',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            <AlertTriangle size={16} color="#ff3b30" />
            <span>The Taiga freezes... The Wendigo has caught your gaze.</span>
          </div>
        )}
      </div>

      {/* Caption & Folklore Attribution Footer */}
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
          <strong style={{ color: 'var(--text-primary)' }}>Origin:</strong> Algonquian First Nations (Subarctic Taiga & Great Lakes)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-gold)' }}>
          <Eye size={15} />
          <span>Click canvas to lock gaze & summon the cold</span>
        </div>
      </div>
    </div>
  );
};

export default WendigoParallax;
