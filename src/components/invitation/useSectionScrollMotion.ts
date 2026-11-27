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
      const clamp = (value: number) => Math.max(0, Math.min(1, value));

      // Read before writing: all layers share this continuous scroll progress,
      // rather than restarting an entrance when the active navigation changes.
      const remaining = scenes.map((scene) => {
        if (reducedMotion.matches || viewportHeight === 0) return [0, 0, 0];
        const { top, bottom } = scene.getBoundingClientRect();
        const fromBelow = clamp((viewportHeight - top) / (viewportHeight * 0.72));
        const fromAbove = clamp(bottom / (viewportHeight * 0.45));
        const progress = Math.min(fromBelow, fromAbove);
        // Slightly offset the layers along the same scroll timeline. Smoothstep
        // keeps each one gentle at both ends, including on a reversed scroll.
        const remaining = (value: number) => {
          const p = clamp(value);
          return 1 - p * p * (3 - 2 * p);
        };
        return [remaining(progress / .8), remaining(progress), remaining((progress - .12) / .88)];
      });
      scenes.forEach((scene, index) => {
        const [early, middle, late] = remaining[index];
        scene.style.setProperty('--invitation-scene-early', early.toFixed(4));
        scene.style.setProperty('--invitation-scene-motion', middle.toFixed(4));
        scene.style.setProperty('--invitation-scene-late', late.toFixed(4));
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
      scenes.forEach((scene) => {
        scene.style.removeProperty('--invitation-scene-early');
        scene.style.removeProperty('--invitation-scene-motion');
        scene.style.removeProperty('--invitation-scene-late');
      });
    };
  }, []);
}
