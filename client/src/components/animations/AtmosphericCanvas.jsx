import React, { useEffect, useRef } from 'react';

const AtmosphericCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Fog and Star Particles
    const particleCount = 45;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 120 + 80, // Large soft mist puff
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.08 + 0.02,
        hue: Math.random() > 0.6 ? 180 : 45 // Subtle teal or faint amber
      });
    }

    // Celestial Dust Particles
    const dustCount = 60;
    const dustParticles = [];
    for (let i = 0; i < dustCount; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -Math.random() * 0.2 - 0.05,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Render Soft Drifting Mist
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        if (p.hue === 180) {
          grad.addColorStop(0, `rgba(40, 70, 75, ${p.opacity})`);
        } else {
          grad.addColorStop(0, `rgba(50, 40, 25, ${p.opacity * 0.8})`);
        }
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Floating Embers & Star Dust
      dustParticles.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;

        if (d.y < 0) d.y = height;
        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;

        const currentAlpha = Math.abs(Math.sin(time * d.pulseSpeed * 10)) * d.alpha;
        ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-fog-canvas" aria-hidden="true" />;
};

export default AtmosphericCanvas;
