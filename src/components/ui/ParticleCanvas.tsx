'use client';

import { useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    const SPEED = 0.5;
    const DIST = 150;
    const NUMBER = 60;

    const resizeCanvas = () => {
      const wrapper = canvas.parentElement;
      if (!wrapper) return;
      width = canvas.width = wrapper.offsetWidth;
      height = canvas.height = wrapper.offsetHeight;

      // Reinitialize points on resize
      pointsRef.current = [];
      for (let i = 0; i < NUMBER; i++) {
        pointsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * SPEED,
          vy: (Math.random() - 0.5) * SPEED,
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getDist = (a: Point, b: Point) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const drawLines = () => {
      const points = pointsRef.current;
      for (let i = 0; i < points.length - 1; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dist = getDist(points[i], points[j]);
          if (dist <= DIST) {
            const alpha = 1 - dist / DIST;
            context.strokeStyle = `hsla(177, 100%, 37%, ${alpha})`;
            context.lineWidth = Math.pow(1 - dist / DIST, 1.5) * 2;
            context.beginPath();
            context.moveTo(points[i].x, points[i].y);
            context.lineTo(points[j].x, points[j].y);
            context.stroke();
          }
        }
      }
    };

    const drawPoints = () => {
      const points = pointsRef.current;
      for (const point of points) {
        context.beginPath();
        context.arc(point.x, point.y, 2, 0, Math.PI * 2);
        context.fillStyle = 'hsl(177, 100%, 47%)';
        context.fill();
      }
    };

    const updatePoints = () => {
      const points = pointsRef.current;
      for (const point of points) {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
      }
    };

    const animate = () => {
      context.clearRect(0, 0, width, height);
      drawLines();
      drawPoints();
      updatePoints();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default ParticleCanvas;
