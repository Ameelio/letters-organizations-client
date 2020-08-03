import url from 'url';
import { API_URL } from './base';

export async function fetchTags(token: string, org_id: number): Promise<Tag[]> {
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    url.resolve(API_URL, `org/${org_id}/tags`),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  const tagsData: Tag[] = [];
  interface t {
    id: number;
    label: string;
    total_contacts: number;
  }
  body.data.data.forEach((tag: t) => {
    const tagData = {
      id: tag.id,
      label: tag.label,
      numContacts: tag.total_contacts,
    };
    tagsData.push(tagData);
  });
  return tagsData;
}
