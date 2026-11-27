import { useRef, useState } from 'react';
import Envelope from './components/opening/Envelope';
import Invitation from './components/invitation/Invitation';
import { useWeddingAudio } from './useWeddingAudio';
import './OpeningAudio.css';

export default function App() {
  const [showInvitation, setShowInvitation] = useState(false);
  const audio = useWeddingAudio();
  const fullscreenAttempted = useRef(false);

  const handleOpeningClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Audio must be unlocked before fullscreen consumes the user's gesture.
    audio.unlockOpening();
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('.envelope-hit, .open-action')) return;
    if (fullscreenAttempted.current || !window.matchMedia('(pointer: coarse) and (max-width: 900px)').matches) return;
    fullscreenAttempted.current = true;
    const root = document.documentElement;
    // Fullscreen is not supported in every mobile browser (including iOS
    // Safari). The regular sticky navigation remains available in that case.
    if (!document.fullscreenElement && document.fullscreenEnabled && root.requestFullscreen) {
      void root.requestFullscreen().catch(() => {});
    }
  };

  const showHome = () => {
    audio.enterInvitation();
    setShowInvitation(true);
  };
  const replay = () => {
    audio.replayOpening();
    setShowInvitation(false);
  };

  return showInvitation
    ? <Invitation onReplay={replay} music={audio.music} />
    : <div onClickCapture={handleOpeningClick} onKeyDownCapture={audio.unlockOnKey}>
        <Envelope onComplete={showHome} onArtworkReady={audio.openingArtworkReady} />
        {audio.ambienceNeedsGesture && (
          <button className="opening-audio" type="button">
            <span aria-hidden="true">♫</span> Enable ocean sound
          </button>
        )}
      </div>;
}
