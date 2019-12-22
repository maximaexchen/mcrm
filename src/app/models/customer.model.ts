export interface Customer {
  _id: string;
  _rev?: string;
  type: string;
  name?: string;
  street?: string;
  streetNumber?: string;
  zip?: string;
  city?: string;
  telephone?: string;
  email?: string;
  web?: string;
  token?: string;
  active?: boolean;
}
