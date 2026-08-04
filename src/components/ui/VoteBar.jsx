const VoteBar = ({ votes }) => {
  const { aye = 0, nay = 0, abstain = 0 } = votes || {};
  const total = aye + nay + abstain;

  if (total === 0) {
    return (
      <div className="votebar-empty">
        <span>No votes cast yet</span>
      </div>
    );
  }

  const ayePct = (aye / total) * 100;
  const nayPct = (nay / total) * 100;
  const abstainPct = (abstain / total) * 100;

  return (
    <div className="votebar-container">
      <div className="votebar-stats">
        <span className="votebar-aye">Aye: {aye}</span>
        <span className="votebar-nay">Nay: {nay}</span>
        {abstain > 0 && <span className="votebar-abstain">Abs: {abstain}</span>}
      </div>
      <div className="votebar-track">
        <div className="votebar-fill votebar-fill-aye" style={{ width: `${ayePct}%` }} />
        <div className="votebar-fill votebar-fill-nay" style={{ width: `${nayPct}%` }} />
        <div className="votebar-fill votebar-fill-abstain" style={{ width: `${abstainPct}%` }} />
      </div>
    </div>
  );
};

export default VoteBar;
