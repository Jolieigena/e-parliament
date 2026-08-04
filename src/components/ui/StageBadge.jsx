import { STAGE_META } from '../../mock/stageMeta';
import Badge from './Badge';

const StageBadge = ({ stage }) => {
  const meta = STAGE_META[stage] || STAGE_META.Draft;
  return (
    <Badge tone={meta.tone} icon={meta.icon}>
      {stage}
    </Badge>
  );
};

export default StageBadge;
