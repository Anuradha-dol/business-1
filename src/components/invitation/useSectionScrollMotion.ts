import { useEffect } from 'react';

/** Move each invitation card gently into place as it enters the viewport. */
export function useSectionScrollMotion() {
  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('.stage-scene:not(.stage-scene--home)'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportHeight = document.documentElement.clientHeight;
      const travel = Math.min(36, viewportHeight * 0.045);

      // Read all positions before writing any styles to avoid repeated layouts.
      const lifts = scenes.map((scene) => {
        if (reducedMotion.matches) return 0;
        const top = scene.getBoundingClientRect().top;
        const progress = Math.max(0, Math.min(1, (viewportHeight - top) / (viewportHeight * 0.72)));
        return travel * (1 - progress);
      });
      scenes.forEach((scene, index) => {
        scene.style.setProperty('--invitation-card-lift', `${lifts[index].toFixed(2)}px`);
      });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('resize', schedule, { passive: true });
    reducedMotion.addEventListener('change', schedule);
    return () => {
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
      if (frame) window.cancelAnimationFrame(frame);
      scenes.forEach((scene) => scene.style.removeProperty('--invitation-card-lift'));
    };
  }, []);
}
