interface RawOrgContact extends Contact {
  id: number;
  tags: Array<RawTag>;
}
interface OrgContact extends Contact {
  id: number;
  tags: Tag[];
  selected: boolean;
}
