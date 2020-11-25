import url from 'url';
import { subDays } from 'date-fns';
import { BASE_URL } from './base';
import { getAuthJson } from 'src/utils/utils';

export async function createNewsletter(
  token: string,
  newsletter: DraftNewsletter,
  isTest: boolean,
  pageCount: number,
): Promise<NewsletterLog> {
  let formData = new FormData();
  formData.append('type', 'pdf');
  formData.append('file', newsletter.file);

  const s3requestOptions = {
    method: 'POST',
    body: formData,
  };
  const s3response = await fetch(
    url.resolve(BASE_URL, 'file/upload'),
    s3requestOptions,
  );
  const s3body = await s3response.json();

  console.log(s3body);
  if (s3body.status === 'ERROR') {
    throw s3body;
  }

  const s3_url = s3body.data;
  let tagIds: number[] = [];
  newsletter.tags.forEach((tag) => tagIds.push(tag.id));

  const response = await getAuthJson({
    method: 'POST',
    token: token,
    endpoint: 'newsletter',
    body: JSON.stringify({
      name: newsletter.title,
      s3_path: s3_url,
      tags: tagIds,
      is_test: isTest,
      page_count: pageCount,
      double_sided: newsletter.double_sided,
      color: newsletter.color,
      mail_type: newsletter.standardMail ? 'usps_standard' : 'usps_first_class',
    }),
  });

  const body = await response.json();
  console.log('Error');
  console.log(body);
  if (body.status === 'ERROR') {
    throw body;
  }
  const newsletterData: NewsletterLog = {
    id: body.data.id,
    title: body.data.name,
    fileLink: body.data.pdf_path,
    delivered: body.data.delivered_count,
    inTransit: body.data.in_transit_count,
    returned: body.data.returned_count,
    creationDate: new Date(body.data.created_at),
    totalLettersCount: body.data.total_letter_count,
    estimatedArrival: null,
    tags: [],
    status: null,
  };
  if (body.data.estimated_arrival) {
    newsletterData.estimatedArrival = new Date(body.data.estimated_arrival);
  }
  interface t {
    id: number;
    label: string;
    total_contacts: number;
  }
  body.data.tags.forEach((tag: t) => {
    const tagData: Tag = {
      label: tag.label,
      id: tag.id,
      numContacts: tag.total_contacts,
    };
    newsletterData.tags.push(tagData);
  });
  return newsletterData;
}

export async function fetchNewsletters(
  token: string,
): Promise<NewsletterLog[]> {
  const response = await getAuthJson({
    method: 'GET',
    token: token,
    endpoint: 'newsletters',
  });

  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  const newslettersData: NewsletterLog[] = [];
  body.data.data.forEach((newsletter: RawNewsletterLog) => {
    const newsletterData: NewsletterLog = {
      id: newsletter.id,
      title: newsletter.name,
      fileLink: newsletter.pdf_path,
      delivered: newsletter.delivered_count,
      inTransit: newsletter.in_transit_count,
      returned: newsletter.returned_count,
      creationDate: new Date(newsletter.created_at),
      estimatedArrival: null,
      tags: [],
      totalLettersCount: newsletter.total_letter_count,
      status: newsletter.status,
    };
    if (newsletter.estimated_arrival) {
      newsletterData.estimatedArrival = new Date(newsletter.estimated_arrival);
    }
    newsletter.tags.forEach((tag) => {
      const tagData: Tag = {
        id: tag.id,
        numContacts: tag.total_contacts,
        label: tag.label,
      };

      newsletterData.tags.push(tagData);
    });
    const yesterday = subDays(new Date(), 1);
    if (
      newsletterData.status !== 'error' ||
      newsletterData.creationDate > yesterday
    ) {
      newslettersData.push(newsletterData);
    }
  });
  return newslettersData;
}
