import { useState } from 'react';
import { 
  FileText, 
  BookOpen, 
  Newspaper, 
  Scroll, 
  Search, 
  Download, 
  Eye, 
  X, 
  CheckCircle2, 
  Calendar, 
  FileCheck2,
  Share2,
  Printer,
  Sparkles
} from 'lucide-react';
import { OFFICIAL_DOCUMENTS } from '../mock/documentsData';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const TYPE_META = {
  Act: { icon: Scroll, color: '#3B82F6', label: 'Act of Parliament' },
  Hansard: { icon: BookOpen, color: '#8B5CF6', label: 'Verbatim Hansard' },
  Gazette: { icon: Newspaper, color: '#10B981', label: 'Gazette Notice' },
  'Order Paper': { icon: FileText, color: '#F59E0B', label: 'Order Paper' },
};

const OfficialDocuments = () => {
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [previewDoc, setPreviewDoc] = useState(null);

  const q = searchQuery.toLowerCase().trim();

  const filteredDocs = OFFICIAL_DOCUMENTS.filter((doc) => {
    if (selectedType !== 'All' && doc.documentType !== selectedType) return false;
    if (selectedYear !== 'All' && !doc.publishDate.startsWith(selectedYear)) return false;
    if (q) {
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchRef = doc.referenceNumber.toLowerCase().includes(q);
      const matchCat = doc.category.toLowerCase().includes(q);
      if (!matchTitle && !matchRef && !matchCat) return false;
    }
    return true;
  });

  const handleDownload = (doc) => {
    alert(`Downloading official PDF for "${doc.title}" (${doc.referenceNumber})...`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* FILTER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['All', 'Act', 'Hansard', 'Gazette', 'Order Paper'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedType === type ? 'var(--primary)' : 'var(--border)',
                background: selectedType === type ? 'rgba(99, 102, 241, 0.12)' : 'var(--surface)',
                color: selectedType === type ? 'var(--primary)' : 'var(--text-strong)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {type === 'All' ? 'All Publications' : type === 'Act' ? 'Acts of Parliament' : type === 'Hansard' ? 'Hansard Reports' : type === 'Gazette' ? 'Gazette Notices' : 'Order Papers'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search reference or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem 0.75rem 0.4rem 2rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: '0.8rem',
                color: 'var(--text-strong)'
              }}
            />
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              fontSize: '0.8rem',
              color: 'var(--text-strong)',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* DOCUMENT CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredDocs.map((doc) => {
          const Meta = TYPE_META[doc.documentType] || TYPE_META.Act;
          const TypeIcon = Meta.icon;

          return (
            <Card key={doc.id} className="official-doc-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: `${Meta.color}15`,
                    color: Meta.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <TypeIcon size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: Meta.color, letterSpacing: '0.04em' }}>
                      {Meta.label}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {doc.referenceNumber}
                    </div>
                  </div>
                </div>

                <Badge tone="success" icon={CheckCircle2}>{doc.status}</Badge>
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.35rem', color: 'var(--text-strong)' }}>
                  {doc.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {doc.summary}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={12} /> {doc.publishDate}
                </span>
                <span>{doc.pages} Pages · {doc.fileSize}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setPreviewDoc(doc)}
                >
                  <Eye size={14} /> Preview Document
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ justifyContent: 'center' }}
                  onClick={() => handleDownload(doc)}
                  title="Download PDF"
                >
                  <Download size={14} /> PDF
                </button>
              </div>
            </Card>
          );
        })}
        {filteredDocs.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Sparkles size={28} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <div>No official publications found for your filters.</div>
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div style={{
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
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '780px',
            maxHeight: '85vh',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* MODAL HEADER */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--glass-bg)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {previewDoc.documentType}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {previewDoc.referenceNumber}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-strong)' }}>
                  {previewDoc.title}
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => handleDownload(previewDoc)}>
                  <Download size={14} /> Download Official PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* MODAL BODY */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* SEAL BANNER */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                <FileCheck2 size={24} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-strong)' }}>
                    Certified Official Parliamentary Publication
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Published in the Official Government Gazette on {previewDoc.publishDate} · Category: {previewDoc.category}
                  </div>
                </div>
              </div>

              {/* SUMMARY / PREAMBLE */}
              <div>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Preamble &amp; Overview
                </h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-strong)', margin: 0 }}>
                  {previewDoc.summary}
                </p>
              </div>

              {/* SECTIONS & CLAUSES */}
              <div>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Published Provisions &amp; Sections
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {previewDoc.sections.map((sec, i) => (
                    <div key={i} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                        {sec.number} — {sec.title}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-strong)', margin: 0, lineHeight: 1.5 }}>
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div style={{ padding: '0.85rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>National Assembly Printing Office · Ref: {previewDoc.referenceNumber}</span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                  <Printer size={13} /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialDocuments;
