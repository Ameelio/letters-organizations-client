interface Org {
  id: number;
  name: string;
  business_name: string;
  ein: string;
  website: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal: string;
  paid_balance: number;
  color_first_page_price: number;
  color_extra_page_price: number;
  bw_first_page_price: number;
  bw_extra_page_price: number;
  share_link: string;
}
