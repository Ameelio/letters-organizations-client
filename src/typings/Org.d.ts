interface OrgUser {
  role: string;
  org: Org;
}

interface Org {
  id: number;
  name: string;
  businessName: string;
  ein: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postal: string;
  paidBalance: number;
  shareLink: string;
  colorFirstPagePrice: number;
  colorExtraPagePrice: number;
  bwFirstPagePrice: number;
  bwExtraPagePrice: number;
  isLegal: boolean;
}
