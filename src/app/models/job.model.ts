export interface JobProperties {
  _id?: string;
  _rev?: string;
  type?: string;
  name?: string;
  date?: Date;
  deadline?: Date;
  customer?: string;
}

export class Job {
  constructor(kwArgs: JobProperties = {}) {
    for (const key in kwArgs) {
      if (kwArgs[key]) {
        this[key] = kwArgs[key];
      }
    }
  }
}
