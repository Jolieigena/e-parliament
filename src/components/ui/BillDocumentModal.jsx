import { useMemo } from 'react';
import { X, Printer, FileCheck2 } from 'lucide-react';
import { useApp } from '../../mock/store';
import Badge from './Badge';

function refFor(bill) {
  let h = 0;
  for (const ch of bill.id) h = (h * 31 + ch.charCodeAt(0)) % 100000;
  const year = bill.history?.[0]?.date?.slice(0, 4) || '2026';
  return { number: `Bill No. ${(h % 900) + 100} of ${year}`, year };
}

function provisionTitle(sentence) {
  const words = sentence.replace(/[.!?\s]+$/g, '').split(' ').slice(0, 6).join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const BillDocumentModal = ({ bill, onClose }) => {
  const { members, institutions } = useApp();

  const isGovBill = bill.sponsorType === 'Government';
  const sponsor = isGovBill ? null : members.find((m) => m.id === bill.sponsorId);
  const institution = isGovBill ? institutions.find((i) => i.id === bill.institutionId) : null;
  const sponsorLabel = isGovBill ? institution?.name || 'Government' : sponsor?.name;

  const { number } = useMemo(() => refFor(bill), [bill]);
  const sentences = useMemo(
    () => bill.summary.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0),
    [bill.summary],
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '85vh',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            background: 'var(--glass-bg)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Badge tone="neutral">Bill Document</Badge>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {number}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-strong)' }}>
              {bill.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => window.print()}>
              <Printer size={14} /> Print
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* SEAL BANNER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
            }}
          >
            <FileCheck2 size={24} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-strong)' }}>
                Draft Bill — For Parliamentary Consideration
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Sponsored by {sponsorLabel} · Category: {bill.category} · Current stage: {bill.stage}
              </div>
            </div>
          </div>

          {/* LONG TITLE */}
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Long title
            </h4>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-strong)', margin: 0, fontWeight: 600 }}>
              A BILL for {bill.title}.
            </p>
          </div>

          {/* PREAMBLE */}
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Preamble
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-strong)', margin: 0 }}>
              Whereas it is expedient to make provision in respect of matters relating to {bill.category.toLowerCase()};
              and whereas the Assembly considers it necessary and desirable that the objects set out in this Bill be
              given the force of law for the benefit of the public —
            </p>
          </div>

          {/* PROVISIONS */}
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Principal provisions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                  Section 1 — Short title and commencement
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-strong)', margin: 0, lineHeight: 1.5 }}>
                  This Bill may be cited as the {bill.title}, {refFor(bill).year}, and shall come into operation on a
                  date appointed by the Assembly by resolution.
                </p>
              </div>

              <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                  Section 2 — Interpretation
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-strong)', margin: 0, lineHeight: 1.5 }}>
                  In this Bill, unless the context otherwise requires, any term not defined herein shall bear the
                  meaning assigned to it in the principal legislation.
                </p>
              </div>

              {sentences.map((sentence, i) => (
                <div key={i} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                    Section {i + 3} — {provisionTitle(sentence)}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-strong)', margin: 0, lineHeight: 1.5 }}>
                    {sentence}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="live-summary-disclaimer" style={{ margin: 0 }}>
            Prototype rendering of the Bill's long title and principal provisions, composed from the published
            summary. Full clause text is held in the official record.
          </p>
        </div>

        {/* MODAL FOOTER */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--glass-bg)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>National Assembly Office of Legislative Drafting · Ref: {number}</span>
        </div>
      </div>
    </div>
  );
};

export default BillDocumentModal;
