import { sampleTags } from './sampleTags';

const sampleA: NewsletterLog = {
  id: 0,
  title: 'Mentorship Program Update 20-21',
  fileLink: '',
  delivered: 321,
  inTransit: 40,
  returned: 3,
  creationDate: new Date(),
  estimatedArrival: new Date(),
  totalLettersCount: 3,
  tags: [sampleTags[0]],
};

const sampleB: NewsletterLog = {
  id: 1,
  title: 'Poetry Newsletter',
  fileLink: '',
  delivered: 30,
  inTransit: 400,
  returned: 0,
  creationDate: new Date(),
  estimatedArrival: new Date(),
  totalLettersCount: 3,
  tags: [sampleTags[1], sampleTags[2]],
};

export const sampleNewsletters: NewsletterLog[] = [sampleA, sampleB];
