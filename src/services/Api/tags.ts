import { getAuthJson } from 'src/utils/utils';

export async function fetchTags(token: string, org_id: number): Promise<Tag[]> {
  const response = await getAuthJson({
    method: 'GET',
    token: token,
    endpoint: `org/${org_id}/tags`,
  });
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  const tagsData: Tag[] = [];
  body.data.data.forEach((tag: RawTag) => {
    const tagData = {
      id: tag.id,
      label: tag.label,
      numContacts: tag.total_contacts,
    };
    tagsData.push(tagData);
  });
  return tagsData;
}

export async function createTag(
  token: string,
  org_id: number,
  label: string,
): Promise<Tag> {
  const response = await getAuthJson({
    method: 'POST',
    token: token,
    endpoint: `org/tag`,
    body: JSON.stringify({
      org_id: org_id,
      label: label,
    }),
  });
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  return {
    id: body.data.id,
    label: body.data.label,
    numContacts: body.data.total_contacts,
  };
}
