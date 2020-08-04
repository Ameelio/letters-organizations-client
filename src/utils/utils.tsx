export const formatDate = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

function hashCode(str: string): number {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 6) - hash);
  }
  return hash;
}

export function generateTagColor(colors: TagColor[], label: string): string {
  return colors[Math.abs(hashCode(label) % colors.length)];
}
