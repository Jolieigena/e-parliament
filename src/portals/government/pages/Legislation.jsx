import { useState } from 'react';
import { FileText, FilePlus2, FileEdit, CheckCircle2, Inbox } from 'lucide-react';
import { useApp } from '../../../mock/store';
import { CATEGORY_ICONS } from '../../../mock/categoryMeta';
import Card from '../../../components/ui/Card';
import BillRow from '../../../components/ui/BillRow';

const CATEGORIES = Object.keys(CATEGORY_ICONS);

const Legislation = () => {
  const { currentGovUser, bills, submitGovernmentBill } = useApp();
  const institutionId = currentGovUser.institutionId;
  const myBills = bills.filter((b) => b.institutionId === institutionId);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [summary, setSummary] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    submitGovernmentBill(title.trim(), category, summary.trim(), institutionId);
    setSuccess(`${title.trim()} was submitted to Parliament as a Draft bill.`);
    setTitle('');
    setSummary('');
    setCategory(CATEGORIES[0]);
  };

  return (
    <div>
      <h1 className="portal-page-title">
        <span className="page-title-icon-wrap"><FileText size={20} /></span> Legislation
      </h1>
      <p className="portal-page-subtitle">Bills sponsored by your institution, and their progress through Parliament.</p>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Submit new legislation</h2>
        <form onSubmit={handleSubmit} className="new-user-form">
          <div className="form-group">
            <label className="form-label" htmlFor="bill-title">Bill title</label>
            <div className="input-icon-wrap">
              <FileEdit size={17} className="input-icon" />
              <input
                id="bill-title"
                type="text"
                className="form-input has-icon"
                placeholder="National Digital Identity Bill"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="bill-category">Category</label>
            <select id="bill-category" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="bill-summary">Summary</label>
            <textarea
              id="bill-summary"
              className="form-input"
              rows={3}
              placeholder="Describe what this bill establishes or amends..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </div>

          {success && <p className="form-success"><CheckCircle2 size={15} /> {success}</p>}

          <button type="submit" className="btn btn-primary btn-md">
            <FilePlus2 size={17} /> Submit to Parliament
          </button>
        </form>
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Your legislation ({myBills.length})</h2>
        {myBills.length > 0 ? (
          <ul className="dash-list">
            {myBills.map((bill) => (
              <li key={bill.id}><BillRow bill={bill} basePath="/government/legislation" /></li>
            ))}
          </ul>
        ) : (
          <p className="dash-empty-state"><Inbox size={15} /> No legislation submitted yet.</p>
        )}
      </Card>
    </div>
  );
};

export default Legislation;
