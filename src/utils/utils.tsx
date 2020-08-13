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

const unauthenticatedMessages: string[] = [
  'Expired Token',
  'Unauthorized',
  'Unauthenticated',
];

export function unauthenticated(errorMessages: string[]): boolean {
  return errorMessages.some((errorMessage) =>
    unauthenticatedMessages.includes(errorMessage),
  );
}

export function generateTagColor(colors: TagColor[], label: string): string {
  return colors[Math.abs(hashCode(label) % colors.length)];
}

export function genImageUri(img: string) {
  return img === 'avatar.svg' ? `${process.env.PUBLIC_URL}/avatar.svg` : img;
}
