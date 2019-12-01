export interface InvoiceOfferItemProperties {
  _id?: string;
  _rev?: string;
  type?: string;
  name?: string;
  date?: Date;
  deadline?: Date;
  customer?: string;
}

export class InvoiceOfferItem {
  constructor(kwArgs: InvoiceOfferItemProperties = {}) {
    for (const key in kwArgs) {
      if (kwArgs[key]) {
        this[key] = kwArgs[key];
      }
    }
  }
}
