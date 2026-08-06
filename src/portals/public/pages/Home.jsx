import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, UserRound, FileText, Video, Play, Volume2, PenTool, Landmark, Vote, Users2 } from 'lucide-react';
import { useApp } from '../../../mock/store';
import Reveal from '../../../components/ui/Reveal';
import CountUp from '../../../components/ui/CountUp';

const MP_HERO_PHOTOS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
];

const AGENDA = [
  {
    tag: 'Second reading',
    title: 'Infrastructure Budget 2026',
    desc: 'Debate on funding high-speed rural broadband for unconnected municipalities.',
    billId: 'bill-infra',
  },
  {
    tag: 'Question time',
    title: 'Ministerial Oral Answers',
    desc: 'Public questioning session directed at the Minister of Finance regarding budget forecasts.',
  },
  {
    tag: 'Third reading',
    title: 'Public Sector Pension Reform Bill',
    desc: 'Final floor vote on the contributory pension reform and its transition cost.',
    billId: 'bill-pension',
  },
];

const Home = () => {
  const { bills, session } = useApp();


  return (
    <div>
      {/* BALANCED 2-COLUMN LUXURY HERO SECTION */}
      <Reveal>
        <div className="editorial-hero-container">
        <div className="editorial-hero-bg" />
        <div className="editorial-hero-overlay" />

        {/* HERO BODY */}
        <div className="editorial-hero-body">
          {/* LEFT EDITORIAL COPY */}
          <div>
            <Reveal delay={0}>
              <div className="editorial-eyebrow">E-Parliament &middot; Built for Governments</div>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="editorial-title">
                The digital backbone of a modern Parliament.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="editorial-lede">
                One secure platform that gives governments total transparency and citizens a real voice &mdash; plain-language legislation, verifiable roll-call votes, live chamber sittings, and e-petitions with real impact.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/public/bills" className="editorial-capsule-btn">
                  Explore Bills <ArrowRight size={14} />
                </Link>

                <Link to="/public/members" className="editorial-capsule-btn" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  <UserRound size={14} /> Find your MP
                </Link>
              </div>
            </Reveal>
          </div>

          {/* RIGHT CHAMBER CARD (LIVE OR ADJOURNED) */}
          <Reveal delay={360}>
          {session?.live ? (
            <div className="hero-live-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="live-badge">
                    <span className="pulse-dot" /> LIVE SITTING IN SESSION
                  </div>
                  <span className="live-rec"><span className="rec-dot" /> REC</span>
                </div>
                <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Plenary Floor</span>
              </div>

              <div className="player-preview">
                <div className="player-overlay">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(15,23,42,0.6)', padding: '3px 8px', borderRadius: '4px', color: '#fff', fontWeight: 600 }}>
                      HD Broadcast 1080p
                    </span>
                    <Volume2 size={16} color="#fff" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Link to="/public/sitting/live" className="play-icon-circle">
                      <Play size={20} style={{ marginLeft: '3px' }} />
                    </Link>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#fff', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                    {session?.name || 'Ordinary Sitting — Floor Debate'}
                  </div>
                </div>
              </div>

              <div className="live-progress-wrap">
                <div className="live-progress-track">
                  <div className="live-progress-fill" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: 600, marginBottom: '10px' }}>
                <span>Streaming live · HD 1080p</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span className="viewer-dot" /> 1,284 watching
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>Current Business: Infrastructure Budget 2026</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px' }}>Hon. S. Kamau (Speaker presiding)</div>
                </div>
                <Link to="/public/sitting/live" className="btn btn-primary btn-sm" style={{ textDecoration: 'none', whiteSpace: 'nowrap', fontSize: '11.5px' }}>
                  Watch Live Stream
                </Link>
              </div>
            </div>
          ) : (
            <div className="hero-live-card" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="live-badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    CHAMBER ADJOURNED
                  </div>
                </div>
                <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Plenary Floor</span>
              </div>

              <div className="player-preview" style={{ filter: 'grayscale(0.6) brightness(0.8)' }}>
                <div className="player-overlay" style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(15,23,42,0.8)', padding: '3px 8px', borderRadius: '4px', color: '#fff', fontWeight: 600 }}>
                      Next: Tomorrow, 9:00 AM
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.7 }}>
                    <div style={{ padding: '16px', borderRadius: '50%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)' }}>
                       <Video size={28} color="#fff" />
                    </div>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#fff', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.8)', textAlign: 'center' }}>
                    Awaiting next sitting
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginTop: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>No live broadcast at the moment</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px' }}>The chamber is currently adjourned.</div>
                </div>
                <Link to="/public/sitting" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', whiteSpace: 'nowrap', fontSize: '11.5px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Watch Past Recordings
                </Link>
              </div>
            </div>
          )}
          </Reveal>
        </div>

        {/* FROSTED GLASS STAT PILLS */}
        <div className="editorial-bottom-bar">
          <div className="editorial-bottom-card">
            <div style={{ display: 'flex', flexShrink: 0 }}>
              {MP_HERO_PHOTOS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="MP Avatar"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ffffff',
                    marginLeft: idx > 0 ? '-12px' : 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
            <div>
              <div className="card-title"><CountUp end={120} /> Members of Parliament</div>
              <div className="card-desc">Representing 12M+ Citizens across 5 Parliamentary Parties</div>
            </div>
          </div>

          <div className="editorial-bottom-card">
            <ShieldCheck size={24} color="#a5b4fc" style={{ flexShrink: 0 }} />
            <div>
              <div className="card-title">100% Open Data &amp; Verified Records</div>
              <div className="card-desc">Publicly accessible legislation &amp; roll-call votes</div>
            </div>
          </div>
        </div>
      </div>
      </Reveal>

      {/* QUICK ACTION FEATURE HUB */}
      <Reveal delay={100}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', margin: '36px 0' }}>
        <Link to="/public/bills" className="public-card feature-hub-card">
          <div className="feature-icon-box">
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-strong)' }}>Track Legislation</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Plain-language bill summaries</div>
          </div>
        </Link>

        <Link to="/public/members" className="public-card feature-hub-card">
          <div className="feature-icon-box">
            <UserRound size={22} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-strong)' }}>Find Your MP</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Search &amp; message your representative</div>
          </div>
        </Link>

        <Link to="/public/sitting" className="public-card feature-hub-card">
          <div className="feature-icon-box">
            <Video size={22} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-strong)' }}>Watch Sittings</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Live broadcast &amp; gallery visits</div>
          </div>
        </Link>

        <Link to="/public/petitions" className="public-card feature-hub-card">
          <div className="feature-icon-box">
            <PenTool size={22} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-strong)' }}>Sign Petitions</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Have your say on key issues</div>
          </div>
        </Link>
      </div>
      </Reveal>

      {/* FOR GOVERNMENTS */}
      <Reveal delay={100}>
      <section id="for-governments" className="gov-offer">
        <div className="gov-offer-head">
          <span className="gov-offer-eyebrow">For Governments</span>
          <h2>Built for institutions that answer to the public.</h2>
          <p>E-Parliament gives your assembly the transparency citizens expect and the workflows your staff need &mdash; in one secure platform.</p>
        </div>

        <div className="gov-offer-grid">
          <div className="gov-offer-item">
            <div className="gov-offer-icon"><Landmark size={20} /></div>
            <div>
              <h4>Open legislation records</h4>
              <p>Plain-language bills, committee work, and full history published as a public record.</p>
            </div>
          </div>
          <div className="gov-offer-item">
            <div className="gov-offer-icon"><Vote size={20} /></div>
            <div>
              <h4>Verifiable roll-call votes</h4>
              <p>Every vote recorded and auditable, so results stand up to scrutiny.</p>
            </div>
          </div>
          <div className="gov-offer-item">
            <div className="gov-offer-icon"><ShieldCheck size={20} /></div>
            <div>
              <h4>Secure oversight workflows</h4>
              <p>Ministries and agencies respond to questions and submit legislation through a controlled channel.</p>
            </div>
          </div>
          <div className="gov-offer-item">
            <div className="gov-offer-icon"><Users2 size={20} /></div>
            <div>
              <h4>Citizen engagement, built in</h4>
              <p>Live sittings, MP directories, and e-petitions turn public feedback into action.</p>
            </div>
          </div>
        </div>

        <div className="gov-offer-cta">
          <Link to="/government/signin" className="btn btn-primary btn-lg">
            Explore the Government Portal
          </Link>
          <Link to="/public" className="gov-offer-link">See the public experience &rarr;</Link>
        </div>
      </section>
      </Reveal>

      {/* TODAY AT THE ASSEMBLY */}
      <Reveal delay={150}>
      <div style={{ margin: '44px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div>
            <h2>Today at the Assembly</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0' }}>
              What's being debated and decided this week, explained simply.
            </p>
          </div>
        </div>

        <div className="agenda-list">
          {AGENDA.map((a, idx) => {
            const content = (
              <div className="agenda-list-item-inner">
                <div className="agenda-time-col">
                  <span className="tag">{a.tag}</span>
                </div>
                <div className="agenda-content-col">
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                </div>
              </div>
            );
            return a.billId ? (
              <Link
                key={idx}
                to={`/public/bills/${a.billId}`}
                className="agenda-list-item"
              >
                {content}
              </Link>
            ) : (
              <div key={idx} className="agenda-list-item">
                {content}
              </div>
            );
          })}
        </div>
      </div>
      </Reveal>

      {/* BILLS BEFORE PARLIAMENT */}
      <Reveal delay={200}>
      <div style={{ margin: '44px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div>
            <h2>Bills before parliament</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0' }}>
              The legislation moving through the Assembly right now.
            </p>
          </div>
          <Link to="/public/bills" className="dash-section-link">
            See all bills &rarr;
          </Link>
        </div>

        <div className="public-bills-asym-layout">
          {/* Featured Bill (Left) */}
          {bills.length > 0 && (
            <div className="featured-bill-col">
              {(() => {
                const bill = bills[0];
                const rawSupport = Math.min(100, Math.max(30, (bill.votes?.aye || 65) * 1.1));
                const roundedSupport = Math.round(rawSupport);
                return (
                  <div key={bill.id} className="public-card public-bill-card featured-bill-card">
                    <div className="topic">{bill.category}</div>
                    <h2>{bill.title}</h2>
                    <div className="plain">{bill.summary}</div>
                    <div className="public-stage-pill">{bill.stage}</div>

                    <div className="support-meter">
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${roundedSupport}%` }} />
                      </div>
                      <div className="lbl">
                        <span>Public &amp; Chamber Support</span>
                        <span>{roundedSupport}%</span>
                      </div>
                    </div>

                    <div className="bill-actions">
                      <Link to={`/public/bills/${bill.id}`} className="btn btn-primary btn-md" style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}>
                        Read full summary
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* List of other bills (Right) */}
          <div className="other-bills-col">
            <h3 style={{ marginBottom: '16px', fontSize: '15px', color: 'var(--text-strong)' }}>Other active legislation</h3>
            <div className="other-bills-list">
              {bills.slice(1, 4).map((bill) => (
                <Link to={`/public/bills/${bill.id}`} key={bill.id} className="other-bill-item">
                  <div className="topic">{bill.category}</div>
                  <h4>{bill.title}</h4>
                  <div className="public-stage-pill">{bill.stage}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      </Reveal>
    </div>
  );
};

export default Home;
