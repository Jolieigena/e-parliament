import { useState } from 'react';
import { FileText, UserRound, Users2, Vote, Download, FileBarChart, Filter } from 'lucide-react';
import { useApp } from '../mock/store';
import { PARTIES } from '../mock/entities';
import Card from '../components/ui/Card';

function toCsv(rows) {
  return rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
}

function downloadCsv(filename, rows) {
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const Reports = () => {
  const { bills, members, committees } = useApp();

  const [timeFilter, setTimeFilter] = useState('All Time');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const partyName = (id) => PARTIES.find((p) => p.id === id)?.name || (id === 'independent' ? 'Independent' : '—');
  const partyColor = (id) => PARTIES.find((p) => p.id === id)?.color || '#64748b';

  // Categories for the dropdown
  const categories = Array.from(new Set(bills.map(b => b.category))).filter(Boolean);

  // Time filtering logic
  const isWithinTimeRange = (dateStr) => {
    if (timeFilter === 'All Time') return true;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date(); // Mock data is 2026, which matches current system time in metadata
    if (timeFilter === 'This Year') return d.getFullYear() === now.getFullYear();
    if (timeFilter === 'Last 6 Months') {
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return d >= sixMonthsAgo && d <= now;
    }
    return true;
  };

  // Filter bills
  const filteredBills = bills.filter(b => {
    if (categoryFilter !== 'All Categories' && b.category !== categoryFilter) return false;
    
    // Check if the bill had any history activity in the time range, or just use its latest history date
    const latestDate = b.history.length > 0 ? b.history[b.history.length - 1].date : null;
    return isWithinTimeRange(latestDate);
  });

  // Filter committees (just filtering their meetings by date, we still show all committees)
  const filteredCommittees = committees.map(c => ({
    ...c,
    meetings: c.meetings.filter(m => isWithinTimeRange(m.date))
  }));

  // Members are unfiltered by time, as agreed in the plan
  const partyCounts = members.reduce((acc, m) => {
    const pId = m.party || 'independent';
    acc[pId] = (acc[pId] || 0) + 1;
    return acc;
  }, {});

  // Metrics using filtered data
  const totalBills = filteredBills.length;
  const totalMembers = members.length;
  const activeCommittees = filteredCommittees.length;
  const totalDivisions = filteredBills.filter((b) => b.votes.aye + b.votes.nay + b.votes.abstain > 0).length;

  const billsByStage = filteredBills.reduce((acc, b) => {
    acc[b.stage] = (acc[b.stage] || 0) + 1;
    return acc;
  }, {});

  const totalAye = filteredBills.reduce((sum, b) => sum + b.votes.aye, 0);
  const totalNay = filteredBills.reduce((sum, b) => sum + b.votes.nay, 0);

  // Exporters using filtered data
  const downloadBills = () =>
    downloadCsv('bills-status-report.csv', [
      ['ID', 'Title', 'Category', 'Stage', 'Sponsor', 'Committee'],
      ...filteredBills.map((b) => [
        b.id,
        b.title,
        b.category,
        b.stage,
        b.sponsorType === 'Government' ? 'Government' : members.find((m) => m.id === b.sponsorId)?.name || 'Unknown',
        b.committee || 'Floor',
      ]),
    ]);

  const downloadMembers = () =>
    downloadCsv('members-directory.csv', [
      ['Name', 'Role', 'Party', 'Constituency'],
      ...members.map((m) => [m.name, m.roles.join(', '), partyName(m.party), m.constituency || '—']),
    ]);

  const downloadCommittees = () =>
    downloadCsv('committee-rosters.csv', [
      ['Committee', 'Member', 'Role', 'Meetings in Range'],
      ...filteredCommittees.flatMap((c) =>
        members
          .filter((m) => m.committees.some((mc) => mc.name === c.name))
          .map((m) => [c.name, m.name, m.committees.find((mc) => mc.name === c.name).role, c.meetings.length]),
      ),
    ]);

  const downloadVoting = () =>
    downloadCsv('voting-record-archive.csv', [
      ['Title', 'Aye', 'Nay', 'Abstain'],
      ...filteredBills
        .filter((b) => b.votes.aye + b.votes.nay + b.votes.abstain > 0)
        .map((b) => [b.title, b.votes.aye, b.votes.nay, b.votes.abstain]),
    ]);

  const stageColors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#64748B', '#EF4444', '#F43F5E'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(var(--glass-blur))' }}>
          <Filter size={16} color="var(--text-muted)" style={{ marginLeft: '0.4rem' }} />
          <select 
            className="form-input" 
            style={{ padding: '0.4rem 2rem 0.4rem 0.8rem', height: 'auto', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '0.8rem' }}
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option>All Time</option>
            <option>This Year</option>
            <option>Last 6 Months</option>
          </select>
          <select 
            className="form-input" 
            style={{ padding: '0.4rem 2rem 0.4rem 0.8rem', height: 'auto', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '0.8rem' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="stat-grid">
        <Card className="stat-tile">
          <div className="stat-tile-icon"><FileText size={18} /></div>
          <div>
            <div className="stat-tile-value">{totalBills}</div>
            <div className="stat-tile-label">Filtered Bills</div>
          </div>
        </Card>
        <Card className="stat-tile">
          <div className="stat-tile-icon"><UserRound size={18} /></div>
          <div>
            <div className="stat-tile-value">{totalMembers}</div>
            <div className="stat-tile-label">Seated Members</div>
          </div>
        </Card>
        <Card className="stat-tile">
          <div className="stat-tile-icon"><Users2 size={18} /></div>
          <div>
            <div className="stat-tile-value">{activeCommittees}</div>
            <div className="stat-tile-label">Standing Committees</div>
          </div>
        </Card>
        <Card className="stat-tile">
          <div className="stat-tile-icon"><Vote size={18} /></div>
          <div>
            <div className="stat-tile-value">{totalDivisions}</div>
            <div className="stat-tile-label">Recorded Divisions</div>
          </div>
        </Card>
      </div>

      <div className="dash-overview-grid">
        <div>
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Legislative Pipeline</h2>
              <button type="button" className="btn btn-secondary btn-sm" onClick={downloadBills}>
                <Download size={14} /> Export CSV
              </button>
            </div>
            <p className="dash-footnote" style={{ marginTop: 0, marginBottom: '1.5rem' }}>Distribution of {totalBills} filtered bills across all stages.</p>
            
            <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.25rem', background: 'var(--border)' }}>
              {Object.entries(billsByStage).map(([stage, count], idx) => {
                const pct = (count / totalBills) * 100;
                return <div key={stage} style={{ width: `${pct}%`, background: stageColors[idx % stageColors.length] }} title={`${stage}: ${count}`} />
              })}
              {totalBills === 0 && <div style={{ width: '100%', background: 'var(--border)' }} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              {Object.entries(billsByStage).map(([stage, count], idx) => (
                <div key={stage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: stageColors[idx % stageColors.length] }} />
                    {stage}
                  </span>
                  <strong>{count}</strong>
                </div>
              ))}
              {totalBills === 0 && <span style={{ color: 'var(--text-muted)' }}>No bills match the current filters.</span>}
            </div>
          </Card>

          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Voting Overview</h2>
              <button type="button" className="btn btn-secondary btn-sm" onClick={downloadVoting}>
                <Download size={14} /> Export CSV
              </button>
            </div>
            <p className="dash-footnote" style={{ marginTop: 0, marginBottom: '1.5rem' }}>Aggregate votes cast across filtered recorded divisions.</p>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '1.5rem 1rem', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{totalAye}</div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Aye</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '1.5rem 1rem', background: 'var(--error-bg)', borderRadius: 'var(--radius-md)', color: 'var(--error)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{totalNay}</div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Nay</div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Party Composition</h2>
              <button type="button" className="btn btn-secondary btn-sm" onClick={downloadMembers}>
                <Download size={14} /> Export CSV
              </button>
            </div>
            <p className="dash-footnote" style={{ marginTop: 0, marginBottom: '1.5rem' }}>{totalMembers} seated members by party affiliation.</p>
            
            <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.25rem', background: 'var(--border)' }}>
              {Object.entries(partyCounts).sort((a, b) => b[1] - a[1]).map(([pId, count]) => (
                <div key={pId} style={{ width: `${(count / totalMembers) * 100}%`, background: partyColor(pId) }} title={`${partyName(pId)}: ${count}`} />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              {Object.entries(partyCounts).sort((a, b) => b[1] - a[1]).map(([pId, count]) => (
                <div key={pId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: partyColor(pId) }} />
                    {partyName(pId)}
                  </span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Active Committees</h2>
              <button type="button" className="btn btn-secondary btn-sm" onClick={downloadCommittees}>
                <Download size={14} /> Export CSV
              </button>
            </div>
            <p className="dash-footnote" style={{ marginTop: 0, marginBottom: '1.5rem' }}>Standing committees and filtered meeting counts.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredCommittees.map((c) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-strong)' }}>{c.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.meetings.length} Meetings</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
