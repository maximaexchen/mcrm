export interface Job {
  _id?: string;
  _rev?: string;
  type?: string;
  name?: string;
  date?: Date;
  deadline?: Date;
  customer?: string;
}
