import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CalendarDays, Heart, Mail, MapPin, Music2, Pause, Play, RotateCcw, X } from 'lucide-react';
import { wedding } from '../../data/wedding';
import './Invitation.css';

type Page = 'home' | 'story' | 'day' | 'venue' | 'rsvp';
type RsvpDraft = { name: string; attendance: string; guests: string; message: string };
type Props = { onReplay?: () => void; music: { playing: boolean; needsGesture: boolean; toggle: () => void } };

function LinkedHearts({ size = 42, className }: { size?: number; className?: string }) {
  return <img className={className} width={size} height={size} src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/linked-hearts.svg`} alt="" aria-hidden="true" />;
}

const draftKey = 'wedding-rsvp-draft';
const emptyDraft: RsvpDraft = { name: '', attendance: '', guests: '1', message: '' };
const pages: { id: Page; label: string; icon: typeof Heart }[] = [
  { id: 'story', label: 'Our Story', icon: Heart },
  { id: 'day', label: 'The Day', icon: CalendarDays },
  { id: 'venue', label: 'Venue', icon: MapPin },
  { id: 'rsvp', label: 'RSVP', icon: Mail },
];

export default function Invitation({ onReplay, music }: Props) {
  const [page, setPage] = useState<Page>('home');
  const [draft, setDraft] = useState<RsvpDraft>(() => {
    try { return { ...emptyDraft, ...JSON.parse(localStorage.getItem(draftKey) || '{}') }; } catch { return emptyDraft; }
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const { playing, needsGesture, toggle } = music;
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => { if (page !== 'home') panelRef.current?.focus(); }, [page]);
  const saveDraft = (event: FormEvent) => {
    event.preventDefault();
    try { localStorage.setItem(draftKey, JSON.stringify(draft)); setSaveStatus('saved'); } catch { setSaveStatus('error'); }
  };
  const changeDraft = (field: keyof RsvpDraft, value: string) => { setDraft(current => ({ ...current, [field]: value })); setSaveStatus('idle'); };
  const current = pages.find(item => item.id === page);

  return <main className="wedding-home">
    <div className="wedding-home__background" style={{ backgroundImage: `url("${import.meta.env.BASE_URL}assets/images/cinematic/main-background.png")` }} aria-hidden="true">
      <div className="wedding-home__side wedding-home__side--left" />
      <div className="wedding-home__side wedding-home__side--right" />
      <div className="wedding-home__glow" />
    </div>
    <header className="wedding-home__header">
      <button className="wedding-home__monogram" onClick={() => setPage('home')} aria-label="Home">{wedding.monogram}<span>⌁ ❧ ⌁</span></button>
      <nav className="wedding-home__nav" aria-label="Wedding navigation">
        <button className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')} aria-current={page === 'home' ? 'page' : undefined}>Home</button>
        {pages.map(item => <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => setPage(item.id)} aria-current={page === item.id ? 'page' : undefined}>{item.label}</button>)}
      </nav>
      <button className="wedding-home__music" onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Pause music' : 'Play music'} title={playing ? 'Pause music' : 'Play music'}>
        <Music2 size={19}/>{playing ? <Pause size={16}/> : <Play size={16}/>}<span>{playing ? 'Pause' : 'Music'}</span>
      </button>
      {needsGesture && <span className="wedding-home__music-error" role="status">Tap Music to play the song.</span>}
    </header>
    <div className="wedding-home__body">
      {page === 'home' ? <section className="wedding-hero" aria-labelledby="wedding-home-title">
        <div className="wedding-hero__shell" aria-hidden="true"><span/><LinkedHearts size={42}/><span/></div>
        <p className="wedding-hero__eyebrow"><span/>The wedding of<span/></p>
        <h1 id="wedding-home-title">{wedding.bride} <span>&amp;</span> {wedding.groom}</h1>
        <div className="wedding-hero__flourish" aria-hidden="true">❧ ♡ ❧</div>
        <div className="wedding-hero__date"><span aria-hidden="true">❧</span><time dateTime={wedding.dateISO}><strong>{wedding.day}</strong>{wedding.month} {wedding.year}</time><span aria-hidden="true">☙</span></div>
        <div className="wedding-hero__tiles">
          {pages.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setPage(id)}><Icon size={34} strokeWidth={1.5}/><span>{label}</span></button>)}
        </div>
        <div className="wedding-hero__bottom" aria-hidden="true">❧ ♡ ❧</div>
        {onReplay && <button className="wedding-home__replay" onClick={onReplay}><RotateCcw size={14}/> Replay invitation</button>}
      </section> : <section className="wedding-panel" ref={panelRef} tabIndex={-1} aria-labelledby="wedding-panel-title">
        <button className="wedding-panel__close" onClick={() => setPage('home')} aria-label="Return home"><X size={20}/></button>
        <LinkedHearts className="wedding-panel__shell" size={32}/>
        <p className="wedding-panel__eyebrow">Himeshi &amp; Madhawa</p>
        <h2 id="wedding-panel-title">{current?.label}</h2>
        <div className="wedding-panel__ornament" aria-hidden="true">❧ ♡ ❧</div>
        {page === 'story' && <div className="wedding-panel__content"><p>Two hearts, one beautiful journey.</p><p>We look forward to sharing the next chapter of our story with you.</p></div>}
        {page === 'day' && <div className="wedding-panel__content"><p className="wedding-panel__date"><time dateTime={wedding.dateISO}>{wedding.dateLabel}</time></p><p>We can't wait to celebrate together.</p><p className="wedding-panel__note">The time will be shared once confirmed.</p></div>}
        {page === 'venue' && <div className="wedding-panel__content"><MapPin size={28} strokeWidth={1.3} aria-hidden="true"/><p>Our celebration awaits.</p><p className="wedding-panel__note">Venue details will be shared once confirmed.</p></div>}
        {page === 'rsvp' && <form className="wedding-rsvp" onSubmit={saveDraft}>
          <p>Prepare your response below. It is saved only on this device and is not sent to the couple.</p>
          <label>Your name<input required value={draft.name} onChange={event => changeDraft('name', event.target.value)} autoComplete="name"/></label>
          <div className="wedding-rsvp__row"><label>Attendance<select required value={draft.attendance} onChange={event => changeDraft('attendance', event.target.value)}><option value="">Please choose</option><option value="accept">Joyfully accepts</option><option value="decline">Regretfully declines</option></select></label><label>Guests<input type="number" min="1" max="20" value={draft.guests} onChange={event => changeDraft('guests', event.target.value)}/></label></div>
          <label>Message <span>(optional)</span><textarea rows={2} value={draft.message} onChange={event => changeDraft('message', event.target.value)}/></label>
          <button type="submit">Save response on this device</button>
          <p className="wedding-rsvp__status" role="status">{saveStatus === 'saved' ? 'Draft saved on this device. Your response has not been sent.' : saveStatus === 'error' ? 'Unable to save on this device. Please check your browser storage settings.' : ''}</p>
        </form>}
      </section>}
    </div>
  </main>;
}
