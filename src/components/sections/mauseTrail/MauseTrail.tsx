import '@/components/sections/mauseTrail/MauseTrail.css';
import { useEffect } from 'react';

export const MouseTrail = () => {
  useEffect(() => {
    const canUseCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canUseCustomCursor) return;

    const coords = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const circles = Array.from(
      document.querySelectorAll<HTMLElement & { x: number; y: number }>('.circle'),
    );
    if (!circles.length) return;

    const root = document.documentElement;
    root.classList.add('custom-cursor-enabled');

    const setThinCursor = (thin: boolean) => {
      circles.forEach((circle) => circle.classList.toggle('circle-thin', thin));
    };

    const isFormField = (target: EventTarget | null) => {
      return target instanceof HTMLElement && Boolean(target.closest('input, textarea, select'));
    };

    const handleMouseOver = (event: MouseEvent) => {
      if (isFormField(event.target)) setThinCursor(true);
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (!isFormField(event.target)) return;
      if (isFormField(event.relatedTarget)) return;
      setThinCursor(false);
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    circles.forEach((circle) => {
      circle.x = coords.x;
      circle.y = coords.y;
    });

    const move = (event: MouseEvent) => {
      coords.x = event.clientX;
      coords.y = event.clientY;

      circles.forEach((circle) => {
        circle.classList.remove('circle-hidden');
      });
    };

    window.addEventListener('mousemove', move);

    let animationFrameId = 0;

    const animateCircles = () => {
      let x = coords.x;
      let y = coords.y;

      circles.forEach((circle, index) => {
        const scale = (circles.length - index) / circles.length;
        circle.style.transform = `translate3d(${x - 12}px, ${y - 12}px, 0) scale(${scale})`;

        circle.x = x;
        circle.y = y;

        const nextCircle = circles[index + 1] || circles[0];
        x += (nextCircle.x - x) * 0.35;
        y += (nextCircle.y - y) * 0.35;
      });

      animationFrameId = requestAnimationFrame(animateCircles);
    };

    animateCircles();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      setThinCursor(false);
      root.classList.remove('custom-cursor-enabled');
    };
  }, []);

  return (
    <>
      {Array.from({ length: 40 }).map((_, index) => (
        <div key={index} className="circle circle-hidden"></div>
      ))}
    </>
  );
};

export default MouseTrail;
