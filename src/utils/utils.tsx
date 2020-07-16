export const formatDate = (date: Date) =>
  `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;

function hashCode(str: string): number {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function generateTagColor(colors: TagColor[], tag: Tag): string {
  return colors[hashCode(tag.label) % (colors.length - 1)];
}
