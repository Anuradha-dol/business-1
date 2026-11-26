import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';

const MUSIC_START = 20;
const AMBIENCE_LEVEL = 0.42;
const MUSIC_LEVEL = 0.68;

/** Keep both media elements alive while the opening scene is replaced. */
export function useWeddingAudio() {
  const ambience = useRef<HTMLAudioElement | null>(null);
  const song = useRef<HTMLAudioElement | null>(null);
  const animations = useRef(new Map<HTMLAudioElement, { id: number; target: number; pauseAfter: boolean }>());
  const inInvitation = useRef(false);
  const enabled = useRef(true);
  const unlocked = useRef(false);
  const ambienceAttempt = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [ambienceNeedsGesture, setAmbienceNeedsGesture] = useState(false);

  const cancelFade = useCallback((audio: HTMLAudioElement) => {
    const animation = animations.current.get(audio);
    if (animation) window.clearTimeout(animation.id);
    animations.current.delete(audio);
  }, []);

  const fade = useCallback((audio: HTMLAudioElement, target: number, duration: number, pauseAfter = false) => {
    cancelFade(audio);
    // Browsers suspend animation frames in hidden tabs. Finish immediately
    // there so that music never remains silent and the old track cannot linger.
    if (document.hidden) {
      audio.volume = target;
      if (pauseAfter) audio.pause();
      return;
    }
    const from = audio.volume;
    const start = performance.now();
    const tick = () => {
      const now = performance.now();
      const fraction = Math.min(1, (now - start) / duration);
      // Smoothstep avoids an audible step at either end of the crossfade.
      const eased = fraction * fraction * (3 - 2 * fraction);
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * eased));
      if (document.hidden) {
        audio.volume = target;
        animations.current.delete(audio);
        if (pauseAfter) audio.pause();
      } else if (fraction < 1) animations.current.set(audio, { id: window.setTimeout(tick, 40), target, pauseAfter });
      else {
        animations.current.delete(audio);
        if (pauseAfter) audio.pause();
      }
    };
    animations.current.set(audio, { id: window.setTimeout(tick, 40), target, pauseAfter });
  }, [cancelFade]);

  const startAmbience = useCallback((immediate = false) => {
    const audio = ambience.current;
    if (!audio || inInvitation.current) return;
    const attempt = ++ambienceAttempt.current;
    cancelFade(audio);
    if (!audio.paused) {
      setAmbienceNeedsGesture(false);
      if (immediate) audio.volume = AMBIENCE_LEVEL;
      else fade(audio, AMBIENCE_LEVEL, 1400);
      return;
    }
    audio.volume = immediate ? AMBIENCE_LEVEL : 0;
    void audio.play().then(() => {
      if (ambience.current === audio && !inInvitation.current) {
        if (ambienceAttempt.current === attempt) setAmbienceNeedsGesture(false);
        if (immediate) audio.volume = AMBIENCE_LEVEL;
        else fade(audio, AMBIENCE_LEVEL, 1400);
      }
      else audio.pause();
    }).catch(() => {
      // A refresh cannot grant autoplay permission. Offer an explicit sound
      // control until playback succeeds, without advancing the opening scene.
      if (ambience.current === audio && !inInvitation.current && ambienceAttempt.current === attempt) {
        setAmbienceNeedsGesture(true);
      }
    });
  }, [cancelFade, fade]);

  const startSong = useCallback((reset: boolean) => {
    const audio = song.current;
    if (!audio || !enabled.current) return;
    cancelFade(audio);
    if (reset) audio.currentTime = MUSIC_START;
    audio.volume = 0;
    void audio.play().then(() => {
      if (song.current === audio && inInvitation.current && enabled.current) {
        setNeedsGesture(false);
        setPlaying(true);
        fade(audio, MUSIC_LEVEL, 1800);
      } else audio.pause();
    }).catch(() => {
      if (inInvitation.current && enabled.current) {
        setPlaying(false);
        setNeedsGesture(true);
      }
    });
  }, [cancelFade, fade]);

  useEffect(() => {
    const base = `${import.meta.env.BASE_URL}assets/audio/`;
    const sea = new Audio(`${base}sea-wind.mp3`);
    const violin = new Audio(`${base}wedding-violin.mp3`);
    sea.preload = 'auto';
    sea.loop = true;
    violin.preload = 'auto';
    ambience.current = sea;
    song.current = violin;
    const onPause = () => { if (inInvitation.current) setPlaying(false); };
    const onEnded = () => { if (inInvitation.current && enabled.current) startSong(true); };
    violin.addEventListener('pause', onPause);
    violin.addEventListener('ended', onEnded);
    const onVisibilityChange = () => {
      if (!document.hidden) return;
      for (const [audio, animation] of animations.current) {
        window.clearTimeout(animation.id);
        audio.volume = animation.target;
        if (animation.pauseAfter) audio.pause();
      }
      animations.current.clear();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    startAmbience();
    return () => {
      ambienceAttempt.current++;
      cancelFade(sea);
      cancelFade(violin);
      violin.removeEventListener('pause', onPause);
      violin.removeEventListener('ended', onEnded);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      sea.pause();
      violin.pause();
      ambience.current = null;
      song.current = null;
    };
  }, [cancelFade, startAmbience, startSong]);

  const unlockOpening = useCallback(() => {
    if (inInvitation.current) return;
    if (unlocked.current) {
      // Permit another attempt if the browser denied an earlier gesture.
      if (ambience.current?.paused) startAmbience();
      return;
    }
    unlocked.current = true;
    startAmbience();
    if (!enabled.current) return;
    // Prime this exact media element during the click; some mobile browsers
    // require a gesture before they will allow playback later in the timeline.
    const audio = song.current;
    if (audio) {
      audio.volume = 0;
      audio.currentTime = MUSIC_START;
      void audio.play().then(() => {
        if (!inInvitation.current) {
          audio.pause();
          audio.currentTime = MUSIC_START;
        }
      }).catch(() => { /* The music control remains the fallback. */ });
    }
  }, [startAmbience]);

  const unlockOnKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') unlockOpening();
  }, [unlockOpening]);

  const enterInvitation = useCallback(() => {
    inInvitation.current = true;
    setAmbienceNeedsGesture(false);
    const sea = ambience.current;
    if (sea) fade(sea, 0, 1400, true);
    if (enabled.current) startSong(true);
  }, [fade, startSong]);

  const replayOpening = useCallback(() => {
    inInvitation.current = false;
    // Allow the next opening gesture to retry audio if replay playback was
    // blocked, and to prime the music element again when it is enabled.
    unlocked.current = false;
    const audio = song.current;
    if (audio) {
      cancelFade(audio);
      audio.pause();
      audio.currentTime = MUSIC_START;
    }
    const sea = ambience.current;
    if (sea) { cancelFade(sea); sea.currentTime = 0; }
    setPlaying(false);
    setNeedsGesture(false);
    // Replay is itself a user gesture: restart the opening sound even if the
    // separate invitation music control has been muted.
    startAmbience(true);
  }, [cancelFade, startAmbience]);

  const toggle = useCallback(() => {
    const audio = song.current;
    if (!audio) return;
    if (playing) {
      enabled.current = false;
      cancelFade(audio);
      audio.pause();
      setPlaying(false);
    } else {
      enabled.current = true;
      startSong(false);
    }
  }, [cancelFade, playing, startSong]);

  return { unlockOpening, unlockOnKey, enterInvitation, replayOpening, ambienceNeedsGesture, music: { playing, needsGesture, toggle } };
}
