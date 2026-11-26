import { useState } from 'react';
import Envelope from './components/opening/Envelope';
import Invitation from './components/invitation/Invitation';
import { useWeddingAudio } from './useWeddingAudio';
import './OpeningAudio.css';

export default function App() {
  const [showInvitation, setShowInvitation] = useState(false);
  const audio = useWeddingAudio();

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
    : <div onClickCapture={audio.unlockOpening} onKeyDownCapture={audio.unlockOnKey}>
        <Envelope onComplete={showHome} />
        {audio.ambienceNeedsGesture && (
          <button className="opening-audio" type="button">
            <span aria-hidden="true">♫</span> Enable ocean sound
          </button>
        )}
      </div>;
}
