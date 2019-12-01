export interface InvoiceProperties {
  _id?: string;
  _rev?: string;
  type?: string;
  name?: string;
  date?: Date;
  deadline?: Date;
  customer?: string;
}

export class Invoice {
  constructor(kwArgs: InvoiceProperties = {}) {
    for (const key in kwArgs) {
      if (kwArgs[key]) {
        this[key] = kwArgs[key];
      }
    }
  }
}
