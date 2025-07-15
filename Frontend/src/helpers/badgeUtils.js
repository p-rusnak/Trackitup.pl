export const formatBadge = (badge) => {
  if (!badge) return '';
  const parts = badge.split('_');
  if (parts.length === 2 && !badge.startsWith('[')) {
    const [category, level] = parts;
    const labelCategory = category
      .replace(/([A-Z])/g, ' $1')
      .replace(/^\w/, (c) => c.toUpperCase());
    return `${labelCategory} Lvl ${level}`;
  }
  return badge;
};
