import { useState } from 'react';
import { FileStack, ArrowDownToLine, ArrowUpFromLine, Send, FileEdit, CheckCircle2, Inbox } from 'lucide-react';
import { useApp } from '../../../mock/store';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const Documents = () => {
  const { currentGovUser, documents, submitDocument } = useApp();
  const institutionId = currentGovUser.institutionId;
  const myDocuments = [...documents]
    .filter((d) => d.institutionId === institutionId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const [subject, setSubject] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    submitDocument(institutionId, subject.trim());
    setSuccess(`"${subject.trim()}" was sent to Parliament.`);
    setSubject('');
  };

  return (
    <div>
      <h1 className="portal-page-title">
        <span className="page-title-icon-wrap"><FileStack size={20} /></span> Documents
      </h1>
      <p className="portal-page-subtitle">Official correspondence exchanged between your institution and Parliament.</p>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Send a document</h2>
        <form onSubmit={handleSubmit} className="new-user-form">
          <div className="form-group">
            <label className="form-label" htmlFor="doc-subject">Subject</label>
            <div className="input-icon-wrap">
              <FileEdit size={17} className="input-icon" />
              <input
                id="doc-subject"
                type="text"
                className="form-input has-icon"
                placeholder="Cost Projections — Q4 2026"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
          </div>

          {success && <p className="form-success"><CheckCircle2 size={15} /> {success}</p>}

          <button type="submit" className="btn btn-primary btn-md">
            <Send size={17} /> Send to Parliament
          </button>
        </form>
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Document log ({myDocuments.length})</h2>
        {myDocuments.length > 0 ? (
          <ul className="agenda-list">
            {myDocuments.map((doc) => (
              <li key={doc.id} className="agenda-row">
                <span className="row-title-with-icon">
                  {doc.direction === 'inbound' ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}
                  <span>{doc.subject}</span>
                </span>
                <Badge tone={doc.direction === 'inbound' ? 'info' : 'neutral'}>{doc.date}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dash-empty-state"><Inbox size={15} /> No documents exchanged yet.</p>
        )}
      </Card>
    </div>
  );
};

export default Documents;
