export interface OfferProperties {
  _id?: string;
  _rev?: string;
  type?: string;
  name?: string;
  date?: Date;
  customer?: string;
}

export class Offer {
  constructor(kwArgs: OfferProperties = {}) {
    for (const key in kwArgs) {
      if (kwArgs[key]) {
        this[key] = kwArgs[key];
      }
    }
  }
}
