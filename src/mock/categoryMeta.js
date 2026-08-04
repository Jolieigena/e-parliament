import { Scale, HeartPulse, Landmark, GraduationCap, Zap, Tag } from 'lucide-react';

export const CATEGORY_ICONS = {
  Judiciary: Scale,
  'Public Health': HeartPulse,
  Budget: Landmark,
  Education: GraduationCap,
  Energy: Zap,
};

export const categoryIcon = (category) => CATEGORY_ICONS[category] || Tag;
