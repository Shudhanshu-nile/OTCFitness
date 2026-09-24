/** "6 minutes ago" style relative time, in the mockup's voice. */
export const formatRelative = (date: Date | null | undefined): string => {
  if (!date) {
    return 'never';
  }

  const seconds = Math.round((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  const days = Math.round(hours / 24);
  if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
};
